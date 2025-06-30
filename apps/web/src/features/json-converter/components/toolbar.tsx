import { ArrowLeftRight, Copy, Download, FileText, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
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
	onLoadSample: () => void;
	onCopyInput: () => void;
	onCopyOutput: () => void;
	onDownload: () => void;
	onClear: () => void;
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
	onLoadSample,
	onCopyInput,
	onCopyOutput,
	onDownload,
	onClear,
}: ToolbarProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-wrap items-center gap-4">
					{/* Conversion Mode */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onModeSwitch}
							className="gap-2"
						>
							<ArrowLeftRight className="h-4 w-4" />
							{conversionMode === "json-to-csv" ? "JSON → CSV" : "CSV → JSON"}
						</Button>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* View Mode */}
					<div className="flex items-center gap-2">
						<Label htmlFor="view-mode" className="font-medium text-sm">
							View:
						</Label>
						<Select value={viewMode} onValueChange={onViewModeChange}>
							<SelectTrigger className="w-24">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="split">Split</SelectItem>
								<SelectItem value="input">Input</SelectItem>
								<SelectItem value="output">Output</SelectItem>
							</SelectContent>
						</Select>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* Options */}
					<div className="flex items-center gap-4">
						<div className="flex items-center gap-2">
							<Label htmlFor="delimiter" className="text-sm">
								Delimiter:
							</Label>
							<Select
								value={options.delimiter}
								onValueChange={(value) => onOptionsChange({ delimiter: value })}
							>
								<SelectTrigger className="w-16">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value=",">Comma</SelectItem>
									<SelectItem value=";">Semicolon</SelectItem>
									<SelectItem value="\t">Tab</SelectItem>
									<SelectItem value="|">Pipe</SelectItem>
								</SelectContent>
							</Select>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="include-headers"
								checked={options.includeHeaders}
								onCheckedChange={(checked) =>
									onOptionsChange({ includeHeaders: checked as boolean })
								}
							/>
							<Label htmlFor="include-headers" className="text-sm">
								Headers
							</Label>
						</div>

						<div className="flex items-center space-x-2">
							<Checkbox
								id="flatten-objects"
								checked={options.flattenObjects}
								onCheckedChange={(checked) =>
									onOptionsChange({ flattenObjects: checked as boolean })
								}
							/>
							<Label htmlFor="flatten-objects" className="text-sm">
								Flatten
							</Label>
						</div>

						{options.flattenObjects && (
							<div className="flex items-center gap-2">
								<Label htmlFor="max-depth" className="text-sm">
									Depth:
								</Label>
								<Input
									id="max-depth"
									type="number"
									min="1"
									max="10"
									value={options.maxDepth}
									onChange={(e) =>
										onOptionsChange({
											maxDepth: Number.parseInt(e.target.value) || 3,
										})
									}
									className="w-16"
								/>
							</div>
						)}
					</div>

					<div className="flex-1" />

					{/* Actions */}
					<div className="flex items-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onLoadSample}
							className="gap-2"
						>
							<FileText className="h-4 w-4" />
							Sample
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onCopyInput}
							disabled={!hasInput}
							className="gap-2"
						>
							<Copy className="h-4 w-4" />
							Copy Input
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onCopyOutput}
							disabled={!hasOutput || !isValid}
							className="gap-2"
						>
							<Copy className="h-4 w-4" />
							Copy Output
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onDownload}
							disabled={!hasOutput || !isValid}
							className="gap-2"
						>
							<Download className="h-4 w-4" />
							Download
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							disabled={!hasInput}
							className="gap-2"
						>
							<Trash2 className="h-4 w-4" />
							Clear
						</Button>

						{/* Status Badge */}
						<Badge variant={isValid ? "default" : "destructive"}>
							{isValid ? "Valid" : "Invalid"}
						</Badge>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
