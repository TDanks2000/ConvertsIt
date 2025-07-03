"use client";

import { ImageIcon, Maximize2 } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useImageResizer } from "../hooks/use-image-resizer";
import type { ResizeOptions } from "../types";
import { ImagePreview } from "./image-preview";
import { ImageUploader } from "./image-uploader";
import { ResizeControls } from "./resize-controls";

export function ImageResizer() {
	const {
		originalImage,
		resizedImage,
		isProcessing,
		error,
		uploadImage,
		resizeImage,
		resetImages,
	} = useImageResizer();

	const [resizeOptions, setResizeOptions] = useState<ResizeOptions>({
		width: 800,
		height: 600,
		maintainAspectRatio: true,
		quality: 90,
		format: "jpeg",
	});

	const handleImageUpload = useCallback(
		(file: File) => {
			uploadImage(file);
		},
		[uploadImage],
	);

	const handleResize = useCallback(() => {
		if (!originalImage) {
			toast.error("Please upload an image first");
			return;
		}
		resizeImage(resizeOptions);
	}, [originalImage, resizeOptions, resizeImage]);

	const handleReset = useCallback(() => {
		resetImages();
		setResizeOptions({
			width: 800,
			height: 600,
			maintainAspectRatio: true,
			quality: 90,
			format: "jpeg",
		});
	}, [resetImages]);

	return (
		<div className="container mx-auto max-w-6xl space-y-8 p-4">
			<PageHeader
				title="Image Resizer"
				description="Resize your images to specific dimensions while maintaining quality and aspect ratio."
				icons={[ImageIcon, Maximize2]}
			/>

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-6">
					<ImageUploader
						onImageUpload={handleImageUpload}
						isProcessing={isProcessing}
					/>

					<ResizeControls
						options={resizeOptions}
						onOptionsChange={setResizeOptions}
						onResize={handleResize}
						onReset={handleReset}
						isProcessing={isProcessing}
						hasImage={!!originalImage}
						originalImage={originalImage}
					/>
				</div>

				<div className="space-y-6">
					<ImagePreview
						originalImage={originalImage}
						resizedImage={resizedImage}
						isProcessing={isProcessing}
						error={error}
					/>
				</div>
			</div>
		</div>
	);
}
