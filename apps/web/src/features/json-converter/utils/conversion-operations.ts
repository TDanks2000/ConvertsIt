import type {
	ConversionOptions,
	ConversionResult,
	ConversionStats,
} from "../types";

const DEFAULT_OPTIONS: ConversionOptions = {
	delimiter: ",",
	quoteChar: '"',
	escapeChar: '"',
	includeHeaders: true,
	flattenObjects: true,
	maxDepth: 3,
};

export function jsonToCsv(
	jsonString: string,
	options: Partial<ConversionOptions> = {},
): ConversionResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	try {
		const data = JSON.parse(jsonString);

		if (!Array.isArray(data)) {
			return {
				isValid: false,
				error: "JSON must be an array of objects for CSV conversion",
			};
		}

		if (data.length === 0) {
			return {
				isValid: true,
				data: "",
			};
		}

		// Flatten objects if needed
		const flattenedData = opts.flattenObjects
			? data.map((item) => flattenObject(item, opts.maxDepth))
			: data;

		// Get all unique keys
		const allKeys = new Set<string>();
		flattenedData.forEach((item) => {
			if (typeof item === "object" && item !== null) {
				Object.keys(item).forEach((key) => allKeys.add(key));
			}
		});

		const headers = Array.from(allKeys);
		let csvContent = "";

		// Add headers
		if (opts.includeHeaders) {
			csvContent += `${headers
				.map((header) => escapeValue(header, opts))
				.join(opts.delimiter)}\n`;
		}

		// Add data rows
		flattenedData.forEach((item) => {
			const row = headers.map((header) => {
				const value =
					item && typeof item === "object"
						? (item as Record<string, unknown>)[header]
						: "";
				return escapeValue(String(value ?? ""), opts);
			});
			csvContent += `${row.join(opts.delimiter)}\n`;
		});

		return {
			isValid: true,
			data: csvContent.trim(),
		};
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

export function csvToJson(
	csvString: string,
	options: Partial<ConversionOptions> = {},
): ConversionResult {
	const opts = { ...DEFAULT_OPTIONS, ...options };

	try {
		if (!csvString.trim()) {
			return {
				isValid: true,
				data: "[]",
			};
		}

		const lines = csvString.split("\n").filter((line) => line.trim());

		if (lines.length === 0) {
			return {
				isValid: true,
				data: "[]",
			};
		}

		let headers: string[];
		let dataLines: string[];

		if (opts.includeHeaders) {
			headers = parseCsvLine(lines[0], opts);
			dataLines = lines.slice(1);
		} else {
			// Generate generic headers
			const firstLine = parseCsvLine(lines[0], opts);
			headers = firstLine.map((_, index) => `column_${index + 1}`);
			dataLines = lines;
		}

		const result = dataLines.map((line) => {
			const values = parseCsvLine(line, opts);
			const obj: Record<string, unknown> = {};

			headers.forEach((header, index) => {
				const value = values[index] || "";
				obj[header] = parseValue(value);
			});

			return obj;
		});

		return {
			isValid: true,
			data: JSON.stringify(result, null, 2),
		};
	} catch (error) {
		return {
			isValid: false,
			error: error instanceof Error ? error.message : "Failed to parse CSV",
		};
	}
}

export function calculateConversionStats(
	input: string,
	output: string,
	conversionTime: number,
): ConversionStats {
	const inputSize = new Blob([input]).size;
	const outputSize = new Blob([output]).size;

	// Count rows and columns
	let rows = 0;
	let columns = 0;

	if (output.trim()) {
		try {
			// Try to parse as JSON first
			const jsonData = JSON.parse(output);
			if (Array.isArray(jsonData)) {
				rows = jsonData.length;
				columns =
					jsonData.length > 0 ? Object.keys(jsonData[0] || {}).length : 0;
			}
		} catch {
			// Parse as CSV
			const lines = output.split("\n").filter((line) => line.trim());
			rows = lines.length;
			if (lines.length > 0) {
				columns = lines[0].split(",").length;
			}
		}
	}

	return {
		inputSize,
		outputSize,
		rows,
		columns,
		conversionTime,
	};
}

// Helper functions
function flattenObject(
	obj: unknown,
	maxDepth: number,
	currentDepth = 0,
): Record<string, unknown> {
	if (currentDepth >= maxDepth || typeof obj !== "object" || obj === null) {
		return { value: obj };
	}

	const flattened: Record<string, unknown> = {};

	for (const [key, value] of Object.entries(obj)) {
		if (typeof value === "object" && value !== null && !Array.isArray(value)) {
			const nested = flattenObject(value, maxDepth, currentDepth + 1);
			for (const [nestedKey, nestedValue] of Object.entries(nested)) {
				flattened[`${key}.${nestedKey}`] = nestedValue;
			}
		} else {
			flattened[key] = value;
		}
	}

	return flattened;
}

function escapeValue(value: string, options: ConversionOptions): string {
	if (
		value.includes(options.delimiter) ||
		value.includes(options.quoteChar) ||
		value.includes("\n")
	) {
		const escaped = value.replace(
			new RegExp(options.quoteChar, "g"),
			options.escapeChar + options.quoteChar,
		);
		return options.quoteChar + escaped + options.quoteChar;
	}
	return value;
}

function parseCsvLine(line: string, options: ConversionOptions): string[] {
	const result: string[] = [];
	let current = "";
	let inQuotes = false;
	let i = 0;

	while (i < line.length) {
		const char = line[i];
		const nextChar = line[i + 1];

		if (char === options.quoteChar) {
			if (inQuotes && nextChar === options.quoteChar) {
				// Escaped quote
				current += options.quoteChar;
				i += 2;
			} else {
				// Toggle quote state
				inQuotes = !inQuotes;
				i++;
			}
		} else if (char === options.delimiter && !inQuotes) {
			result.push(current);
			current = "";
			i++;
		} else {
			current += char;
			i++;
		}
	}

	result.push(current);
	return result;
}

function parseValue(value: string): unknown {
	if (value === "") return "";
	if (value === "null") return null;
	if (value === "true") return true;
	if (value === "false") return false;

	// Try to parse as number
	const num = Number(value);
	if (!Number.isNaN(num) && Number.isFinite(num)) {
		return num;
	}

	return value;
}
