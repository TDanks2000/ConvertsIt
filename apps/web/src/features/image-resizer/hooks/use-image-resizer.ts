"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import type { ImageData, ResizeOptions, ResizeResult } from "../types";
import { resizeImageFile } from "../utils/image-utils";

export function useImageResizer() {
	const [originalImage, setOriginalImage] = useState<ImageData | null>(null);
	const [resizedImage, setResizedImage] = useState<ResizeResult | null>(null);
	const [isProcessing, setIsProcessing] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const uploadImage = useCallback(async (file: File) => {
		setError(null);
		setIsProcessing(true);

		try {
			// Validate file type
			if (!file.type.startsWith("image/")) {
				throw new Error("Please select a valid image file");
			}

			// Validate file size (max 10MB)
			if (file.size > 10 * 1024 * 1024) {
				throw new Error("Image size must be less than 10MB");
			}

			// Create image to get dimensions
			const img = new Image();
			const url = URL.createObjectURL(file);

			await new Promise<void>((resolve, reject) => {
				img.onload = () => resolve();
				img.onerror = () => reject(new Error("Failed to load image"));
				img.src = url;
			});

			const imageData: ImageData = {
				file,
				url,
				width: img.width,
				height: img.height,
				size: file.size,
			};

			setOriginalImage(imageData);
			setResizedImage(null);
			toast.success("Image uploaded successfully");
		} catch (err) {
			const message =
				err instanceof Error ? err.message : "Failed to upload image";
			setError(message);
			toast.error(message);
		} finally {
			setIsProcessing(false);
		}
	}, []);

	const resizeImage = useCallback(
		async (options: ResizeOptions) => {
			if (!originalImage) {
				toast.error("No image to resize");
				return;
			}

			setError(null);
			setIsProcessing(true);

			try {
				const result = await resizeImageFile(originalImage.file, options);
				setResizedImage(result);
				toast.success("Image resized successfully");
			} catch (err) {
				const message =
					err instanceof Error ? err.message : "Failed to resize image";
				setError(message);
				toast.error(message);
			} finally {
				setIsProcessing(false);
			}
		},
		[originalImage],
	);

	const resetImages = useCallback(() => {
		if (originalImage?.url) {
			URL.revokeObjectURL(originalImage.url);
		}
		if (resizedImage?.url) {
			URL.revokeObjectURL(resizedImage.url);
		}
		setOriginalImage(null);
		setResizedImage(null);
		setError(null);
	}, [originalImage, resizedImage]);

	return {
		originalImage,
		resizedImage,
		isProcessing,
		error,
		uploadImage,
		resizeImage,
		resetImages,
	};
}
