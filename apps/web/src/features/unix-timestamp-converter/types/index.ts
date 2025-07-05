export type ConversionMode = "timestamp-to-date" | "date-to-timestamp";
export type ViewMode = "split" | "input" | "output";
export type TimestampFormat = "seconds" | "milliseconds";
export type DateFormat = "iso" | "local" | "utc" | "custom";

export interface ConversionResult {
	isValid: boolean;
	data?: string;
	error?: string;
	conversionTime?: number;
}

export interface ConversionOptions {
	timestampFormat: TimestampFormat;
	dateFormat: DateFormat;
	customFormat?: string;
	timezone?: string;
}

export interface ConversionStats {
	inputSize: number;
	outputSize: number;
	conversionTime: number;
	timestamp?: number;
	date?: string;
	timezone?: string;
}

export interface TimestampInfo {
	timestamp: number;
	date: Date;
	isoString: string;
	localString: string;
	utcString: string;
	unixSeconds: number;
	unixMilliseconds: number;
	timezone: string;
	dayOfWeek: string;
	dayOfYear: number;
	weekOfYear: number;
	isLeapYear: boolean;
	relativeTime: string;
}
