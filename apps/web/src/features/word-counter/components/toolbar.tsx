"use client";

import {
	Check,
	Copy,
	Eye,
	EyeOff,
	FileText,
	Hash,
	Loader2,
	RotateCcw,
	Type,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { TextStats } from "../types";

interface ToolbarProps {
	viewMode: "compact" | "detailed";
	onViewModeChange: (mode: "compact" | "detailed") => void;
	stats: TextStats;
	onClearText: () => void;
	onCopyText: () => Promise<void>;
	onCopyStats: () => Promise<void>;
	hasContent: boolean;
}

export const Toolbar = memo(function Toolbar({
	viewMode,
	onViewModeChange,
	stats,
	onClearText,
	onCopyText,
	onCopyStats,
	hasContent,
}: ToolbarProps) {
	const [copyTextState, setCopyTextState] = useState<
		"idle" | "loading" | "success"
	>("idle");
	const [copyStatsState, setCopyStatsState] = useState<
		"idle" | "loading" | "success"
	>("idle");
	const [clearState, setClearState] = useState<"idle" | "loading" | "success">(
		"idle",
	);

	const handleCompactMode = useCallback(
		() => onViewModeChange("compact"),
		[onViewModeChange],
	);

	const handleDetailedMode = useCallback(
		() => onViewModeChange("detailed"),
		[onViewModeChange],
	);

	const handleCopyTextWithFeedback = useCallback(async () => {
		setCopyTextState("loading");
		try {
			await onCopyText();
			setCopyTextState("success");
			setTimeout(() => setCopyTextState("idle"), 2000);
		} catch {
			setCopyTextState("idle");
		}
	}, [onCopyText]);

	const handleCopyStatsWithFeedback = useCallback(async () => {
		setCopyStatsState("loading");
		try {
			await onCopyStats();
			setCopyStatsState("success");
			setTimeout(() => setCopyStatsState("idle"), 2000);
		} catch {
			setCopyStatsState("idle");
		}
	}, [onCopyStats]);

	const handleClearWithFeedback = useCallback(() => {
		setClearState("loading");
		try {
			onClearText();
			setClearState("success");
			setTimeout(() => setClearState("idle"), 2000);
		} catch {
			setClearState("idle");
		}
	}, [onClearText]);

	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					{/* View Mode Controls */}
					<div className="flex items-center gap-2">
						<span className="font-medium text-muted-foreground text-sm">
							View:
						</span>
						<div className="flex rounded-md border">
							<Button
								variant={viewMode === "compact" ? "default" : "ghost"}
								size="sm"
								onClick={handleCompactMode}
								className="rounded-r-none border-r"
							>
								<EyeOff className="h-4 w-4" />
								<span className="ml-1 hidden sm:inline">Compact</span>
							</Button>
							<Button
								variant={viewMode === "detailed" ? "default" : "ghost"}
								size="sm"
								onClick={handleDetailedMode}
								className="rounded-l-none"
							>
								<Eye className="h-4 w-4" />
								<span className="ml-1 hidden sm:inline">Detailed</span>
							</Button>
						</div>
					</div>

					{/* Quick Statistics */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Type className="h-4 w-4 text-muted-foreground" />
							<Badge variant="secondary" className="text-xs">
								{stats.words.toLocaleString()} words
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Hash className="h-4 w-4 text-muted-foreground" />
							<Badge variant="secondary" className="text-xs">
								{stats.characters.toLocaleString()} chars
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<Badge variant="secondary" className="text-xs">
								{stats.readingTimeMinutes}m read
							</Badge>
						</div>

						<Separator orientation="vertical" className="h-6" />

						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							<Button
								variant={copyTextState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleCopyTextWithFeedback}
								disabled={!hasContent || copyTextState === "loading"}
								className="gap-1 transition-colors"
							>
								{copyTextState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : copyTextState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{copyTextState === "success" ? "Copied!" : "Copy Text"}
								</span>
							</Button>
							<Button
								variant={copyStatsState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleCopyStatsWithFeedback}
								disabled={!hasContent || copyStatsState === "loading"}
								className="gap-1 transition-colors"
							>
								{copyStatsState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : copyStatsState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<FileText className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{copyStatsState === "success" ? "Copied!" : "Copy Stats"}
								</span>
							</Button>
							<Button
								variant={clearState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleClearWithFeedback}
								disabled={!hasContent || clearState === "loading"}
								className="gap-1 transition-colors"
							>
								{clearState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : clearState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<RotateCcw className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{clearState === "success" ? "Cleared!" : "Clear"}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
