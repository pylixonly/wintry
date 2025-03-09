import { getEsbuildConfig } from "./esbuild-config";
import esbuild, { type BuildResult } from "esbuild";
import { args } from "../args-parser";
import { bold, greenBright, yellowBright } from "ansi-colors";
import { $, file } from "bun";
import logger from "../logger";
import crypto from "node:crypto";
import * as hermesc from "hermes-compiler";
import { writeFile } from "node:fs/promises";
import * as c from "ansi-colors";

export interface WintryBuildContext {
    contextCreated: number;
    timeTaken?: number;
    lastBuildTime?: number;
    revision: string;

    config: esbuild.BuildOptions;
    context: esbuild.BuildContext;
    build(options: { silent?: boolean; skipCompile?: boolean }): Promise<BuildResult>;
    updateRevision: () => Promise<void>;

    lastBuildConsumed: boolean;
    lastBuildResult?: esbuild.BuildResult;

    outputPath?: string;
    bytecodePath?: Record<number, string>;
}

interface BuildContextOptions {
    deploy?: boolean;
    minify: boolean;
}

export async function createBuildContext({
    deploy = args.deploy,
    minify,
}: BuildContextOptions): Promise<WintryBuildContext> {
    const config = await getEsbuildConfig({ deploy, minify });

    const context: WintryBuildContext = {
        contextCreated: Date.now(),
        lastBuildConsumed: true,
        config: config,
        context: await esbuild.context(config),
        revision: "N/A",
        async build({ silent = false, skipCompile = false }) {
            const result = await buildBundle(context, silent, skipCompile);
            return result;
        },
        async updateRevision() {
            context.revision = deploy
                ? (await $`git rev-parse HEAD`.text()).trim()
                : crypto.randomBytes(20).toString("hex");
        },
    };

    return context;
}

export let buildingContext: WintryBuildContext | undefined;

async function buildBundle(buildContext: WintryBuildContext, silent = false, skipCompile = false) {
    buildingContext = buildContext;
    if (!silent) logger(yellowBright(`Building ${bold(buildContext.config.outfile ?? "bundle")}...`));

    await buildContext.updateRevision();

    const beginTime = performance.now();
    const buildResult = await buildContext.context.rebuild();

    if (buildResult.errors.length > 0) {
        throw new Error(buildResult.errors[0].text);
    }

    const outputPath = Object.keys(buildResult.metafile?.outputs ?? {})[0];

    if (!outputPath) {
        throw new Error("No output generated");
    }

    buildContext.lastBuildTime = performance.now();
    buildContext.lastBuildConsumed = false;
    buildContext.lastBuildResult = buildResult;
    buildContext.outputPath = outputPath;
    buildContext.timeTaken = buildContext.lastBuildTime - beginTime;

    buildContext.bytecodePath = {
        [hermesc.VERSION]: await compileToBytecode(outputPath, hermesc.VERSION),
    };

    if (!silent) logger(greenBright(`Bundle built in ${bold(`${buildContext.timeTaken.toFixed(2)}ms`)}`));
    buildingContext = undefined;

    return buildResult;
}

async function compileToBytecode(target: string, hbcVersion: number) {
    if (hbcVersion <= 0 || hermesc.VERSION !== hbcVersion) {
        throw new Error(`Unsupported version: ${hbcVersion} !== ${hermesc.VERSION}`);
    }

    const startTime = performance.now();

    const file = Bun.file(target);
    const bundleBuffer = Buffer.from(await file.arrayBuffer());
    const { bytecode } = hermesc.compile(bundleBuffer, { sourceURL: "wintry" });
    const hbcPath = file.name!.replace(/\.js$/, `.${hbcVersion}.hbc`);

    logger(c.dim("Bundle compilation took:"), `${(performance.now() - startTime).toFixed(2)}ms`);

    await writeFile(hbcPath, bytecode);
    return hbcPath;
}

if (import.meta.main) {
    if (args.port) {
        logger(yellowBright("Port argument is provided, but this is not a server script. Ignoring..."));
    }

    const availablePaths = [] as string[];
    const buildContext = await createBuildContext({ minify: false });

    const hash = crypto.createHash("sha256");

    try {
        await buildBundle(buildContext);
        logger(`${c.green("Built bundle")}: ${buildContext.outputPath}`);

        availablePaths.push(buildContext.outputPath!);
        hash.update(await file(buildContext.outputPath!).text());

        if (!args.nocompile) {
            const bytecodePath = await compileToBytecode(buildContext.outputPath!, hermesc.VERSION);
            logger(`${c.green("Compiled bytecode")}: ${bytecodePath}`);

            availablePaths.push(bytecodePath);
            hash.update(await file(bytecodePath).text());
        }
    } catch (e) {
        logger(`${c.redBright("Build failed:")} ${e}`);
    } finally {
        buildContext.context.dispose();
    }

    if (args.minify) {
        const minifiedBuildContext = await createBuildContext({ minify: true });

        try {
            await buildBundle(minifiedBuildContext);
            logger(`${c.green("Built minified bundle:")} ${minifiedBuildContext.outputPath}`);

            availablePaths.push(minifiedBuildContext.outputPath!);
            hash.update(await file(minifiedBuildContext.outputPath!).text());

            if (!args.nocompile) {
                const bytecodePath = await compileToBytecode(minifiedBuildContext.outputPath!, hermesc.VERSION);
                logger(`${c.green("Compiled minified bytecode")}: ${bytecodePath}`);

                availablePaths.push(bytecodePath);
                hash.update(await file(bytecodePath).text());
            }
        } catch (e) {
            logger(`${c.redBright("Build failed:")} ${e}`);
        } finally {
            minifiedBuildContext.context.dispose();
        }
    }

    logger(`${c.yellow("Available paths:")} ${availablePaths.join(", ")}`);

    await writeFile("dist/info.json", JSON.stringify({ paths: availablePaths, hash: hash.digest("hex") }, null, 2));
    logger(c.bold.green("Info file written to dist/info.json"));
}
