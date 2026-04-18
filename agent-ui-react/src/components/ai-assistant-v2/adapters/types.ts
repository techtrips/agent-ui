/**
 * Chat adapter abstraction — the single integration point
 * for any AI backend (AG-UI, REST, WebSocket, etc.).
 */

export type ChatEvent =
	| { type: "text-delta"; content: string }
	| { type: "text-done"; content: string }
	| { type: "error"; message: string };

export interface SendMessageRequest {
	threadId: string;
	messageId: string;
	message: string;
	model?: string;
	abortSignal?: AbortSignal;
}

export interface ChatAdapter {
	sendMessage(request: SendMessageRequest): AsyncIterable<ChatEvent>;
}
