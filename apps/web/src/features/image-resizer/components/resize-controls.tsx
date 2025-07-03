"use client";

import { Link, Maximize2, RotateCcw, Settings, Unlink } from "lucide-react";
import { useCallback, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
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
import type { ImageData, ResizeOptions } from "../types";

interface ResizeControlsProps {
	options: ResizeOptions;
	onOptionsChange: (options: ResizeOptions) => void;
	onResize: () => void;
	onReset: () => void;
	isProcessing: boolean;
	hasImage: boolean;
	originalImage: ImageData | null;
}

export function ResizeControls({
	options,
	onOptionsChange,
	onResize,
	onReset,
	isProcessing,
	hasImage,
	originalImage,
}: ResizeControlsProps) {
	const handleWidthChange = useCallback(
		(value: string) => {
			const width = Number.parseInt(value) || 0;
			const newOptions = { ...options, width };

			if (options.maintainAspectRatio && originalImage) {
				const aspectRatio = originalImage.width / originalImage.height;
				newOptions.height = Math.round(width / aspectRatio);
			}

			onOptionsChange(newOptions);
		},
		[options, onOptionsChange, originalImage],
	);

	const handleHeightChange = useCallback(
		(value: string) => {
			const height = Number.parseInt(value) || 0;
			const newOptions = { ...options, height };

			if (options.maintainAspectRatio && originalImage) {
				const aspectRatio = originalImage.width / originalImage.height;
				newOptions.width = Math.round(height * aspectRatio);
			}

			onOptionsChange(newOptions);
		},
		[options, onOptionsChange, originalImage],
	);

	const handleAspectRatioToggle = useCallback(() => {
		const newMaintainAspectRatio = !options.maintainAspectRatio;
		const newOptions = {
			...options,
			maintainAspectRatio: newMaintainAspectRatio,
		};

		if (newMaintainAspectRatio && originalImage) {
			// Recalculate height based on current width
			const aspectRatio = originalImage.width / originalImage.height;
			newOptions.height = Math.round(options.width / aspectRatio);
		}

		onOptionsChange(newOptions);
	}, [options, onOptionsChange, originalImage]);

	const handleQualityChange = useCallback(
		(value: number[]) => {
			onOptionsChange({ ...options, quality: value[0] });
		},
		[options, onOptionsChange],
	);

	const handleFormatChange = useCallback(
		(format: "jpeg" | "png" | "webp") => {
			onOptionsChange({ ...options, format });
		},
		[options, onOptionsChange],
	);

	// Update dimensions when image changes and aspect ratio is maintained
	useEffect(() => {
		if (originalImage && options.maintainAspectRatio) {
			const aspectRatio = originalImage.width / originalImage.height;
			const newHeight = Math.round(options.width / aspectRatio);
			if (newHeight !== options.height) {
				onOptionsChange({ ...options, height: newHeight });
			}
		}
	}, [
		originalImage,
		options.maintainAspectRatio,
		options.width,
		options,
		onOptionsChange,
	]);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					Resize Settings
				</CardTitle>
				<CardDescription>
					Configure the dimensions and quality for your resized image.
				</CardDescription>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Original Image Info */}
				{originalImage && (
					<div className="rounded-lg bg-muted/50 p-3">
						<p className="font-medium text-sm">Original Image</p>
						<p className="text-muted-foreground text-xs">
							{originalImage.width} × {originalImage.height} pixels
						</p>
					</div>
				)}

				{/* Dimensions */}
				<div className="space-y-4">
					<div className="flex items-center justify-between">
						<Label className="font-medium text-sm">Dimensions</Label>
						<Button
							variant="ghost"
							size="sm"
							onClick={handleAspectRatioToggle}
							className="h-8 px-2"
						>
							{options.maintainAspectRatio ? (
								<Link className="h-4 w-4" />
							) : (
								<Unlink className="h-4 w-4" />
							)}
							<span className="ml-1 text-xs">
								{options.maintainAspectRatio ? "Linked" : "Free"}
							</span>
						</Button>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="width" className="text-xs">
								Width (px)
							</Label>
							<Input
								id="width"
								type="number"
								value={options.width}
								onChange={(e) => handleWidthChange(e.target.value)}
								min="1"
								max="5000"
								className="h-9"
							/>
						</div>
						<div className="space-y-2">
							<Label htmlFor="height" className="text-xs">
								Height (px)
							</Label>
							<Input
								id="height"
								type="number"
								value={options.height}
								onChange={(e) => handleHeightChange(e.target.value)}
								min="1"
								max="5000"
								disabled={options.maintainAspectRatio}
								className="h-9"
							/>
						</div>
					</div>
				</div>

				<Separator />

				{/* Quality */}
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<Label className="font-medium text-sm">Quality</Label>
						<span className="text-muted-foreground text-xs">
							{options.quality}%
						</span>
					</div>
					<Slider
						value={[options.quality]}
						onValueChange={handleQualityChange}
						min={10}
						max={100}
						step={5}
						className="w-full"
					/>
				</div>

				<Separator />

				{/* Format */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Output Format</Label>
					<Select value={options.format} onValueChange={handleFormatChange}>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="jpeg">JPEG</SelectItem>
							<SelectItem value="png">PNG</SelectItem>
							<SelectItem value="webp">WebP</SelectItem>
						</SelectContent>
					</Select>
				</div>

				<Separator />

				{/* Actions */}
				<div className="flex gap-2">
					<Button
						onClick={onResize}
						disabled={!hasImage || isProcessing}
						className="flex-1"
					>
						<Maximize2 className="mr-2 h-4 w-4" />
						{isProcessing ? "Processing..." : "Resize Image"}
					</Button>
					<Button
						variant="outline"
						onClick={onReset}
						disabled={!hasImage || isProcessing}
					>
						<RotateCcw className="h-4 w-4" />
					</Button>
				</div>
			</CardContent>
		</Card>
	);
}
