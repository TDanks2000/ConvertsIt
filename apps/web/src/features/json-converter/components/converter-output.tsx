import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import type { ConversionMode } from "../types";

interface ConverterOutputProps {
	value: string;
	conversionMode: ConversionMode;
	isValid: boolean;
}

export function ConverterOutput({
	value,
	conversionMode,
	isValid,
}: ConverterOutputProps) {
	const outputType = conversionMode === "json-to-csv" ? "CSV" : "JSON";
	const placeholder = isValid
		? `Converted ${outputType} will appear here...`
		: "Fix input errors to see converted output...";

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Output {outputType}</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={value}
					readOnly
					placeholder={placeholder}
					className="min-h-[400px] resize-none bg-muted/50 font-mono text-sm"
				/>
			</CardContent>
		</Card>
	);
}
