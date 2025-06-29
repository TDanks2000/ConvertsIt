import type { ConversionOptions, ConversionResult, ImageFile } from "../types";

export namespace ImageConverter {
	export async function convertImage(
		file: File,
		options: ConversionOptions,
	): Promise<ConversionResult> {
		try {
			return new Promise((resolve) => {
				const canvas = document.createElement("canvas");
				const ctx = canvas.getContext("2d");
				const img = new Image();

				img.onload = () => {
					// Calculate dimensions
					let { width, height } = img;

					if (options.width || options.height) {
						if (options.maintainAspectRatio) {
							const aspectRatio = width / height;

							if (options.width && options.height) {
								// Use the smaller scaling factor to maintain aspect ratio
								const scaleX = options.width / width;
								const scaleY = options.height / height;
								const scale = Math.min(scaleX, scaleY);
								width = width * scale;
								height = height * scale;
							} else if (options.width) {
								height = options.width / aspectRatio;
								width = options.width;
							} else if (options.height) {
								width = options.height * aspectRatio;
								height = options.height;
							}
						} else {
							width = options.width || width;
							height = options.height || height;
						}
					}

					canvas.width = width;
					canvas.height = height;

					// Draw image on canvas
					ctx?.drawImage(img, 0, 0, width, height);

					// Convert to desired format
					const mimeType = `image/${options.format}`;
					const quality =
						options.format === "jpeg" ? options.quality / 100 : undefined;

					canvas.toBlob(
						(blob) => {
							if (blob) {
								const url = URL.createObjectURL(blob);
								resolve({
									success: true,
									url,
									size: blob.size,
								});
							} else {
								resolve({
									success: false,
									error: "Failed to convert image",
								});
							}
						},
						mimeType,
						quality,
					);
				};

				img.onerror = () => {
					resolve({
						success: false,
						error: "Failed to load image",
					});
				};

				img.src = URL.createObjectURL(file);
			});
		} catch (error) {
			return {
				success: false,
				error: error instanceof Error ? error.message : "Unknown error",
			};
		}
	}

	export function formatFileSize(bytes: number): string {
		if (bytes === 0) return "0 Bytes";

		const k = 1024;
		const sizes = ["Bytes", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));

		return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
	}

	export function generateId(): string {
		return Math.random().toString(36).substring(2) + Date.now().toString(36);
	}

	export function isValidImageType(file: File): boolean {
		const validTypes = [
			"image/jpeg",
			"image/jpg",
			"image/png",
			"image/gif",
			"image/webp",
			"image/bmp",
		];
		return validTypes.includes(file.type);
	}

	export function createImageFile(file: File): ImageFile {
		return {
			file,
			id: generateId(),
			name: file.name,
			size: file.size,
			type: file.type,
			preview: URL.createObjectURL(file),
			status: "pending",
			progress: 0,
		};
	}

	export function downloadImage(url: string, filename: string): void {
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);
	}

	export function downloadAllAsZip(images: ImageFile[]): void {
		// This would require a zip library like JSZip
		// For now, we'll download them individually
		images.forEach((image, index) => {
			if (image.convertedUrl) {
				setTimeout(() => {
					if (!image?.convertedUrl) return;
					downloadImage(image.convertedUrl, image.name);
				}, index * 100); // Stagger downloads
			}
		});
	}
}
