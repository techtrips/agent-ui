import { useCallback, useMemo, useState, type CSSProperties } from "react";
import { mergeClasses, tokens } from "@fluentui/react-components";
import {
	AddRegular,
	FullScreenMaximize20Regular,
	FullScreenMinimize20Regular,
	DismissRegular,
	PanelLeftRegular,
	SparkleRegular,
} from "@fluentui/react-icons";
import type { AIAssistantProps } from "./AIAssistant.types";
import { useChatState } from "./useChatState";
import { ChatArea } from "./ChatArea";
import { ChatInput } from "./ChatInput";
import { useAIAssistantStyles } from "./AIAssistant.styles";

const CHAT_VIEW = "__chat__";

export const AIAssistant = ({
	adapter,
	greetingText,
	headerText = "AI Assistant",
	defaultFullScreen = false,
	showFullScreenToggle = true,
	className,
	extensions,
	renderMessage,
	onClose,
}: AIAssistantProps) => {
	const classes = useAIAssistantStyles();
	const [isFullScreen, setIsFullScreen] = useState(defaultFullScreen);
	const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
	const [activeView, setActiveView] = useState(CHAT_VIEW);
	const { messages, isStreaming, streamingText, sendMessage, abort, newChat } =
		useChatState(adapter);

	const themeVars = useMemo(
		() =>
			({
				"--agent-chat-bg": tokens.colorNeutralBackground2,
				"--agent-chat-fg": tokens.colorNeutralForeground1,
				"--agent-chat-brand": tokens.colorBrandBackground,
				"--agent-chat-brand-hover": tokens.colorBrandBackgroundHover,
				"--agent-chat-surface": tokens.colorNeutralBackground1,
				"--agent-chat-border": tokens.colorNeutralStroke2,
				"--agent-chat-hover": tokens.colorNeutralBackground1Hover,
				"--agent-chat-muted": tokens.colorNeutralForeground3,
				"--agent-chat-user-fg": tokens.colorNeutralForegroundOnBrand,
				"--agent-chat-card": tokens.colorNeutralBackground1,
				"--agent-chat-sidebar-bg": tokens.colorNeutralBackground3,
			}) as CSSProperties & Record<string, string>,
		[],
	);

	const hasMessages = messages.length > 0 || isStreaming;

	const handleToggleFullScreen = useCallback(() => {
		setIsFullScreen((prev) => !prev);
	}, []);

	const handleToggleSidebar = useCallback(() => {
		setIsSidebarCollapsed((prev) => !prev);
	}, []);

	const handleNavSelect = useCallback((key: string) => {
		setActiveView((prev) => (prev === key ? CHAT_VIEW : key));
	}, []);

	const handleBackToChat = useCallback(() => {
		setActiveView(CHAT_VIEW);
	}, []);

	const handleNewChat = useCallback(() => {
		newChat();
		setActiveView(CHAT_VIEW);
	}, [newChat]);

	const activeExtension = extensions?.find(
		(ext) => ext.extensionMeta.key === activeView,
	);

	const hasExtensions = extensions && extensions.length > 0;

	/* ── Sidebar nav items (New Chat + extensions) ── */
	const sidebarNavItems = useMemo(
		() => [
			{ key: CHAT_VIEW, label: "New Chat", icon: AddRegular },
			...(extensions ?? []).map((ext) => ({
				key: ext.extensionMeta.key,
				label: ext.extensionMeta.label,
				icon: ext.extensionMeta.icon,
			})),
		],
		[extensions],
	);

	/* ── Shared content area ── */
	const renderContent = () => {
		if (activeExtension) {
			const ExtComponent = activeExtension;
			return <ExtComponent onClose={handleBackToChat} />;
		}
		if (hasMessages) {
			return (
				<>
					<ChatArea
						messages={messages}
						isStreaming={isStreaming}
						streamingText={streamingText}
						renderMessage={renderMessage}
					/>
					<ChatInput
						isStreaming={isStreaming}
						onSend={sendMessage}
						onAbort={abort}
					/>
				</>
			);
		}
		return (
			<div className={classes.welcomeContainer}>
				<h1 className={classes.welcomeHeading}>
					<span className={classes.welcomeHeadingStrong}>Hello,</span>
					{greetingText ?? "How can I assist you?"}
				</h1>
				<div className={classes.welcomeComposerContainer}>
					<ChatInput
						isStreaming={isStreaming}
						onSend={sendMessage}
						onAbort={abort}
					/>
				</div>
			</div>
		);
	};

	return (
		<div
			className={mergeClasses(
				className ?? classes.root,
				isFullScreen && classes.rootFullScreen,
			)}
			style={themeVars}
		>
			{/* ── Header bar ── */}
			<div className={classes.header}>
				<span className={classes.headerTitle}>{headerText}</span>
				<div className={classes.headerActions}>
					{/* Side-panel mode: show extension nav in header */}
					{!isFullScreen && hasExtensions && (
						<>
							<button
								className={classes.headerButton}
								type="button"
								title="New chat"
								aria-label="New chat"
								onClick={handleNewChat}
							>
								<AddRegular fontSize={18} />
							</button>
							{extensions.map((ext) => (
								<button
									key={ext.extensionMeta.key}
									className={mergeClasses(
										classes.headerButton,
										activeView === ext.extensionMeta.key &&
											classes.headerButtonActive,
									)}
									type="button"
									title={ext.extensionMeta.label}
									aria-label={ext.extensionMeta.label}
									onClick={() => handleNavSelect(ext.extensionMeta.key)}
								>
									<ext.extensionMeta.icon fontSize={18} />
								</button>
							))}
						</>
					)}

					{showFullScreenToggle && (
						<button
							className={classes.headerButton}
							type="button"
							title={
								isFullScreen ? "Switch to side panel" : "Switch to full screen"
							}
							aria-label={
								isFullScreen ? "Switch to side panel" : "Switch to full screen"
							}
							onClick={handleToggleFullScreen}
						>
							{isFullScreen ? (
								<FullScreenMinimize20Regular fontSize={18} />
							) : (
								<FullScreenMaximize20Regular fontSize={18} />
							)}
						</button>
					)}

					{onClose && (
						<button
							className={classes.headerButton}
							type="button"
							title="Close panel"
							aria-label="Close panel"
							onClick={onClose}
						>
							<DismissRegular fontSize={18} />
						</button>
					)}
				</div>
			</div>

			{/* ── Body: sidebar (full-screen) + content ── */}
			{isFullScreen && hasExtensions ? (
				<div className={classes.immersiveLayout}>
					{/* Left sidebar */}
					<div
						className={mergeClasses(
							classes.sidebar,
							isSidebarCollapsed
								? classes.sidebarCollapsed
								: classes.sidebarExpanded,
						)}
					>
						<div
							className={mergeClasses(
								classes.sidebarTopBar,
								!isSidebarCollapsed && classes.sidebarTopBarExpanded,
							)}
						>
							{!isSidebarCollapsed && (
								<SparkleRegular
									fontSize={20}
									style={{ color: "var(--agent-chat-brand)", marginLeft: 4 }}
								/>
							)}
							<button
								className={classes.sidebarToggle}
								type="button"
								title={
									isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
								}
								aria-label={
									isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"
								}
								onClick={handleToggleSidebar}
							>
								<PanelLeftRegular fontSize={20} />
							</button>
						</div>
						<nav className={classes.sidebarNav}>
							{sidebarNavItems.map((item) => (
								<button
									key={item.key}
									className={mergeClasses(
										classes.sidebarNavButton,
										!isSidebarCollapsed && classes.sidebarNavButtonExpanded,
										activeView === item.key &&
											item.key !== CHAT_VIEW &&
											classes.sidebarNavButtonActive,
									)}
									type="button"
									title={item.label}
									aria-label={item.label}
									onClick={() =>
										item.key === CHAT_VIEW
											? handleNewChat()
											: handleNavSelect(item.key)
									}
								>
									<span className={classes.sidebarNavIcon}>
										<item.icon fontSize={20} />
									</span>
									{!isSidebarCollapsed && (
										<span className={classes.sidebarNavLabel}>
											{item.label}
										</span>
									)}
								</button>
							))}
						</nav>
					</div>

					{/* Content */}
					<div className={classes.contentBody}>{renderContent()}</div>
				</div>
			) : (
				<div className={classes.contentBody}>{renderContent()}</div>
			)}
		</div>
	);
};
