export type ConversionMode = "yaml-to-json" | "json-to-yaml";

export type ViewMode = "split" | "input" | "output";

export interface ConversionOptions {
	indent: number;
	quotingType: "single" | "double" | "minimal";
	lineWidth: number;
	noRefs: boolean;
	noCompatMode: boolean;
}

export interface ConversionResult {
	data: string | null;
	isValid: boolean;
	error?: string;
	processingTime?: number;
}

export interface ConversionStats {
	inputLines: number;
	outputLines: number;
	inputSize: number;
	outputSize: number;
	processingTime: number;
}