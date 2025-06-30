import {
	Code2,
	Copy,
	Download,
	FileText,
	MinusSquare,
	Settings,
	Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { FormatMode, ViewMode } from "../types";

interface ToolbarProps {
	formatMode: FormatMode;
	viewMode: ViewMode;
	indentSize: number;
	isValid: boolean;
	hasContent: boolean;
	onFormatModeChange: (mode: FormatMode) => void;
	onViewModeChange: (mode: ViewMode) => void;
	onIndentSizeChange: (size: number) => void;
	onClear: () => void;
	onCopyInput: () => void;
	onCopyOutput: () => void;
	onLoadSample: () => void;
	onDownload: () => void;
}

export function Toolbar({
	formatMode,
	viewMode,
	indentSize,
	isValid,
	hasContent,
	onFormatModeChange,
	onViewModeChange,
	onIndentSizeChange,
	onClear,
	onCopyInput,
	onCopyOutput,
	onLoadSample,
	onDownload,
}: ToolbarProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					{/* Left Section - Format and View Controls */}
					<div className="flex flex-wrap items-center gap-4">
						{/* Format Mode */}
						<div className="flex items-center gap-2">
							<span className="font-medium text-muted-foreground text-sm">
								Format:
							</span>
							<div className="flex rounded-md border">
								<Button
									variant={formatMode === "beautify" ? "default" : "ghost"}
									size="sm"
									onClick={() => onFormatModeChange("beautify")}
									className="gap-2 rounded-r-none border-r"
								>
									<Code2 className="h-4 w-4" />
									<span className="hidden sm:inline">Beautify</span>
								</Button>
								<Button
									variant={formatMode === "minify" ? "default" : "ghost"}
									size="sm"
									onClick={() => onFormatModeChange("minify")}
									className="gap-2 rounded-l-none"
								>
									<MinusSquare className="h-4 w-4" />
									<span className="hidden sm:inline">Minify</span>
								</Button>
							</div>
						</div>

						{/* View Mode */}
						<div className="flex items-center gap-2">
							<span className="font-medium text-muted-foreground text-sm">
								View:
							</span>
							<div className="flex rounded-md border">
								<Button
									variant={viewMode === "split" ? "default" : "ghost"}
									size="sm"
									onClick={() => onViewModeChange("split")}
									className="rounded-r-none border-r"
								>
									Split
								</Button>
								<Button
									variant={viewMode === "input" ? "default" : "ghost"}
									size="sm"
									onClick={() => onViewModeChange("input")}
									className="rounded-none border-r"
								>
									Input
								</Button>
								<Button
									variant={viewMode === "output" ? "default" : "ghost"}
									size="sm"
									onClick={() => onViewModeChange("output")}
									className="rounded-l-none"
								>
									Output
								</Button>
							</div>
						</div>
					</div>

					{/* Right Section - Settings, Actions, and Status */}
					<div className="flex flex-wrap items-center gap-2">
						{/* Settings */}
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline" size="sm" className="gap-2">
									<Settings className="h-4 w-4" />
									<span className="hidden sm:inline">Indent: {indentSize}</span>
									<span className="sm:hidden">{indentSize}</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent>
								<DropdownMenuItem onClick={() => onIndentSizeChange(2)}>
									2 spaces
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onIndentSizeChange(4)}>
									4 spaces
								</DropdownMenuItem>
								<DropdownMenuItem onClick={() => onIndentSizeChange(8)}>
									8 spaces
								</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						{/* Actions */}
						<Button
							variant="outline"
							size="sm"
							onClick={onLoadSample}
							className="gap-2"
						>
							<FileText className="h-4 w-4" />
							<span className="hidden sm:inline">Sample</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onCopyInput}
							disabled={!hasContent}
							className="gap-2"
						>
							<Copy className="h-4 w-4" />
							<span className="hidden sm:inline">Copy Input</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onCopyOutput}
							disabled={!hasContent || !isValid}
							className="gap-2"
						>
							<Copy className="h-4 w-4" />
							<span className="hidden sm:inline">Copy Output</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onDownload}
							disabled={!hasContent || !isValid}
							className="gap-2"
						>
							<Download className="h-4 w-4" />
							<span className="hidden sm:inline">Download</span>
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							disabled={!hasContent}
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							<span className="hidden sm:inline">Clear</span>
						</Button>

						{/* Status Badge */}
						<Badge variant={isValid ? "default" : "destructive"}>
							{isValid ? "Valid JSON" : "Invalid JSON"}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
