import type { RegexFlags, RegexMatch, RegexTestResult } from "../types";

export function createRegexFromPattern(
	pattern: string,
	flags: RegexFlags,
): RegExp | null {
	try {
		const flagString =
			(flags.global ? "g" : "") +
			(flags.ignoreCase ? "i" : "") +
			(flags.multiline ? "m" : "") +
			(flags.dotAll ? "s" : "") +
			(flags.unicode ? "u" : "") +
			(flags.sticky ? "y" : "");
		return new RegExp(pattern, flagString);
	} catch {
		return null;
	}
}

export function testRegex(
	pattern: string,
	testString: string,
	flags: RegexFlags,
	maxMatches = 1000,
): RegexTestResult {
	const startTime = performance.now();

	try {
		const regex = createRegexFromPattern(pattern, flags);

		if (!regex) {
			throw new Error("Invalid regular expression");
		}

		const matches: RegexMatch[] = [];
		let matchCount = 0;
		let currentMatch: RegExpExecArray | null = null;

		regex.lastIndex = 0;

		currentMatch = regex.exec(testString);

		while (currentMatch !== null && matchCount < maxMatches) {
			matches.push({
				id: `match-${matchCount}`,
				match: currentMatch[0],
				index: currentMatch.index,
				length: currentMatch[0].length,
				groups: currentMatch.slice(1),
			});
			matchCount++;

			if (!flags.global) {
				break;
			}

			if (currentMatch[0].length === 0) {
				regex.lastIndex++;
			}

			currentMatch = regex.exec(testString);
		}

		return {
			isValid: true,
			matches,
			totalMatches: matchCount,
			executionTime: performance.now() - startTime,
		};
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Unknown error";
		return {
			isValid: false,
			matches: [],
			totalMatches: 0,
			error: errorMessage,
			executionTime: performance.now() - startTime,
		};
	}
}

export function escapeRegex(text: string): string {
	return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function getCommonRegexPatterns() {
	return [
		{
			name: "Email",
			pattern: "[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,}",
			description: "Matches email addresses",
		},
		{
			name: "URL",
			pattern: "https?:\\/\\/[^\\s]+",
			description: "Matches HTTP/HTTPS URLs",
		},
		{
			name: "Phone (US)",
			pattern: "\\(?\\d{3}\\)?[-.\\s]?\\d{3}[-.\\s]?\\d{4}",
			description: "Matches US phone numbers",
		},
		{
			name: "Date (YYYY-MM-DD)",
			pattern: "\\d{4}-\\d{2}-\\d{2}",
			description: "Matches dates in YYYY-MM-DD format",
		},
		{
			name: "IP Address",
			pattern:
				"\\b(?:(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\.){3}(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\\b",
			description: "Matches IPv4 addresses",
		},
		{
			name: "Hex Color",
			pattern: "#[a-fA-F0-9]{6}|#[a-fA-F0-9]{3}",
			description: "Matches hex color codes",
		},
	];
}
