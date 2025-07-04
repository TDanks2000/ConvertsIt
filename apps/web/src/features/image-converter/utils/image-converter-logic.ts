import type { ConversionOptions, ConversionResult } from "../types";

export async function convertImage(
	file: File,
	options: ConversionOptions,
): Promise<ConversionResult> {
	try {
		if (options.format === "svg") {
			return new Promise((resolve) => {
				const img = new Image();
				img.onload = () => {
					const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="${options.width || img.width}" height="${options.height || img.height}" viewBox="0 0 ${img.width} ${img.height}"><image href="${img.src}" width="${img.width}" height="${img.height}"/></svg>`;
					const blob = new Blob([svgContent], { type: "image/svg+xml" });
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
				let { width, height } = img;

				if (options.width || options.height) {
					if (options.maintainAspectRatio) {
						const aspectRatio = width / height;

						if (options.width && options.height) {
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

				ctx?.drawImage(img, 0, 0, width, height);

				const mimeType = `image/${options.format}`;
				const quality =
					options.format === "jpeg" ||
					options.format === "webp" ||
					options.format === "avif"
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
