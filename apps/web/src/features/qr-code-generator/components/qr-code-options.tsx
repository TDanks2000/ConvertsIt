"use client";

import { Palette, RotateCcw, Settings, Wand2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Slider } from "@/components/ui/slider";
import type { QRCodeLevel, QRCodeOptions } from "../types";
import {
	getErrorCorrectionDescription,
	isValidHexColor,
} from "../utils/qr-code-generator";

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

const PRESET_COLORS = [
	{ name: "Black", value: "#000000" },
	{ name: "Blue", value: "#3B82F6" },
	{ name: "Green", value: "#10B981" },
	{ name: "Red", value: "#EF4444" },
	{ name: "Purple", value: "#8B5CF6" },
	{ name: "Orange", value: "#F97316" },
];

export function QRCodeOptionsComponent({
	options,
	onUpdateOption,
	onAutoAdjustSize,
	onResetOptions,
	inputLength,
	disabled = false,
}: QRCodeOptionsProps) {
	const handleColorChange = (
		colorType: "fgColor" | "bgColor",
		value: string,
	) => {
		if (isValidHexColor(value) || value === "") {
			onUpdateOption(colorType, value);
		}
	};

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
							<div
								className="h-8 w-8 rounded border"
								style={{ backgroundColor: options.fgColor }}
							/>
							<Input
								value={options.fgColor}
								onChange={(e) => handleColorChange("fgColor", e.target.value)}
								placeholder="#000000"
								disabled={disabled}
								className="font-mono text-sm"
							/>
						</div>
						<div className="flex flex-wrap gap-1">
							{PRESET_COLORS.map((color) => (
								<button
									key={`fg-${color.value}`}
									type="button"
									onClick={() => onUpdateOption("fgColor", color.value)}
									disabled={disabled}
									className="h-6 w-6 rounded border transition-transform hover:scale-110"
									style={{ backgroundColor: color.value }}
									title={color.name}
								/>
							))}
						</div>
					</div>

					{/* Background Color */}
					<div className="space-y-2">
						<Label className="text-muted-foreground text-xs">Background</Label>
						<div className="flex items-center gap-2">
							<div
								className="h-8 w-8 rounded border"
								style={{ backgroundColor: options.bgColor }}
							/>
							<Input
								value={options.bgColor}
								onChange={(e) => handleColorChange("bgColor", e.target.value)}
								placeholder="#FFFFFF"
								disabled={disabled}
								className="font-mono text-sm"
							/>
						</div>
						<div className="flex flex-wrap gap-1">
							<button
								type="button"
								onClick={() => onUpdateOption("bgColor", "#FFFFFF")}
								disabled={disabled}
								className="h-6 w-6 rounded border transition-transform hover:scale-110"
								style={{ backgroundColor: "#FFFFFF" }}
								title="White"
							/>
							<button
								type="button"
								onClick={() => onUpdateOption("bgColor", "#F3F4F6")}
								disabled={disabled}
								className="h-6 w-6 rounded border transition-transform hover:scale-110"
								style={{ backgroundColor: "#F3F4F6" }}
								title="Light Gray"
							/>
							<button
								type="button"
								onClick={() => onUpdateOption("bgColor", "transparent")}
								disabled={disabled}
								className="h-6 w-6 rounded border bg-gradient-to-br from-red-500 via-transparent to-blue-500 transition-transform hover:scale-110"
								title="Transparent"
							/>
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
