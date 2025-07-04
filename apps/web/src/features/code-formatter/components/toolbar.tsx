"use client";

import {
	Code2,
	Copy,
	Download,
	FileText,
	MinusSquare,
	RotateCcw,
	Settings,
	Trash2,
	Wand2,
	Zap,
} from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type {
	FormatMode,
	FormattingOptions,
	SupportedLanguage,
	ViewMode,
} from "../types";
import { languageConfigs } from "../utils/code-operations";

interface ToolbarProps {
	language: SupportedLanguage;
	onLanguageChange: (language: SupportedLanguage) => void;
	formatMode: FormatMode;
	onFormatModeChange: (mode: FormatMode) => void;
	viewMode: ViewMode;
	onViewModeChange: (mode: ViewMode) => void;
	formattingOptions: FormattingOptions;
	onFormattingOptionsChange: (options: Partial<FormattingOptions>) => void;
	validation: {
		isValid: boolean;
		error?: string;
		line?: number;
		column?: number;
	};
	hasInput: boolean;
	hasOutput: boolean;
	onAutoDetect: () => void;
	onLoadSample: () => void;
	onClear: () => void;
	onFormat: () => void;
	onMinify: () => void;
	onReset: () => void;
	onCopyInput: () => void;
	onCopyOutput: () => void;
	onDownloadInput: () => void;
	onDownloadOutput: () => void;
}

export const Toolbar = memo(function Toolbar({
	language,
	onLanguageChange,
	viewMode,
	onViewModeChange,
	formatMode,
	onFormatModeChange,
	formattingOptions,
	onFormattingOptionsChange,
	validation,
	hasInput,
	hasOutput,
	onAutoDetect,
	onLoadSample,
	onClear,
	onFormat,
	onMinify,
	onReset,
	onCopyInput,
	onCopyOutput,
	onDownloadInput,
	onDownloadOutput,
}: ToolbarProps) {
	const config = languageConfigs[language];

	return (
		<Card className="relative">
			{/* Status Badge - Top Right */}
			<div className="absolute top-3 right-3 z-10">
				<Badge
					variant={validation.isValid ? "default" : "destructive"}
					className="text-xs"
				>
					{validation.isValid ? "Valid" : "Invalid"}
				</Badge>
			</div>

			<CardContent className="pt-6">
				<div className="flex flex-col gap-4">
					{/* Language Selection Row */}
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<Code2 className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium text-sm">Language:</span>
						</div>
						<Select value={language} onValueChange={onLanguageChange}>
							<SelectTrigger className="w-[140px]">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{Object.entries(languageConfigs).map(([key, config]) => (
									<SelectItem key={key} value={key}>
										{config.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							variant="outline"
							size="sm"
							onClick={onAutoDetect}
							disabled={!hasInput}
							className="text-xs"
						>
							<Zap className="mr-1 h-3 w-3" />
							Auto-detect
						</Button>
					</div>

					<Separator />

					{/* Format Mode Row */}
					<div className="flex flex-wrap items-center gap-3">
						<div className="flex items-center gap-2">
							<Wand2 className="h-4 w-4 text-muted-foreground" />
							<span className="font-medium text-sm">Mode:</span>
						</div>
						<div className="flex gap-2">
							<Button
						variant={formatMode === "format" ? "default" : "outline"}
						size="sm"
						onClick={() => {
							onFormatModeChange("format");
							onFormat();
						}}
						disabled={
							!config.supportsFormatting || !hasInput || !validation.isValid
						}
						className="text-xs"
					>
						<FileText className="mr-1 h-3 w-3" />
						Format
					</Button>
					<Button
						variant={formatMode === "minify" ? "default" : "outline"}
						size="sm"
						onClick={() => {
							onFormatModeChange("minify");
							onMinify();
						}}
						disabled={
							!config.supportsMinification ||
							!hasInput ||
							!validation.isValid
						}
						className="text-xs"
					>
						<MinusSquare className="mr-1 h-3 w-3" />
						Minify
					</Button>
					<Button
						variant={formatMode === "original" ? "default" : "outline"}
						size="sm"
						onClick={() => {
							onFormatModeChange("original");
							onReset();
						}}
						disabled={!hasOutput}
						className="text-xs"
					>
						<RotateCcw className="mr-1 h-3 w-3" />
						Reset
					</Button>
						</div>
					</div>

					<Separator />

					{/* View Mode and Actions Row */}
					<div className="flex flex-wrap items-center justify-between gap-3">
						{/* View Mode */}
						<div className="flex items-center gap-3">
							<span className="font-medium text-sm">View:</span>
							<Select value={viewMode} onValueChange={onViewModeChange}>
								<SelectTrigger className="w-[100px]">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value="split">Split</SelectItem>
									<SelectItem value="input">Input</SelectItem>
									<SelectItem value="output">Output</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Action Buttons */}
						<div className="flex items-center gap-2">
							{/* Formatting Options */}
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="sm" className="text-xs">
										<Settings className="mr-1 h-3 w-3" />
										Options
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end" className="w-56">
									<DropdownMenuLabel>Formatting Options</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<div className="space-y-3 p-2">
										{/* Indent Size */}
										<div className="flex items-center justify-between">
											<span className="text-sm">Indent Size:</span>
											<Select
												value={formattingOptions.indentSize.toString()}
												onValueChange={(value) =>
													onFormattingOptionsChange({
														indentSize: Number.parseInt(value),
													})
												}
											>
												<SelectTrigger className="h-8 w-16">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="2">2</SelectItem>
													<SelectItem value="4">4</SelectItem>
													<SelectItem value="8">8</SelectItem>
												</SelectContent>
											</Select>
										</div>

										{/* Indent Type */}
										<div className="flex items-center justify-between">
											<span className="text-sm">Indent Type:</span>
											<Select
												value={formattingOptions.indentType}
												onValueChange={(value: "spaces" | "tabs") =>
													onFormattingOptionsChange({ indentType: value })
												}
											>
												<SelectTrigger className="h-8 w-20">
													<SelectValue />
												</SelectTrigger>
												<SelectContent>
													<SelectItem value="spaces">Spaces</SelectItem>
													<SelectItem value="tabs">Tabs</SelectItem>
												</SelectContent>
											</Select>
										</div>
									</div>
								</DropdownMenuContent>
							</DropdownMenu>

							<Button
								variant="outline"
								size="sm"
								onClick={onLoadSample}
								className="text-xs"
							>
								<FileText className="mr-1 h-3 w-3" />
								Sample
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onCopyInput}
								disabled={!hasInput}
								className="text-xs"
							>
								<Copy className="mr-1 h-3 w-3" />
								Copy Input
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onCopyOutput}
								disabled={!hasOutput}
								className="text-xs"
							>
								<Copy className="mr-1 h-3 w-3" />
								Copy Output
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onDownloadInput}
								disabled={!hasInput}
								className="text-xs"
							>
								<Download className="mr-1 h-3 w-3" />
								Download Input
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onDownloadOutput}
								disabled={!hasOutput}
								className="text-xs"
							>
								<Download className="mr-1 h-3 w-3" />
								Download Output
							</Button>

							<Button
								variant="outline"
								size="sm"
								onClick={onClear}
								disabled={!hasInput}
								className="text-xs"
							>
								<Trash2 className="mr-1 h-3 w-3" />
								Clear
							</Button>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
