import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ConversionMode, ConversionResult } from "../types";

interface ConverterInputProps {
	value: string;
	onChange: (value: string) => void;
	conversionMode: ConversionMode;
	validationResult: ConversionResult;
}

export function ConverterInput({
	value,
	onChange,
	conversionMode,
	validationResult,
}: ConverterInputProps) {
	const inputType =
		conversionMode === "timestamp-to-date" ? "Unix Timestamp" : "Date";
	const placeholder =
		conversionMode === "timestamp-to-date"
			? "Enter Unix timestamp here...\n\nExamples:\n1703980800 (seconds)\n1703980800000 (milliseconds)\n\nCurrent timestamp: " +
				Math.floor(Date.now() / 1000)
			: "Enter date string here...\n\nExamples:\n2024-01-01T00:00:00.000Z\n2024-01-01 12:00:00\nJanuary 1, 2024\n2024/01/01\n\nCurrent date: " +
				new Date().toISOString();

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Input {inputType}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<Textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder}
					rows={8}
					className="resize-none font-mono text-sm"
				/>
				{!validationResult.isValid && validationResult.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{validationResult.error}</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
