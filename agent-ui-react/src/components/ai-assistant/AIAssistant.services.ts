import type {
	IChatMessage,
	IConversation,
	IStarterPrompt,
	ITemplate,
} from "./AIAssistant.types";

/* ── Service contracts ── */

export interface IEntity<T> {
	data?: T;
	loading?: boolean;
	error?: string;
}

export interface IStarterPromptService {
	getStarterPrompts: (
		agentNames?: string[],
	) => Promise<IEntity<IStarterPrompt[]>>;
	addStarterPrompt: (
		prompt: IStarterPrompt,
	) => Promise<IEntity<IStarterPrompt>>;
	updateStarterPrompt: (
		prompt: IStarterPrompt,
	) => Promise<IEntity<IStarterPrompt>>;
	deleteStarterPrompt: (
		promptId: string,
		agentName?: string,
	) => Promise<IEntity<void>>;
}

export interface ITemplateService {
	getTemplates: () => Promise<IEntity<ITemplate[]>>;
	getTemplateById: (templateId: string) => Promise<IEntity<ITemplate>>;
	addTemplate: (template: ITemplate) => Promise<IEntity<ITemplate>>;
	updateTemplate: (template: ITemplate) => Promise<IEntity<ITemplate>>;
	deleteTemplate: (templateId: string) => Promise<IEntity<void>>;
}

export interface IConversationService {
	getConversationHistory: () => Promise<IEntity<IConversation[]>>;
	getConversationMessages: (
		threadId: string,
	) => Promise<IEntity<IChatMessage[]>>;
}

export interface IAIAssistantService
	extends IStarterPromptService,
		ITemplateService,
		IConversationService {}

export interface ICreateServiceOptions {
	baseUrl: string;
	getToken: () => Promise<string>;
}

export class AIAssistantService implements IAIAssistantService {
	private readonly baseUrl: string;
	private readonly getToken: () => Promise<string>;

	constructor(options: ICreateServiceOptions) {
		this.baseUrl = options.baseUrl;
		this.getToken = options.getToken;
	}

	private async fetchApi<T>(
		path: string,
		method: "GET" | "POST" | "PUT" | "DELETE",
		body?: unknown,
	): Promise<IEntity<T>> {
		if (!this.baseUrl)
			return { error: "API base URL is required.", loading: false };
		try {
			const token = await this.getToken();
			if (!token) return { error: "Access token is required.", loading: false };
			const res = await fetch(`${this.baseUrl}${path}`, {
				method,
				headers: {
					Authorization: `Bearer ${token}`,
					"Content-Type": "application/json",
				},
				body: body ? JSON.stringify(body) : undefined,
			});
			if (!res.ok) {
				throw new Error(`HTTP ${res.status} ${res.statusText}`);
			}
			const data = method === "DELETE" ? undefined : await res.json();
			return { data: data as T, loading: false };
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Unknown error";
			return { error: msg, loading: false };
		}
	}

	// Starter Prompts
	getStarterPrompts(agentNames?: string[]): Promise<IEntity<IStarterPrompt[]>> {
		return this.fetchApi("/starter-prompts/search", "POST", {
			agentNames: agentNames ?? [],
			tags: [],
		});
	}

	addStarterPrompt(prompt: IStarterPrompt): Promise<IEntity<IStarterPrompt>> {
		return this.fetchApi("/starter-prompts", "POST", prompt);
	}

	updateStarterPrompt(
		prompt: IStarterPrompt,
	): Promise<IEntity<IStarterPrompt>> {
		return this.fetchApi(
			`/starter-prompts/${prompt.id}?agentName=${encodeURIComponent(prompt.agentName ?? "")}`,
			"PUT",
			prompt,
		);
	}

	deleteStarterPrompt(
		promptId: string,
		agentName?: string,
	): Promise<IEntity<void>> {
		return this.fetchApi(
			`/starter-prompts/${promptId}${agentName ? `?agentName=${encodeURIComponent(agentName)}` : ""}`,
			"DELETE",
		);
	}

	// Templates
	getTemplates(): Promise<IEntity<ITemplate[]>> {
		return this.fetchApi("/templates", "GET");
	}

	getTemplateById(templateId: string): Promise<IEntity<ITemplate>> {
		return this.fetchApi(`/templates/${templateId}`, "GET");
	}

	addTemplate(template: ITemplate): Promise<IEntity<ITemplate>> {
		return this.fetchApi("/templates", "POST", template);
	}

	updateTemplate(template: ITemplate): Promise<IEntity<ITemplate>> {
		return this.fetchApi(`/templates/${template.id}`, "PUT", template);
	}

	deleteTemplate(templateId: string): Promise<IEntity<void>> {
		return this.fetchApi(`/templates/${templateId}`, "DELETE");
	}

	// Conversation History
	getConversationHistory(): Promise<IEntity<IConversation[]>> {
		return this.fetchApi("/conversations", "GET");
	}

	async getConversationMessages(
		threadId: string,
	): Promise<IEntity<IChatMessage[]>> {
		const result = await this.fetchApi<
			{ id?: string; messageText: string; role: string; timestamp: string }[]
		>(`/conversations/${threadId}/messages`, "GET");
		if (result.error || !result.data)
			return { error: result.error, loading: result.loading };
		return {
			data: result.data
				.filter((m) => m.role !== "system")
				.map((m) => ({
					id:
						m.id ?? `msg-${Date.now()}-${Math.random().toString(36).slice(2)}`,
					role: m.role as "user" | "assistant",
					content: m.messageText,
					timestamp: m.timestamp,
				})),
		};
	}
}
