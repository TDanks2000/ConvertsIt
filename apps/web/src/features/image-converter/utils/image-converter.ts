import type { ConversionOptions, ConversionResult, ImageFile } from "../types";

export namespace ImageConverter {
	export async function convertImage(
		file: File,
		options: ConversionOptions,
	): Promise<ConversionResult> {
		try {
			// Handle SVG output format specially
			if (options.format === "svg") {
				// For SVG output, we need to create an SVG wrapper
				return new Promise((resolve) => {
					const img = new Image();
					img.onload = () => {
						const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width || img.width}" height="${options.height || img.height}" viewBox="0 0 ${img.width} ${img.height}"><image href="${img.src}" width="${img.width}" height="${img.height}"/></svg>`;
						const blob = new Blob([svgContent], { type: 'image/svg+xml' });
						const url = URL.createObjectURL(blob);
						resolve({
							success: true,
							url,
							size: blob.size,
						});
					};
					img.onerror = () => {
						resolve({
							success: false,
							error: "Failed to load image for SVG conversion",
						});
					};
					img.src = URL.createObjectURL(file);
				});
			}

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
						(options.format === "jpeg" || options.format === "webp" || options.format === "avif") 
							? options.quality / 100 
							: undefined;

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
			"image/tiff",
			"image/tif",
			"image/avif",
			"image/x-icon",
			"image/vnd.microsoft.icon",
			"image/ico",
			"image/icon",
			"image/svg+xml",
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
