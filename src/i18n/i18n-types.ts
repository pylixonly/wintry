// This file was auto-generated by 'typesafe-i18n'. Any manual changes will be overwritten.
/* eslint-disable */
import type { BaseTranslation as BaseTranslationType, LocalizedString } from 'typesafe-i18n'

export type BaseTranslation = BaseTranslationType
export type BaseLocale = 'en'

export type Locales =
	| 'en'

export type Translation = RootTranslation

export type Translations = RootTranslation

type RootTranslation = {
	/**
	 * D​i​s​c​o​r​d
	 */
	discord: string
	/**
	 * W​i​n​t​r​y
	 */
	wintry: string
	ui: {
		components: {
			search: {
				/**
				 * S​e​a​r​c​h
				 */
				placeholder: string
			}
		}
	}
	error_boundary: {
		/**
		 * U​h​ ​o​h​.
		 */
		uh_oh: string
		/**
		 * R​e​t​r​y​ ​R​e​n​d​e​r
		 */
		retry_render: string
		/**
		 * R​e​l​o​a​d​ ​D​i​s​c​o​r​d
		 */
		reload: string
		/**
		 * S​a​f​e​ ​M​o​d​e
		 */
		safe_mode: string
		screen: {
			/**
			 * C​o​p​y
			 */
			copy: string
			/**
			 * S​h​o​w​ ​m​o​r​e
			 */
			show_more: string
			/**
			 * S​h​o​w​ ​l​e​s​s
			 */
			show_less: string
			/**
			 * C​o​m​p​o​n​e​n​t​ ​S​t​a​c​k
			 */
			component_stack: string
			/**
			 * C​a​l​l​ ​S​t​a​c​k
			 */
			call_stack: string
			/**
			 * A​n​ ​e​r​r​o​r​ ​o​c​c​u​r​r​e​d​ ​w​h​i​l​e​ ​r​e​n​d​e​r​i​n​g​ ​a​ ​c​o​m​p​o​n​e​n​t​.​ ​T​h​i​s​ ​m​a​y​ ​h​a​v​e​ ​b​e​e​n​ ​c​a​u​s​e​d​ ​b​y​ ​a​ ​p​l​u​g​i​n​,​ ​W​i​n​t​r​y​,​ ​o​r​ ​D​i​s​c​o​r​d​ ​i​t​s​e​l​f​.
			 */
			description: string
		}
	}
	settings: {
		sections: {
			/**
			 * P​l​u​g​i​n​s
			 */
			plugins: string
			/**
			 * T​h​e​m​e​s
			 */
			themes: string
			/**
			 * D​e​v​e​l​o​p​e​r
			 */
			developer: string
			/**
			 * U​p​d​a​t​e​r
			 */
			updater: string
		}
		general: {
			/**
			 * I​n​f​o
			 */
			info: string
			/**
			 * Q​u​i​c​k​ ​A​c​t​i​o​n​s
			 */
			quick_actions: string
			/**
			 * R​e​l​o​a​d​ ​D​i​s​c​o​r​d
			 */
			reload: string
		}
		plugins: {
			/**
			 * D​e​s​c​r​i​p​t​i​o​n
			 */
			description: string
			info_sheet: {
				/**
				 * D​e​t​a​i​l​s
				 */
				details: string
				/**
				 * M​o​r​e​ ​I​n​f​o
				 */
				more_info: string
				/**
				 * V​i​e​w​ ​S​o​u​r​c​e
				 */
				view_source: string
				/**
				 * C​o​n​f​i​g​u​r​a​t​i​o​n​s
				 */
				configurations: string
				/**
				 * A​u​t​h​o​r​s
				 */
				authors: string
				/**
				 * V​e​r​s​i​o​n
				 */
				version: string
				/**
				 * I​D
				 */
				id: string
				/**
				 * P​a​t​h
				 */
				path: string
			}
		}
		developer: {
			/**
			 * A​s​s​e​t​ ​B​r​o​w​s​e​r
			 */
			assetBrowser: string
			sections: {
				/**
				 * T​o​o​l​s
				 */
				tools: string
				/**
				 * D​a​t​a
				 */
				data: string
				/**
				 * I​n​v​a​l​i​d​a​t​e​ ​M​e​t​r​o​ ​C​a​c​h​e
				 */
				invalidate_metro_cache: string
			}
		}
		updater: {
			/**
			 * I​n​f​o
			 */
			info: string
			/**
			 * R​e​p​o​s​i​t​o​r​y
			 */
			repo: string
			/**
			 * S​e​t​t​i​n​g​s
			 */
			settings: string
			/**
			 * A​u​t​o​m​a​t​i​c​ ​U​p​d​a​t​e​s
			 */
			autoUpdate: string
			/**
			 * E​n​a​b​l​e​ ​a​u​t​o​m​a​t​i​c​ ​W​i​n​t​r​y​ ​u​p​d​a​t​e​s​ ​w​i​t​h​o​u​t​ ​p​r​o​m​p​t​s
			 */
			autoUpdateDescription: string
			/**
			 * N​o​t​i​f​y​ ​A​f​t​e​r​ ​U​p​d​a​t​e
			 */
			notify: string
			/**
			 * D​i​s​p​l​a​y​ ​a​ ​m​e​s​s​a​g​e​ ​o​n​c​e​ ​W​i​n​t​r​y​ ​i​s​ ​a​u​t​o​-​u​p​d​a​t​e​d
			 */
			notifyDescription: string
			/**
			 * C​h​e​c​k​ ​f​o​r​ ​U​p​d​a​t​e​s
			 */
			checkForUpdates: string
		}
	}
}

