export type ConversionMode = "json-to-csv" | "csv-to-json";
export type ViewMode = "split" | "input" | "output";

export interface ConversionResult {
	isValid: boolean;
	data?: string;
	error?: string;
	lineNumber?: number;
	columnNumber?: number;
	conversionTime?: number;
}

export interface ConversionOptions {
	delimiter: string;
	quoteChar: string;
	escapeChar: string;
	includeHeaders: boolean;
	flattenObjects: boolean;
	maxDepth: number;
}

export interface ConversionStats {
	inputSize: number;
	outputSize: number;
	rows: number;
	columns: number;
	conversionTime: number;
}