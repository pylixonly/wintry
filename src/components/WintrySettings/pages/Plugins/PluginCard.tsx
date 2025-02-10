import { omit } from "es-toolkit";
import type {} from "fuzzysort";
import { type ComponentProps, createContext, memo, useContext } from "react";
import { View } from "react-native";
import { useShallow } from "zustand/shallow";
import { findAssetId } from "@metro";
import type { WintryPluginInstance } from "@plugins/types";
import usePluginStore from "@stores/usePluginStore";
import { showSheet } from "@components/utils/sheets";
import IconButton from "@components/Discord/Button/IconButton";
import FormSwitch from "@components/Discord/Forms/FormSwitch";
import { Card, Stack, Text } from "@components/Discord";
import { chroma, tokens } from "@metro/common/libraries";

const PluginCardContext = createContext<{
    plugin: WintryPluginInstance;
    result: Fuzzysort.KeysResult<WintryPluginInstance>;
}>(null!);

export interface PluginCardProps<T> {
    item: T;
    result: Fuzzysort.KeysResult<T>;
}

const useCardContext = () => useContext(PluginCardContext);

function getHighlightColor(): import("react-native").ColorValue {
    return chroma(tokens.unsafe_rawColors.YELLOW_300).alpha(0.3).hex();
}

function usePluginSettings() {
    const {
        plugin: { id },
    } = useCardContext();
    return usePluginStore(useShallow(state => state.settings[id]));
}

function SearchHighlightText(props: { index: number; fallback: string } & ComponentProps<typeof Text>) {
    const { result } = useCardContext();
    const textProps = omit(props, ["index", "fallback"]);

    const highlightedNode = result[props.index].highlight((m, i) => (
        <Text key={i} {...textProps} style={[props.style, { backgroundColor: getHighlightColor() }]}>
            {m}
        </Text>
    ));

    return <Text {...textProps}>{highlightedNode.length > 0 ? highlightedNode : props.fallback}</Text>;
}

function CardHeader() {
    const { plugin, result } = useCardContext();

    // could be empty if the plugin name is irrelevant!
    const highlightedNode = result[0].highlight((m, i) => (
        <Text key={i} style={{ backgroundColor: getHighlightColor() }}>
            {m}
        </Text>
    ));

    // const icon = plugin.icon && findAssetId(plugin.icon);

    const textNode = (
        <Text variant="heading-lg/semibold">{highlightedNode.length ? highlightedNode : plugin.name}</Text>
    );

    return (
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
            {/* {icon && <Image style={styles.smallIcon} source={icon} />} */}
            {textNode}
        </View>
    );
}

function CardDevs() {
    const {
        plugin: { authors },
    } = useCardContext();
    if (!authors) return null;

    return (
        <View style={{ flexDirection: "row", flexWrap: "wrap", flexShrink: 1, gap: 4 }}>
            <Text variant="text-sm/semibold" color="text-muted">
                by{" "}
                {
                    <SearchHighlightText
                        index={2}
                        fallback={authors.map(a => a.name).join(", ")}
                        variant="text-sm/semibold"
                        color="text-muted"
                    />
                }
            </Text>
        </View>
    );
}

function Description() {
    const { plugin } = useCardContext();
    return <SearchHighlightText index={1} fallback={plugin.description} />;
}

function CardActions() {
    const { plugin } = useCardContext();

    return (
        <View style={{ flexDirection: "row", gap: 6 }}>
            <IconButton
                size="sm"
                variant="secondary"
                icon={findAssetId("CircleInformationIcon-primary")}
                onPress={() => {
                    showSheet("PluginSheetComponent", import("./PluginSheetComponent"), { plugin });
                }}
            />
        </View>
    );
}

function CardSwitch() {
    const { plugin } = useCardContext();
    const settings = usePluginSettings();
    const togglePlugin = usePluginStore(state => state.togglePlugin);

    return (
        <View style={{ opacity: plugin.required ? 0.7 : 1 }}>
            <FormSwitch
                value={settings.enabled}
                disabled={plugin.required}
                onValueChange={(v: boolean) => {
                    if (settings.enabled && plugin.onStopRequest) {
                        const manualHandle = plugin.onStopRequest(() => togglePlugin(plugin.id, false));
                        if (manualHandle === true) return;
                    }

                    if (v && plugin.requiresRestart?.(true, plugin.state)) {
                        // TODO: Use a proper alert
                        alert("This plugin requires a restart to be enabled.");
                        togglePlugin(plugin.id, v, false);
                    } else if (!v && plugin.requiresRestart?.(false, plugin.state)) {
                        // TODO: Use a proper alert
                        alert("This plugin requires a restart to be disabled.");
                        togglePlugin(plugin.id, v, false);
                    } else {
                        togglePlugin(plugin.id, v);
                    }
                }}
            />
        </View>
    );
}

export default memo(function PluginCard({ result, item: plugin }: PluginCardProps<WintryPluginInstance>) {
    return (
        <PluginCardContext.Provider value={{ plugin, result }}>
            <Card onPress={() => showSheet("PluginSheetComponent", import("./PluginSheetComponent"), { plugin })}>
                <Stack spacing={16}>
                    <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                        <View style={{ flexShrink: 1 }}>
                            <CardHeader />
                            <CardDevs />
                        </View>
                        <View>
                            <Stack spacing={12} direction="horizontal">
                                <CardActions />
                                <CardSwitch />
                            </Stack>
                        </View>
                    </View>
                    <Description />
                </Stack>
            </Card>
        </PluginCardContext.Provider>
    );
});
