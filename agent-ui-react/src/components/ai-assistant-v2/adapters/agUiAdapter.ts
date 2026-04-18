import { HttpAgent } from "@ag-ui/client";
import type { RunAgentInput, Message, AgentSubscriber } from "@ag-ui/core";
import type { ChatAdapter, ChatEvent, SendMessageRequest } from "./types";

interface AgUiAdapterOptions {
	url: string;
	getToken: () => Promise<string>;
}

/**
 * Extended HttpAgent that injects `model` into the POST body.
 */
class ExtendedHttpAgent extends HttpAgent {
	public model?: string;

	protected override requestInit(input: RunAgentInput): RequestInit {
		const base = super.requestInit(input);
		const body = typeof base.body === "string" ? JSON.parse(base.body) : {};
		if (this.model) {
			body.model = this.model;
		}
		return { ...base, body: JSON.stringify(body) };
	}
}

/**
 * Creates a ChatAdapter backed by the AG-UI protocol.
 *
 * Usage:
 * ```ts
 * const adapter = agUiAdapter({ url: "https://agent.example.com/agui", getToken });
 * ```
 */
export const agUiAdapter = (options: AgUiAdapterOptions): ChatAdapter => {
	let agent: ExtendedHttpAgent | undefined;

	return {
		async *sendMessage(request: SendMessageRequest): AsyncGenerator<ChatEvent> {
			if (!agent) {
				agent = new ExtendedHttpAgent({ url: options.url });
			}

			const token = await options.getToken().catch(() => "");

			agent.threadId = request.threadId;
			agent.headers = token ? { Authorization: `Bearer ${token}` } : {};
			agent.model = request.model;

			const userMessage: Message = {
				id: request.messageId,
				role: "user",
				content: request.message,
			};
			agent.setMessages([userMessage]);

			// Use a queue to bridge the callback-based subscriber to async iteration
			type QueueItem = ChatEvent | null; // null = done
			const queue: QueueItem[] = [];
			let resolve: (() => void) | null = null;
			let finished = false;

			const push = (item: QueueItem) => {
				queue.push(item);
				if (resolve) {
					const r = resolve;
					resolve = null;
					r();
				}
			};

			const subscriber: AgentSubscriber = {
				onTextMessageStartEvent: () => {},
				onTextMessageContentEvent: (params) => {
					push({ type: "text-delta", content: params.event.delta ?? "" });
				},
				onTextMessageEndEvent: (params) => {
					push({
						type: "text-done",
						content: params.textMessageBuffer ?? "",
					});
				},
				onRunErrorEvent: (params) => {
					push({ type: "error", message: params.event.message });
				},
				onRunFailed: (params) => {
					push({ type: "error", message: params.error.message });
				},
				onRunFinishedEvent: () => {
					// will be marked done after runAgent resolves
				},
				onToolCallStartEvent: () => {},
				onToolCallArgsEvent: () => {},
				onToolCallEndEvent: () => {},
				onToolCallResultEvent: () => {},
				onStepStartedEvent: () => {},
				onStepFinishedEvent: () => {},
			};

			const abortController = new AbortController();
			if (request.abortSignal) {
				request.abortSignal.addEventListener("abort", () =>
					abortController.abort(),
				);
			}

			// Run agent in background, push events via subscriber
			const runPromise = agent
				.runAgent({ abortController }, subscriber)
				.then((result) => {
					// Extract final assistant text from newMessages if available
					const msgs = result.newMessages ?? [];
					const assistantText = msgs
						.filter((m: Message) => m.role === "assistant")
						.map((m: Message) => (m as { content?: string }).content ?? "")
						.join("\n")
						.trim();
					if (assistantText) {
						push({ type: "text-done", content: assistantText });
					}
				})
				.catch((err: Error) => {
					if (err.name !== "AbortError") {
						push({ type: "error", message: err.message });
					}
				})
				.finally(() => {
					finished = true;
					push(null);
				});

			// Yield events as they arrive
			while (true) {
				if (queue.length > 0) {
					const item = queue.shift()!;
					if (item === null) break;
					yield item;
				} else if (finished) {
					break;
				} else {
					await new Promise<void>((r) => {
						resolve = r;
					});
				}
			}

			await runPromise;
		},
	};
};
