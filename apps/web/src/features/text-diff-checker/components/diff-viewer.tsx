"use client";

import { Eye, Loader2 } from "lucide-react";
import { useMemo } from "react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import type { DiffChange, DiffResult, ViewMode } from "../types";

interface DiffViewerProps {
	diffResult: DiffResult | null;
	viewMode: ViewMode;
	isLoading?: boolean;
	showLineNumbers?: boolean;
	className?: string;
}

interface DiffLineProps {
	change: DiffChange;
	showLineNumbers: boolean;
	lineNumber?: number;
}

function DiffLine({ change, showLineNumbers, lineNumber }: DiffLineProps) {
	const getLineStyles = () => {
		switch (change.type) {
			case "added":
				return "bg-green-50 border-l-4 border-l-green-500 text-green-900 dark:bg-green-950/30 dark:text-green-100";
			case "removed":
				return "bg-red-50 border-l-4 border-l-red-500 text-red-900 dark:bg-red-950/30 dark:text-red-100";
			case "unchanged":
				return "bg-background border-l-4 border-l-transparent hover:bg-muted/50";
			default:
				return "bg-background border-l-4 border-l-transparent";
		}
	};

	const getPrefix = () => {
		switch (change.type) {
			case "added":
				return "+";
			case "removed":
				return "-";
			default:
				return " ";
		}
	};

	return (
		<div
			className={cn(
				"flex px-3 py-1.5 font-mono text-sm leading-relaxed transition-colors sm:px-4",
				getLineStyles(),
			)}
		>
			{showLineNumbers && (
				<span className="mr-3 w-8 flex-shrink-0 text-right text-muted-foreground sm:mr-4 sm:w-12">
					{lineNumber || change.lineNumber || ""}
				</span>
			)}
			<span className="mr-2 w-4 flex-shrink-0 text-center font-bold">
				{getPrefix()}
			</span>
			<span className="flex-1 whitespace-pre-wrap break-all sm:break-words">
				{change.value || " "}
			</span>
		</div>
	);
}

function UnifiedDiffView({
	diffResult,
	showLineNumbers,
}: {
	diffResult: DiffResult;
	showLineNumbers: boolean;
}) {
	const addedCount = diffResult.diffs.filter((c) => c.type === "added").length;
	const removedCount = diffResult.diffs.filter(
		(c) => c.type === "removed",
	).length;
	const unchangedCount = diffResult.diffs.filter(
		(c) => c.type === "unchanged",
	).length;

	return (
		<div className="space-y-2">
			<div className="flex flex-wrap items-center gap-2">
				<h4 className="font-medium text-muted-foreground text-sm">
					Unified Diff
				</h4>
				<div className="flex flex-wrap gap-1">
					{addedCount > 0 && (
						<Badge
							variant="default"
							className="bg-green-600 text-xs hover:bg-green-700"
						>
							+{addedCount}
						</Badge>
					)}
					{removedCount > 0 && (
						<Badge variant="destructive" className="text-xs">
							-{removedCount}
						</Badge>
					)}
					{unchangedCount > 0 && (
						<Badge variant="outline" className="text-xs">
							={unchangedCount}
						</Badge>
					)}
				</div>
			</div>
			<div className="rounded-md border bg-muted/30">
				{diffResult.diffs.map((change, index) => (
					<DiffLine
						key={`${index + 1}added${change.type}`}
						change={change}
						showLineNumbers={showLineNumbers}
						lineNumber={index + 1}
					/>
				))}
			</div>
		</div>
	);
}

