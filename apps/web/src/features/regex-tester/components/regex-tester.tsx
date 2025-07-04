"use client";

import { Code2, Eraser, Target } from "lucide-react";
import { useCallback } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { Button } from "@/components/ui/button";
import { useRegexTester } from "../hooks/use-regex-tester";
import { CommonPatterns } from "./common-patterns";
import { MatchesDisplay } from "./matches-display";
import { RegexFlagsComponent as RegexFlags } from "./regex-flags";
import { RegexInput } from "./regex-input";
import { TestStringInput } from "./test-string-input";

export function RegexTester() {
	const {
		pattern,
		setPattern,
		testString,
		setTestString,
		flags,
		updateFlag,
		result,
		clearAll,
		loadExample,
	} = useRegexTester();

	const handleClearAll = useCallback(() => {
		clearAll();
		toast.success("All fields cleared");
	}, [clearAll]);

	const handleLoadExample = useCallback(
		(examplePattern: string, exampleText?: string) => {
			loadExample(examplePattern, exampleText);
			toast.success("Example loaded");
		},
		[loadExample],
	);

	return (
		<div className="container mx-auto space-y-6 p-6">
			<PageHeader
				title="Regex Tester"
				description="Test and debug regular expressions with real-time matching, capture groups, and common pattern examples"
				icons={[Code2, Target]}
			/>

			<div className="flex justify-end">
				<Button
					variant="outline"
					onClick={handleClearAll}
					className="gap-2"
					disabled={!pattern && !testString}
				>
					<Eraser className="h-4 w-4" />
					Clear All
				</Button>
			</div>

			<div className="grid gap-6 lg:grid-cols-[1fr_350px]">
				<div className="space-y-6">
					<RegexInput
						value={pattern}
						onChange={setPattern}
						isValid={result.isValid}
						error={result.error}
					/>

					<RegexFlags flags={flags} onFlagChange={updateFlag} />

					<TestStringInput
						value={testString}
						onChange={setTestString}
						matches={result.matches}
					/>
				</div>

				<div className="space-y-6 lg:sticky lg:top-6 lg:self-start">
					<MatchesDisplay result={result} />
					<CommonPatterns onPatternSelect={handleLoadExample} />
				</div>
			</div>
		</div>
	);
}
