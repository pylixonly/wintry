import type { BaseTranslation } from "../i18n-types.js";

const en = {
    discord: "Discord",
    wintry: "Wintry",
    ui: {
        components: {
            search: {
                placeholder: "Search",
            },
        },
    },
    error_boundary: {
        uh_oh: "Uh oh.",
        retry_render: "Retry Render",
        reload: "Reload Discord",
        safe_mode: "Safe Mode",
        stack_trace: "Stack Trace",
        screen: {
            copy: "Copy",
            show_more: "Show more",
            show_less: "Show less",
            component_stack: "Component Stack",
            call_stack: "Call Stack",
            description: "An error occurred while rendering a component. This may have been caused by a plugin, Wintry, or Discord itself.",
        }
    },
    actions: {
        nevermind: "Nevermind",
        dismiss: "Dismiss",
    },
    updater: {
        update_available: "Update Available",
        new_version: "A new version of Wintry is available!",
        update_now: "Update Now",
        already_latest: "You're already on the latest version!",
        failed_to_check: "Failed to check for updates",
        error_alert: "An error occurred while checking for updates.",
    },
    settings: {
        sections: {
            plugins: "Plugins",
            themes: "Themes",
            developer: "Developer",
            updater: "Updater",
        },
        general: {
            info: "Info",
            logs: "Logs",
            platform: "Platform",
            quick_actions: "Quick Actions",
            reload: "Reload Discord",
            links: "Links",
            github: "GitHub",
            discord: "Discord",
            react: "React",
            react_native: "React Native",
            hermes: "Hermes",
            client_info: {
                label: "Client Info",
            },
            configurations: {
                label: "Configurations",
                enable_safe_mode: "Safe Mode",
                enable_safe_mode_description: "This will disable all plugins and themes, leaving only core functionalities. Restart required.",
            }
        },
        plugins: {
            description: "Description",
            safe_mode_callout: "Safe Mode Enabled",
            safe_mode_callout_desc: "Only internal plugins will take effect while safe mode is enabled.",
            info_sheet: {
                details: "Details",
                more_info: "More Info",
                view_source: "View Source",
                configurations: "Configurations",
                authors: "Authors",
                version: "Version",
                id: "ID",
                path: "Path",
            }
        },
        developer: {
            sections: {
                init_config: {
                    label: "Loader Configurations",
                    sublabel: "Configure the loader to use custom endpoint for bundle fetching. Refer CONTRIBUTING.md to learn how to configure local dev server for development",
                    custom_endpoint: "Custom Endpoint",
                    bundle_path: "Bundle Path",
                    bundle_path_desc: "(Optional) Path to bundle file. Default is dependent on custom endpoint availability",
                    force_update: "Force Update",
                    force_update_desc: "Forcefully fetch bundle every app start to ensure latest bundle is loaded",
                },
                tools: {
                    label: "Tools",
                    asset_browser: {
                        label: "Asset Browser",
                    }
                },
                playground: {
                    label: "Playground",
                },
                actions: {
                    label: "Actions",
                    invalidate_metro_cache: "Invalidate Metro Cache",
                }
            },
        },
        updater: {
            info: "Info",
            repo: "Repository",
            settings: "Settings",
            autoUpdate: "Automatic Updates",
            autoUpdateDescription: "Enable automatic Wintry updates without prompts",
            notify: "Notify After Update",
            notifyDescription: "Display a message once Wintry is auto-updated",
            checkForUpdates: "Check for Updates",
        }
    },
} satisfies BaseTranslation;

export default en;
