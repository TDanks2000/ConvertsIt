import { blobUrlToZipFile, downloadAsZip } from "@/utils/zip";
import type { ImageFile } from "../types";
import { downloadImage } from "./image-utilities";

export async function downloadAllAsZip(
	images: ImageFile[],
	format: string,
): Promise<void> {
	try {
		const zipFiles = await Promise.all(
			images
				.filter((image) => image.convertedUrl)
				.map(async (image) => {
					if (!image.convertedUrl) throw new Error("No converted URL");

					const extension = format === "jpeg" ? "jpg" : format;
					const baseName = image.name.replace(/\.[^/.]+$/, "");
					const filename = `${baseName}.${extension}`;

					return await blobUrlToZipFile(image.convertedUrl, filename);
				}),
		);

		await downloadAsZip(zipFiles, "converted-images.zip", {
			compressionLevel: 6,
		});
	} catch (error) {
		console.error(
			"Failed to create ZIP, falling back to individual downloads:",
			error,
		);
		images.forEach((image, index) => {
			if (image.convertedUrl) {
				setTimeout(() => {
					if (!image?.convertedUrl) return;
					const extension = format === "jpeg" ? "jpg" : format;
					const baseName = image.name.replace(/\.[^/.]+$/, "");
					const filename = `${baseName}.${extension}`;
					downloadImage(image.convertedUrl, filename);
				}, index * 100);
			}
		});
	}
}
