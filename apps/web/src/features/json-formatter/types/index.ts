export interface JsonValidationResult {
	isValid: boolean;
	error?: string;
	lineNumber?: number;
	columnNumber?: number;
}

export interface JsonStats {
	size: number;
	keys: number;
	depth: number;
	arrays: number;
	objects: number;
	strings: number;
	numbers: number;
	booleans: number;
	nulls: number;
}

export type FormatMode = "beautify" | "minify";
export type ViewMode = "split" | "input" | "output";