import { definePlugin, meta } from "#plugin-context";
import { Devs } from "@data/constants";
import { createContextualPatcher } from "@patcher/contextual";
import { lookup } from "@metro/api";
import { byFilePath } from "@metro/common/filters";
import ToastContainer from "./rewrite/ToastContainer";
import { useToastStore } from "@stores/useToastStore";
const patcher = createContextualPatcher({ pluginId: meta.id });

const _ToastContainer = lookup(byFilePath("modules/toast/native/ToastContainer.tsx")).asLazy();

export default definePlugin({
    name: "Toasts",
    description: "Provides a toast notification API.",
    authors: [Devs.Pylix],
    required: true,

    start() {
        patcher.reset();

        patcher.after(_ToastContainer, "type", (_, res) => {
            const toasts = useToastStore(s => s.toasts);
            if (!toasts.length) return res;

            return (
                <>
                    {res}
                    <ToastContainer />
                </>
            );
        });
    },

    cleanup() {},
});
