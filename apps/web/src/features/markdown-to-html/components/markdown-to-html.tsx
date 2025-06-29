"use client";

import { useCallback, useMemo, useState } from "react";
import { useMarkdownConverter } from "../hooks/use-markdown-converter";
import type { ViewMode } from "../types";
import { HtmlPreview } from "./html-preview";
import { MarkdownEditor } from "./markdown-editor";
import { PageHeader } from "./page-header";
import { Toolbar } from "./toolbar";

export function MarkdownToHtml() {
	const [viewMode, setViewMode] = useState<ViewMode>("split");
	const { markdown, setMarkdown, html, isLoading, error, resetToDefault } =
		useMarkdownConverter();

	const handleCopyHtml = useCallback(async () => {
		if (html) {
			try {
				await navigator.clipboard.writeText(html);
				// You could add a toast notification here
			} catch (err) {
				console.error("Failed to copy HTML:", err);
			}
		}
	}, [html]);

	const handleDownloadHtml = useCallback(() => {
		if (html) {
			const blob = new Blob([html], { type: "text/html" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "converted.html";
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
		}
	}, [html]);

	// Memoize calculations to prevent unnecessary recalculations
	const { wordCount, charCount, hasContent } = useMemo(() => {
		const trimmedMarkdown = markdown.trim();
		return {
			wordCount: trimmedMarkdown ? trimmedMarkdown.split(/\s+/).length : 0,
			charCount: markdown.length,
			hasContent: !!trimmedMarkdown,
		};
	}, [markdown]);

	// Memoize grid styles
	const gridStyles = useMemo(
		() => ({
			gridTemplateColumns:
				viewMode === "split"
					? "1fr 1fr"
					: viewMode === "editor"
						? "1fr"
						: "1fr",
			height: "600px",
		}),
		[viewMode],
	);

	// Memoize placeholder text
	const placeholderText = useMemo(
		() =>
			"# Welcome to Markdown to HTML Converter\n\nStart typing your markdown here...\n\n## Features\n- GitHub Flavored Markdown support\n- Real-time preview\n- Syntax highlighting\n- Export to HTML",
		[],
	);

	return (
		<div className="container mx-auto space-y-6 p-6">
			<PageHeader />

			<Toolbar
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				wordCount={wordCount}
				charCount={charCount}
				onCopyHtml={handleCopyHtml}
				onDownloadHtml={handleDownloadHtml}
				onReset={resetToDefault}
				hasContent={hasContent}
			/>

			<div className="grid gap-6" style={gridStyles}>
				{(viewMode === "split" || viewMode === "editor") && (
					<MarkdownEditor
						value={markdown}
						onChange={setMarkdown}
						placeholder={placeholderText}
					/>
				)}

				{(viewMode === "split" || viewMode === "preview") && (
					<HtmlPreview html={html} isLoading={isLoading} />
				)}
			</div>

			{error && (
				<div className="rounded-md border border-destructive/20 bg-destructive/10 px-4 py-3 text-destructive">
					<p className="font-medium">Error converting markdown:</p>
					<p className="mt-1 text-sm">{error}</p>
				</div>
			)}
		</div>
	);
}
