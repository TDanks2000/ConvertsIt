"use client";

import {
	ArrowLeftRight,
	Check,
	Clipboard,
	ClipboardCheck,
	Columns2,
	Copy,
	Download,
	Eye,
	FileText,
	Link,
	Loader2,
	RotateCcw,
	Settings,
} from "lucide-react";
import { memo, useCallback, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { EncodingMode, EncodingType, ViewMode } from "../types";

interface ToolbarProps {
	mode: EncodingMode;
	onModeChange: (mode: EncodingMode) => void;
	encodingType: EncodingType;
	onEncodingTypeChange: (type: EncodingType) => void;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	isValid: boolean;
	hasInput: boolean;
	hasOutput: boolean;
	onClear: () => void;
	onSwapMode: () => void;
	onCopyInput: () => Promise<void>;
	onCopyOutput: () => Promise<void>;
	onLoadSample: () => void;
	onDownload: () => void;
}

export const Toolbar = memo(function Toolbar({
	mode,
	onModeChange,
	encodingType,
	onEncodingTypeChange,
	viewMode,
	onViewModeChange,
	isValid,
	hasInput,
	hasOutput,
	onClear,
	onSwapMode,
	onCopyInput,
	onCopyOutput,
	onLoadSample,
	onDownload,
}: ToolbarProps) {
	const [copyInputState, setCopyInputState] = useState<
		"idle" | "loading" | "success"
	>("idle");
	const [copyOutputState, setCopyOutputState] = useState<
		"idle" | "loading" | "success"
	>("idle");

	const handleCopyInput = useCallback(async () => {
		setCopyInputState("loading");
		try {
			await onCopyInput();
			setCopyInputState("success");
			setTimeout(() => setCopyInputState("idle"), 2000);
		} catch {
			setCopyInputState("idle");
		}
	}, [onCopyInput]);

	const handleCopyOutput = useCallback(async () => {
		setCopyOutputState("loading");
		try {
			await onCopyOutput();
			setCopyOutputState("success");
			setTimeout(() => setCopyOutputState("idle"), 2000);
		} catch {
			setCopyOutputState("idle");
		}
	}, [onCopyOutput]);

	return (
		<Card className="relative">
			{/* Status Badge - Top Right */}
			{hasInput && (
				<div className="absolute top-3 right-3 z-10">
					<Badge variant={isValid ? "default" : "destructive"} className="shadow-sm">
						{isValid ? "Valid" : "Invalid"}
					</Badge>
				</div>
			)}

			<CardContent className="p-3 pr-24">
				{/* Single Row Layout */}
				<div className="flex flex-wrap items-center gap-2 lg:gap-3">
					{/* Mode Selection */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">Mode:</Label>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={mode === "encode" ? "default" : "ghost"}
								size="sm"
								onClick={() => onModeChange("encode")}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Link className="h-3 w-3" />
								Encode
							</Button>
							<Button
								variant={mode === "decode" ? "default" : "ghost"}
								size="sm"
								onClick={() => onModeChange("decode")}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Settings className="h-3 w-3" />
								Decode
							</Button>
						</div>
					</div>

					{/* Encoding Type */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">Type:</Label>
						<Select value={encodingType} onValueChange={onEncodingTypeChange}>
							<SelectTrigger className="h-7 w-28 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="component">Component</SelectItem>
								<SelectItem value="full">Full URL</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* View Mode */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">View:</Label>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={viewMode === "input" ? "default" : "ghost"}
										size="sm"
										onClick={() => onViewModeChange("input")}
										className="h-7 rounded-md px-2"
									>
										<FileText className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Input Only</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={viewMode === "split" ? "default" : "ghost"}
										size="sm"
										onClick={() => onViewModeChange("split")}
										className="h-7 rounded-md px-2"
									>
										<Columns2 className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Split View</TooltipContent>
							</Tooltip>

							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={viewMode === "output" ? "default" : "ghost"}
										size="sm"
										onClick={() => onViewModeChange("output")}
										className="h-7 rounded-md px-2"
									>
										<Eye className="h-3 w-3" />
									</Button>
								</TooltipTrigger>
								<TooltipContent>Output Only</TooltipContent>
							</Tooltip>
						</div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Action Buttons */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onSwapMode}
								disabled={!hasOutput}
								className="h-7 px-2"
							>
								<ArrowLeftRight className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Swap Mode & Content</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button 
								variant="outline" 
								size="sm" 
								onClick={onLoadSample}
								className="h-7 gap-1 px-2 text-xs"
							>
								<FileText className="h-3 w-3" />
								<span className="hidden sm:inline">Sample</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Load Sample Data</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyInput}
								disabled={!hasInput || copyInputState === "loading"}
								className="h-7 px-2"
							>
								{copyInputState === "loading" ? (
									<Loader2 className="h-3 w-3 animate-spin" />
								) : copyInputState === "success" ? (
									<ClipboardCheck className="h-3 w-3" />
								) : (
									<Clipboard className="h-3 w-3" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy Input</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={handleCopyOutput}
								disabled={!hasOutput || copyOutputState === "loading"}
								className="h-7 px-2"
							>
								{copyOutputState === "loading" ? (
									<Loader2 className="h-3 w-3 animate-spin" />
								) : copyOutputState === "success" ? (
									<Check className="h-3 w-3" />
								) : (
									<Copy className="h-3 w-3" />
								)}
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy Output</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onDownload}
								disabled={!hasOutput}
								className="h-7 gap-1 px-2 text-xs"
							>
								<Download className="h-3 w-3" />
								<span className="hidden sm:inline">Save</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Download Result</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onClear}
								disabled={!hasInput}
								className="h-7 gap-1 px-2 text-xs"
							>
								<RotateCcw className="h-3 w-3" />
								<span className="hidden sm:inline">Clear</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Clear All</TooltipContent>
					</Tooltip>
				</div>
			</CardContent>
		</Card>
	);
});
