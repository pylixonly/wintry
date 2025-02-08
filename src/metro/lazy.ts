import { _patcherDelaySymbol } from "../patcher/patcher";
import { lazyValue } from "@utils/lazy";
import { findImmediate } from "./legacy_api";
import { waitFor } from "./internal/modules";
import type { LazyModuleContext } from "./types";
import type { ModuleFilter } from "./factories";

/** @internal */
const _lazyContextSymbol = Symbol.for("wintry.metro.lazyContext");

const _lazyContexts = new WeakMap<any, LazyModuleContext>();

export function getLazyContext<A extends unknown[]>(proxy: any): LazyModuleContext<A> | void {
    return _lazyContexts.get(proxy) as unknown as LazyModuleContext<A>;
}

export function createLazyModule<A, R>(filter: ModuleFilter<A, R>): R {
    let cache: R | undefined = undefined;

    const context: LazyModuleContext<A, R> = {
        filter,
        getExports(callback: (exports: any) => void) {
            if (cache) {
                callback(cache);
                return () => void 0;
            }

            return this.subscribe(callback);
        },
        subscribe(callback: (exports: any) => void) {
            return waitFor(filter, exp => callback(exp));
        },
        get cache() {
            return cache;
        },
        forceLoad() {
            if (!cache) {
                cache = findImmediate(filter);
                if (!cache) throw new Error(`Result of ${filter.key} is ${typeof cache}!`);
                if (typeof cache === "function" || typeof cache === "object")
                    _lazyContexts.set(cache, context as LazyModuleContext<unknown[]>);
            }

            return cache;
        },
    };

    const proxy = lazyValue(() => context.forceLoad(), {
        exemptedEntries: {
            [_lazyContextSymbol]: context,
            [_patcherDelaySymbol]: (cb: (exports: any) => void) => context.getExports(cb),
        },
    });

    _lazyContexts.set(proxy, context as LazyModuleContext<unknown[]>);

    context.subscribe(exp => (cache = exp));

    return proxy;
}
