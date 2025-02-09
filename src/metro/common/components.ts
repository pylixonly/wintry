import { lazyDestructure, lazyValue } from "@utils/lazy";
import { byProps } from "@metro/new/common/filters";
import { lookup } from "@metro/new/api";
import { lookupByProps } from "@metro/new/common/wrappers";

export const findProp = (...prop: string[]) => lazyValue(() => lookup(byProps(prop)).load()[prop[0]]);

// React Native's included SafeAreaView only adds padding on iOS.
export let { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } = lazyDestructure(() =>
    lookupByProps("useSafeAreaInsets").asLazy(m => ({ SafeAreaView, SafeAreaProvider, useSafeAreaInsets } = m)),
) as any;
