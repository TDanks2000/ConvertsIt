export interface Base64ConversionResult {
	isValid: boolean;
	error?: string;
	output: string;
}

export interface Base64Stats {
	originalSize: number;
	encodedSize: number;
	compressionRatio: number;
	characters: number;
	lines: number;
}

export type ConversionMode = "encode" | "decode";

export type InputType = "text" | "file";

export interface Base64ConverterState {
	input: string;
	output: string;
	mode: ConversionMode;
	inputType: InputType;
	stats: Base64Stats;
	validation: Base64ConversionResult;
}

export interface FileInfo {
	name: string;
	size: number;
	type: string;
	lastModified: number;
}