import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { JsonValidationResult } from "../types";

interface JsonInputProps {
	value: string;
	onChange: (value: string) => void;
	validation: JsonValidationResult;
	placeholder?: string;
}

export function JsonInput({
	value,
	onChange,
	validation,
	placeholder = "Paste your JSON here...",
}: JsonInputProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="text-lg">Input JSON</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="json-input">JSON Data</Label>
					<Textarea
						id="json-input"
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={placeholder}
						className="min-h-[400px] font-mono text-sm"
						spellCheck={false}
					/>
				</div>

				{!validation.isValid && validation.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							<div className="space-y-1">
								<div className="font-medium">JSON Validation Error</div>
								<div>{validation.error}</div>
								{validation.lineNumber && validation.columnNumber && (
									<div className="text-sm opacity-90">
										Line {validation.lineNumber}, Column{" "}
										{validation.columnNumber}
									</div>
								)}
							</div>
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
