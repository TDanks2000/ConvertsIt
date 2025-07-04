import type { RegexFlags, RegexMatch, RegexTestResult } from "../types";

export function createRegexFromPattern(
	pattern: string,
	flags: RegexFlags,
): RegExp | null {
	try {
		const flagString = Object.entries(flags)
			.filter(([, enabled]) => enabled)
			.map(([flag]) => {
				switch (flag) {
					case "global":
						return "g";
					case "ignoreCase":
						return "i";
					case "multiline":
						return "m";
					case "dotAll":
						return "s";
					case "unicode":
						return "u";
					case "sticky":
						return "y";
					default:
						return "";
				}
			})
			.join("");

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
			return {
				isValid: false,
				matches: [],
				totalMatches: 0,
				error: "Invalid regular expression",
				executionTime: performance.now() - startTime,
			};
		}

		const matches: RegexMatch[] = [];
		let match: RegExpExecArray | null;
		let matchCount = 0;

		if (flags.global) {
			match = regex.exec(testString);
			while (match !== null && matchCount < maxMatches) {
				matches.push({
					id: `match-${matchCount}`,
					match: match[0],
					index: match.index,
					length: match[0].length,
					groups: match.slice(1),
				});
				matchCount++;

				// Prevent infinite loops
				if (match[0].length === 0) {
					regex.lastIndex++;
				}
				match = regex.exec(testString);
			}
		} else {
			match = regex.exec(testString);
			if (match) {
				matches.push({
					id: "match-0",
					match: match[0],
					index: match.index,
					length: match[0].length,
					groups: match.slice(1),
				});
				matchCount = 1;
			}
		}

		return {
			isValid: true,
			matches,
			totalMatches: matchCount,
			executionTime: performance.now() - startTime,
		};
	} catch (error) {
		return {
			isValid: false,
			matches: [],
			totalMatches: 0,
			error: error instanceof Error ? error.message : "Unknown error",
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