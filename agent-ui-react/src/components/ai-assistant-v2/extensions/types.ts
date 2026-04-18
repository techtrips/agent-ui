import type { ComponentType } from "react";

/** Props passed to every extension component by the shell. */
export interface ExtensionProps {
	/** Return to the chat view. */
	onClose: () => void;
}

/** Metadata that each extension component carries as a static property. */
export interface ExtensionMeta {
	/** Unique key used for nav state. */
	key: string;
	/** Human-readable label shown in the nav. */
	label: string;
	/** Fluent icon component shown in the header / sidebar. */
	icon: ComponentType<{ fontSize?: number }>;
}

/** An extension component with self-describing metadata. */
export type AIAssistantExtension = ComponentType<ExtensionProps> & {
	extensionMeta: ExtensionMeta;
};

/** Helper to define an extension with metadata in one call. */
export function defineExtension(
	component: ComponentType<ExtensionProps>,
	meta: ExtensionMeta,
): AIAssistantExtension {
	const ext = component as AIAssistantExtension;
	ext.extensionMeta = meta;
	return ext;
}