export type TranslationFunctions = {
	/**
	 * Discord
	 */
	discord: () => LocalizedString
	/**
	 * Wintry
	 */
	wintry: () => LocalizedString
	ui: {
		components: {
			search: {
				/**
				 * Search
				 */
				placeholder: () => LocalizedString
			}
		}
	}
	error_boundary: {
		/**
		 * Uh oh.
		 */
		uh_oh: () => LocalizedString
		/**
		 * Retry Render
		 */
		retry_render: () => LocalizedString
		/**
		 * Reload Discord
		 */
		reload: () => LocalizedString
		/**
		 * Safe Mode
		 */
		safe_mode: () => LocalizedString
		screen: {
			/**
			 * Copy
			 */
			copy: () => LocalizedString
			/**
			 * Show more
			 */
			show_more: () => LocalizedString
			/**
			 * Show less
			 */
			show_less: () => LocalizedString
			/**
			 * Component Stack
			 */
			component_stack: () => LocalizedString
			/**
			 * Call Stack
			 */
			call_stack: () => LocalizedString
			/**
			 * An error occurred while rendering a component. This may have been caused by a plugin, Wintry, or Discord itself.
			 */
			description: () => LocalizedString
		}
	}
	settings: {
		sections: {
			/**
			 * Plugins
			 */
			plugins: () => LocalizedString
			/**
			 * Themes
			 */
			themes: () => LocalizedString
			/**
			 * Developer
			 */
			developer: () => LocalizedString
			/**
			 * Updater
			 */
			updater: () => LocalizedString
		}
		general: {
			/**
			 * Info
			 */
			info: () => LocalizedString
			/**
			 * Quick Actions
			 */
			quick_actions: () => LocalizedString
			/**
			 * Reload Discord
			 */
			reload: () => LocalizedString
		}
		plugins: {
			/**
			 * Description
			 */
			description: () => LocalizedString
			info_sheet: {
				/**
				 * Details
				 */
				details: () => LocalizedString
				/**
				 * More Info
				 */
				more_info: () => LocalizedString
				/**
				 * View Source
				 */
				view_source: () => LocalizedString
				/**
				 * Configurations
				 */
				configurations: () => LocalizedString
				/**
				 * Authors
				 */
				authors: () => LocalizedString
				/**
				 * Version
				 */
				version: () => LocalizedString
				/**
				 * ID
				 */
				id: () => LocalizedString
				/**
				 * Path
				 */
				path: () => LocalizedString
			}
		}
		developer: {
			/**
			 * Asset Browser
			 */
			assetBrowser: () => LocalizedString
			sections: {
				/**
				 * Tools
				 */
				tools: () => LocalizedString
				/**
				 * Data
				 */
				data: () => LocalizedString
				/**
				 * Invalidate Metro Cache
				 */
				invalidate_metro_cache: () => LocalizedString
			}
		}
		updater: {
			/**
			 * Info
			 */
			info: () => LocalizedString
			/**
			 * Repository
			 */
			repo: () => LocalizedString
			/**
			 * Settings
			 */
			settings: () => LocalizedString
			/**
			 * Automatic Updates
			 */
			autoUpdate: () => LocalizedString
			/**
			 * Enable automatic Wintry updates without prompts
			 */
			autoUpdateDescription: () => LocalizedString
			/**
			 * Notify After Update
			 */
			notify: () => LocalizedString
			/**
			 * Display a message once Wintry is auto-updated
			 */
			notifyDescription: () => LocalizedString
			/**
			 * Check for Updates
			 */
			checkForUpdates: () => LocalizedString
		}
	}
}

export type Formatters = {}
