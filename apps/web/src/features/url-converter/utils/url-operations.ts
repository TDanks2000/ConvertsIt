import type { UrlStats, UrlValidationResult } from "../types";

export function encodeUrl(input: string, type: "component" | "full"): string {
	if (!input.trim()) return "";

	try {
		if (type === "component") {
			return encodeURIComponent(input);
		}
		return encodeURI(input);
	} catch (error) {
		return input;
	}
}

export function decodeUrl(input: string, type: "component" | "full"): string {
	if (!input.trim()) return "";

	try {
		if (type === "component") {
			return decodeURIComponent(input);
		}
		return decodeURI(input);
	} catch (error) {
		return input;
	}
}

export function validateUrl(
	input: string,
	mode: "encode" | "decode",
): UrlValidationResult {
	if (!input.trim()) {
		return { isValid: true };
	}

	try {
		if (mode === "decode") {
			// Try to decode to check if it's valid encoded URL
			decodeURIComponent(input);
			return { isValid: true };
		}
		// For encoding, check if it looks like a URL or contains special characters
		if (input.includes("://")) {
			try {
				new URL(input);
				return { isValid: true };
			} catch {
				return {
					isValid: false,
					error: "Invalid URL format",
				};
			}
		}
		return { isValid: true };
	} catch (error) {
		return {
			isValid: false,
			error: mode === "decode" ? "Invalid encoded URL" : "Invalid input",
		};
	}
}

export function calculateUrlStats(input: string): UrlStats {
	if (!input.trim()) {
		return {
			length: 0,
			paramCount: 0,
		};
	}

	const stats: UrlStats = {
		length: input.length,
		paramCount: 0,
	};

	try {
		// Try to parse as URL
		if (input.includes("://")) {
			const url = new URL(input);
			stats.protocol = url.protocol;
			stats.hostname = url.hostname;
			stats.pathname = url.pathname;
			stats.search = url.search;
			stats.hash = url.hash;
			stats.paramCount = url.searchParams.size;
		} else {
			// Count query parameters in string
			const paramMatches = input.match(/[?&]([^=&]+)=/g);
			stats.paramCount = paramMatches ? paramMatches.length : 0;
		}
	} catch {
		// If URL parsing fails, try to count parameters manually
		const paramMatches = input.match(/[?&]([^=&]+)=/g);
		stats.paramCount = paramMatches ? paramMatches.length : 0;
	}

	return stats;
}

export function getSampleUrls() {
	return {
		encode: {
			component: "Hello World! How are you?",
			full: "https://example.com/search?q=hello world&category=test",
		},
		decode: {
			component: "Hello%20World!%20How%20are%20you%3F",
			full: "https://example.com/search?q=hello%20world&category=test",
		},
	};
}
