export type EncodingMode = "encode" | "decode";

export type EncodingType = "component" | "full";

export interface UrlValidationResult {
	isValid: boolean;
	error?: string;
	warning?: string;
}

export interface UrlStats {
	length: number;
	protocol?: string;
	hostname?: string;
	pathname?: string;
	search?: string;
	hash?: string;
	paramCount: number;
}

export type ViewMode = "split" | "input" | "output";
