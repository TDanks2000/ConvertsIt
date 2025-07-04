import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EncodingMode, UrlValidationResult } from "../types";

interface UrlInputProps {
	value: string;
	onChange: (value: string) => void;
	validation: UrlValidationResult;
	mode: EncodingMode;
	placeholder?: string;
}

export function UrlInput({
	value,
	onChange,
	validation,
	mode,
	placeholder,
}: UrlInputProps) {
	const title = mode === "encode" ? "Input URL/Text" : "Encoded URL/Text";
	const defaultPlaceholder =
		mode === "encode"
			? "Enter URL or text to encode..."
			: "Enter encoded URL or text to decode...";

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="url-input">Input</Label>
					<Textarea
						id="url-input"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder || defaultPlaceholder}
						rows={8}
						className="resize-none font-mono text-sm"
					/>
				</div>

				{!validation.isValid && validation.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{validation.error}</AlertDescription>
					</Alert>
				)}

				{validation.warning && (
					<Alert>
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{validation.warning}</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
