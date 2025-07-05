import {
	ArrowLeftRight,
	Calendar,
	Clock,
	Columns2,
	Copy,
	Download,
	Edit3,
	Eye,
	FileText,
	RotateCcw,
	Timer,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
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
	onLoadCurrentTimestamp: () => void;
	onLoadCurrentDate: () => void;
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
	onLoadCurrentTimestamp,
	onCopyInput,
	onCopyOutput,
	onDownload,
	onClear,
}: ToolbarProps) {
	return (
		<Card className="relative">
			{/* Status Badge - Top Right */}
			{hasInput && (
				<div className="absolute top-3 right-3 z-10">
					<Badge
						variant={isValid ? "default" : "destructive"}
						className="shadow-sm"
					>
						{isValid ? "Valid" : "Invalid"}
					</Badge>
				</div>
			)}

			<CardContent className="p-3 pr-24">
				{/* Single Row Layout */}
				<div className="flex flex-wrap items-center gap-2 lg:gap-3">
					{/* Conversion Mode */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">
							Mode:
						</Label>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Button
								variant={
									conversionMode === "timestamp-to-date" ? "default" : "ghost"
								}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Timer className="h-3 w-3" />
								<span className="hidden sm:inline">Timestamp→Date</span>
							</Button>
							<Button
								variant={
									conversionMode === "date-to-timestamp" ? "default" : "ghost"
								}
								size="sm"
								onClick={onModeSwitch}
								className="h-7 gap-1 rounded-md px-2 text-xs"
							>
								<Calendar className="h-3 w-3" />
								<span className="hidden sm:inline">Date→Timestamp</span>
							</Button>
						</div>
					</div>

					<Separator orientation="vertical" className="h-6" />

					{/* View Mode */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">
							View:
						</Label>
						<div className="flex rounded-lg border bg-muted/30 p-1">
							<Tooltip>
								<TooltipTrigger asChild>
									<Button
										variant={viewMode === "input" ? "default" : "ghost"}
										size="sm"
										onClick={() => onViewModeChange("input")}
										className="h-7 rounded-md px-2"
									>
										<Edit3 className="h-3 w-3" />
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

					{/* Timestamp Format */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">
							Format:
						</Label>
						<Select
							value={options.timestampFormat}
							onValueChange={(value) =>
								onOptionsChange({
									timestampFormat: value as "seconds" | "milliseconds",
								})
							}
						>
							<SelectTrigger className="h-7 w-28 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="seconds">Seconds</SelectItem>
								<SelectItem value="milliseconds">Milliseconds</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Date Format */}
					<div className="flex items-center gap-2">
						<Label className="whitespace-nowrap font-medium text-sm">
							Date:
						</Label>
						<Select
							value={options.dateFormat}
							onValueChange={(value) =>
								onOptionsChange({
									dateFormat: value as "iso" | "local" | "utc" | "custom",
								})
							}
						>
							<SelectTrigger className="h-7 w-20 text-xs">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								<SelectItem value="iso">ISO</SelectItem>
								<SelectItem value="local">Local</SelectItem>
								<SelectItem value="utc">UTC</SelectItem>
								<SelectItem value="custom">Custom</SelectItem>
							</SelectContent>
						</Select>
					</div>

					{/* Custom Format Input */}
					{options.dateFormat === "custom" && (
						<div className="flex items-center gap-2">
							<Input
								value={options.customFormat || ""}
								onChange={(e) =>
									onOptionsChange({ customFormat: e.target.value })
								}
								placeholder="YYYY-MM-DD HH:mm:ss"
								className="h-7 w-40 text-xs"
							/>
						</div>
					)}

					<Separator orientation="vertical" className="h-6" />

					{/* Quick Actions */}
					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onModeSwitch}
								disabled={!hasOutput}
								className="h-7 px-2"
							>
								<ArrowLeftRight className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Swap Mode</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onLoadCurrentTimestamp}
								className="h-7 gap-1 px-2 text-xs"
							>
								<Clock className="h-3 w-3" />
								<span className="hidden sm:inline">Now</span>
							</Button>
						</TooltipTrigger>
						<TooltipContent>Load Current Timestamp</TooltipContent>
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
								onClick={onCopyInput}
								disabled={!hasInput}
								className="h-7 px-2"
							>
								<Copy className="h-3 w-3" />
							</Button>
						</TooltipTrigger>
						<TooltipContent>Copy Input</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button
								variant="outline"
								size="sm"
								onClick={onCopyOutput}
								disabled={!hasOutput || !isValid}
								className="h-7 px-2"
							>
								<Copy className="h-3 w-3" />
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
								disabled={!hasOutput || !isValid}
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
}
