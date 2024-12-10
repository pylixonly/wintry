import swc from "@swc/core";
import { $ } from "bun";
import crypto from "crypto";
import { build, type BuildOptions } from "esbuild";
import yargs from "yargs-parser";
import { printBuildSuccess } from "./util";
import path from "path";
import globalPlugin from "esbuild-plugin-globals";

const metroDeps: string[] = await (async () => {
    const ast = await swc.parseFile(path.resolve("./shims/depsModule.ts"));

    // @ts-ignore
    return ast.body.at(-1).expression.properties.map(p => p.key.value);
    // return ast.body.at(-1).expression.right.properties.map(p => p.key.value); // <- Parsing CommonJS version
})();

const args = yargs(process.argv.slice(2));
const { "release-branch": releaseBranch, "build-minify": buildMinify } = args;

let context = {} as {
    hash: string;
};

const config: BuildOptions = {
    stdin: {
        resolveDir: path.dirname(require.resolve("../src")),
        contents: `
            try {
                WINTRY_START_TIME = nativePerformanceNow();
                require("./index.ts");
            } catch (e) {
                require("./error-reporter.ts").default(e);
            }
        `,
    },
    bundle: true,
    outfile: "dist/wintry.js",
    format: "iife",
    splitting: false,
    external: [],
    supported: {
        // Hermes does not actually support const and let, even though it syntactically
        // accepts it, but it's treated just like 'var' and causes issues
        "const-and-let": false,
    },
    footer: {
        js: "//# sourceURL=wintry",
    },
    loader: {
        ".png": "dataurl",
    },
    platform: "browser",
    define: {
        window: "globalThis",
        global: "globalThis",
        __DEV__: JSON.stringify(releaseBranch !== "main"),
    },
    // inject: ["./shims/asyncIteratorSymbol.js", "./shims/promiseAllSettled.js"],
    legalComments: "none",
    alias: {
        "!wintry-deps-shim!": "./shims/depsModule",
        "react/jsx-runtime": "./shims/jsxRuntime",
    },
    plugins: [
        globalPlugin({
            ...metroDeps.reduce((obj: Record<string, any>, key) => {
                obj[key] = `require("!wintry-deps-shim!").default[${JSON.stringify(key)}]`;
                return obj;
            }, {}),
        }),
        {
            name: "swc",
            setup(build) {
                build.onLoad({ filter: /\.[cm]?[jt]sx?$/ }, async args => {
                    const result = await swc.transformFile(args.path, {
                        jsc: {
                            externalHelpers: true,
                            transform: {
                                constModules: {
                                    globals: {
                                        "#build-info": {
                                            version: `"${context.hash}-${releaseBranch ?? "local"}"`,
                                        },
                                    },
                                },
                                react: {
                                    runtime: "automatic",
                                },
                            },
                        },
                        // https://github.com/facebook/hermes/blob/3815fec63d1a6667ca3195160d6e12fee6a0d8d5/doc/Features.md
                        // https://github.com/facebook/hermes/issues/696#issuecomment-1396235791
                        env: {
                            targets: "fully supports es6",
                            include: [
                                "transform-block-scoping",
                                "transform-classes",
                                "transform-async-to-generator",
                                "transform-async-generator-functions",
                            ],
                            exclude: [
                                "transform-parameters",
                                "transform-template-literals",
                                "transform-exponentiation-operator",
                                "transform-named-capturing-groups-regex",
                                "transform-nullish-coalescing-operator",
                                "transform-object-rest-spread",
                                "transform-optional-chaining",
                                "transform-logical-assignment-operators",
                            ],
                        },
                    });

                    return { contents: result.code };
                });
            },
        },
    ],
};

export async function buildBundle(overrideConfig: BuildOptions = {}) {
    context = {
        hash:
            (releaseBranch && (await $`git rev-parse --short HEAD`.quiet()).text().trim()) ||
            crypto.randomBytes(8).toString("hex").slice(0, 7), // Random hash for each local build
    };

    const initialStartTime = performance.now();
    await build({ ...config, ...overrideConfig });

    return {
        config,
        context,
        timeTook: performance.now() - initialStartTime,
    };
}

if (import.meta.main) {
    const { timeTook } = await buildBundle();

    printBuildSuccess(context.hash, releaseBranch, timeTook);

    if (buildMinify) {
        const { timeTook } = await buildBundle({
            minify: true,
            outfile: config.outfile!.replace(/\.js$/, ".min.js"),
        });

        printBuildSuccess(context.hash, releaseBranch, timeTook, true);
    }
}
