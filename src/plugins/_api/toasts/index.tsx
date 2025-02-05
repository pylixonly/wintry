import { definePlugin, meta } from "#plugin-context";
import { createStyles } from "@components/utils/styles";
import { Devs } from "@data/constants";
import { findByFilePath, findByStoreName } from "@metro";
import { Card, FluxUtils, PressableScale, Text } from "@metro/common";
import { createContextualPatcher } from "@patcher/contextual";
import { showToast, useToastStore, type ToastInstance } from "@stores/useToastStore";
import { useEffect, useMemo, useRef } from "react";
import { Swipeable, ToasterBase, useToast } from "react-native-customizable-toast" with { lazy: "on" };
import type { ToastItemProps, ToasterMethods } from "react-native-customizable-toast";
import { SlideInUp, SlideOutUp, clamp, withSpring } from "react-native-reanimated";

const patcher = createContextualPatcher({ pluginId: meta.id });

const ToastStore = findByStoreName("ToastStore");
const ToastContainer = findByFilePath("modules/toast/native/ToastContainer.tsx", true);

const useStyles = createStyles(() => ({
    container: {
        marginTop: 10,
        marginHorizontal: 10,
    },
    card: {
        alignItems: "center",
        flexDirection: "row",
        borderRadius: 5,
        minHeight: 24,
    },
}));

const CustomToastComponent = () => {
    const styles = useStyles();
    const { hide, ...toast } = useToast<ToastInstance>();

    if (toast == null) return null;

    if (toast.type === "generic") {
        return (
            <Swipeable onSwipe={() => toast.options?.onDismiss?.()} disabled={!toast.options?.dismissible}>
                <PressableScale style={styles.container} onPress={() => toast.content.onPress?.()}>
                    <Card style={styles.card}>
                        <Text variant="text-sm/semibold">{toast.content.text}</Text>
                    </Card>
                </PressableScale>
            </Swipeable>
        );
    }

    // return (
    //     <Swipeable onSwipe={hide} disabled={!dismissible}>
    //         <PressableScale style={styles.touchable} onPress={hide} disabled={!dismissible}>
    //             <Card style={styles.container}>
    //                 <Text variant="display-lg">{text}</Text>
    //             </Card>
    //         </PressableScale>
    //     </Swipeable>
    // );
};

export const CustomToaster = () => {
    const ref = useRef<ToasterMethods<ToastInstance>>(null);
    const toastIdMap = useMemo(() => new Map<string, string>(), []);

    const toasts = useToastStore(state => state.toasts);
    const isDiscordToastDisplaying = FluxUtils.useStateFromStores([ToastStore], () => ToastStore.getContent()) != null;

    useEffect(() => {
        for (const toast of toasts) {
            const { id } = toast;

            if (toastIdMap.has(id)) {
                ref.current?.update(id, toast);
            } else {
                const libId = ref.current?.show(toast);
                if (libId != null) toastIdMap.set(id, libId);
            }
        }

        for (const [id, libId] of toastIdMap) {
            if (!toasts.some(t => t.id === id)) {
                toastIdMap.delete(id);
                ref.current?.hide(libId);
            }
        }
    }, [toasts, toastIdMap]);

    return (
        <ToasterBase<typeof ref>
            entering={SlideInUp.springify().mass(0.1).damping(10).stiffness(100).overshootClamping(1)}
            exiting={SlideOutUp.springify()
                .mass(0.35)
                .damping(15)
                .stiffness(350)
                .restDisplacementThreshold(0.1)
                .restSpeedThreshold(0.1)}
            useSafeArea={true}
            // @ts-expect-error - Passing function as ref is valid.
            ref={(r: ToasterMethods<CustomToaster>) => r && (ref.current = r)}
            itemStyle={({ itemLayout: { y }, gesture: { translationY }, displayFromBottom }: ToastItemProps) => {
                "worklet";

                const translateY = clamp(translationY.value, -y.value, 0);

                return {
                    transform: [
                        {
                            translateY: withSpring(translateY + (isDiscordToastDisplaying ? 50 : 0), {
                                mass: 0.1,
                                damping: 10,
                                stiffness: 100,
                                overshootClamping: true,
                            }),
                        },
                        displayFromBottom ? { rotate: "-180deg" } : { rotate: "0deg" },
                    ],
                };
            }}
            onSwipeEdge={({ filter }) => filter(t => t.options?.dismissible === false)}
            render={CustomToastComponent}
        />
    );
};

export default definePlugin({
    name: "Toasts",
    description: "Provides a toast notification API.",
    authors: [Devs.Pylix],
    required: true,

    start() {
        // Testing purposes
        // window.ToasterHelper = CustomToasterHelper;
        // window.demoToast = () => {
        //     const id = CustomToasterHelper.show({
        //         text: "Hello, world!",
        //         dismissible: true,
        //     });

        //     setTimeout(() => {
        //         CustomToasterHelper.update(id, {
        //             text: "Bye-bye, world!",
        //         });

        //         setTimeout(() => {
        //             CustomToasterHelper.hide(id);
        //         }, 3000);
        //     }, 1000);
        // };

        // useToastStore.subscribe(() => {
        //     console.log(useToastStore.getState());
        // });

        window.showToast = showToast;

        patcher.after(ToastContainer, "type", (_, res) => {
            return (
                <>
                    {res}
                    <CustomToaster />
                </>
            );
        });
    },
});
