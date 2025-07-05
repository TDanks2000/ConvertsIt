import { useCallback, useMemo, useState } from "react";
import type { DiffResult, TextDiffConfig, ViewMode } from "../types";
import { computeDiffStats, computeTextDiff } from "../utils/diff-processor";

interface UseTextDiffReturn {
	originalText: string;
	modifiedText: string;
	setOriginalText: (text: string) => void;
	setModifiedText: (text: string) => void;
	diffResult: DiffResult | null;
	config: TextDiffConfig;
	updateConfig: (newConfig: Partial<TextDiffConfig>) => void;
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	isLoading: boolean;
	error: string | null;
	resetTexts: () => void;
	swapTexts: () => void;
	stats: {
		additions: number;
		deletions: number;
		modifications: number;
		totalLines: number;
		originalLines: number;
		modifiedLines: number;
		originalWords: number;
		modifiedWords: number;
		originalChars: number;
		modifiedChars: number;
	};
}

const DEFAULT_ORIGINAL = `Welcome to the Text Diff Checker!

This is the original text.
You can edit this text to see how it differs from the modified version.

Features:
- Line-by-line comparison
- Word-level diffing
- Ignore whitespace option
- Case-insensitive comparison
- Multiple view modes`;

const DEFAULT_MODIFIED = `Welcome to the Text Diff Checker!

This is the modified text.
You can edit this text to see how it differs from the original version.

Features:
- Line-by-line comparison
- Word-level diffing
- Ignore whitespace option
- Case-insensitive comparison
- Multiple view modes
- Export diff results`;

export function useTextDiff(): UseTextDiffReturn {
	const [originalText, setOriginalText] = useState(DEFAULT_ORIGINAL);
	const [modifiedText, setModifiedText] = useState(DEFAULT_MODIFIED);
	const [config, setConfig] = useState<TextDiffConfig>({
		ignoreWhitespace: false,
		ignoreCase: false,
		showLineNumbers: true,
		wordLevel: false,
	});
	const [viewMode, setViewMode] = useState<ViewMode>("side-by-side");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Compute diff result
	const diffResult = useMemo(() => {
		if (!originalText && !modifiedText) return null;

		try {
			setIsLoading(true);
			setError(null);
			const result = computeTextDiff(originalText, modifiedText, config);
			return result;
		} catch (err) {
			setError(
				err instanceof Error
					? err.message
					: "An error occurred while computing diff",
			);
			return null;
		} finally {
			setIsLoading(false);
		}
	}, [originalText, modifiedText, config]);

	// Compute statistics
	const stats = useMemo(() => {
		const originalLines = originalText.split("\n").length;
		const modifiedLines = modifiedText.split("\n").length;
		const originalWords = originalText.trim()
			? originalText.trim().split(/\s+/).length
			: 0;
		const modifiedWords = modifiedText.trim()
			? modifiedText.trim().split(/\s+/).length
			: 0;
		const originalChars = originalText.length;
		const modifiedChars = modifiedText.length;

		const diffStats = diffResult
			? computeDiffStats(diffResult.diffs)
			: {
					additions: 0,
					deletions: 0,
					modifications: 0,
					totalLines: 0,
				};

		return {
			...diffStats,
			originalLines,
			modifiedLines,
			originalWords,
			modifiedWords,
			originalChars,
			modifiedChars,
		};
	}, [originalText, modifiedText, diffResult]);

	// Update configuration
	const updateConfig = useCallback((newConfig: Partial<TextDiffConfig>) => {
		setConfig((prev) => ({ ...prev, ...newConfig }));
	}, []);

	// Reset texts to default
	const resetTexts = useCallback(() => {
		setOriginalText(DEFAULT_ORIGINAL);
		setModifiedText(DEFAULT_MODIFIED);
	}, []);

	// Swap original and modified texts
	const swapTexts = useCallback(() => {
		const temp = originalText;
		setOriginalText(modifiedText);
		setModifiedText(temp);
	}, [originalText, modifiedText]);

	return {
		originalText,
		modifiedText,
		setOriginalText,
		setModifiedText,
		diffResult,
		config,
		updateConfig,
		viewMode,
		setViewMode,
		isLoading,
		error,
		resetTexts,
		swapTexts,
		stats,
	};
}
