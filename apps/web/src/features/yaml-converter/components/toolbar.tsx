import {
	ArrowLeft,
	ArrowRight,
	Copy,
	Download,
	FileText,
	Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { ConversionMode, ConversionOptions, ViewMode } from "../types";

interface ToolbarProps {
	conversionMode: ConversionMode;
	viewMode: ViewMode;
	options: ConversionOptions;
	isValid: boolean;
	hasInput: boolean;
	hasOutput: boolean;
	onModeSwitch: () => void;
	onViewModeChange: (mode: ViewMode) => void;
	onOptionsChange: (options: Partial<ConversionOptions>) => void;
	onClear: () => void;
	onCopyInput: () => void;
	onCopyOutput: () => void;
	onLoadSample: () => void;
	onDownload: () => void;
}

export function Toolbar({
	conversionMode,
	viewMode,
	options,
	isValid,
	hasInput,
	hasOutput,
	onModeSwitch,
	onViewModeChange,
	onOptionsChange,
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
					{isValid ? "Valid" : "Invalid"}
				</Badge>
			</div>

			<CardContent className="p-3 pr-24">
				{/* Single Row Layout */}
				<div className="flex flex-wrap items-center gap-2 lg:gap-3">
					{/* Conversion Mode */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Mode:
						</span>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={conversionMode === "yaml-to-json" ? "default" : "ghost"}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<ArrowRight className="h-3 w-3" />
								<span className="hidden sm:inline">YAML→JSON</span>
							</Button>
							<Button
								variant={conversionMode === "json-to-yaml" ? "default" : "ghost"}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<ArrowLeft className="h-3 w-3" />
								<span className="hidden sm:inline">JSON→YAML</span>
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

					{/* Indent */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Indent:
						</span>
						<Input
							type="number"
							value={options.indent}
							onChange={(e) =>
								onOptionsChange({ indent: Number(e.target.value) })
							}
							min={1}
							max={8}
							className="h-7 w-14 text-xs"
						/>
					</div>

					{/* Quoting Type */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Quotes:
						</span>
						<Select
							value={options.quotingType}
							onValueChange={(value: "single" | "double" | "minimal") =>
								onOptionsChange({ quotingType: value })
							}
						>
							<SelectTrigger className="h-7 w-24 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="minimal">Minimal</SelectItem>
								<SelectItem value="single">Single</SelectItem>
								<SelectItem value="double">Double</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Line Width */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Width:
						</span>
						<Input
							type="number"
							value={options.lineWidth}
							onChange={(e) =>
								onOptionsChange({ lineWidth: Number(e.target.value) })
							}
							min={40}
							max={200}
							className="h-7 w-16 text-xs"
						/>
					</div>

					{/* No Refs */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="no-refs"
							checked={options.noRefs}
							onCheckedChange={(checked) =>
								onOptionsChange({ noRefs: checked === true })
							}
							className="h-3 w-3"
						/>
						<label
							htmlFor="no-refs"
							className="cursor-pointer whitespace-nowrap font-medium text-muted-foreground text-xs"
						>
							<span className="hidden sm:inline">No References</span>
							<span className="sm:hidden">No Refs</span>
						</label>
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
						disabled={!hasInput}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Copy className="h-3 w-3" />
						<span className="hidden sm:inline">Copy In</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onCopyOutput}
						disabled={!hasOutput || !isValid}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Copy className="h-3 w-3" />
						<span className="hidden sm:inline">Copy Out</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onDownload}
						disabled={!hasOutput || !isValid}
						className="h-7 gap-1 px-2 text-xs"
					>
						<Download className="h-3 w-3" />
						<span className="hidden sm:inline">Download</span>
					</Button>

					<Button
						variant="outline"
						size="sm"
						onClick={onClear}
						disabled={!hasInput}
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