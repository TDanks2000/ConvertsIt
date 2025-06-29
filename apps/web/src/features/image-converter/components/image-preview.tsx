import {
	AlertCircle,
	CheckCircle,
	Download,
	Loader2,
	RotateCcw,
	X,
} from "lucide-react";
import { useState } from "react";
import {
	ReactCompareSlider,
	ReactCompareSliderImage,
} from "react-compare-slider";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import type { ImageFile } from "../types";
import { ImageConverter } from "../utils/image-converter";

interface ImagePreviewProps {
	image: ImageFile;
	onRemove: (id: string) => void;
	onConvert: (id: string) => void;
	onDownload: (id: string) => void;
	disabled?: boolean;
}

export function ImagePreview({
	image,
	onRemove,
	onConvert,
	onDownload,
	disabled,
}: ImagePreviewProps) {
	const [imageError, setImageError] = useState(false);

	const getStatusIcon = () => {
		switch (image.status) {
			case "pending":
				return null;
			case "converting":
				return <Loader2 className="h-4 w-4 animate-spin" />;
			case "completed":
				return <CheckCircle className="h-4 w-4 text-green-500" />;
			case "error":
				return <AlertCircle className="h-4 w-4 text-red-500" />;
		}
	};

	const getStatusBadge = () => {
		switch (image.status) {
			case "pending":
				return <Badge variant="secondary">Pending</Badge>;
			case "converting":
				return <Badge variant="default">Converting...</Badge>;
			case "completed":
				return (
					<Badge variant="default" className="bg-green-500">
						Completed
					</Badge>
				);
			case "error":
				return <Badge variant="destructive">Error</Badge>;
		}
	};

	return (
		<Card className="overflow-hidden py-0">
			<div className="relative">
				{/* Image Preview */}
				<div className="flex aspect-square items-center justify-center overflow-hidden bg-muted">
					{image.status === "completed" && image.convertedUrl ? (
						<ReactCompareSlider
							itemOne={
								<ReactCompareSliderImage src={image.preview} alt={image.name} />
							}
							itemTwo={
								<ReactCompareSliderImage
									src={image.convertedUrl}
									alt={`Converted ${image.name}`}
								/>
							}
						/>
					) : !imageError ? (
						// biome-ignore lint/performance/noImgElement: this is a preview, not a dynamic image
						<img
							src={image.preview}
							alt={image.name}
							className="h-full w-full object-cover"
							onError={() => setImageError(true)}
						/>
					) : (
						<div className="flex flex-col items-center gap-2 text-muted-foreground">
							<AlertCircle className="h-8 w-8" />
							<span className="text-sm">Preview unavailable</span>
						</div>
					)}
				</div>

				{/* Remove Button */}
				<Button
					variant="destructive"
					size="sm"
					className="absolute top-2 right-2 h-8 w-8 p-0"
					onClick={() => onRemove(image.id)}
					disabled={disabled}
				>
					<X className="h-4 w-4" />
				</Button>

				{/* Progress Bar */}
				{image.status === "converting" && (
					<div className="absolute right-0 bottom-0 left-0 bg-black/50">
						<div
							className="h-1 bg-primary transition-all duration-300"
							style={{ width: `${image.progress}%` }}
						/>
					</div>
				)}
			</div>

			{/* Image Info */}
			<div className="space-y-3 p-4">
				<div className="space-y-1">
					<div className="flex items-center justify-between">
						<h4 className="truncate font-medium text-sm" title={image.name}>
							{image.name}
						</h4>
						{getStatusIcon()}
					</div>

					<div className="flex items-center justify-between text-muted-foreground text-xs">
						<span>{ImageConverter.formatFileSize(image.size)}</span>
						<span>{image.type.split("/")[1].toUpperCase()}</span>
					</div>
				</div>

				{/* Status Badge */}
				<div className="flex justify-center">{getStatusBadge()}</div>

				{/* Error Message */}
				{image.status === "error" && image.error && (
					<div className="text-center text-red-500 text-xs">{image.error}</div>
				)}

				{/* Action Buttons */}
				<div className="flex gap-2">
					{image.status === "pending" && (
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={() => onConvert(image.id)}
							disabled={disabled}
						>
							Convert
						</Button>
					)}

					{image.status === "error" && (
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={() => onConvert(image.id)}
							disabled={disabled}
						>
							<RotateCcw className="mr-1 h-3 w-3" />
							Retry
						</Button>
					)}

					{image.status === "completed" && (
						<Button
							variant="outline"
							size="sm"
							className="flex-1"
							onClick={() => onDownload(image.id)}
							disabled={disabled}
						>
							<Download className="mr-1 h-3 w-3" />
							Download
						</Button>
					)}
				</div>
			</div>
		</Card>
	);
}
