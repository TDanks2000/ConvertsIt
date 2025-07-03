import type { ImageDimensions, ResizeOptions, ResizeResult } from "../types";

/**
 * Calculate new dimensions while maintaining aspect ratio
 */
export function calculateAspectRatioDimensions(
	originalWidth: number,
	originalHeight: number,
	targetWidth: number,
	targetHeight: number,
	maintainAspectRatio: boolean,
): ImageDimensions {
	if (!maintainAspectRatio) {
		return { width: targetWidth, height: targetHeight };
	}

	const aspectRatio = originalWidth / originalHeight;
	const targetAspectRatio = targetWidth / targetHeight;

	if (aspectRatio > targetAspectRatio) {
		// Image is wider, fit to width
		return {
			width: targetWidth,
			height: Math.round(targetWidth / aspectRatio),
		};
	}
	// Image is taller, fit to height
	return {
		width: Math.round(targetHeight * aspectRatio),
		height: targetHeight,
	};
}

/**
 * Resize an image file using canvas
 */
export async function resizeImageFile(
	file: File,
	options: ResizeOptions,
): Promise<ResizeResult> {
	return new Promise((resolve, reject) => {
		const img = new Image();
		const canvas = document.createElement("canvas");
		const ctx = canvas.getContext("2d");

		if (!ctx) {
			reject(new Error("Failed to get canvas context"));
			return;
		}

		img.onload = () => {
			try {
				// Calculate new dimensions
				const dimensions = calculateAspectRatioDimensions(
					img.width,
					img.height,
					options.width,
					options.height,
					options.maintainAspectRatio,
				);

				// Set canvas dimensions
				canvas.width = dimensions.width;
				canvas.height = dimensions.height;

				// Configure canvas for better quality
				ctx.imageSmoothingEnabled = true;
				ctx.imageSmoothingQuality = "high";

				// Draw resized image
				ctx.drawImage(img, 0, 0, dimensions.width, dimensions.height);

				// Convert to blob
				canvas.toBlob(
					(blob) => {
						if (!blob) {
							reject(new Error("Failed to create resized image"));
							return;
						}

						const url = URL.createObjectURL(blob);
						const result: ResizeResult = {
							blob,
							url,
							width: dimensions.width,
							height: dimensions.height,
							size: blob.size,
						};

						resolve(result);
					},
					getMimeType(options.format),
					options.quality / 100,
				);
			} catch (error) {
				reject(error);
			}
		};

		img.onerror = () => {
			reject(new Error("Failed to load image"));
		};

		img.src = URL.createObjectURL(file);
	});
}

/**
 * Get MIME type for image format
 */
function getMimeType(format: string): string {
	switch (format) {
		case "png":
			return "image/png";
		case "webp":
			return "image/webp";
		default:
			return "image/jpeg";
	}
}

/**
 * Format file size for display
 */
export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

/**
 * Download a blob as a file
 */
export function downloadBlob(blob: Blob, filename: string): void {
	const url = URL.createObjectURL(blob);
	const a = document.createElement("a");
	a.href = url;
	a.download = filename;
	document.body.appendChild(a);
	a.click();
	document.body.removeChild(a);
	URL.revokeObjectURL(url);
}
