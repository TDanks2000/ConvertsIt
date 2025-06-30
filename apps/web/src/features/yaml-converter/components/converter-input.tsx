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
	const inputType = conversionMode === "yaml-to-json" ? "YAML" : "JSON";
	const placeholder =
		conversionMode === "yaml-to-json"
			? "Paste your YAML data here...\n\nExample:\nname: John Doe\nage: 30\naddress:\n  street: 123 Main St\n  city: Anytown\nhobbies:\n  - reading\n  - coding"
			: 'Paste your JSON data here...\n\nExample:\n{\n  "name": "John Doe",\n  "age": 30,\n  "address": {\n    "street": "123 Main St",\n    "city": "Anytown"\n  },\n  "hobbies": ["reading", "coding"]\n}';

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
						<AlertDescription>{validationResult.error}</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}