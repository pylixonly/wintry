import { connectToDebugger, patchLogHook } from "./debug";
import reportErrorOnInitialization from "./error-reporter";
import { wintryGlobalObject } from "./globals";
import { initializeMetro } from "./metro/internal";
import { metroEventEmitter } from "./metro/internal/events";
import { internal_getDefiner, waitFor } from "./metro/internal/modules";
import { after } from "./patcher";
import { initializePlugins } from "./stores/usePluginStore";
import { isSafeModeEnabled } from "./stores/usePrefsStore";
import hookDefineProperty from "./utils/objects";

export let hasIndexInitialized = false;

Object.freeze = Object.seal = Object;

// This is a blocking function!
function initialize() {
    try {
        console.log("Initializing Wintry...");

        initializeMetro();

        if (!isSafeModeEnabled()) {
            initializePlugins();
        }


        // Uncomment this to log error boundaries
        const { byName } = require("./metro/filters");
        waitFor(byName("ErrorBoundary"), module => {
            after(module.prototype, "render", function f(this: any) {
                this.state.error && console.log(this.state.error?.stack);
            });
        });

        return () => {
            hasIndexInitialized = true;

            patchLogHook();
            connectToDebugger("ws://localhost:9092");

            // __reactDevTools!.exports.connectToDevTools({
            //     host: "localhost",
            //     resolveRNStyle: require("react-native").flatten,
            // })

            metroEventEmitter.emit("metroReady");

            window.wintry = wintryGlobalObject();
        };
    } catch (e) {
        return () => {
            reportErrorOnInitialization(e);
        };
    }
}

function onceIndexRequired(runFactory: any) {
    if (hasIndexInitialized) return;

    const afterInit = initialize();
    runFactory();
    afterInit();

    // const batchedBridge = window.__fbBatchedBridge;

    // // Defer calls from the native side until we're ready
    // const callQueue = [] as Array<any[]>;
    // const unpatchHook = instead(batchedBridge, "callFunctionReturnFlushedQueue", (args: any, orig: any) => {
    //     // We only care about AppRegistry.runApplication calls and modules that are not loaded yet
    //     if (args[0] === "AppRegistry" || !batchedBridge.getCallableModule(args[0])) {
    //         callQueue.push(args);
    //         return batchedBridge.flushedQueue();
    //     }

    //     return orig.apply(batchedBridge, args);
    // });

    // const startDiscord = async () => {
    //     const afterInit = await initialize();

    //     unpatchHook();
    //     runFactory();

    //     for (const args of callQueue) {
    //         if (batchedBridge.getCallableModule(args[0])) {
    //             batchedBridge.__callFunction(...args);
    //         }
    //     }

    //     afterInit();
    // };

    // startDiscord();
}

const unhook = hookDefineProperty(global, "__d", define => {
    unhook!();
    // @ts-ignore - __d is an internal RN function exposed by Metro
    global.__d = internal_getDefiner(define, onceIndexRequired);
});
