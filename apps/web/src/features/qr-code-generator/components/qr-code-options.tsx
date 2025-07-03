"use client";

import { Palette, RotateCcw, Settings, Wand2 } from "lucide-react";
import { ColorPicker } from "@/components/color-picker/color-picker";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Slider } from "@/components/ui/slider";
import type { QRCodeLevel, QRCodeOptions } from "../types";
import { getErrorCorrectionDescription } from "../utils/qr-code-generator";

interface QRCodeOptionsProps {
	options: QRCodeOptions;
	onUpdateOption: <K extends keyof QRCodeOptions>(
		key: K,
		value: QRCodeOptions[K],
	) => void;
	onAutoAdjustSize: () => void;
	onResetOptions: () => void;
	inputLength: number;
	disabled?: boolean;
}

const ERROR_CORRECTION_LEVELS: { value: QRCodeLevel; label: string }[] = [
	{ value: "L", label: "Low (7%)" },
	{ value: "M", label: "Medium (15%)" },
	{ value: "Q", label: "Quartile (25%)" },
	{ value: "H", label: "High (30%)" },
];

const FOREGROUND_PRESET_COLORS = [
	"#000000",
	"#3B82F6",
	"#10B981",
	"#EF4444",
	"#8B5CF6",
	"#F97316",
	"#1F2937",
	"#DC2626",
];

const BACKGROUND_PRESET_COLORS = [
	"#FFFFFF",
	"#F3F4F6",
	"#E5E7EB",
	"#FEF3C7",
	"#DBEAFE",
	"#D1FAE5",
	"#FCE7F3",
	"#F3E8FF",
];

export function QRCodeOptionsComponent({
	options,
	onUpdateOption,
	onAutoAdjustSize,
	onResetOptions,
	inputLength,
	disabled = false,
}: QRCodeOptionsProps) {
	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Settings className="h-5 w-5" />
						QR Code Options
					</CardTitle>
					<Button
						variant="outline"
						size="sm"
						onClick={onResetOptions}
						disabled={disabled}
						className="flex items-center gap-2"
					>
						<RotateCcw className="h-4 w-4" />
						Reset
					</Button>
				</div>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Size Settings */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="font-medium text-sm">
							Size: {options.size}px
						</Label>
						<Button
							variant="outline"
							size="sm"
							onClick={onAutoAdjustSize}
							disabled={disabled || inputLength === 0}
							className="flex items-center gap-2 text-xs"
						>
							<Wand2 className="h-3 w-3" />
							Auto
						</Button>
					</div>
					<Slider
						value={[options.size]}
						onValueChange={([value]) => onUpdateOption("size", value)}
						min={100}
						max={500}
						step={10}
						disabled={disabled}
						className="w-full"
					/>
				</div>

				<Separator />

				{/* Error Correction Level */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Error Correction Level</Label>
					<Select
						value={options.level}
						onValueChange={(value) =>
							onUpdateOption("level", value as QRCodeLevel)
						}
						disabled={disabled}
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ERROR_CORRECTION_LEVELS.map((level) => (
								<SelectItem key={level.value} value={level.value}>
									{level.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<p className="text-muted-foreground text-xs">
						{getErrorCorrectionDescription(options.level)}
					</p>
				</div>

				<Separator />

				{/* Colors */}
				<div className="space-y-4">
					<div className="flex items-center gap-2">
						<Palette className="h-4 w-4" />
						<Label className="font-medium text-sm">Colors</Label>
					</div>

					{/* Foreground Color */}
					<div className="space-y-2">
						<Label className="text-muted-foreground text-xs">
							Foreground (QR Code)
						</Label>
						<div className="flex items-center gap-2">
							<ColorPicker
								value={options.fgColor}
								onChange={(color) => onUpdateOption("fgColor", color)}
								disabled={disabled}
								customPresets={FOREGROUND_PRESET_COLORS}
								hexInputPlaceholder="#000000"
							/>
							<span className="font-mono text-muted-foreground text-sm">
								{options.fgColor}
							</span>
						</div>
					</div>

					{/* Background Color */}
					<div className="space-y-2">
						<Label className="text-muted-foreground text-xs">Background</Label>
						<div className="flex items-center gap-2">
							<ColorPicker
								value={
									options.bgColor === "transparent"
										? "#FFFFFF"
										: options.bgColor
								}
								onChange={(color) => onUpdateOption("bgColor", color)}
								disabled={disabled}
								customPresets={BACKGROUND_PRESET_COLORS}
								hexInputPlaceholder="#FFFFFF"
							/>
							<span className="font-mono text-muted-foreground text-sm">
								{options.bgColor}
							</span>
							{options.bgColor !== "transparent" && (
								<Button
									variant="outline"
									size="sm"
									onClick={() => onUpdateOption("bgColor", "transparent")}
									disabled={disabled}
									className="h-8 px-2 text-xs"
								>
									Transparent
								</Button>
							)}
						</div>
					</div>
				</div>

				<Separator />

				{/* Additional Options */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Additional Options</Label>
					<div className="flex items-center space-x-2">
						<Checkbox
							id="includeMargin"
							checked={options.includeMargin}
							onCheckedChange={(checked) =>
								onUpdateOption("includeMargin", checked as boolean)
							}
							disabled={disabled}
						/>
						<Label htmlFor="includeMargin" className="text-sm">
							Include margin around QR code
						</Label>
					</div>
				</div>

				{/* Preview Badge */}
				<div className="flex items-center justify-center pt-2">
					<Badge variant="secondary" className="text-xs">
						{options.size}×{options.size}px • {options.level} Error Correction
					</Badge>
				</div>
			</CardContent>
		</Card>
	);
}
