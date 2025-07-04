import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { EncodingMode } from "../types";

interface UrlOutputProps {
	value: string;
	mode: EncodingMode;
	isValid: boolean;
}

export function UrlOutput({ value, mode, isValid }: UrlOutputProps) {
	const title = mode === "encode" ? "Encoded Result" : "Decoded Result";
	const placeholder = isValid
		? `Your ${mode === "encode" ? "encoded" : "decoded"} result will appear here...`
		: "Fix input errors to see the result...";

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="text-base">{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="url-output">Output</Label>
					<Textarea
						id="url-output"
						value={value}
						readOnly
						placeholder={placeholder}
						rows={8}
						className="resize-none bg-muted/50 font-mono text-sm"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
