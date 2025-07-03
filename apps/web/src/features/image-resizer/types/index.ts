export interface ResizeOptions {
	width: number;
	height: number;
	maintainAspectRatio: boolean;
	quality: number;
	format: "jpeg" | "png" | "webp";
}

export interface ImageData {
	file: File;
	url: string;
	width: number;
	height: number;
	size: number;
}

export interface ResizeResult {
	blob: Blob;
	url: string;
	width: number;
	height: number;
	size: number;
}

export type ImageFormat = "jpeg" | "png" | "webp";

export interface ImageDimensions {
	width: number;
	height: number;
}
