"use client";

import { useCallback, useMemo, useState } from "react";
import type {
	FormatMode,
	FormattingOptions,
	SupportedLanguage,
	ViewMode,
} from "../types";
import {
	calculateCodeStats,
	defaultFormattingOptions,
	detectLanguage,
	formatCode,
	getSampleCode,
	minifyCode,
	validateCode,
} from "../utils/code-operations";

export function useCodeFormatter() {
	const [input, setInput] = useState("");
	const [language, setLanguage] = useState<SupportedLanguage>("javascript");
	const [formatMode, setFormatMode] = useState<FormatMode>("format");
	const [viewMode, setViewMode] = useState<ViewMode>("split");
	const [formattingOptions, setFormattingOptions] = useState<FormattingOptions>(
		defaultFormattingOptions,
	);

	// Validation
	const validation = useMemo(() => {
		return validateCode(input, language);
	}, [input, language]);

	// Statistics
	const stats = useMemo(() => {
		return calculateCodeStats(input, language);
	}, [input, language]);

	// Output
	const output = useMemo(() => {
		if (!input.trim()) {
			return "";
		}

		switch (formatMode) {
			case "format":
				return formatCode(input, language, formattingOptions);
			case "minify":
				return minifyCode(input, language);
			default:
				return input;
		}
	}, [input, language, formatMode, formattingOptions]);

	// Auto-detect language
	const handleAutoDetect = useCallback(() => {
		if (input.trim()) {
			const detectedLanguage = detectLanguage(input);
			setLanguage(detectedLanguage);
		}
	}, [input]);

	// Load sample code
	const handleLoadSample = useCallback(() => {
		const sample = getSampleCode(language);
		setInput(sample);
	}, [language]);

	// Clear input
	const handleClear = useCallback(() => {
		setInput("");
	}, []);

	// Format code
	const handleFormat = useCallback(() => {
		setFormatMode("format");
	}, []);

	// Minify code
	const handleMinify = useCallback(() => {
		setFormatMode("minify");
	}, []);

	// Reset to original
	const handleReset = useCallback(() => {
		setFormatMode("original");
	}, []);

	// Update formatting options
	const handleOptionsChange = useCallback(
		(newOptions: Partial<FormattingOptions>) => {
			setFormattingOptions((prev) => ({ ...prev, ...newOptions }));
		},
		[],
	);

	// Copy to clipboard
	const handleCopyInput = useCallback(async () => {
		if (input) {
			await navigator.clipboard.writeText(input);
		}
	}, [input]);

	const handleCopyOutput = useCallback(async () => {
		if (output) {
			await navigator.clipboard.writeText(output);
		}
	}, [output]);

	// Download files
	const handleDownloadInput = useCallback(() => {
		if (!input) return;

		const blob = new Blob([input], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `input-code.${getFileExtension(language)}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, [input, language]);

	const handleDownloadOutput = useCallback(() => {
		if (!output) return;

		const blob = new Blob([output], { type: "text/plain" });
		const url = URL.createObjectURL(blob);
		const a = document.createElement("a");
		a.href = url;
		a.download = `formatted-code.${getFileExtension(language)}`;
		document.body.appendChild(a);
		a.click();
		document.body.removeChild(a);
		URL.revokeObjectURL(url);
	}, [output, language]);

	return {
		// State
		input,
		setInput,
		output,
		language,
		setLanguage,
		formatMode,
		setFormatMode,
		viewMode,
		setViewMode,
		formattingOptions,
		validation,
		stats,

		// Actions
		handleAutoDetect,
		handleLoadSample,
		handleClear,
		handleFormat,
		handleMinify,
		handleReset,
		handleOptionsChange,
		handleCopyInput,
		handleCopyOutput,
		handleDownloadInput,
		handleDownloadOutput,
	};
}

// Helper function to get file extension
function getFileExtension(language: SupportedLanguage): string {
	const extensions: Record<SupportedLanguage, string> = {
		javascript: "js",
		typescript: "ts",
		python: "py",
		java: "java",
		cpp: "cpp",
		csharp: "cs",
		php: "php",
		ruby: "rb",
		go: "go",
		rust: "rs",
		html: "html",
		css: "css",
		scss: "scss",
		json: "json",
		xml: "xml",
		yaml: "yaml",
		sql: "sql",
		markdown: "md",
	};

	return extensions[language] || "txt";
}
