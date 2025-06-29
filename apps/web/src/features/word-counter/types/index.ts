export interface TextStats {
	words: number;
	characters: number;
	charactersNoSpaces: number;
	lines: number;
	paragraphs: number;
	averageWordsPerLine: number;
	averageCharsPerWord: number;
	longestLineLength: number;
	mostCommonWordLength: string;
	readingTimeMinutes: number;
}

export interface WordCounterConfig {
	wordsPerMinute: number;
	defaultPlaceholder: string;
}
