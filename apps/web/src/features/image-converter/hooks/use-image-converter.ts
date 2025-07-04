import { useCallback, useState } from "react";
import type { ConversionOptions, ImageFile, ImageStats } from "../types";
import { ImageConverter } from "../utils/image-converter";

export function useImageConverter() {
	const [images, setImages] = useState<ImageFile[]>([]);
	const [isConverting, setIsConverting] = useState(false);
	const [conversionOptions, setConversionOptions] = useState<ConversionOptions>(
		{
			format: "jpeg",
			quality: 80,
			maintainAspectRatio: true,
		},
	);

	// Custom setter that resets completed images to pending when options change
	const updateConversionOptions = useCallback(
		(newOptions: ConversionOptions) => {
			setConversionOptions(newOptions);

			// Reset completed images to pending status so they can be re-converted
			setImages((prev) =>
				prev.map((img) => {
					if (img.status === "completed") {
						// Clean up the old converted URL
						if (img.convertedUrl) {
							URL.revokeObjectURL(img.convertedUrl);
						}
						return {
							...img,
							status: "pending" as const,
							progress: 0,
							convertedUrl: undefined,
							convertedSize: undefined,
							error: undefined,
						};
					}
					return img;
				}),
			);
		},
		[],
	);

	const addImages = useCallback((files: File[]) => {
		const validFiles = files.filter(ImageConverter.isValidImageType);
		const newImages = validFiles.map(ImageConverter.createImageFile);

		setImages((prev) => [...prev, ...newImages]);
		return newImages.length;
	}, []);

	const removeImage = useCallback((id: string) => {
		setImages((prev) => {
			const image = prev.find((img) => img.id === id);
			if (image?.preview) {
				URL.revokeObjectURL(image.preview);
			}
			if (image?.convertedUrl) {
				URL.revokeObjectURL(image.convertedUrl);
			}
			return prev.filter((img) => img.id !== id);
		});
	}, []);

	const clearAllImages = useCallback(() => {
		images.forEach((image) => {
			if (image.preview) {
				URL.revokeObjectURL(image.preview);
			}
			if (image.convertedUrl) {
				URL.revokeObjectURL(image.convertedUrl);
			}
		});
		setImages([]);
	}, [images]);

	const convertImage = useCallback(
		async (imageId: string) => {
			setImages((prev) =>
				prev.map((img) =>
					img.id === imageId
						? { ...img, status: "converting" as const, progress: 0 }
						: img,
				),
			);

			const image = images.find((img) => img.id === imageId);
			if (!image) return;

			try {
				// Simulate progress updates
				const progressInterval = setInterval(() => {
					setImages((prev) =>
						prev.map((img) =>
							img.id === imageId && img.progress < 90
								? { ...img, progress: img.progress + 10 }
								: img,
						),
					);
				}, 100);

				const result = await ImageConverter.convertImage(
					image.file,
					conversionOptions,
				);

				clearInterval(progressInterval);

				if (result.success && result.url) {
					setImages((prev) =>
						prev.map((img) =>
							img.id === imageId
								? {
										...img,
										status: "completed" as const,
										progress: 100,
										convertedUrl: result.url,
										convertedSize: result.size,
									}
								: img,
						),
					);
				} else {
					setImages((prev) =>
						prev.map((img) =>
							img.id === imageId
								? {
										...img,
										status: "error" as const,
										progress: 0,
										error: result.error || "Conversion failed",
									}
								: img,
						),
					);
				}
			} catch (error) {
				setImages((prev) =>
					prev.map((img) =>
						img.id === imageId
							? {
									...img,
									status: "error" as const,
									progress: 0,
									error:
										error instanceof Error ? error.message : "Unknown error",
								}
							: img,
					),
				);
			}
		},
		[images, conversionOptions],
	);

	const convertAllImages = useCallback(async () => {
		setIsConverting(true);

		const pendingImages = images.filter((img) => img.status === "pending");

		for (const image of pendingImages) {
			await convertImage(image.id);
		}

		setIsConverting(false);
	}, [images, convertImage]);

	const downloadImage = useCallback(
		(imageId: string) => {
			const image = images.find((img) => img.id === imageId);
			if (!image) return;
			if (image.convertedUrl) {
				const extension =
					conversionOptions.format === "jpeg"
						? "jpg"
						: conversionOptions.format;
				const filename = `${image.name.split(".")[0]}.${extension}`;
				ImageConverter.downloadImage(image.convertedUrl, filename);
			}
		},
		[images, conversionOptions.format],
	);

	const downloadAllImages = useCallback(async () => {
		const completedImages = images.filter((img) => img.status === "completed");
		await ImageConverter.downloadAllAsZip(
			completedImages,
			conversionOptions.format,
		);
	}, [images, conversionOptions.format]);

	const getStats = useCallback((): ImageStats => {
		const totalFiles = images.length;
		const completedFiles = images.filter(
			(img) => img.status === "completed",
		).length;
		const totalSize = images.reduce((sum, img) => sum + img.size, 0);
		const convertedSize = images
			.filter((img) => img.status === "completed")
			.reduce((sum, img) => sum + (img.convertedSize || 0), 0);

		const compressionRatio =
			totalSize > 0 ? ((totalSize - convertedSize) / totalSize) * 100 : 0;

		return {
			totalFiles,
			completedFiles,
			totalSize,
			convertedSize,
			compressionRatio,
		};
	}, [images]);

	return {
		images,
		isConverting,
		conversionOptions,
		setConversionOptions: updateConversionOptions,
		addImages,
		removeImage,
		clearAllImages,
		convertImage,
		convertAllImages,
		downloadImage,
		downloadAllImages,
		getStats,
	};
}
