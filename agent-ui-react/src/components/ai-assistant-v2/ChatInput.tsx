import { useCallback, useEffect, useRef, useState } from "react";
import { mergeClasses } from "@fluentui/react-components";
import {
	AttachRegular,
	SendRegular,
	Stop16Filled,
} from "@fluentui/react-icons";
import { useAIAssistantStyles } from "./AIAssistant.styles";
import { VoiceInput, type VoiceInputHandle } from "./VoiceInput";

interface ChatInputProps {
	isStreaming: boolean;
	onSend: (text: string) => void;
	onAbort: () => void;
	onFileSelect?: (file: File) => void;
}

export const ChatInput = ({
	isStreaming,
	onSend,
	onAbort,
	onFileSelect,
}: ChatInputProps) => {
	const classes = useAIAssistantStyles();
	const [value, setValue] = useState("");
	const textareaRef = useRef<HTMLTextAreaElement>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);
	const voiceRef = useRef<VoiceInputHandle>(null);
	const recordingBaseRef = useRef("");

	useEffect(() => {
		const el = textareaRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) el.focus();
			},
			{ threshold: 0.1 },
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	const handleSend = useCallback(() => {
		const trimmed = value.trim();
		if (!trimmed || isStreaming) return;
		voiceRef.current?.stop();
		onSend(trimmed);
		setValue("");
	}, [value, isStreaming, onSend]);

	const handleKeyDown = useCallback(
		(e: React.KeyboardEvent<HTMLTextAreaElement>) => {
			if (e.key === "Enter" && !e.shiftKey) {
				e.preventDefault();
				handleSend();
			}
		},
		[handleSend],
	);

	const handleAttachClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleFileChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file && onFileSelect) {
				onFileSelect(file);
			}
			// Reset so the same file can be re-selected
			e.target.value = "";
		},
		[onFileSelect],
	);

	const handleVoiceStart = useCallback(() => {
		recordingBaseRef.current = value;
	}, [value]);

	const handleVoiceTranscript = useCallback((transcript: string) => {
		const next = [recordingBaseRef.current, transcript]
			.filter(Boolean)
			.join(" ")
			.trim();
		setValue(next);
	}, []);

	const handleVoiceStop = useCallback((message: string) => {
		if (message.trim()) {
			const next = [recordingBaseRef.current, message]
				.filter(Boolean)
				.join(" ")
				.trim();
			setValue(next);
		} else {
			setValue(recordingBaseRef.current);
		}
	}, []);

	const hasInput = value.trim().length > 0;

	return (
		<div className={classes.composerContainer}>
			<div className={classes.composer}>
				<textarea
					ref={textareaRef}
					className={classes.composerInput}
					placeholder="Ask anything"
					value={value}
					onChange={(e) => setValue(e.target.value)}
					onKeyDown={handleKeyDown}
					rows={1}
				/>
				<div className={classes.composerFooter}>
					<div className={classes.leftTools}>
						<button
							className={classes.iconButton}
							type="button"
							title="Attach file"
							aria-label="Attach file"
							onClick={handleAttachClick}
						>
							<AttachRegular fontSize={20} />
						</button>
						<input
							ref={fileInputRef}
							type="file"
							style={{ display: "none" }}
							onChange={handleFileChange}
						/>
					</div>
					<div className={classes.rightTools}>
						<VoiceInput
							ref={voiceRef}
							onStartRecording={handleVoiceStart}
							onTranscriptChange={handleVoiceTranscript}
							onStopRecording={handleVoiceStop}
						/>
						{isStreaming ? (
							<button
								className={mergeClasses(
									classes.sendButton,
									classes.sendButtonActive,
								)}
								onClick={onAbort}
								title="Stop generating"
								aria-label="Stop generating"
								type="button"
							>
								<Stop16Filled />
							</button>
						) : (
							<button
								className={mergeClasses(
									classes.sendButton,
									hasInput && classes.sendButtonActive,
								)}
								onClick={handleSend}
								disabled={!hasInput}
								title="Send message"
								aria-label="Send message"
								type="button"
							>
								<SendRegular fontSize={20} />
							</button>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};
