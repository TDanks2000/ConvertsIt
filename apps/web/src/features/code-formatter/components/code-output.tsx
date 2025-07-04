"use client";

import { FileText } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { FormatMode, SupportedLanguage } from "../types";
import { languageConfigs } from "../utils/code-operations";

interface CodeOutputProps {
	value: string;
	language: SupportedLanguage;
	formatMode: FormatMode;
	isValid: boolean;
	className?: string;
}

export const CodeOutput = memo(function CodeOutput({
	value,
	language,
	formatMode,
	isValid,
	className,
}: CodeOutputProps) {
	const config = languageConfigs[language];

	const getModeLabel = () => {
		switch (formatMode) {
			case "format":
				return "Formatted";
			case "minify":
				return "Minified";
			case "original":
				return "Original";
			default:
				return "Output";
		}
	};

	const getPlaceholder = () => {
		if (!isValid) {
			return "Please fix the syntax errors in your code to see the formatted output.";
		}

		switch (formatMode) {
			case "format":
				return `Your formatted ${config.label} code will appear here...\n\nThe formatter will:\n• Add proper indentation\n• Organize code structure\n• Apply consistent styling`;
			case "minify":
				return `Your minified ${config.label} code will appear here...\n\nMinification will:\n• Remove unnecessary whitespace\n• Reduce file size\n• Optimize for production`;
			case "original":
				return `Your original ${config.label} code will appear here...`;
			default:
				return `Your processed ${config.label} code will appear here...`;
		}
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<FileText className="h-4 w-4" />
					{getModeLabel()} ({config.label})
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<Textarea
					value={value}
					placeholder={getPlaceholder()}
					readOnly
					className="min-h-[400px] resize-none bg-muted/30 font-mono text-sm"
					spellCheck={false}
					autoComplete="off"
					autoCorrect="off"
					autoCapitalize="off"
					data-gramm="false"
					data-gramm_editor="false"
					data-enable-grammarly="false"
				/>
			</CardContent>
		</Card>
	);
});
