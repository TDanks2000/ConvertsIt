import type {
	ConversionOptions,
	ConversionResult,
	ConversionStats,
	TimestampInfo,
} from "../types";

const DEFAULT_OPTIONS: ConversionOptions = {
	timestampFormat: "seconds",
	dateFormat: "iso",
	timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
};

export function timestampToDate(
	timestampString: string,
	options: Partial<ConversionOptions> = {},
): ConversionResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const startTime = performance.now();

	try {
		const trimmed = timestampString.trim();
		if (!trimmed) {
			return { isValid: true, data: "" };
		}

		// Parse timestamp
		const parsed = Number.parseFloat(trimmed);
		if (Number.isNaN(parsed)) {
			return {
				isValid: false,
				error: "Invalid timestamp format. Please enter a valid number.",
			};
		}

		// Convert to milliseconds if needed
		let timestampMs: number;
		if (opts.timestampFormat === "seconds") {
			timestampMs = parsed * 1000;
		} else {
			timestampMs = parsed;
		}

		// Validate timestamp range (reasonable bounds)
		if (timestampMs < 0 || timestampMs > 253402300799999) {
			return {
				isValid: false,
				error: "Timestamp out of valid range (1970-9999).",
			};
		}

		const date = new Date(timestampMs);
		if (Number.isNaN(date.getTime())) {
			return {
				isValid: false,
				error: "Invalid timestamp. Could not convert to date.",
			};
		}

		let result: string;
		switch (opts.dateFormat) {
			case "iso":
				result = date.toISOString();
				break;
			case "local":
				result = date.toLocaleString();
				break;
			case "utc":
				result = date.toUTCString();
				break;
			case "custom":
				if (opts.customFormat) {
					result = formatDateCustom(date, opts.customFormat);
				} else {
					result = date.toISOString();
				}
				break;
			default:
				result = date.toISOString();
		}

		const endTime = performance.now();
		return {
			isValid: true,
			data: result,
			conversionTime: endTime - startTime,
		};
	} catch (error) {
		return {
			isValid: false,
			error: `Conversion error: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
}

export function dateToTimestamp(
	dateString: string,
	options: Partial<ConversionOptions> = {},
): ConversionResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };
	const startTime = performance.now();

	try {
		const trimmed = dateString.trim();
		if (!trimmed) {
			return { isValid: true, data: "" };
		}

		// Try to parse the date
		const date = new Date(trimmed);
		if (Number.isNaN(date.getTime())) {
			return {
				isValid: false,
				error: "Invalid date format. Please enter a valid date string.",
			};
		}

		const timestampMs = date.getTime();
		let result: string;

		if (opts.timestampFormat === "seconds") {
			result = Math.floor(timestampMs / 1000).toString();
		} else {
			result = timestampMs.toString();
		}

		const endTime = performance.now();
		return {
			isValid: true,
			data: result,
			conversionTime: endTime - startTime,
		};
	} catch (error) {
		return {
			isValid: false,
			error: `Conversion error: ${error instanceof Error ? error.message : "Unknown error"}`,
		};
	}
}

export function getTimestampInfo(timestamp: number): TimestampInfo {
	const date = new Date(timestamp);
	const now = new Date();
	const diffMs = now.getTime() - timestamp;

	return {
		timestamp,
		date,
		isoString: date.toISOString(),
		localString: date.toLocaleString(),
		utcString: date.toUTCString(),
		unixSeconds: Math.floor(timestamp / 1000),
		unixMilliseconds: timestamp,
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
		dayOfWeek: date.toLocaleDateString("en-US", { weekday: "long" }),
		dayOfYear: getDayOfYear(date),
		weekOfYear: getWeekOfYear(date),
		isLeapYear: isLeapYear(date.getFullYear()),
		relativeTime: getRelativeTime(diffMs),
	};
}

export function calculateConversionStats(
	input: string,
	output: string,
	conversionTime: number,
): ConversionStats {
	return {
		inputSize: new Blob([input]).size,
		outputSize: new Blob([output]).size,
		conversionTime,
	};
}

function formatDateCustom(date: Date, format: string): string {
	// Simple custom format implementation
	const replacements: Record<string, string> = {
		YYYY: date.getFullYear().toString(),
		MM: (date.getMonth() + 1).toString().padStart(2, "0"),
		DD: date.getDate().toString().padStart(2, "0"),
		HH: date.getHours().toString().padStart(2, "0"),
		mm: date.getMinutes().toString().padStart(2, "0"),
		ss: date.getSeconds().toString().padStart(2, "0"),
	};

	let result = format;
	for (const [pattern, replacement] of Object.entries(replacements)) {
		result = result.replace(new RegExp(pattern, "g"), replacement);
	}
	return result;
}

function getDayOfYear(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 0);
	const diff = date.getTime() - start.getTime();
	return Math.floor(diff / (1000 * 60 * 60 * 24));
}

function getWeekOfYear(date: Date): number {
	const start = new Date(date.getFullYear(), 0, 1);
	const days = Math.floor(
		(date.getTime() - start.getTime()) / (24 * 60 * 60 * 1000),
	);
	return Math.ceil((days + start.getDay() + 1) / 7);
}

function isLeapYear(year: number): boolean {
	return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function getRelativeTime(diffMs: number): string {
	const absDiff = Math.abs(diffMs);
	const seconds = Math.floor(absDiff / 1000);
	const minutes = Math.floor(seconds / 60);
	const hours = Math.floor(minutes / 60);
	const days = Math.floor(hours / 24);
	const months = Math.floor(days / 30);
	const years = Math.floor(days / 365);

	const future = diffMs < 0;
	const suffix = future ? "from now" : "ago";

	if (years > 0) return `${years} year${years > 1 ? "s" : ""} ${suffix}`;
	if (months > 0) return `${months} month${months > 1 ? "s" : ""} ${suffix}`;
	if (days > 0) return `${days} day${days > 1 ? "s" : ""} ${suffix}`;
	if (hours > 0) return `${hours} hour${hours > 1 ? "s" : ""} ${suffix}`;
	if (minutes > 0)
		return `${minutes} minute${minutes > 1 ? "s" : ""} ${suffix}`;
	if (seconds > 0)
		return `${seconds} second${seconds > 1 ? "s" : ""} ${suffix}`;
	return "just now";
}
