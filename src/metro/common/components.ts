import type { FlashListProps } from "@shopify/flash-list";
import { lazyDestructure, lazyValue } from "../../utils/lazy";
import { find, findByDisplayName, findByName, findByProps } from "../api";
import { createFilterDefinition } from "../factories";

import type { ReactElement } from "react";
import type * as t from "./types/components";

const bySingularProp = createFilterDefinition<[string]>(
    ([prop], m) => m[prop] && Object.keys(m).length === 1,
    prop => `bunny.metro.common.components.bySingularProp(${prop})`,
);

const findSingular = (prop: string) => lazyValue(() => find(bySingularProp(prop))?.[prop]);
const findProp = (...prop: string[]) => lazyValue(() => findByProps(...prop)[prop[0]]);

// Discord
export const LegacyAlert = findByDisplayName("FluxContainer(Alert)");
export const CompatButton = findByProps("Looks", "Colors", "Sizes");
export const HelpMessage = findByName("HelpMessage");

// React Native's included SafeAreaView only adds padding on iOS.
export const { SafeAreaView, SafeAreaProvider, useSafeAreaInsets } = lazyDestructure(() =>
    findByProps("useSafeAreaInsets"),
);

// ActionSheet
export const ActionSheetRow = findProp("ActionSheetRow");

// Buttons
export const Button = findSingular("Button") as t.Button;
export const TwinButtons = findProp("TwinButtons");
export const IconButton = findSingular("IconButton") as t.IconButton;
export const RowButton = findProp("RowButton") as t.RowButton;

export const PressableScale = findProp("PressableScale");

// Tables
export const TableRow = findProp("TableRow");
export const TableRowIcon = findProp("TableRowIcon");
export const TableRowTrailingText = findProp("TableRowTrailingText");
export const TableRowGroup = findProp("TableRowGroup");
export const TableSwitchRow = findProp("TableSwitchRow");
export const TableSwitch = findSingular("FormSwitch");
export const TableRadio = findSingular("FormRadio");
export const TableCheckbox = findSingular("FormCheckbox");

export const FormSwitch = findSingular("FormSwitch");
export const FormRadio = findSingular("FormRadio");
export const FormCheckbox = findSingular("FormCheckbox");

// Card
export const Card = findProp("Card");
export const RedesignCompat = lazyValue(() => findByProps("RedesignCompat").RedesignCompat);

// Misc.
export const Stack = findProp("Stack") as t.Stack;

// Inputs
export const TextInput = findSingular("TextInput") as t.TextInput;

// SegmentedControl
export const SegmentedControl = findProp("SegmentedControl") as t.SegmentedControl;
export const SegmentedControlPages = findProp("SegmentedControlPages") as t.SegmentedControlPages;
export const useSegmentedControlState = findSingular("useSegmentedControlState") as (
    state: t.SegmentedControlStateArgs,
) => t.SegmentedControlState;
export const CompatSegmentedControl = findProp("CompatSegmentedControl") as t.CompatSegmentedControl;

export const FloatingActionButton = findProp("FloatingActionButton") as t.FloatingActionButton;
export const ActionSheet = findProp("ActionSheet") as t.ActionSheet;
export const BottomSheetTitleHeader = findProp("BottomSheetTitleHeader");

export const Text = findProp("Text", "LegacyText") as t.Text;

export const Forms = findByProps("Form", "FormSection");

export const FlashList = findProp("FlashList") as <T>(props: FlashListProps<T>) => ReactElement<typeof props>;
export const MasonryFlashList = findProp("MasonryFlashList") as <T>(
    props: FlashListProps<T>,
) => ReactElement<typeof props>;
