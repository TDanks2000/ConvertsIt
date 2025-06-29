import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TextStats } from "../types";

interface TextAnalysisProps {
	stats: TextStats;
}

export function TextAnalysis({ stats }: TextAnalysisProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					Advanced Analysis
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
					<div className="space-y-4">
						<div className="flex h-24 flex-col justify-between rounded-lg border p-4">
							<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
								Average words per line
							</p>
							<p className="font-bold text-2xl">
								{stats.averageWordsPerLine.toFixed(1)}
							</p>
						</div>
						<div className="flex h-24 flex-col justify-between rounded-lg border p-4">
							<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
								Average characters per word
							</p>
							<p className="font-bold text-2xl">
								{stats.averageCharsPerWord.toFixed(1)}
							</p>
						</div>
					</div>
					<div className="space-y-4">
						<div className="flex h-24 flex-col justify-between rounded-lg border p-4">
							<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
								Longest line
							</p>
							<div>
								<p className="font-bold text-2xl">{stats.longestLineLength}</p>
								<p className="text-muted-foreground text-sm">characters</p>
							</div>
						</div>
						<div className="flex h-24 flex-col justify-between rounded-lg border p-4">
							<p className="font-medium text-muted-foreground text-sm uppercase tracking-wide">
								Most common word length
							</p>
							<p className="font-bold text-2xl">{stats.mostCommonWordLength}</p>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
