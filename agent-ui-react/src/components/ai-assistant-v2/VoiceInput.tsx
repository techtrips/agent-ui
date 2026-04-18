import { forwardRef, useCallback, useImperativeHandle, useRef } from "react";
import {
	makeStyles,
	mergeClasses,
	shorthands,
} from "@fluentui/react-components";
import {
	MicRegular,
	DismissRegular,
	CheckmarkRegular,
} from "@fluentui/react-icons";
import { useSpeechRecognition } from "./useSpeechRecognition";

interface VoiceInputProps {
	onStartRecording: () => void;
	onStopRecording: (message: string) => void;
	onTranscriptChange?: (message: string) => void;
}

export interface VoiceInputHandle {
	stop: () => void;
}

const useStyles = makeStyles({
	root: {
		position: "relative",
		display: "flex",
		alignItems: "center",
		...shorthands.gap("6px"),
	},
	listeningIndicator: {
		position: "absolute",
		right: "0",
		bottom: "calc(100% + 10px)",
		display: "inline-flex",
		alignItems: "center",
		...shorthands.gap("6px"),
		...shorthands.padding("8px", "12px"),
		...shorthands.borderRadius("10px"),
		backgroundColor: "var(--agent-chat-surface)",
		boxShadow: "0 4px 12px rgba(0, 0, 0, 0.12)",
		color: "var(--agent-chat-muted)",
		whiteSpace: "nowrap",
		zIndex: 1,
	},
	listeningDot: {
		width: "8px",
		height: "8px",
		borderRadius: "50%",
		backgroundColor: "#f28b82",
		flexShrink: 0,
	},
	actionButton: {
		minWidth: "34px",
		width: "34px",
		height: "34px",
		...shorthands.borderRadius("50%"),
		...shorthands.padding("0"),
		...shorthands.border("none"),
		backgroundColor: "transparent",
		color: "var(--agent-chat-muted)",
		cursor: "pointer",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		":hover": {
			backgroundColor: "var(--agent-chat-hover)",
			color: "var(--agent-chat-fg)",
		},
	},
	actionButtonConfirm: {
		...shorthands.border("1px", "solid", "var(--agent-chat-border)"),
	},
	button: {
		minWidth: "34px",
		width: "34px",
		height: "34px",
		...shorthands.borderRadius("50%"),
		...shorthands.padding("0"),
		...shorthands.border("none"),
		backgroundColor: "transparent",
		color: "var(--agent-chat-muted)",
		cursor: "pointer",
		display: "inline-flex",
		alignItems: "center",
		justifyContent: "center",
		":hover": {
			backgroundColor: "var(--agent-chat-hover)",
			color: "var(--agent-chat-fg)",
		},
	},
	buttonDisabled: {
		opacity: 0.4,
		cursor: "not-allowed",
	},
});

export const VoiceInput = forwardRef<VoiceInputHandle, VoiceInputProps>(
	({ onStartRecording, onStopRecording, onTranscriptChange }, ref) => {
		const classes = useStyles();
		const transcriptRef = useRef("");

		const handleTranscript = useCallback(
			(transcript: string) => {
				transcriptRef.current = transcript;
				onTranscriptChange?.(transcript);
			},
			[onTranscriptChange],
		);

		const {
			isSupported,
			isListening,
			interimTranscript,
			startListening,
			stopListening,
			abortListening,
		} = useSpeechRecognition(handleTranscript, handleTranscript);

		useImperativeHandle(
			ref,
			() => ({
				stop: () => {
					if (isListening) {
						stopListening();
					}
				},
			}),
			[isListening, stopListening],
		);

		const handleStart = useCallback(() => {
			if (!isSupported) return;
			transcriptRef.current = "";
			onStartRecording();
			startListening();
		}, [isSupported, onStartRecording, startListening]);

		const handleCancel = useCallback(() => {
			transcriptRef.current = "";
			abortListening();
			onStopRecording("");
		}, [abortListening, onStopRecording]);

		const handleConfirm = useCallback(() => {
			stopListening();
			onStopRecording((transcriptRef.current || interimTranscript).trim());
		}, [stopListening, onStopRecording, interimTranscript]);

		return (
			<div className={classes.root}>
				{isListening && (
					<div className={classes.listeningIndicator}>
						<span className={classes.listeningDot} />
						<span>{interimTranscript || "Listening..."}</span>
					</div>
				)}

				{isListening ? (
					<>
						<button
							className={classes.actionButton}
							type="button"
							title="Cancel voice recording"
							aria-label="Cancel voice recording"
							onClick={handleCancel}
						>
							<DismissRegular fontSize={18} />
						</button>
						<button
							className={mergeClasses(
								classes.actionButton,
								classes.actionButtonConfirm,
							)}
							type="button"
							title="Use recorded text"
							aria-label="Use recorded text"
							onClick={handleConfirm}
						>
							<CheckmarkRegular fontSize={18} />
						</button>
					</>
				) : (
					<button
						className={mergeClasses(
							classes.button,
							!isSupported && classes.buttonDisabled,
						)}
						type="button"
						title={
							isSupported
								? "Start voice recording"
								: "Speech recognition is not supported in this browser"
						}
						aria-label="Start voice recording"
						onClick={handleStart}
						disabled={!isSupported}
					>
						<MicRegular fontSize={20} />
					</button>
				)}
			</div>
		);
	},
);
