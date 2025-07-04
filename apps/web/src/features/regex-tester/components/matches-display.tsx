"use client";

import { CheckCircle, Copy, Target, XCircle } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import type { RegexTestResult } from "../types";

interface MatchesDisplayProps {
	result: RegexTestResult;
}

export function MatchesDisplay({ result }: MatchesDisplayProps) {
	const handleCopyMatch = useCallback(async (match: string) => {
		try {
			await navigator.clipboard.writeText(match);
			toast.success("Match copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy match:", err);
			toast.error("Failed to copy match");
		}
	}, []);

	const handleCopyAllMatches = useCallback(async () => {
		if (!result.matches.length) {
			toast.error("No matches to copy");
			return;
		}

		try {
			const matchesText = result.matches
				.map(
					(match, index) =>
						`${index + 1}. "${match.match}" (index: ${match.index})`,
				)
				.join("\n");
			await navigator.clipboard.writeText(matchesText);
			toast.success("All matches copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy matches:", err);
			toast.error("Failed to copy matches");
		}
	}, [result.matches]);

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Target className="h-4 w-4" />
						Matches
						<Badge variant="secondary">{result.totalMatches}</Badge>
					</CardTitle>
					{result.matches.length > 0 && (
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyAllMatches}
							className="h-8"
						>
							<Copy className="h-3 w-3" />
							Copy All
						</Button>
					)}
				</div>
				{result.executionTime !== undefined && (
					<p className="text-muted-foreground text-sm">
						Execution time: {result.executionTime.toFixed(2)}ms
					</p>
				)}
			</CardHeader>
			<CardContent>
				{!result.isValid ? (
					<div className="flex items-center gap-2 text-destructive">
						<XCircle className="h-4 w-4" />
						<span className="text-sm">{result.error}</span>
					</div>
				) : result.matches.length === 0 ? (
					<div className="flex items-center gap-2 text-muted-foreground">
						<CheckCircle className="h-4 w-4" />
						<span className="text-sm">No matches found</span>
					</div>
				) : (
					<ScrollArea className="h-[300px]">
						<div className="space-y-3">
							{result.matches.map((match, index) => (
								<div
									key={match.id}
									className="rounded-lg border bg-muted/50 p-3"
								>
									<div className="flex items-start justify-between gap-2">
										<div className="flex-1 space-y-1">
											<div className="flex items-center gap-2">
												<Badge variant="outline" className="text-xs">
													#{index + 1}
												</Badge>
												<span className="text-muted-foreground text-xs">
													Index: {match.index}, Length: {match.length}
												</span>
											</div>
											<code className="block rounded bg-background px-2 py-1 font-mono text-sm">
												{match.match}
											</code>
											{match.groups && match.groups.length > 0 && (
												<div className="space-y-1">
													<span className="font-medium text-muted-foreground text-xs">
														Capture Groups:
													</span>
													{match.groups.map((group, groupIndex) => (
														<div
															key={`${match.id}-group-${groupIndex}`}
															className="flex items-center gap-2"
														>
															<Badge variant="secondary" className="text-xs">
																${groupIndex + 1}
															</Badge>
															<code className="text-xs">
																{group || "(empty)"}
															</code>
														</div>
													))}
												</div>
											)}
										</div>
										<Button
											variant="ghost"
											size="sm"
											onClick={() => handleCopyMatch(match.match)}
											className="h-8 w-8 p-0"
										>
											<Copy className="h-3 w-3" />
										</Button>
									</div>
								</div>
							))}
						</div>
					</ScrollArea>
				)}
			</CardContent>
		</Card>
	);
}
