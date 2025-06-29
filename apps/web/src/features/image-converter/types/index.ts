export interface ImageFile {
	file: File;
	id: string;
	name: string;
	size: number;
	type: string;
	preview: string;
	status: "pending" | "converting" | "completed" | "error";
	progress: number;
	convertedUrl?: string;
	convertedSize?: number;
	error?: string;
}

export interface ConversionOptions {
	format: "jpeg" | "png" | "webp" | "gif" | "bmp";
	quality: number;
	width?: number;
	height?: number;
	maintainAspectRatio: boolean;
}

export interface ConversionResult {
	success: boolean;
	url?: string;
	error?: string;
	size?: number;
}

export interface ImageStats {
	totalFiles: number;
	completedFiles: number;
	totalSize: number;
	convertedSize: number;
	compressionRatio: number;
}
