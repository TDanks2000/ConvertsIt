"use client";

import { AlertCircle, FileOutput } from "lucide-react";
import { memo } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { Base64ConversionResult, ConversionMode } from "../types";

interface Base64OutputProps {
	value: string;
	mode: ConversionMode;
	validation: Base64ConversionResult;
	readOnly?: boolean;
	className?: string;
}

export const Base64Output = memo(function Base64Output({
	value,
	mode,
	validation,
	readOnly = true,
	className,
}: Base64OutputProps) {
	const getPlaceholder = () => {
		if (!validation.isValid && validation.error) {
			return "Please fix the input errors to see the converted output.";
		}

		if (mode === "encode") {
			return "Your Base64 encoded output will appear here...\n\nBase64 encoding will:\n• Convert your text/file to Base64 format\n• Make it safe for transmission\n• Increase size by ~33%\n\nExample output:\nU0dWc2JHOHNJRmR2Y214a0lRPT0=";
		}
		return "Your decoded text will appear here...\n\nBase64 decoding will:\n• Convert Base64 back to original format\n• Restore original content\n• Reduce size by ~25%\n\nExample output:\nHello, World!";
	};

	const getModeLabel = () => {
		return mode === "encode" ? "Base64 Encoded Output" : "Decoded Text Output";
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileOutput className="h-5 w-5" />
					{getModeLabel()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Error Display */}
				{!validation.isValid && validation.error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{validation.error}</AlertDescription>
					</Alert>
				)}

				{/* Output Text */}
				<div className="space-y-2">
					<Label className="font-medium text-sm">Output</Label>
					<Textarea
						value={validation.isValid ? value : ""}
						placeholder={getPlaceholder()}
						readOnly={readOnly}
						className="min-h-[200px] resize-y font-mono text-sm"
					/>
				</div>

				{/* Success Indicator */}
				{validation.isValid && value && (
					<div className="rounded-md border border-green-200 bg-green-50 p-3 dark:border-green-800 dark:bg-green-950">
						<div className="flex items-center gap-2 text-green-800 text-sm dark:text-green-200">
							<div className="h-2 w-2 rounded-full bg-green-500" />
							<span className="font-medium">
								{mode === "encode"
									? "Successfully encoded to Base64"
									: "Successfully decoded from Base64"}
							</span>
						</div>
					</div>
				)}

				{/* Format Information */}
				{validation.isValid && value && (
					<div className="rounded-md border bg-muted/50 p-3">
						<div className="text-muted-foreground text-sm">
							{mode === "encode" ? (
								<>
									<strong>Base64 Format:</strong> This encoded string can be
									safely transmitted over text-based protocols.
									<br />
									<strong>Usage:</strong> Commonly used in email attachments,
									data URLs, and API responses.
								</>
							) : (
								<>
									<strong>Decoded Content:</strong> Original data has been
									restored from Base64 encoding.
									<br />
									<strong>Note:</strong> Verify the content matches your
									expectations before using.
								</>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
});
