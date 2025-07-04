import { useCallback, useMemo, useState } from "react";
import type { RegexFlags, RegexTestResult } from "../types";
import { testRegex } from "../utils/regex-utils";

export function useRegexTester() {
	const [pattern, setPattern] = useState("");
	const [testString, setTestString] = useState("");
	const [flags, setFlags] = useState<RegexFlags>({
		global: true,
		ignoreCase: false,
		multiline: false,
		dotAll: false,
		unicode: false,
		sticky: false,
	});

	const result = useMemo<RegexTestResult>(() => {
		if (!pattern.trim()) {
			return {
				isValid: true,
				matches: [],
				totalMatches: 0,
			};
		}

		return testRegex(pattern, testString, flags);
	}, [pattern, testString, flags]);

	const updateFlag = useCallback((flag: keyof RegexFlags, value: boolean) => {
		setFlags((prev) => ({ ...prev, [flag]: value }));
	}, []);

	const clearAll = useCallback(() => {
		setPattern("");
		setTestString("");
	}, []);

	const loadExample = useCallback(
		(examplePattern: string, exampleText?: string) => {
			setPattern(examplePattern);
			if (exampleText) {
				setTestString(exampleText);
			}
		},
		[],
	);

	return {
		pattern,
		setPattern,
		testString,
		setTestString,
		flags,
		updateFlag,
		result,
		clearAll,
		loadExample,
	};
}