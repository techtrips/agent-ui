import { mergeClasses } from "@fluentui/react-components";
import { SparkleRegular } from "@fluentui/react-icons";
import type { ChatMessage } from "./AIAssistant.types";
import { ChatMessageBubble } from "./ChatMessageBubble";
import { useAutoScroll } from "./useAutoScroll";
import { useAIAssistantStyles } from "./AIAssistant.styles";
import type { ComponentType } from "react";

interface ChatAreaProps {
	messages: ChatMessage[];
	isStreaming: boolean;
	streamingText: string;
	renderMessage?: ComponentType<{ message: ChatMessage }>;
}

const TYPING_DOT_CLASSES = ["typingDot1", "typingDot2", "typingDot3"] as const;

export const ChatArea = ({
	messages,
	isStreaming,
	streamingText,
	renderMessage,
}: ChatAreaProps) => {
	const classes = useAIAssistantStyles();
	const { scrollRef } = useAutoScroll(messages.length);

	return (
		<div ref={scrollRef} className={classes.thread}>
			{messages.map((message) => (
				<ChatMessageBubble
					key={message.id}
					message={message}
					renderMessage={renderMessage}
				/>
			))}

			{isStreaming && (
				<div className={classes.assistantBlock}>
					<div className={classes.assistantPreamble}>
						<span className={classes.avatar}>
							<SparkleRegular fontSize={18} />
						</span>
						{streamingText ? (
							<span>{""}</span>
						) : (
							<div className={classes.typingIndicator}>
								{TYPING_DOT_CLASSES.map((cls) => (
									<span
										key={cls}
										className={mergeClasses(classes.typingDot, classes[cls])}
									/>
								))}
							</div>
						)}
					</div>
					{streamingText && (
						<div className={classes.assistantBubble}>{streamingText}</div>
					)}
				</div>
			)}
		</div>
	);
};
