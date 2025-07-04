"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { RegexMatch } from "../types";

interface TestStringInputProps {
	value: string;
	onChange: (value: string) => void;
	matches: RegexMatch[];
	placeholder?: string;
}

interface TextSegment {
	type: "text" | "match";
	content: string;
	id?: string;
}

export function TestStringInput({
	value,
	onChange,
	matches,
	placeholder = "Enter your test string here...",
}: TestStringInputProps) {
	const createTextSegments = (
		text: string,
		matches: RegexMatch[],
	): TextSegment[] => {
		if (!matches.length || !text) {
			return [{ type: "text", content: text }];
		}

		// Sort matches by index to process them in order
		const sortedMatches = [...matches].sort((a, b) => a.index - b.index);
		const segments: TextSegment[] = [];
		let lastIndex = 0;

		sortedMatches.forEach((match) => {
			// Add text before the match
			if (match.index > lastIndex) {
				segments.push({
					type: "text",
					content: text.slice(lastIndex, match.index),
				});
			}

			// Add the match
			segments.push({
				type: "match",
				content: match.match,
				id: match.id,
			});

			lastIndex = match.index + match.length;
		});

		// Add remaining text
		if (lastIndex < text.length) {
			segments.push({
				type: "text",
				content: text.slice(lastIndex),
			});
		}

		return segments;
	};

	const renderTextWithHighlights = (text: string, matches: RegexMatch[]) => {
		const segments = createTextSegments(text, matches);

		return segments.map((segment, index) => {
			if (segment.type === "match") {
				return (
					<span
						key={segment.id || `match-${index}`}
						className="rounded bg-yellow-200 px-1 py-0.5 font-medium text-yellow-900 dark:bg-yellow-800 dark:text-yellow-100"
					>
						{segment.content}
					</span>
				);
			}

			// Handle line breaks in text segments
			const lines = segment.content.split("\n");
			return lines.map((line, lineIndex) => (
				<span key={`text-${index}-${lineIndex + 1}`}>
					{line}
					{lineIndex < lines.length - 1 && <br />}
				</span>
			));
		});
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-4 w-4" />
					Test String
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="test-string">Input Text</Label>
					<Textarea
						id="test-string"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="min-h-[120px] resize-y font-mono text-sm"
					/>
				</div>

				{matches.length > 0 && value && (
					<div className="space-y-2">
						<Label>Preview with Matches</Label>
						<div className="min-h-[120px] whitespace-pre-wrap rounded-md border bg-muted/50 p-3 font-mono text-sm leading-relaxed">
							{renderTextWithHighlights(value, matches)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
