import type { ComponentType } from "react";
import type { ChatAdapter } from "./adapters/types";
import type { AIAssistantExtension } from "./extensions/types";

export interface ChatMessage {
	id: string;
	role: "user" | "assistant" | "error";
	content: string;
	timestamp: string;
}

export interface AIAssistantProps {
	/** The adapter that handles sending messages (AG-UI, REST, etc.) */
	adapter: ChatAdapter;
	/** Display theme */
	theme?: "light" | "dark";
	/** Greeting text on the welcome screen */
	greetingText?: string;
	/** Header text */
	headerText?: string;
	/** Start in full-screen mode (default: false) */
	defaultFullScreen?: boolean;
	/** Show the full-screen toggle button (default: true) */
	showFullScreenToggle?: boolean;
	/** CSS class name for the root element */
	className?: string;
	/** Optional extension panels shown via header nav buttons */
	extensions?: AIAssistantExtension[];
	/** Custom message renderer — override how assistant messages are displayed */
	renderMessage?: ComponentType<{ message: ChatMessage }>;
	/** Called when the close button is clicked (side-panel mode) */
	onClose?: () => void;
}
