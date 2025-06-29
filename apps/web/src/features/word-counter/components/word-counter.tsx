"use client";

import { useState } from "react";
import { useTextStats } from "../hooks/use-text-stats";
import { PageHeader } from "./page-header";
import { StatsGrid } from "./stats-grid";
import { TextAnalysis } from "./text-analysis";
import { TextInput } from "./text-input";

export function WordCounter() {
	const [text, setText] = useState("");
	const stats = useTextStats(text);

	return (
		<div className="container mx-auto max-w-4xl p-6">
			<div className="space-y-6">
				<PageHeader
					title="Word Counter"
					description="Analyze your text with real-time word, character, and line counting"
				/>

				<TextInput
					value={text}
					onChange={setText}
					placeholder="Start typing or paste your text here..."
				/>

				<StatsGrid stats={stats} />

				<TextAnalysis stats={stats} isVisible={!!text} />
			</div>
		</div>
	);
}
