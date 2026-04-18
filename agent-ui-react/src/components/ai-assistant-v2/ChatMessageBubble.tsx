import { SparkleRegular } from "@fluentui/react-icons";
import type { ChatMessage } from "./AIAssistant.types";
import { useAIAssistantStyles } from "./AIAssistant.styles";
import type { ComponentType } from "react";

const formatTime = (timestamp: string): string => {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - date.getTime();
	const oneDayMs = 24 * 60 * 60 * 1000;
	const time = date.toLocaleTimeString([], {
		hour: "2-digit",
		minute: "2-digit",
	});
	if (diffMs >= oneDayMs) {
		const sameYear = date.getFullYear() === now.getFullYear();
		const dateStr = date.toLocaleDateString([], {
			month: "short",
			day: "numeric",
			...(sameYear ? {} : { year: "numeric" }),
		});
		return `${dateStr}, ${time}`;
	}
	return time;
};

interface ChatMessageBubbleProps {
	message: ChatMessage;
	renderMessage?: ComponentType<{ message: ChatMessage }>;
}

export const ChatMessageBubble = ({
	message,
	renderMessage: CustomRenderer,
}: ChatMessageBubbleProps) => {
	const classes = useAIAssistantStyles();

	if (message.role === "user") {
		return (
			<div className={classes.userBlock}>
				<span className={classes.userTime}>
					{formatTime(message.timestamp)}
				</span>
				<div className={classes.userBubble}>{message.content}</div>
			</div>
		);
	}

	if (message.role === "error") {
		return (
			<div className={classes.assistantBlock}>
				<div className={classes.assistantPreamble}>
					<span className={classes.avatar}>
						<SparkleRegular fontSize={18} />
					</span>
					<span className={classes.errorText}>
						Something went wrong. Please try again.
					</span>
				</div>
			</div>
		);
	}

	// Assistant message
	return (
		<div className={classes.assistantBlock}>
			<div className={classes.assistantPreamble}>
				<span className={classes.avatar}>
					<SparkleRegular fontSize={18} />
				</span>
				<span>{formatTime(message.timestamp)}</span>
			</div>
			{CustomRenderer ? (
				<div className={classes.assistantCard}>
					<CustomRenderer message={message} />
				</div>
			) : (
				<div className={classes.assistantBubble}>{message.content}</div>
			)}
		</div>
	);
};
