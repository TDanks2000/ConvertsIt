"use client";

import { Check, Copy, Hash } from "lucide-react";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { HashResult } from "../types";
import { formatHashForDisplay } from "../utils/hash-generator";

interface HashResultsProps {
	results: HashResult[];
}

export function HashResults({ results }: HashResultsProps) {
	const [copiedHashes, setCopiedHashes] = useState<Set<string>>(new Set());

	const copyToClipboard = useCallback(
		async (hash: string, algorithm: string) => {
			try {
				await navigator.clipboard.writeText(hash);
				setCopiedHashes((prev) => new Set(prev).add(hash));
				toast.success(`${algorithm.toUpperCase()} hash copied to clipboard!`);

				// Reset copied state after 2 seconds
				setTimeout(() => {
					setCopiedHashes((prev) => {
						const newSet = new Set(prev);
						newSet.delete(hash);
						return newSet;
					});
				}, 2000);
			} catch (err) {
				console.error("Failed to copy hash:", err);
				toast.error("Failed to copy hash to clipboard");
			}
		},
		[],
	);

	const copyAllHashes = useCallback(async () => {
		const hashText = results
			.map((result) => `${result.algorithm.toUpperCase()}: ${result.hash}`)
			.join("\n");

		try {
			await navigator.clipboard.writeText(hashText);
			toast.success("All hashes copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy hashes:", err);
			toast.error("Failed to copy hashes to clipboard");
		}
	}, [results]);

	if (results.length === 0) {
		return null;
	}

	return (
		<Card>
			<CardHeader>
				<div className="flex items-center justify-between">
					<CardTitle className="flex items-center gap-2">
						<Hash className="h-5 w-5" />
						Hash Results
					</CardTitle>
					{results.length > 1 && (
						<Button
							variant="outline"
							size="sm"
							onClick={copyAllHashes}
							className="flex items-center gap-2"
						>
							<Copy className="h-4 w-4" />
							Copy All
						</Button>
					)}
				</div>
			</CardHeader>
			<CardContent className="space-y-4">
				{results.map((result, index) => (
					<div key={`${result.algorithm}-${index}`}>
						<div className="mb-2 flex items-center justify-between">
							<Badge variant="secondary" className="font-mono text-xs">
								{result.algorithm.toUpperCase()}
							</Badge>
							<Button
								variant="ghost"
								size="sm"
								onClick={() => copyToClipboard(result.hash, result.algorithm)}
								className="h-8 px-2"
							>
								{copiedHashes.has(result.hash) ? (
									<Check className="h-4 w-4 text-green-600" />
								) : (
									<Copy className="h-4 w-4" />
								)}
							</Button>
						</div>
						<div className="break-all rounded-md bg-muted p-3 font-mono text-sm">
							<div className="hidden sm:block">
								{formatHashForDisplay(result.hash)}
							</div>
							<div className="sm:hidden">{result.hash}</div>
						</div>
						<div className="mt-2 text-muted-foreground text-xs">
							Length: {result.hash.length} characters
						</div>
						{index < results.length - 1 && <Separator className="mt-4" />}
					</div>
				))}
			</CardContent>
		</Card>
	);
}
