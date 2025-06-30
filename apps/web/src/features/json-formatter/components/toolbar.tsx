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
import { Separator } from "@/components/ui/separator";
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
		<Card className="relative">
			{/* Status Badge - Top Right */}
			<div className="absolute top-3 right-3 z-10">
				<Badge
					variant={isValid ? "default" : "destructive"}
					className="shadow-sm"
				>
					{isValid ? "Valid JSON" : "Invalid JSON"}
				</Badge>
			</div>

			<CardContent className="p-3 pr-24">
				{/* Single Row Layout */}
				<div className="flex flex-wrap items-center gap-2 lg:gap-3">
					{/* Format Mode */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Format:
						</span>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={formatMode === "beautify" ? "default" : "ghost"}
								size="sm"
								onClick={() => onFormatModeChange("beautify")}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Code2 className="h-3 w-3" />
								<span className="hidden sm:inline">Beautify</span>
							</Button>
							<Button
								variant={formatMode === "minify" ? "default" : "ghost"}
								size="sm"
								onClick={() => onFormatModeChange("minify")}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<MinusSquare className="h-3 w-3" />
								<span className="hidden sm:inline">Minify</span>
							</Button>
						</div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* View Mode */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							View:
						</span>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={viewMode === "split" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("split")}
								className="h-7 rounded-md px-2 text-xs"
							>
								Split
							</Button>
							<Button
								variant={viewMode === "input" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("input")}
								className="h-7 rounded-md px-2 text-xs"
							>
								Input
							</Button>
							<Button
								variant={viewMode === "output" ? "default" : "ghost"}
								size="sm"
								onClick={() => onViewModeChange("output")}
								className="h-7 rounded-md px-2 text-xs"
							>
								Output
							</Button>
						</div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Settings */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Indent:
						</span>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-7 gap-1 px-2 text-xs"
								>
									<Settings className="h-3 w-3" />
									<span>{indentSize}</span>
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
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
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Action Buttons */}
					<Button
						variant="outline"
						size="sm"
						onClick={onLoadSample}
						className="h-7 gap-1 px-2 text-xs"
					>
						<FileText className="h-3 w-3" />
						<span className="hidden sm:inline">Sample</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onCopyInput}
						disabled={!hasContent}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Copy className="h-3 w-3" />
						<span className="hidden sm:inline">Copy In</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onCopyOutput}
						disabled={!hasContent || !isValid}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Copy className="h-3 w-3" />
						<span className="hidden sm:inline">Copy Out</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onDownload}
						disabled={!hasContent || !isValid}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Download className="h-3 w-3" />
						<span className="hidden sm:inline">Download</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onClear}
						disabled={!hasContent}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Trash2 className="h-3 w-3" />
						<span className="hidden sm:inline">Clear</span>
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
