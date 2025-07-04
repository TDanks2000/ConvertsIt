import { useCallback, useMemo, useState } from "react";
import type {
	EncodingMode,
	EncodingType,
	UrlStats,
	UrlValidationResult,
} from "../types";
import {
	calculateUrlStats,
	decodeUrl,
	encodeUrl,
	getSampleUrls,
	validateUrl,
} from "../utils/url-operations";

export function useUrlEncoderDecoder() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<EncodingMode>("encode");
	const [encodingType, setEncodingType] = useState<EncodingType>("component");

	const validation = useMemo((): UrlValidationResult => {
		return validateUrl(input, mode);
	}, [input, mode]);

	const stats = useMemo((): UrlStats => {
		return calculateUrlStats(input);
	}, [input]);

	const output = useMemo((): string => {
		if (!input.trim() || !validation.isValid) {
			return "";
		}

		if (mode === "encode") {
			return encodeUrl(input, encodingType);
		}
		return decodeUrl(input, encodingType);
	}, [input, mode, encodingType, validation.isValid]);

	const handleClear = useCallback(() => {
		setInput("");
	}, []);

	const handleSwapMode = useCallback(() => {
		const newMode = mode === "encode" ? "decode" : "encode";
		setMode(newMode);

		// If there's output, swap input and output
		if (output.trim()) {
			setInput(output);
		}
	}, [mode, output]);

	const handleLoadSample = useCallback(() => {
		const samples = getSampleUrls();
		const sample = samples[mode][encodingType];
		setInput(sample);
	}, [mode, encodingType]);

	const handleEncodingTypeChange = useCallback((type: EncodingType) => {
		setEncodingType(type);
	}, []);

	return {
		input,
		setInput,
		output,
		mode,
		setMode,
		encodingType,
		validation,
		stats,
		handleClear,
		handleSwapMode,
		handleLoadSample,
		handleEncodingTypeChange,
	};
}
