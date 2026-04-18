import { useCallback, useEffect, useMemo, useState } from "react";
import { useAIAssistantContext } from "../../AIAssistantContext";
import type { IConversation } from "../../AIAssistant.types";

export const useConversationHistory = () => {
	const { service, newChat, setMessages } = useAIAssistantContext();
	const [conversations, setConversations] = useState<IConversation[]>([]);
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | undefined>();
	const [searchQuery, setSearchQuery] = useState("");

	useEffect(() => {
		if (!service) {
			setLoading(false);
			return;
		}
		service.getConversationHistory().then((result) => {
			if (result.data) {
				const sorted = [...result.data].sort(
					(a, b) =>
						new Date(b.lastActivityAt).getTime() -
						new Date(a.lastActivityAt).getTime(),
				);
				setConversations(sorted);
			}
			if (result.error) setError(result.error);
			setLoading(false);
		});
	}, [service]);

	const filtered = useMemo(() => {
		if (!searchQuery.trim()) return conversations;
		const q = searchQuery.toLowerCase();
		return conversations.filter((c) =>
			c.firstMessageText.toLowerCase().includes(q),
		);
	}, [conversations, searchQuery]);

	const handleSelect = useCallback(
		async (conversation: IConversation, onClose: () => void) => {
			if (!service) return;
			const result = await service.getConversationMessages(
				conversation.threadId,
			);
			if (result.data) {
				setMessages(result.data);
			}
			onClose();
		},
		[service, setMessages],
	);

	const handleNewChat = useCallback(
		(onClose: () => void) => {
			newChat();
			onClose();
		},
		[newChat],
	);

	return {
		service,
		conversations,
		filtered,
		loading,
		error,
		searchQuery,
		setSearchQuery,
		handleSelect,
		handleNewChat,
	};
};
