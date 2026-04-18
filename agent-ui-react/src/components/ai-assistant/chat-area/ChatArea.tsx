import { mergeClasses } from "@fluentui/react-components";
import { SparkleRegular } from "@fluentui/react-icons";
import { ChatMessageBubble } from "./chat-message-bubble";
import { useChatMessageBubbleStyles } from "./chat-message-bubble";
import { useAutoScroll } from "./useAutoScroll";
import { useChatAreaStyles } from "./ChatArea.styles";
import type { IChatAreaProps } from "./ChatArea.types";

const TYPING_DOT_CLASSES = ["typingDot1", "typingDot2", "typingDot3"] as const;

export const ChatArea = ({
	messages,
	isStreaming,
	streamingText,
	renderMessage,
}: IChatAreaProps) => {
	const classes = useChatAreaStyles();
	const msgClasses = useChatMessageBubbleStyles();
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
				<div className={msgClasses.assistantBlock}>
					<div className={msgClasses.assistantPreamble}>
						<span className={msgClasses.avatar}>
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
						<div className={msgClasses.assistantBubble}>{streamingText}</div>
					)}
				</div>
			)}
		</div>
	);
};
