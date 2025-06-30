import type { JsonStats, JsonValidationResult } from "../types";

export function validateJson(jsonString: string): JsonValidationResult {
	if (!jsonString.trim()) {
		return { isValid: true };
	}

	try {
		JSON.parse(jsonString);
		return { isValid: true };
	} catch (error) {
		if (error instanceof SyntaxError) {
			const match = error.message.match(/at position (\d+)/);
			const position = match ? Number.parseInt(match[1], 10) : 0;
			const lines = jsonString.substring(0, position).split("\n");
			const lineNumber = lines.length;
			const columnNumber = lines[lines.length - 1].length + 1;

			return {
				isValid: false,
				error: error.message,
				lineNumber,
				columnNumber,
			};
		}

		return {
			isValid: false,
			error: "Invalid JSON format",
		};
	}
}

export function formatJson(jsonString: string, indent = 2): string {
	try {
		const parsed = JSON.parse(jsonString);
		return JSON.stringify(parsed, null, indent);
	} catch {
		return jsonString;
	}
}

export function minifyJson(jsonString: string): string {
	try {
		const parsed = JSON.parse(jsonString);
		return JSON.stringify(parsed);
	} catch {
		return jsonString;
	}
}

export function calculateJsonStats(jsonString: string): JsonStats {
	const defaultStats: JsonStats = {
		size: 0,
		keys: 0,
		depth: 0,
		arrays: 0,
		objects: 0,
		strings: 0,
		numbers: 0,
		booleans: 0,
		nulls: 0,
	};

	if (!jsonString.trim()) {
		return defaultStats;
	}

	try {
		const parsed = JSON.parse(jsonString);
		const stats = { ...defaultStats };
		stats.size = new Blob([jsonString]).size;

		function analyzeValue(value: unknown, currentDepth = 1): void {
			stats.depth = Math.max(stats.depth, currentDepth);

			if (value === null) {
				stats.nulls++;
			} else if (typeof value === "string") {
				stats.strings++;
			} else if (typeof value === "number") {
				stats.numbers++;
			} else if (typeof value === "boolean") {
				stats.booleans++;
			} else if (Array.isArray(value)) {
				stats.arrays++;
				value.forEach((item) => analyzeValue(item, currentDepth + 1));
			} else if (typeof value === "object") {
				stats.objects++;
				const keys = Object.keys(value);
				stats.keys += keys.length;
				keys.forEach((key) =>
					analyzeValue(
						(value as Record<string, unknown>)[key],
						currentDepth + 1,
					),
				);
			}
		}

		analyzeValue(parsed);
		return stats;
	} catch {
		return defaultStats;
	}
}

export function escapeJson(jsonString: string): string {
	return jsonString
		.replace(/\\/g, "\\\\")
		.replace(/"/g, '\\"')
		.replace(/\n/g, "\\n")
		.replace(/\r/g, "\\r")
		.replace(/\t/g, "\\t");
}

export function unescapeJson(jsonString: string): string {
	return jsonString
		.replace(/\\\\/g, "\\")
		.replace(/\\"/g, '"')
		.replace(/\\n/g, "\n")
		.replace(/\\r/g, "\r")
		.replace(/\\t/g, "\t");
}
