"use client";

import { Code2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface RegexInputProps {
	value: string;
	onChange: (value: string) => void;
	isValid: boolean;
	error?: string;
}

export function RegexInput({
	value,
	onChange,
	isValid,
	error,
}: RegexInputProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Code2 className="h-4 w-4" />
					Regular Expression
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-2">
					<Label htmlFor="regex-pattern">Pattern</Label>
					<div className="relative">
						<span className="-translate-y-1/2 absolute top-1/2 left-3 text-muted-foreground">
							/
						</span>
						<Input
							id="regex-pattern"
							value={value}
							onChange={(e) => onChange(e.target.value)}
							placeholder="Enter your regular expression..."
							className={`pr-8 pl-8 font-mono ${
								!isValid && value ? "border-destructive" : ""
							}`}
						/>
						<span className="-translate-y-1/2 absolute top-1/2 right-3 text-muted-foreground">
							/
						</span>
					</div>
					{error && <p className="text-destructive text-sm">{error}</p>}
				</div>
			</CardContent>
		</Card>
	);
}
