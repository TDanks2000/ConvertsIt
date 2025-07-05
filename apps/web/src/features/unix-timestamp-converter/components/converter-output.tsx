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
	const outputType =
		conversionMode === "timestamp-to-date" ? "Date" : "Unix Timestamp";

	return (
		<Card className="flex-1">
			<CardHeader>
				<CardTitle>Output {outputType}</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={value}
					readOnly
					rows={8}
					className={`resize-none font-mono text-sm ${
						isValid ? "text-foreground" : "text-muted-foreground"
					}`}
					placeholder="Converted result will appear here..."
				/>
			</CardContent>
		</Card>
	);
}
