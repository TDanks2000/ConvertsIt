"use client";

import { FileText, QrCode } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
	disabled?: boolean;
	maxLength?: number;
}

export function TextInput({
	value,
	onChange,
	placeholder = "Enter text, URL, or any data to generate QR code...",
	disabled = false,
	maxLength = 2953,
}: TextInputProps) {
	const remainingChars = maxLength - value.length;
	const isNearLimit = remainingChars < 100;
	const isOverLimit = remainingChars < 0;

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Input Data
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					disabled={disabled}
					rows={6}
					maxLength={maxLength}
					className="min-h-[150px] resize-none text-sm"
				/>
				<div className="mt-2 flex items-center justify-between text-sm">
					<div className="flex items-center gap-2 text-muted-foreground">
						<QrCode className="h-4 w-4" />
						Characters: {value.length.toLocaleString()}
					</div>
					<div
						className={`text-sm ${
							isOverLimit
								? "text-destructive"
								: isNearLimit
									? "text-orange-600"
									: "text-muted-foreground"
						}`}
					>
						{remainingChars} remaining
					</div>
				</div>
				{isOverLimit && (
					<div className="mt-2 text-destructive text-sm">
						Input exceeds maximum length. Please reduce the content.
					</div>
				)}
			</CardContent>
		</Card>
	);
}
