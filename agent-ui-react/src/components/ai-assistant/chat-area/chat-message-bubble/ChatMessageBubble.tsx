import { SparkleRegular } from "@fluentui/react-icons";
import { useChatMessageBubbleStyles } from "./ChatMessageBubble.styles";
import { formatTime } from "./ChatMessageBubble.utils";
import type { IChatMessageBubbleProps } from "./ChatMessageBubble.types";

export const ChatMessageBubble = ({
	message,
	renderMessage: CustomRenderer,
}: IChatMessageBubbleProps) => {
	const classes = useChatMessageBubbleStyles();

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
