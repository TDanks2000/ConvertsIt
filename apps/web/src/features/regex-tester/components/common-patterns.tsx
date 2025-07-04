"use client";

import { Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getCommonRegexPatterns } from "../utils/regex-utils";

interface CommonPatternsProps {
	onPatternSelect: (pattern: string, example?: string) => void;
}

const exampleTexts: Record<string, string> = {
	Email:
		"Contact us at john.doe@example.com or support@company.org for assistance.",
	URL: "Visit https://www.example.com or http://subdomain.site.org/path for more info.",
	"Phone (US)": "Call us at (555) 123-4567 or 555.987.6543 or 555-111-2222.",
	"Date (YYYY-MM-DD)":
		"Important dates: 2024-01-15, 2023-12-31, and 2024-03-22.",
	"IP Address": "Server IPs: 192.168.1.1, 10.0.0.1, and 172.16.254.1.",
	"Hex Color": "Colors used: #FF5733, #33FF57, #3357FF, #FFF, and #000.",
};

export function CommonPatterns({ onPatternSelect }: CommonPatternsProps) {
	const patterns = getCommonRegexPatterns();

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Lightbulb className="h-4 w-4" />
					Common Patterns
				</CardTitle>
			</CardHeader>
			<CardContent>
				<ScrollArea className="h-[300px]">
					<div className="space-y-2">
						{patterns.map((pattern) => (
							<div
								key={pattern.name}
								className="rounded-lg border bg-muted/50 p-3"
							>
								<div className="space-y-2">
									<div className="flex items-center justify-between">
										<h4 className="font-medium">{pattern.name}</h4>
										<Button
											variant="outline"
											size="sm"
											onClick={() =>
												onPatternSelect(
													pattern.pattern,
													exampleTexts[pattern.name],
												)
											}
											className="h-7 text-xs"
										>
											Try It
										</Button>
									</div>
									<p className="text-muted-foreground text-sm">
										{pattern.description}
									</p>
									<code className="block rounded bg-background px-2 py-1 font-mono text-xs">
										{pattern.pattern}
									</code>
								</div>
							</div>
						))}
					</div>
				</ScrollArea>
			</CardContent>
		</Card>
	);
}
