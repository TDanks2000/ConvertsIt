import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TextStats } from "../types";

interface TextAnalysisProps {
	stats: TextStats;
	isVisible: boolean;
}

export function TextAnalysis({ stats, isVisible }: TextAnalysisProps) {
	if (!isVisible) return null;

	return (
		<Card>
			<CardHeader>
				<CardTitle>Text Analysis</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 text-sm md:grid-cols-4">
					<div>
						<p className="font-medium">Average words per line:</p>
						<p className="text-muted-foreground">
							{stats.averageWordsPerLine.toFixed(1)}
						</p>
					</div>
					<div>
						<p className="font-medium">Average characters per word:</p>
						<p className="text-muted-foreground">
							{stats.averageCharsPerWord.toFixed(1)}
						</p>
					</div>
					<div>
						<p className="font-medium">Longest line:</p>
						<p className="text-muted-foreground">
							{stats.longestLineLength} characters
						</p>
					</div>
					<div>
						<p className="font-medium">Most common word length:</p>
						<p className="text-muted-foreground">
							{stats.mostCommonWordLength}
						</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
