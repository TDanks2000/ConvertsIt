import { Film, Layers, Settings, SlidersHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ConversionOptions } from "../types";

interface ConversionOptionsProps {
	options: ConversionOptions;
	onChange: (options: ConversionOptions) => void;
	disabled?: boolean;
}

const formatOptions = [
	{
		value: "jpeg",
		label: "JPEG",
		description: "Best for photos",
		features: { quality: true, transparency: false, animation: false },
	},
	{
		value: "png",
		label: "PNG",
		description: "Best for graphics with transparency",
		features: { quality: false, transparency: true, animation: false },
	},
	{
		value: "webp",
		label: "WebP",
		description: "Modern format with great compression",
		features: { quality: true, transparency: true, animation: true },
	},
	{
		value: "gif",
		label: "GIF",
		description: "For simple animations",
		features: { quality: false, transparency: true, animation: true },
	},
	{
		value: "bmp",
		label: "BMP",
		description: "Uncompressed bitmap",
		features: { quality: false, transparency: false, animation: false },
	},
	{
		value: "tiff",
		label: "TIFF",
		description: "High quality archival format",
		features: { quality: false, transparency: true, animation: false },
	},
	{
		value: "avif",
		label: "AVIF",
		description: "Next-gen format with excellent compression",
		features: { quality: true, transparency: true, animation: false },
	},
	{
		value: "ico",
		label: "ICO",
		description: "Windows icon format",
		features: { quality: false, transparency: true, animation: false },
	},
	{
		value: "svg",
		label: "SVG",
		description: "Vector graphics format",
		features: { quality: false, transparency: true, animation: true },
	},
] as const;

export function ConversionOptionsComponent({
	options,
	onChange,
	disabled,
}: ConversionOptionsProps) {
	const updateOptions = (updates: Partial<ConversionOptions>) => {
		onChange({ ...options, ...updates });
	};

	return (
		<Card className="p-6">
			<div className="space-y-6">
				<div className="flex items-center gap-2">
					<Settings className="h-5 w-5" />
					<h3 className="font-semibold text-lg">Conversion Options</h3>
				</div>

				{/* Format Selection */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Output Format</Label>
					<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
						{formatOptions.map((format) => (
							<Button
								key={format.value}
								variant={
									options.format === format.value ? "default" : "outline"
								}
								size="sm"
								disabled={disabled}
								onClick={() => updateOptions({ format: format.value })}
								className="flex h-full flex-col justify-between p-3 text-center"
							>
								<div>
									<span className="block font-medium">{format.label}</span>
									<span className="text-wrap text-xs opacity-70">
										{format.description}
									</span>
								</div>
								<div className="mt-2 flex justify-center gap-2">
									{format.features.quality && (
										<Tooltip>
											<TooltipTrigger>
												<SlidersHorizontal className="h-4 w-4" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Quality adjustment</p>
											</TooltipContent>
										</Tooltip>
									)}
									{format.features.transparency && (
										<Tooltip>
											<TooltipTrigger>
												<Layers className="h-4 w-4" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Supports transparency</p>
											</TooltipContent>
										</Tooltip>
									)}
									{format.features.animation && (
										<Tooltip>
											<TooltipTrigger>
												<Film className="h-4 w-4" />
											</TooltipTrigger>
											<TooltipContent>
												<p>Supports animation</p>
											</TooltipContent>
										</Tooltip>
									)}
								</div>
							</Button>
						))}
					</div>
					<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 text-muted-foreground text-sm">
						<div className="flex items-center gap-1.5">
							<SlidersHorizontal className="h-4 w-4" />
							<span>Quality</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Layers className="h-4 w-4" />
							<span>Transparency</span>
						</div>
						<div className="flex items-center gap-1.5">
							<Film className="h-4 w-4" />
							<span>Animation</span>
						</div>
					</div>
				</div>

				{(options.format === "jpeg" ||
					options.format === "webp" ||
					options.format === "avif") && (
					<div className="space-y-3">
						<div className="flex items-center justify-between">
							<Label className="font-medium text-sm">Quality</Label>
							<span className="text-muted-foreground text-sm">
								{options.quality}%
							</span>
						</div>
						<input
							type="range"
							min="10"
							max="100"
							step="5"
							value={options.quality}
							onChange={(e) =>
								updateOptions({ quality: Number.parseInt(e.target.value) })
							}
							disabled={disabled}
							className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-gray-200 dark:bg-gray-700"
						/>
						<div className="flex justify-between text-muted-foreground text-xs">
							<span>Lower size</span>
							<span>Higher quality</span>
						</div>
					</div>
				)}

				{/* Resize Options */}
				<div className="space-y-4">
					<Label className="font-medium text-sm">Resize Options</Label>

					<div className="flex items-center space-x-2">
						<Checkbox
							id="maintain-aspect"
							checked={options.maintainAspectRatio}
							onCheckedChange={(checked) =>
								updateOptions({ maintainAspectRatio: checked as boolean })
							}
							disabled={disabled}
						/>
						<Label htmlFor="maintain-aspect" className="text-sm">
							Maintain aspect ratio
						</Label>
					</div>

					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-2">
							<Label htmlFor="width" className="text-sm">
								Width (px)
							</Label>
							<Input
								id="width"
								type="number"
								placeholder="Auto"
								value={options.width || ""}
								onChange={(e) => {
									const value = e.target.value
										? Number.parseInt(e.target.value)
										: undefined;
									updateOptions({ width: value });
								}}
								disabled={disabled}
								min="1"
								max="10000"
							/>
						</div>

						<div className="space-y-2">
							<Label htmlFor="height" className="text-sm">
								Height (px)
							</Label>
							<Input
								id="height"
								type="number"
								placeholder="Auto"
								value={options.height || ""}
								onChange={(e) => {
									const value = e.target.value
										? Number.parseInt(e.target.value)
										: undefined;
									updateOptions({ height: value });
								}}
								disabled={disabled}
								min="1"
								max="10000"
							/>
						</div>
					</div>

					<p className="text-muted-foreground text-xs">
						Leave width/height empty to keep original dimensions
					</p>
				</div>
			</div>
		</Card>
	);
}
