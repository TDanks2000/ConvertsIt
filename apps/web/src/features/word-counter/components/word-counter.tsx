"use client";

import { Hash, Type } from "lucide-react";
import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useTextStats } from "../hooks/use-text-stats";
import { StatsGrid } from "./stats-grid";
import { TextAnalysis } from "./text-analysis";
import { TextInput } from "./text-input";
import { Toolbar } from "./toolbar";

export function WordCounter() {
	const [text, setText] = useState("");
	const [viewMode, setViewMode] = useState<"compact" | "detailed">("compact");
	const stats = useTextStats(text);

	const handleClearText = useCallback(() => {
		setText("");
		toast.success("Text cleared successfully");
	}, []);

	const handleCopyText = useCallback(async () => {
		if (!text.trim()) {
			toast.error("No text to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(text);
			toast.success("Text copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy text:", err);
			toast.error("Failed to copy text to clipboard");
		}
	}, [text]);

	const handleCopyStats = useCallback(async () => {
		if (!text.trim()) {
			toast.error("No statistics to copy");
			return;
		}

		const statsText = `Text Statistics:
• Words: ${stats.words.toLocaleString()}
• Characters: ${stats.characters.toLocaleString()}
• Characters (no spaces): ${stats.charactersNoSpaces.toLocaleString()}
• Lines: ${stats.lines.toLocaleString()}
• Paragraphs: ${stats.paragraphs.toLocaleString()}
• Reading time: ${stats.readingTimeMinutes} minutes
• Average words per line: ${stats.averageWordsPerLine.toFixed(1)}
• Average characters per word: ${stats.averageCharsPerWord.toFixed(1)}
• Longest line: ${stats.longestLineLength} characters
• Most common word length: ${stats.mostCommonWordLength}`;

		try {
			await navigator.clipboard.writeText(statsText);
			toast.success("Statistics copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy statistics:", err);
			toast.error("Failed to copy statistics to clipboard");
		}
	}, [stats, text]);

	const hasContent = useMemo(() => !!text.trim(), [text]);

	return (
		<div className="container mx-auto space-y-6 p-6">
			<PageHeader
				title={"Word Counter"}
				description={
					"Analyze your text with real-time word, character, and line counting plus advanced text statistics"
				}
				icons={[Type, Hash]}
			/>

			<Toolbar
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				stats={stats}
				onClearText={handleClearText}
				onCopyText={handleCopyText}
				onCopyStats={handleCopyStats}
				hasContent={hasContent}
			/>

			<div className="grid gap-6 lg:grid-cols-[1fr_400px]">
				<div className="space-y-6">
					<TextInput
						value={text}
						onChange={setText}
						placeholder="Start typing or paste your text here..."
					/>

					{hasContent && viewMode === "detailed" && (
						<TextAnalysis stats={stats} />
					)}
				</div>

				<div className="lg:sticky lg:top-6 lg:self-start">
					<StatsGrid stats={stats} viewMode={viewMode} />
				</div>
			</div>
		</div>
	);
}
