import type { ImageFile } from "../types";

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
