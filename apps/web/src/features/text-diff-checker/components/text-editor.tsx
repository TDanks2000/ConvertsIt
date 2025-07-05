"use client";

import { FileText } from "lucide-react";
import type React from "react";
import { useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

interface TextEditorProps {
	title: string;
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
	showStats?: boolean;
	wordCount?: number;
	lineCount?: number;
	charCount?: number;
}

export function TextEditor({
	title,
	value,
	onChange,
	placeholder = "Enter your text here...",
	readOnly = false,
	className,
	showStats = true,
	wordCount = 0,
	lineCount = 0,
	charCount = 0,
}: TextEditorProps) {
	const handleChange = useCallback(
		(e: React.ChangeEvent<HTMLTextAreaElement>) => {
			onChange(e.target.value);
		},
		[onChange],
	);

	return (
		<Card className={cn("h-full", className)}>
			<CardHeader className="pb-3">
				<div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
					<CardTitle className="flex items-center gap-2 text-base">
						<FileText className="h-4 w-4" />
						{title}
					</CardTitle>
					{showStats && (
						<div className="flex flex-wrap gap-2 text-muted-foreground text-xs">
							<span className="rounded-md border px-2 py-1">
								{lineCount.toLocaleString()} lines
							</span>
							<span className="rounded-md border px-2 py-1">
								{wordCount.toLocaleString()} words
							</span>
							<span className="rounded-md border px-2 py-1">
								{charCount.toLocaleString()} chars
							</span>
						</div>
					)}
				</div>
			</CardHeader>
			<CardContent className="h-[calc(100%-5rem)] p-0">
				<Textarea
					value={value}
					onChange={handleChange}
					placeholder={placeholder}
					readOnly={readOnly}
					className="h-full min-h-[280px] resize-none rounded-none border-0 font-mono text-sm leading-relaxed focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</CardContent>
		</Card>
	);
}
