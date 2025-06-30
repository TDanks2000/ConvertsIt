import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { FormatMode } from "../types";

interface JsonOutputProps {
	value: string;
	formatMode: FormatMode;
	isValid: boolean;
}

export function JsonOutput({ value, formatMode, isValid }: JsonOutputProps) {
	const title = formatMode === "beautify" ? "Formatted JSON" : "Minified JSON";
	const placeholder = isValid
		? `Your ${formatMode === "beautify" ? "formatted" : "minified"} JSON will appear here...`
		: "Fix JSON errors to see formatted output...";

	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">{title}</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Label htmlFor="json-output">Output</Label>
					<Textarea
						id="json-output"
						value={value}
						readOnly
						placeholder={placeholder}
						className="min-h-[400px] bg-muted/50 font-mono text-sm"
						spellCheck={false}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
