import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { makeStyles, mergeClasses } from "@fluentui/react-components";
import { SparkleRegular } from "@fluentui/react-icons";
import { homeStyles } from "./Home.styles";
import {
	AIAssistant,
	agUiAdapter,
	ConversationHistory,
	StarterPrompts,
	TemplateRenderer,
} from "../../../ai-assistant-v2";
import { AIAssistant as AIAssistantV1 } from "../../../ai-assistant/AIAssistant";
import {
	AIAssistantDisplayMode,
	IAssistantConfig,
} from "../../../ai-assistant/AIAssistant.models";
import { HOME_ASSISTANT_AGENTS } from "./Home.models";
import { useAssistantTemplates } from "../../../templates/useAssistantTemplates";
import { mapRolesToPermissions } from "../../../auth-provider/AuthProvider.utils";
import { AuthContext, AuthProvider } from "../../../auth-provider";
import { AppConfig } from "../../../../appConfig";

const useStyles = makeStyles(homeStyles);

const appConfig = AppConfig.getConfig();
const aguiUrl = appConfig?.agentConfig.url ?? "";
const apiBaseUrl = appConfig?.api.baseUrl ?? "";

export const Home = () => {
	const classes = useStyles();
	const [isAssistantVisible, setIsAssistantVisible] = useState(true);
	const [loginError, setLoginError] = useState<string>("");

	const tokenRef = useRef<string>("");
	const refreshTokenRef = useRef<string>("");

	useEffect(() => {
		const login = async () => {
			const email = appConfig?.auth?.email;
			const password = appConfig?.auth?.password;
			if (!email || !password) {
				setLoginError(
					"Set auth.email and auth.password in app.config.dev.json to test AG-UI.",
				);
				return;
			}
			try {
				const res = await fetch(`${apiBaseUrl}/auth/login`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ email, password }),
				});
				if (!res.ok) {
					const body = await res.json().catch(() => ({}));
					setLoginError(body.error || `Login failed (HTTP ${res.status})`);
					return;
				}
				const data = await res.json();
				tokenRef.current = data.token;
				refreshTokenRef.current = data.refreshToken;
				setLoginError("");
			} catch (err) {
				setLoginError("Login error: unable to reach API.");
			}
		};
		login();
	}, []);

	const getAccessToken = useCallback(async (): Promise<string> => {
		if (tokenRef.current) {
			return tokenRef.current;
		}
		// Try refreshing if we have a refresh token
		if (refreshTokenRef.current) {
			try {
				const res = await fetch(`${apiBaseUrl}/auth/refresh`, {
					method: "POST",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({ refreshToken: refreshTokenRef.current }),
				});
				if (res.ok) {
					const data = await res.json();
					tokenRef.current = data.token;
					refreshTokenRef.current = data.refreshToken;
					return data.token;
				}
			} catch (err) {
				console.error("Token refresh error:", err);
			}
		}
		return "";
	}, []);

	const adapter = useMemo(
		() => agUiAdapter({ url: aguiUrl, getToken: getAccessToken }),
		[getAccessToken],
	);

	const assistantConfig: IAssistantConfig = {
		api: { baseUrl: apiBaseUrl },
		agentConfig: { url: aguiUrl },
	};

	const { getTemplate } = useAssistantTemplates();

	const extensions = useMemo(
		() => [ConversationHistory, StarterPrompts, TemplateRenderer],
		[],
	);

	const handleToggleAssistant = useCallback(() => {
		setIsAssistantVisible((isVisible) => !isVisible);
	}, []);

	return (
		<div className={classes.root}>
			<div className={classes.navBar}>
				<h1 className={classes.navBarTitle}>Home</h1>
				<button
					className={mergeClasses(
						classes.assistantToggleButton,
						isAssistantVisible && classes.assistantToggleButtonActive,
					)}
					type="button"
					title={isAssistantVisible ? "Hide AI assistant" : "Open AI assistant"}
					aria-label={
						isAssistantVisible ? "Hide AI assistant" : "Open AI assistant"
					}
					onClick={handleToggleAssistant}
				>
					<SparkleRegular fontSize={18} />
				</button>
			</div>
			<div className={classes.content}>
				{loginError ? (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							height: "100%",
							color: "#c4314b",
							fontSize: "0.9rem",
							padding: "24px",
							textAlign: "center",
						}}
					>
						{loginError}
					</div>
				) : (
					<div
						style={{
							display: "flex",
							height: "100%",
							gap: "1px",
							backgroundColor: "#e0e0e0",
							position: "relative",
						}}
					>
						{/* V2 — New simplified component (full-screen locked) */}
						<div
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									textAlign: "center",
									padding: "4px 0",
									fontSize: "11px",
									fontWeight: 600,
									color: "#666",
									backgroundColor: "#f5f5f5",
									borderBottom: "1px solid #e0e0e0",
								}}
							>
								V2 — ai-assistant-v2 (defaultFullScreen, no toggle)
							</div>
							<div style={{ flex: 1, overflow: "hidden" }}>
								<AIAssistant
									adapter={adapter}
									extensions={extensions}
									defaultFullScreen
									//showFullScreenToggle={false}
								/>
							</div>
						</div>
						{/* V1 — Original component */}
						<div
							style={{
								flex: 1,
								display: "flex",
								flexDirection: "column",
								overflow: "hidden",
							}}
						>
							<div
								style={{
									textAlign: "center",
									padding: "4px 0",
									fontSize: "11px",
									fontWeight: 600,
									color: "#666",
									backgroundColor: "#f5f5f5",
									borderBottom: "1px solid #e0e0e0",
								}}
							>
								V1 — ai-assistant (original)
							</div>
							<div style={{ flex: 1, overflow: "hidden" }}>
								<AuthProvider
									config={assistantConfig}
									getToken={getAccessToken}
								>
									<AuthContext.Consumer>
										{(value) => (
											<AIAssistantV1
												config={assistantConfig}
												getToken={getAccessToken}
												displayMode={AIAssistantDisplayMode.FullScreen}
												agents={HOME_ASSISTANT_AGENTS}
												getTemplate={getTemplate}
												userInfo={value?.userInfo}
												permissions={mapRolesToPermissions(value?.roles, [
													"agent.configuration",
												])}
											/>
										)}
									</AuthContext.Consumer>
								</AuthProvider>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
};
