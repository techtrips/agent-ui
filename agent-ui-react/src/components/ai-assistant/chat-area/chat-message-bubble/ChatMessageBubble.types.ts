import type { ComponentType } from "react";
import type { IChatMessage } from "../../AIAssistant.types";

export interface IChatMessageBubbleProps {
	message: IChatMessage;
	renderMessage?: ComponentType<{ message: IChatMessage }>;
}
