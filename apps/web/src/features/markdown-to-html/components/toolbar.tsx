"use client";

import {
	Columns2,
	Copy,
	Download,
	Edit3,
	Eye,
	FileText,
	Hash,
	RotateCcw,
} from "lucide-react";
import { memo, useCallback } from "react";
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
	onCopyHtml: () => void;
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
								variant="outline"
								size="sm"
								onClick={onCopyHtml}
								disabled={!hasContent}
								className="gap-1"
							>
								<Copy className="h-4 w-4" />
								<span className="hidden sm:inline">Copy HTML</span>
							</Button>
							<Button
								variant="outline"
								size="sm"
								onClick={onDownloadHtml}
								disabled={!hasContent}
								className="gap-1"
							>
								<Download className="h-4 w-4" />
								<span className="hidden sm:inline">Download</span>
							</Button>
							<Button
							variant="outline"
							size="sm"
							onClick={onReset}
							className="gap-1"
						>
								<RotateCcw className="h-4 w-4" />
								<span className="hidden sm:inline">Reset</span>
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
