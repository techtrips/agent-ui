import { makeStyles, shorthands, tokens } from "@fluentui/react-components";
import { ChatRegular, LightbulbRegular } from "@fluentui/react-icons";
import { defineExtension } from "./types";
import type { ExtensionProps } from "./types";

const useStyles = makeStyles({
	root: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		overflow: "hidden",
	},
	header: {
		display: "flex",
		alignItems: "center",
		justifyContent: "space-between",
		...shorthands.padding("8px", "12px"),
		...shorthands.borderBottom("1px", "solid", "var(--agent-chat-border)"),
		flexShrink: 0,
	},
	title: {
		fontSize: tokens.fontSizeBase300,
		fontWeight: tokens.fontWeightSemibold,
		color: "var(--agent-chat-fg)",
	},
	backButton: {
		...shorthands.border("none"),
		...shorthands.borderRadius("6px"),
		...shorthands.padding("6px", "12px"),
		display: "inline-flex",
		alignItems: "center",
		...shorthands.gap("6px"),
		backgroundColor: "transparent",
		color: "var(--agent-chat-brand)",
		cursor: "pointer",
		fontSize: tokens.fontSizeBase200,
		fontWeight: tokens.fontWeightSemibold,
		":hover": {
			backgroundColor: "var(--agent-chat-hover)",
		},
	},
	empty: {
		display: "flex",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
		color: "var(--agent-chat-muted)",
		fontSize: tokens.fontSizeBase300,
	},
});

const StarterPromptsPanel = ({ onClose }: ExtensionProps) => {
	const classes = useStyles();

	return (
		<div className={classes.root}>
			<div className={classes.header}>
				<span className={classes.title}>Starter Prompts</span>
				<button className={classes.backButton} type="button" onClick={onClose}>
					<ChatRegular fontSize={14} />
					Back to chat
				</button>
			</div>
			<div className={classes.empty}>No starter prompts configured</div>
		</div>
	);
};

export const StarterPrompts = defineExtension(StarterPromptsPanel, {
	key: "prompts",
	label: "Starter Prompts",
	icon: LightbulbRegular,
});
