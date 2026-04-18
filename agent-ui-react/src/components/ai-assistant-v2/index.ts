export { AIAssistant } from "./AIAssistant";
export type { AIAssistantProps, ChatMessage } from "./AIAssistant.types";
export type {
	ChatAdapter,
	ChatEvent,
	SendMessageRequest,
} from "./adapters/types";
export { agUiAdapter } from "./adapters/agUiAdapter";
export { restAdapter } from "./adapters/restAdapter";
export { useChatState } from "./useChatState";
export type { AIAssistantExtension, ExtensionProps } from "./extensions/types";
export { ConversationHistory } from "./extensions/ConversationHistory";
export { StarterPrompts } from "./extensions/StarterPrompts";
export { TemplateRenderer } from "./extensions/TemplateRenderer";