function SideBySideDiffView({
	diffResult,
	showLineNumbers,
}: {
	diffResult: DiffResult;
	showLineNumbers: boolean;
}) {
	const { originalLines, modifiedLines } = useMemo(() => {
		const original: Array<{
			line: string;
			type: "unchanged" | "removed" | "empty";
			lineNumber: number;
		}> = [];
		const modified: Array<{
			line: string;
			type: "unchanged" | "added" | "empty";
			lineNumber: number;
		}> = [];

		let originalLineNum = 1;
		let modifiedLineNum = 1;

		for (const change of diffResult.diffs) {
			switch (change.type) {
				case "unchanged":
					original.push({
						line: change.value,
						type: "unchanged",
						lineNumber: originalLineNum++,
					});
					modified.push({
						line: change.value,
						type: "unchanged",
						lineNumber: modifiedLineNum++,
					});
					break;
				case "removed":
					original.push({
						line: change.value,
						type: "removed",
						lineNumber: originalLineNum++,
					});
					modified.push({ line: "", type: "empty", lineNumber: 0 });
					break;
				case "added":
					original.push({ line: "", type: "empty", lineNumber: 0 });
					modified.push({
						line: change.value,
						type: "added",
						lineNumber: modifiedLineNum++,
					});
					break;
			}
		}

		return { originalLines: original, modifiedLines: modified };
	}, [diffResult.diffs]);

	const getLineStyles = (type: string) => {
		switch (type) {
			case "added":
				return "bg-green-50 border-l-4 border-l-green-500 text-green-900 dark:bg-green-950/30 dark:text-green-100";
			case "removed":
				return "bg-red-50 border-l-4 border-l-red-500 text-red-900 dark:bg-red-950/30 dark:text-red-100";
			case "empty":
				return "bg-muted/30 border-l-4 border-l-transparent";
			default:
				return "bg-background border-l-4 border-l-transparent";
		}
	};

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div className="space-y-0">
				<div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
					<span className="font-medium text-sm">Original</span>
					<Badge variant="outline" className="text-xs">
						{originalLines.filter((l) => l.type !== "empty").length} lines
					</Badge>
				</div>
				{originalLines.map((line, index) => (
					<div
						key={`${index + 1}original`}
						className={cn(
							"flex px-4 py-1 font-mono text-sm leading-relaxed",
							getLineStyles(line.type),
						)}
					>
						{showLineNumbers && (
							<span className="mr-4 w-12 flex-shrink-0 text-right text-muted-foreground">
								{line.lineNumber || ""}
							</span>
						)}
						<span className="flex-1 whitespace-pre-wrap break-words">
							{line.line || " "}
						</span>
					</div>
				))}
			</div>
			<div className="space-y-0">
				<div className="flex items-center gap-2 border-b bg-muted/50 px-4 py-2">
					<span className="font-medium text-sm">Modified</span>
					<Badge variant="outline" className="text-xs">
						{modifiedLines.filter((l) => l.type !== "empty").length} lines
					</Badge>
				</div>
				{modifiedLines.map((line, index) => (
					<div
						key={`${index + 1}modified`}
						className={cn(
							"flex px-4 py-1 font-mono text-sm leading-relaxed",
							getLineStyles(line.type),
						)}
					>
						{showLineNumbers && (
							<span className="mr-4 w-12 flex-shrink-0 text-right text-muted-foreground">
								{line.lineNumber || ""}
							</span>
						)}
						<span className="flex-1 whitespace-pre-wrap break-words">
							{line.line || " "}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

function SplitDiffView({
	diffResult,
	showLineNumbers,
}: {
	diffResult: DiffResult;
	showLineNumbers: boolean;
}) {
	const {
		addedLines,
		removedLines,
		unchangedLines: _unchangedLines,
	} = useMemo(() => {
		const added = diffResult.diffs.filter((d) => d.type === "added");
		const removed = diffResult.diffs.filter((d) => d.type === "removed");
		const unchanged = diffResult.diffs.filter((d) => d.type === "unchanged");
		return {
			addedLines: added,
			removedLines: removed,
			unchangedLines: unchanged,
		};
	}, [diffResult.diffs]);

	return (
		<div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
			<div className="space-y-0">
				<div className="flex items-center gap-2 border-b bg-red-50 px-4 py-2 text-sm dark:bg-red-950/30">
					<span className="font-medium text-red-900 dark:text-red-100">
						Removed Lines
					</span>
					<Badge variant="destructive" className="text-xs">
						{removedLines.length}
					</Badge>
				</div>
				{removedLines.map((change, index) => (
					<DiffLine
						key={`${index + 1}removed`}
						change={change}
						showLineNumbers={showLineNumbers}
						lineNumber={index + 1}
					/>
				))}
			</div>
			<div className="space-y-0">
				<div className="flex items-center gap-2 border-b bg-green-50 px-4 py-2 text-sm dark:bg-green-950/30">
					<span className="font-medium text-green-900 dark:text-green-100">
						Added Lines
					</span>
					<Badge
						variant="default"
						className="bg-green-600 text-xs hover:bg-green-700"
					>
						{addedLines.length}
					</Badge>
				</div>
				{addedLines.map((change, index) => (
					<DiffLine
						key={`${index + 1}added`}
						change={change}
						showLineNumbers={showLineNumbers}
						lineNumber={index + 1}
					/>
				))}
			</div>
		</div>
	);
}

export function DiffViewer({
	diffResult,
	viewMode,
	isLoading = false,
	showLineNumbers = true,
	className,
}: DiffViewerProps) {
	if (isLoading) {
		return (
			<Card className={cn("h-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Loader2 className="h-4 w-4 animate-spin" />
						Processing Diff...
					</CardTitle>
				</CardHeader>
				<CardContent className="flex h-[400px] items-center justify-center">
					<div className="text-center text-muted-foreground">
						<Loader2 className="mx-auto h-8 w-8 animate-spin" />
						<p className="mt-2">Computing differences...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	if (!diffResult) {
		return (
			<Card className={cn("h-full", className)}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-4 w-4" />
						Diff Results
					</CardTitle>
					<CardDescription>
						Enter text in both editors to see the differences
					</CardDescription>
				</CardHeader>
				<CardContent className="flex h-[400px] items-center justify-center">
					<div className="text-center text-muted-foreground">
						<Eye className="mx-auto h-8 w-8" />
						<p className="mt-2">No differences to display</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={cn("h-full", className)}>
			<CardHeader className="pb-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<Eye className="h-4 w-4" />
						Diff Results
					</CardTitle>
					<div className="text-muted-foreground text-xs">
						{viewMode === "side-by-side"
							? "Side by Side"
							: viewMode === "split"
								? "Split"
								: "Unified"}{" "}
						view
					</div>
				</div>
			</CardHeader>
			<CardContent className="h-[calc(100%-5rem)] p-0">
				<ScrollArea className="h-full">
					<div className="p-3 sm:p-4">
						{viewMode === "unified" && (
							<UnifiedDiffView
								diffResult={diffResult}
								showLineNumbers={showLineNumbers}
							/>
						)}
						{viewMode === "side-by-side" && (
							<SideBySideDiffView
								diffResult={diffResult}
								showLineNumbers={showLineNumbers}
							/>
						)}
						{viewMode === "split" && (
							<SplitDiffView
								diffResult={diffResult}
								showLineNumbers={showLineNumbers}
							/>
						)}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
