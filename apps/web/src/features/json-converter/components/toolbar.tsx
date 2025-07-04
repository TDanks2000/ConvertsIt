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
								variant={conversionMode === "json-to-csv" ? "default" : "ghost"}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<ArrowRight className="h-3 w-3" />
								<span className="hidden sm:inline">JSON→CSV</span>
							</Button>
							<Button
								variant={conversionMode === "csv-to-json" ? "default" : "ghost"}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<ArrowLeft className="h-3 w-3" />
								<span className="hidden sm:inline">CSV→JSON</span>
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

					{/* Delimiter */}
					<div className="flex items-center gap-2">
						<span className="whitespace-nowrap font-medium text-muted-foreground text-sm">
							Delimiter:
						</span>
						<Select
							value={options.delimiter}
							onValueChange={(value) => onOptionsChange({ delimiter: value })}
						>
							<SelectTrigger className="h-7 w-32 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value=",">Comma (,)</SelectItem>
								<SelectItem value=";">Semicolon (;)</SelectItem>
								<SelectItem value="\t">Tab</SelectItem>
								<SelectItem value="|">Pipe (|)</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Include Headers */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="include-headers"
							checked={options.includeHeaders}
							onCheckedChange={(checked) =>
							onOptionsChange({ includeHeaders: checked === true })
						}
							className="h-3 w-3"
						/>
						<label
							htmlFor="include-headers"
							className="cursor-pointer whitespace-nowrap font-medium text-muted-foreground text-xs"
						>
							<span className="hidden sm:inline">Include Headers</span>
							<span className="sm:hidden">Headers</span>
						</label>
					</div>

					{/* Flatten Objects */}
					<div className="flex items-center gap-2">
						<Checkbox
							id="flatten-objects"
							checked={options.flattenObjects}
							onCheckedChange={(checked) =>
							onOptionsChange({ flattenObjects: checked === true })
						}
							className="h-3 w-3"
						/>
						<label
							htmlFor="flatten-objects"
							className="cursor-pointer whitespace-nowrap font-medium text-muted-foreground text-xs"
						>
							<span className="hidden sm:inline">Flatten Objects</span>
							<span className="sm:hidden">Flatten</span>
						</label>
					</div>

					{/* Max Depth */}
					{options.flattenObjects && (
						<div className="flex items-center gap-2">
							<span className="whitespace-nowrap font-medium text-muted-foreground text-xs">
								Depth:
							</span>
							<Input
								type="number"
								value={options.maxDepth}
								onChange={(e) =>
									onOptionsChange({ maxDepth: Number(e.target.value) })
								}
								min={1}
								max={10}
								className="h-7 w-14 text-xs"
							/>
						</div>
					)}

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
