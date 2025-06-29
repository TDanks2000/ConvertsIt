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
								variant={viewMode === "split" ? "default" : "ghost"}
								size="sm"
								onClick={handleSplitMode}
								className="rounded-r-none border-r"
							>
								<Columns2 className="h-4 w-4" />
								<span className="ml-1 hidden sm:inline">Split</span>
							</Button>
							<Button
								variant={viewMode === "editor" ? "default" : "ghost"}
								size="sm"
								onClick={handleEditorMode}
								className="rounded-none border-r"
							>
								<Edit3 className="h-4 w-4" />
								<span className="ml-1 hidden sm:inline">Editor</span>
							</Button>
							<Button
								variant={viewMode === "preview" ? "default" : "ghost"}
								size="sm"
								onClick={handlePreviewMode}
								className="rounded-l-none"
							>
								<Eye className="h-4 w-4" />
								<span className="ml-1 hidden sm:inline">Preview</span>
							</Button>
						</div>
					</div>

					{/* Statistics */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<Badge variant="secondary" className="text-xs">
								{wordCount} words
							</Badge>
						</div>
						<div className="flex items-center gap-2">
							<Hash className="h-4 w-4 text-muted-foreground" />
							<Badge variant="secondary" className="text-xs">
								{charCount} chars
							</Badge>
						</div>

						<Separator orientation="vertical" className="h-6" />

						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							<Button
								variant={copyState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleCopyWithFeedback}
								disabled={!hasContent || copyState === "loading"}
								className="gap-1 transition-colors"
							>
								{copyState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : copyState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<Copy className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{copyState === "success" ? "Copied!" : "Copy HTML"}
								</span>
							</Button>
							<Button
								variant={downloadState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleDownloadWithFeedback}
								disabled={!hasContent || downloadState === "loading"}
								className="gap-1 transition-colors"
							>
								{downloadState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : downloadState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<Download className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{downloadState === "success" ? "Downloaded!" : "Download"}
								</span>
							</Button>
							<Button
								variant={resetState === "success" ? "default" : "outline"}
								size="sm"
								onClick={handleResetWithFeedback}
								disabled={resetState === "loading"}
								className="gap-1 transition-colors"
							>
								{resetState === "loading" ? (
									<Loader2 className="h-4 w-4 animate-spin" />
								) : resetState === "success" ? (
									<Check className="h-4 w-4" />
								) : (
									<RotateCcw className="h-4 w-4" />
								)}
								<span className="hidden sm:inline">
									{resetState === "success" ? "Reset!" : "Reset"}
								</span>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
