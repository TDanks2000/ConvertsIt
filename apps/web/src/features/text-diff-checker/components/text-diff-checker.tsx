"use client";

import { GitCompare, Type } from "lucide-react";
import { useMemo } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useTextDiff } from "../hooks/use-text-diff";
import { DiffViewer } from "./diff-viewer";
import { TextEditor } from "./text-editor";
import { Toolbar } from "./toolbar";

export function TextDiffChecker() {
	const {
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
	} = useTextDiff();

	// Memoize text statistics for editors
	const originalStats = useMemo(() => {
		const lines = originalText.split('\n').length;
		const words = originalText.trim() ? originalText.trim().split(/\s+/).length : 0;
		const chars = originalText.length;
		return { lines, words, chars };
	}, [originalText]);

	const modifiedStats = useMemo(() => {
		const lines = modifiedText.split('\n').length;
		const words = modifiedText.trim() ? modifiedText.trim().split(/\s+/).length : 0;
		const chars = modifiedText.length;
		return { lines, words, chars };
	}, [modifiedText]);

	// Check if there's content to work with
	const hasContent = useMemo(() => {
		return originalText.trim().length > 0 || modifiedText.trim().length > 0;
	}, [originalText, modifiedText]);

	// Handle reset with toast notification
	const handleReset = () => {
		resetTexts();
		toast.info("Text reset to default examples");
	};

	// Handle swap with toast notification
	const handleSwap = () => {
		swapTexts();
		toast.success("Original and modified text swapped");
	};

	// Determine layout based on view mode with improved responsive design
	const getLayoutClasses = () => {
		if (viewMode === 'unified' || viewMode === 'split') {
			return "flex flex-col gap-4 lg:gap-6";
		}
		return "flex flex-col gap-4 lg:gap-6";
	};

	// Get editor container classes for better responsive layout
	const getEditorContainerClasses = () => {
		if (viewMode === 'side-by-side') {
			return "grid grid-cols-1 gap-4 lg:grid-cols-2 lg:gap-6";
		}
		return "grid grid-cols-1 gap-4 md:grid-cols-2 lg:gap-6";
	};

	return (
		<div className="container mx-auto max-w-7xl space-y-4 p-4 lg:space-y-6 lg:p-6">
			<PageHeader
				title="Text Diff Checker"
				description="Compare two texts and visualize differences with multiple view modes and advanced options"
				icons={[GitCompare, Type]}
			/>

			<Toolbar
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				config={config}
				onConfigChange={updateConfig}
				diffResult={diffResult}
				stats={stats}
				onReset={handleReset}
				onSwap={handleSwap}
				isLoading={isLoading}
				hasContent={hasContent}
			/>

			{/* Main Content Layout */}
			<div className={getLayoutClasses()}>
				{/* Text Editors */}
				<div className={getEditorContainerClasses()}>
					<TextEditor
						title="Original Text"
						value={originalText}
						onChange={setOriginalText}
						placeholder="Enter your original text here..."
						wordCount={originalStats.words}
						lineCount={originalStats.lines}
						charCount={originalStats.chars}
					/>
					<TextEditor
						title="Modified Text"
						value={modifiedText}
						onChange={setModifiedText}
						placeholder="Enter your modified text here..."
						wordCount={modifiedStats.words}
						lineCount={modifiedStats.lines}
						charCount={modifiedStats.chars}
					/>
				</div>

				{/* Diff Viewer */}
				<DiffViewer
					diffResult={diffResult}
					viewMode={viewMode}
					isLoading={isLoading}
					showLineNumbers={config.showLineNumbers}
				/>
			</div>

			{/* Error Display */}
			{error && (
				<div className="rounded-lg border border-destructive/20 bg-destructive/10 p-4 text-destructive">
					<p className="font-medium">Error processing diff:</p>
					<p className="mt-1 text-sm opacity-90">{error}</p>
				</div>
			)}
		</div>
	);
}