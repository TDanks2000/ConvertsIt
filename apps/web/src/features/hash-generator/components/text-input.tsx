"use client";

import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
}

export function TextInput({
	value,
	onChange,
	placeholder = "Enter text to generate hash...",
	disabled = false,
}: TextInputProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Input Text
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					rows={8}
					className="min-h-[200px] resize-none font-mono text-sm"
				/>
				<div className="mt-2 text-muted-foreground text-sm">
					Characters: {value.length.toLocaleString()}
				</div>
			</CardContent>
		</Card>
	);
}
