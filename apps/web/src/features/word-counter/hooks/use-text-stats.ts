import { useMemo } from "react";
import type { TextStats } from "../types";
import {
	calculateAverageCharsPerWord,
	calculateAverageWordsPerLine,
	calculateCharacterCount,
	calculateCharacterCountNoSpaces,
	calculateLineCount,
	calculateParagraphCount,
	calculateReadingTime,
	calculateWordCount,
	findLongestLineLength,
	findMostCommonWordLength,
} from "../utils/text-calculations";

export function useTextStats(text: string): TextStats {
	return useMemo(() => {
		const words = calculateWordCount(text);
		const characters = calculateCharacterCount(text);
		const charactersNoSpaces = calculateCharacterCountNoSpaces(text);
		const lines = calculateLineCount(text);
		const paragraphs = calculateParagraphCount(text);
		const averageWordsPerLine = calculateAverageWordsPerLine(words, lines);
		const averageCharsPerWord = calculateAverageCharsPerWord(
			charactersNoSpaces,
			words,
		);
		const longestLineLength = findLongestLineLength(text);
		const mostCommonWordLength = findMostCommonWordLength(text);
		const readingTimeMinutes = calculateReadingTime(words);

		return {
			words,
			characters,
			charactersNoSpaces,
			lines,
			paragraphs,
			averageWordsPerLine,
			averageCharsPerWord,
			longestLineLength,
			mostCommonWordLength,
			readingTimeMinutes,
		};
	}, [text]);
}
