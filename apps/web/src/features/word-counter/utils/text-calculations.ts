/**
 * Calculate word count from text
 */
export function calculateWordCount(text: string): number {
	return text.trim() === "" ? 0 : text.trim().split(/\s+/).length;
}

/**
 * Calculate character count (including spaces)
 */
export function calculateCharacterCount(text: string): number {
	return text.length;
}

/**
 * Calculate character count (excluding spaces)
 */
export function calculateCharacterCountNoSpaces(text: string): number {
	return text.replace(/\s/g, "").length;
}

/**
 * Calculate line count
 */
export function calculateLineCount(text: string): number {
	return text === "" ? 0 : text.split("\n").length;
}

/**
 * Calculate paragraph count
 */
export function calculateParagraphCount(text: string): number {
	return text.trim() === ""
		? 0
		: text
				.trim()
				.split(/\n\s*\n/)
				.filter((p) => p.trim() !== "").length;
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(
	wordCount: number,
	wordsPerMinute = 200,
): number {
	return Math.ceil(wordCount / wordsPerMinute) || 0;
}

/**
 * Find the longest line in text
 */
export function findLongestLineLength(text: string): number {
	return Math.max(...text.split("\n").map((line) => line.length), 0);
}

/**
 * Find the most common word length
 */
export function findMostCommonWordLength(text: string): string {
	if (text.trim() === "") return "0";

	const words = text.trim().split(/\s+/);
	const lengths = words.map((word) => word.replace(/[^a-zA-Z]/g, "").length);
	const lengthCounts = lengths.reduce(
		(acc, length) => {
			acc[length] = (acc[length] || 0) + 1;
			return acc;
		},
		{} as Record<number, number>,
	);

	const mostCommon = Object.entries(lengthCounts).reduce((a, b) =>
		lengthCounts[Number(a[0])] > lengthCounts[Number(b[0])] ? a : b,
	);

	return `${mostCommon[0]} characters`;
}

/**
 * Calculate average words per line
 */
export function calculateAverageWordsPerLine(
	wordCount: number,
	lineCount: number,
): number {
	return lineCount > 0 ? wordCount / lineCount : 0;
}

/**
 * Calculate average characters per word
 */
export function calculateAverageCharsPerWord(
	charCountNoSpaces: number,
	wordCount: number,
): number {
	return wordCount > 0 ? charCountNoSpaces / wordCount : 0;
}
