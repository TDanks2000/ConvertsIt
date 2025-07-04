"use client";

import { Code2 } from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { SupportedLanguage } from "../types";
import { languageConfigs } from "../utils/code-operations";

interface CodeInputProps {
	value: string;
	onChange: (value: string) => void;
	language: SupportedLanguage;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}

export const CodeInput = memo(function CodeInput({
	value,
	onChange,
	language,
	placeholder,
	readOnly = false,
	className,
}: CodeInputProps) {
	const config = languageConfigs[language];

	const defaultPlaceholder = `Enter your ${config.label} code here...\n\nTip: Use the "Sample" button to load example code, or "Auto-detect" to automatically identify the language.`;

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<Code2 className="h-4 w-4" />
					Input ({config.label})
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<Textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder || defaultPlaceholder}
					readOnly={readOnly}
					className="min-h-[400px] resize-none font-mono text-sm"
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
