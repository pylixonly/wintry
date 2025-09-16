import { definePlugin } from "#plugin-context";
import { byStoreName } from "@metro/common/stores";

export default definePlugin({
    name: "AlwaysTrust",
    description: "Prevents Discord's trust website confirmations",
    authors: [
        {
            "name": "cocobo1",
            "id": 767650984175992833n
        },
    ],

    patches: [
        {
            id: "MaskedLinkStore",
            target: byStoreName("MaskedLinkStore"),
            patch(module, patcher) {
                patcher.instead(module, "isTrustedDomain", () => true);
            },
        },
    ],
});
