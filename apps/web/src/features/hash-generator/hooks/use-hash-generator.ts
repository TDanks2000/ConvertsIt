"use client";

import { useCallback, useState } from "react";
import type { HashAlgorithm, HashResult } from "../types";
import { generateHash, generateMultipleHashes } from "../utils/hash-generator";

export function useHashGenerator() {
	const [input, setInput] = useState("");
	const [algorithm, setAlgorithm] = useState<HashAlgorithm>("sha256");
	const [results, setResults] = useState<HashResult[]>([]);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const generateSingleHash = useCallback(async () => {
		if (!input.trim()) {
			setError("Please enter some text to hash");
			return;
		}

		setIsGenerating(true);
		setError(null);

		try {
			const result = await generateHash(input, algorithm);
			setResults([result]);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to generate hash");
		} finally {
			setIsGenerating(false);
		}
	}, [input, algorithm]);

	const generateAllHashes = useCallback(async () => {
		if (!input.trim()) {
			setError("Please enter some text to hash");
			return;
		}

		setIsGenerating(true);
		setError(null);

		try {
			const algorithms: HashAlgorithm[] = ["md5", "sha1", "sha256", "sha512"];
			const allResults = await generateMultipleHashes(input, algorithms);
			setResults(allResults);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to generate hashes",
			);
		} finally {
			setIsGenerating(false);
		}
	}, [input]);

	const clearResults = useCallback(() => {
		setResults([]);
		setError(null);
	}, []);

	const clearAll = useCallback(() => {
		setInput("");
		setResults([]);
		setError(null);
	}, []);

	return {
		input,
		setInput,
		algorithm,
		setAlgorithm,
		results,
		isGenerating,
		error,
		generateSingleHash,
		generateAllHashes,
		clearResults,
		clearAll,
		hasInput: !!input.trim(),
		hasResults: results.length > 0,
	};
}
