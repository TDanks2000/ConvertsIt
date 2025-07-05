"use client";

import {
	ArrowLeftRight,
	Columns2,
	Copy,
	Download,
	Eye,
	Loader2,
	RotateCcw,
	Settings,
	Split,
} from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipProvider,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { DiffResult, TextDiffConfig, ViewMode } from "../types";

interface ToolbarProps {
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	config: TextDiffConfig;
	onConfigChange: (config: Partial<TextDiffConfig>) => void;
	diffResult: DiffResult | null;
	stats: {
		additions: number;
		deletions: number;
		modifications: number;
		totalLines: number;
		originalLines: number;
		modifiedLines: number;
		originalWords: number;
		modifiedWords: number;
		originalChars: number;
		modifiedChars: number;
	};
	onReset: () => void;
	onSwap: () => void;
	isLoading?: boolean;
	hasContent?: boolean;
}

export function Toolbar({
	viewMode,
	onViewModeChange,
	config,
	onConfigChange,
	diffResult,
	stats,
	onReset,
	onSwap,
	isLoading = false,
	hasContent = false,
}: ToolbarProps) {
	const handleCopyDiff = useCallback(async () => {
		if (!diffResult) {
			toast.error("No diff results to copy");
			return;
		}

		try {
			const diffText = diffResult.diffs
				.map((change) => {
					const prefix =
						change.type === "added"
							? "+"
							: change.type === "removed"
								? "-"
								: " ";
					return `${prefix} ${change.value}`;
				})
				.join("\n");

			await navigator.clipboard.writeText(diffText);
			toast.success("Diff results copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy diff:", err);
			toast.error("Failed to copy diff results");
		}
	}, [diffResult]);

	const handleDownloadDiff = useCallback(() => {
		if (!diffResult) {
			toast.error("No diff results to download");
			return;
		}

		try {
			const diffText = diffResult.diffs
				.map((change) => {
					const prefix =
						change.type === "added"
							? "+"
							: change.type === "removed"
								? "-"
								: " ";
					return `${prefix} ${change.value}`;
				})
				.join("\n");

			const blob = new Blob([diffText], { type: "text/plain" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "text-diff.txt";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			toast.success("Diff results downloaded successfully!");
		} catch (err) {
			console.error("Failed to download diff:", err);
			toast.error("Failed to download diff results");
		}
	}, [diffResult]);

	const getViewModeIcon = (mode: ViewMode) => {
		switch (mode) {
			case "unified":
				return <Eye className="h-4 w-4" />;
			case "side-by-side":
				return <Columns2 className="h-4 w-4" />;
			case "split":
				return <Split className="h-4 w-4" />;
		}
	};

	const getViewModeLabel = (mode: ViewMode) => {
		switch (mode) {
			case "unified":
				return "Unified";
			case "side-by-side":
				return "Side by Side";
			case "split":
				return "Split";
		}
	};

	return (
		<div className="space-y-3 lg:space-y-4">
			{/* Main Toolbar */}
			<Card>
				<CardContent className="flex flex-col gap-3 p-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4 sm:p-4">
					<div className="flex flex-wrap items-center gap-2">
						{/* View Mode Selector */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="min-w-[120px] justify-start gap-2"
								>
									{getViewModeIcon(viewMode)}
									<span className="hidden sm:inline">
										{getViewModeLabel(viewMode)}
									</span>
									<span className="sm:hidden">View</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuLabel>View Mode</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuItem onClick={() => onViewModeChange("unified")}>
									<Eye className="mr-2 h-4 w-4" />
									Unified
								</DropdownMenuItem>
								<DropdownMenuItem
									onClick={() => onViewModeChange("side-by-side")}
								>
									<Columns2 className="mr-2 h-4 w-4" />
									Side by Side
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onViewModeChange("split")}>
									<Split className="mr-2 h-4 w-4" />
									Split
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<Separator orientation="vertical" className="hidden h-6 sm:block" />

						{/* Configuration Options */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="gap-2">
									<Settings className="h-4 w-4" />
									<span className="hidden sm:inline">Options</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start" className="w-56">
								<DropdownMenuLabel>Diff Options</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<div className="space-y-2 p-2">
									<div className="flex items-center space-x-2">
										<Checkbox
											id="ignore-whitespace"
											checked={config.ignoreWhitespace}
											onCheckedChange={(checked) =>
												onConfigChange({ ignoreWhitespace: !!checked })
											}
										/>
										<label htmlFor="ignore-whitespace" className="text-sm">
											Ignore whitespace
										</label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="ignore-case"
											checked={config.ignoreCase}
											onCheckedChange={(checked) =>
												onConfigChange({ ignoreCase: !!checked })
											}
										/>
										<label htmlFor="ignore-case" className="text-sm">
											Ignore case
										</label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="show-line-numbers"
											checked={config.showLineNumbers}
											onCheckedChange={(checked) =>
												onConfigChange({ showLineNumbers: !!checked })
											}
										/>
										<label htmlFor="show-line-numbers" className="text-sm">
											Show line numbers
										</label>
									</div>
									<div className="flex items-center space-x-2">
										<Checkbox
											id="word-level"
											checked={config.wordLevel}
											onCheckedChange={(checked) =>
												onConfigChange({ wordLevel: !!checked })
											}
										/>
										<label htmlFor="word-level" className="text-sm">
											Word-level diff
										</label>
									</div>
								</div>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>

					<div className="flex flex-wrap items-center gap-2 sm:gap-2">
						{/* Action Buttons */}
						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={onSwap}
										disabled={!hasContent || isLoading}
										className="gap-2"
									>
										<ArrowLeftRight className="h-4 w-4" />
										<span className="hidden sm:inline">Swap</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Swap original and modified texts</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={handleCopyDiff}
										disabled={!diffResult || isLoading}
										className="gap-2"
									>
										{isLoading ? (
											<Loader2 className="h-4 w-4 animate-spin" />
										) : (
											<Copy className="h-4 w-4" />
										)}
										<span className="hidden sm:inline">Copy</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Copy diff to clipboard</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={handleDownloadDiff}
										disabled={!diffResult || isLoading}
										className="gap-2"
									>
										<Download className="h-4 w-4" />
										<span className="hidden sm:inline">Download</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Download diff as file</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>

						<TooltipProvider>
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant="outline"
										size="sm"
										onClick={onReset}
										disabled={isLoading}
										className="gap-2"
									>
										<RotateCcw className="h-4 w-4" />
										<span className="hidden sm:inline">Reset</span>
									</Button>
								</TooltipTrigger>
								<TooltipContent>
									<p>Reset all texts and settings</p>
								</TooltipContent>
							</Tooltip>
						</TooltipProvider>
					</div>
				</CardContent>
			</Card>

			{/* Statistics */}
			<Card>
				<CardContent className="p-3 sm:p-4">
					<div className="space-y-3 sm:space-y-4">
						<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
							<h3 className="font-medium text-sm">Diff Statistics</h3>
							<div className="flex flex-wrap gap-2">
								<Badge
									variant="secondary"
									className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400"
								>
									<span className="hidden sm:inline">
										+{stats.additions} additions
									</span>
									<span className="sm:hidden">+{stats.additions}</span>
								</Badge>
								<Badge
									variant="secondary"
									className="bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400"
								>
									<span className="hidden sm:inline">
										-{stats.deletions} deletions
									</span>
									<span className="sm:hidden">-{stats.deletions}</span>
								</Badge>
								<Badge
									variant="secondary"
									className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400"
								>
									<span className="hidden sm:inline">
										~{stats.modifications} modifications
									</span>
									<span className="sm:hidden">~{stats.modifications}</span>
								</Badge>
								<Badge variant="outline">
									<span className="hidden sm:inline">
										{stats.totalLines} total lines
									</span>
									<span className="sm:hidden">{stats.totalLines} lines</span>
								</Badge>
							</div>
						</div>

						<div className="grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
							<div className="space-y-2">
								<h4 className="font-medium text-muted-foreground">Original</h4>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span>Lines:</span>
										<span className="font-mono">
											{stats.originalLines.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Words:</span>
										<span className="font-mono">
											{stats.originalWords.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Characters:</span>
										<span className="font-mono">
											{stats.originalChars.toLocaleString()}
										</span>
									</div>
								</div>
							</div>

							<div className="space-y-2">
								<h4 className="font-medium text-muted-foreground">Modified</h4>
								<div className="space-y-1">
									<div className="flex justify-between">
										<span>Lines:</span>
										<span className="font-mono">
											{stats.modifiedLines.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Words:</span>
										<span className="font-mono">
											{stats.modifiedWords.toLocaleString()}
										</span>
									</div>
									<div className="flex justify-between">
										<span>Characters:</span>
										<span className="font-mono">
											{stats.modifiedChars.toLocaleString()}
										</span>
									</div>
								</div>
							</div>
						</div>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
