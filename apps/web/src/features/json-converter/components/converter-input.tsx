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
	const inputType = conversionMode === "json-to-csv" ? "JSON" : "CSV";
	const placeholder =
		conversionMode === "json-to-csv"
			? 'Paste your JSON data here...\n\nExample:\n[\n  {\n    "name": "John",\n    "age": 30\n  }\n]'
			: "Paste your CSV data here...\n\nExample:\nname,age\nJohn,30\nJane,25";

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
					className="min-h-[400px] resize-none font-mono text-sm"
				/>

				{!validationResult.isValid && validationResult.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{validationResult.error}
							{validationResult.lineNumber && validationResult.columnNumber && (
								<span className="mt-1 block text-xs">
									Line {validationResult.lineNumber}, Column{" "}
									{validationResult.columnNumber}
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
