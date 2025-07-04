"use client";

import {
	Check,
	Columns2,
	Copy,
	Download,
	Edit3,
	Eye,
	FileText,
	Hash,
	Loader2,
	RotateCcw,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ViewMode } from "../types";

interface ToolbarProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	wordCount: number;
	charCount: number;
	onCopyHtml: () => Promise<void>;
	onDownloadHtml: () => void;
	onReset: () => void;
	hasContent: boolean;
}

export const Toolbar = memo(function Toolbar({
	viewMode,
	onViewModeChange,
	wordCount,
	charCount,
	onCopyHtml,
	onDownloadHtml,
	onReset,
	hasContent,
}: ToolbarProps) {
	const [copyState, setCopyState] = useState<"idle" | "loading" | "success">(
		"idle",
	);
	const [downloadState, setDownloadState] = useState<
		"idle" | "loading" | "success"
	>("idle");
	const [resetState, setResetState] = useState<"idle" | "loading" | "success">(
		"idle",
	);

	const handleSplitMode = useCallback(
		() => onViewModeChange("split"),
		[onViewModeChange],
	);
	const handleEditorMode = useCallback(
		() => onViewModeChange("editor"),
		[onViewModeChange],
	);
	const handlePreviewMode = useCallback(
		() => onViewModeChange("preview"),
		[onViewModeChange],
	);

	const handleCopyWithFeedback = useCallback(async () => {
		setCopyState("loading");
		try {
			await onCopyHtml();
			setCopyState("success");
			setTimeout(() => setCopyState("idle"), 2000);
		} catch {
			setCopyState("idle");
		}
	}, [onCopyHtml]);

	const handleDownloadWithFeedback = useCallback(() => {
		setDownloadState("loading");
		try {
			onDownloadHtml();
			setDownloadState("success");
			setTimeout(() => setDownloadState("idle"), 2000);
		} catch {
			setDownloadState("idle");
		}
	}, [onDownloadHtml]);

	const handleResetWithFeedback = useCallback(() => {
		setResetState("loading");
		try {
			onReset();
			setResetState("success");
			setTimeout(() => setResetState("idle"), 2000);
		} catch {
			setResetState("idle");
		}
	}, [onReset]);

	return (
		<Card className="relative">
			{/* Statistics Badge - Top Right */}
			<div className="absolute top-3 right-3 z-10">
				<div className="flex items-center gap-2">
					<Badge variant="secondary" className="text-xs shadow-sm">
						<FileText className="mr-1 h-3 w-3" />
						{wordCount} words
					</Badge>
					<Badge variant="secondary" className="text-xs shadow-sm">
						<Hash className="mr-1 h-3 w-3" />
						{charCount} chars
					</Badge>
				</div>
			</div>

			<CardContent className="p-3 pr-40">
				{/* Single Row Layout */}
				<div className="flex flex-wrap items-center gap-2 lg:gap-3">
					{/* View Mode */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							View:
						</span>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={viewMode === "split" ? "default" : "ghost"}
								size="sm"
								onClick={handleSplitMode}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Columns2 className="h-3 w-3" />
								<span className="hidden sm:inline">Split</span>
							</Button>
							<Button
								variant={viewMode === "editor" ? "default" : "ghost"}
								size="sm"
								onClick={handleEditorMode}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Edit3 className="h-3 w-3" />
								<span className="hidden sm:inline">Editor</span>
							</Button>
							<Button
								variant={viewMode === "preview" ? "default" : "ghost"}
								size="sm"
								onClick={handlePreviewMode}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Eye className="h-3 w-3" />
								<span className="hidden sm:inline">Preview</span>
							</Button>
						</div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Action Buttons */}
					<Button
						variant="outline"
						size="sm"
						onClick={handleCopyWithFeedback}
						disabled={!hasContent || copyState === "loading"}
						className="h-7 gap-1 px-2 text-xs"
					>
						{copyState === "loading" ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : copyState === "success" ? (
							<Check className="h-3 w-3" />
						) : (
							<Copy className="h-3 w-3" />
						)}
						<span className="hidden sm:inline">
							{copyState === "success" ? "Copied!" : "Copy HTML"}
						</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={handleDownloadWithFeedback}
						disabled={!hasContent || downloadState === "loading"}
						className="h-7 gap-1 px-2 text-xs"
					>
						{downloadState === "loading" ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : downloadState === "success" ? (
							<Check className="h-3 w-3" />
						) : (
							<Download className="h-3 w-3" />
						)}
						<span className="hidden sm:inline">
							{downloadState === "success" ? "Downloaded!" : "Download"}
						</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={handleResetWithFeedback}
						disabled={resetState === "loading"}
						className="h-7 gap-1 px-2 text-xs"
					>
						{resetState === "loading" ? (
							<Loader2 className="h-3 w-3 animate-spin" />
						) : resetState === "success" ? (
							<Check className="h-3 w-3" />
						) : (
							<RotateCcw className="h-3 w-3" />
						)}
						<span className="hidden sm:inline">
							{resetState === "success" ? "Reset!" : "Reset"}
						</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
});
