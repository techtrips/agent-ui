import type { ComponentType } from "react";
import type { IChatMessage } from "../AIAssistant.types";

export interface IChatAreaProps {
	messages: IChatMessage[];
	isStreaming: boolean;
	streamingText: string;
	renderMessage?: ComponentType<{ message: IChatMessage }>;
}
