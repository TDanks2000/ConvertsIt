import { useCallback, useMemo, useState } from "react";
import type { FormatMode, JsonStats, JsonValidationResult } from "../types";
import {
	calculateJsonStats,
	formatJson,
	minifyJson,
	validateJson,
} from "../utils/json-operations";

export function useJsonFormatter() {
	const [input, setInput] = useState("");
	const [formatMode, setFormatMode] = useState<FormatMode>("beautify");
	const [indentSize, setIndentSize] = useState(2);

	const validation = useMemo((): JsonValidationResult => {
		return validateJson(input);
	}, [input]);

	const stats = useMemo((): JsonStats => {
		return calculateJsonStats(input);
	}, [input]);

	const output = useMemo((): string => {
		if (!input.trim() || !validation.isValid) {
			return "";
		}

		if (formatMode === "beautify") {
			return formatJson(input, indentSize);
		}
		return minifyJson(input);
	}, [input, formatMode, indentSize, validation.isValid]);

	const handleClear = useCallback(() => {
		setInput("");
	}, []);

	const handleFormat = useCallback((mode: FormatMode) => {
		setFormatMode(mode);
	}, []);

	const handleIndentChange = useCallback((size: number) => {
		setIndentSize(size);
	}, []);

	const handleLoadSample = useCallback(() => {
		const sampleJson = {
			name: "John Doe",
			age: 30,
			email: "john.doe@example.com",
			address: {
				street: "123 Main St",
				city: "New York",
				state: "NY",
				zipCode: "10001",
			},
			hobbies: ["reading", "swimming", "coding"],
			isActive: true,
			balance: 1234.56,
			lastLogin: null,
		};
		setInput(JSON.stringify(sampleJson));
	}, []);

	return {
		input,
		setInput,
		output,
		validation,
		stats,
		formatMode,
		indentSize,
		handleClear,
		handleFormat,
		handleIndentChange,
		handleLoadSample,
	};
}
