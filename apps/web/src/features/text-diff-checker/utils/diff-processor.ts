import type {
	DiffChange,
	DiffResult,
	DiffStats,
	TextDiffConfig,
} from "../types";

/**
 * Simple diff algorithm implementation
 */
export class DiffProcessor {
	private config: TextDiffConfig;

	constructor(config: TextDiffConfig = {}) {
		this.config = {
			ignoreWhitespace: false,
			ignoreCase: false,
			showLineNumbers: true,
			wordLevel: false,
			...config,
		};
	}

	/**
	 * Process text diff between original and modified text
	 */
	processDiff(original: string, modified: string): DiffResult {
		const originalLines = this.preprocessText(original).split("\n");
		const modifiedLines = this.preprocessText(modified).split("\n");

		const diffs = this.config.wordLevel
			? this.computeWordDiff(original, modified)
			: this.computeLineDiff(originalLines, modifiedLines);

		return {
			original,
			modified,
			diffs,
		};
	}

	/**
	 * Preprocess text based on configuration
	 */
	private preprocessText(text: string): string {
		let processed = text;

		if (this.config.ignoreCase) {
			processed = processed.toLowerCase();
		}

		if (this.config.ignoreWhitespace) {
			processed = processed.replace(/\s+/g, " ").trim();
		}

		return processed;
	}

	/**
	 * Compute line-based diff
	 */
	private computeLineDiff(
		originalLines: string[],
		modifiedLines: string[],
	): DiffChange[] {
		const diffs: DiffChange[] = [];
		const lcs = this.longestCommonSubsequence(originalLines, modifiedLines);

		let i = 0;
		let j = 0;
		let lineNumber = 1;

		while (i < originalLines.length || j < modifiedLines.length) {
			if (i < originalLines.length && j < modifiedLines.length) {
				if (originalLines[i] === modifiedLines[j]) {
					diffs.push({
						type: "unchanged",
						value: originalLines[i],
						lineNumber: lineNumber++,
					});
					i++;
					j++;
				} else if (!lcs.includes(originalLines[i])) {
					diffs.push({
						type: "removed",
						value: originalLines[i],
						lineNumber: lineNumber++,
					});
					i++;
				} else {
					diffs.push({
						type: "added",
						value: modifiedLines[j],
						lineNumber: lineNumber++,
					});
					j++;
				}
			} else if (i < originalLines.length) {
				diffs.push({
					type: "removed",
					value: originalLines[i],
					lineNumber: lineNumber++,
				});
				i++;
			} else {
				diffs.push({
					type: "added",
					value: modifiedLines[j],
					lineNumber: lineNumber++,
				});
				j++;
			}
		}

		return diffs;
	}

	/**
	 * Compute word-based diff
	 */
	private computeWordDiff(original: string, modified: string): DiffChange[] {
		const originalWords = this.preprocessText(original).split(/\s+/);
		const modifiedWords = this.preprocessText(modified).split(/\s+/);

		const diffs: DiffChange[] = [];
		const lcs = this.longestCommonSubsequence(originalWords, modifiedWords);

		let i = 0;
		let j = 0;

		while (i < originalWords.length || j < modifiedWords.length) {
			if (i < originalWords.length && j < modifiedWords.length) {
				if (originalWords[i] === modifiedWords[j]) {
					diffs.push({
						type: "unchanged",
						value: `${originalWords[i]} `,
					});
					i++;
					j++;
				} else if (!lcs.includes(originalWords[i])) {
					diffs.push({
						type: "removed",
						value: `${originalWords[i]} `,
					});
					i++;
				} else {
					diffs.push({
						type: "added",
						value: `${modifiedWords[j]} `,
					});
					j++;
				}
			} else if (i < originalWords.length) {
				diffs.push({
					type: "removed",
					value: `${originalWords[i]} `,
				});
				i++;
			} else {
				diffs.push({
					type: "added",
					value: `${modifiedWords[j]} `,
				});
				j++;
			}
		}

		return diffs;
	}

	/**
	 * Longest Common Subsequence algorithm
	 */
	private longestCommonSubsequence(arr1: string[], arr2: string[]): string[] {
		const m = arr1.length;
		const n = arr2.length;
		const dp: number[][] = Array(m + 1)
			.fill(null)
			.map(() => Array(n + 1).fill(0));

		for (let i = 1; i <= m; i++) {
			for (let j = 1; j <= n; j++) {
				if (arr1[i - 1] === arr2[j - 1]) {
					dp[i][j] = dp[i - 1][j - 1] + 1;
				} else {
					dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
				}
			}
		}

		// Reconstruct LCS
		const lcs: string[] = [];
		let i = m;
		let j = n;

		while (i > 0 && j > 0) {
			if (arr1[i - 1] === arr2[j - 1]) {
				lcs.unshift(arr1[i - 1]);
				i--;
				j--;
			} else if (dp[i - 1][j] > dp[i][j - 1]) {
				i--;
			} else {
				j--;
			}
		}

		return lcs;
	}

	/**
	 * Calculate diff statistics
	 */
	computeStats(diffs: DiffChange[]): DiffStats {
		const stats: DiffStats = {
			additions: 0,
			deletions: 0,
			modifications: 0,
			totalLines: diffs.length,
		};

		for (const diff of diffs) {
			switch (diff.type) {
				case "added":
					stats.additions++;
					break;
				case "removed":
					stats.deletions++;
					break;
				default:
					break;
			}
		}

		stats.modifications = stats.additions + stats.deletions;

		return stats;
	}
}

/**
 * Export utility functions
 */
export const createDiffProcessor = (config?: TextDiffConfig) =>
	new DiffProcessor(config);

export const computeTextDiff = (
	original: string,
	modified: string,
	config?: TextDiffConfig,
): DiffResult => {
	const processor = new DiffProcessor(config);
	return processor.processDiff(original, modified);
};

export const computeDiffStats = (diffs: DiffChange[]): DiffStats => {
	const processor = new DiffProcessor();
	return processor.computeStats(diffs);
};
