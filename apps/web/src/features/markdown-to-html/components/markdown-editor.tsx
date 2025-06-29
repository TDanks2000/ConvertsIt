"use client";

import { FileText } from "lucide-react";
import { memo, useCallback } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface MarkdownEditorProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export const MarkdownEditor = memo(function MarkdownEditor({
	value,
	onChange,
	placeholder = "Enter your markdown here...",
}: MarkdownEditorProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[onChange],
	);

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-lg">
					<FileText className="h-5 w-5" />
					Markdown Editor
				</CardTitle>
				<CardDescription>
					Write your markdown content. Supports GitHub Flavored Markdown with
					syntax highlighting.
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[calc(100%-120px)]">
				<Textarea
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					className="h-full resize-none font-mono text-sm leading-relaxed"
				/>
			</CardContent>
		</Card>
	);
});
