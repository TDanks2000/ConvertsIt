"use client";

import { useCallback, useMemo, useState } from "react";
import type {
	Base64ConversionResult,
	Base64Stats,
	ConversionMode,
	FileInfo,
	InputType,
} from "../types";
import {
	calculateBase64Stats,
	copyToClipboard,
	decodeFromBase64,
	downloadAsFile,
	encodeToBase64,
	fileToBase64,
	getFileInfo,
	getSampleData,
} from "../utils/base64-operations";

export function useBase64Converter() {
	const [input, setInput] = useState("");
	const [mode, setMode] = useState<ConversionMode>("encode");
	const [inputType, setInputType] = useState<InputType>("text");
	const [fileInfo, setFileInfo] = useState<FileInfo | null>(null);

	// Validation and conversion
	const validation = useMemo((): Base64ConversionResult => {
		if (!input.trim()) {
			return {
				isValid: true,
				output: "",
			};
		}

		if (mode === "encode") {
			return encodeToBase64(input);
		}
		return decodeFromBase64(input);
	}, [input, mode]);

	// Output
	const output = validation.output;

	// Statistics
	const stats = useMemo((): Base64Stats => {
		return calculateBase64Stats(input, output, mode);
	}, [input, output, mode]);

	// Handlers
	const handleInputChange = useCallback(
		(value: string) => {
			setInput(value);
			// Reset file info when manually editing text
			if (inputType === "file") {
				setFileInfo(null);
			}
		},
		[inputType],
	);

	const handleModeChange = useCallback(
		(newMode: ConversionMode) => {
			setMode(newMode);
			// Optionally swap input/output when changing modes
			if (output && validation.isValid) {
				setInput(output);
			}
		},
		[output, validation.isValid],
	);

	const handleInputTypeChange = useCallback((newInputType: InputType) => {
		setInputType(newInputType);
		if (newInputType === "text") {
			setFileInfo(null);
		}
	}, []);

	const handleFileUpload = useCallback(
		async (file: File) => {
			try {
				setInputType("file");
				setFileInfo(getFileInfo(file));

				if (mode === "encode") {
					// For encoding, convert file to base64
					const base64 = await fileToBase64(file);
					setInput(base64);
				} else {
					// For decoding, read file as text
					const text = await file.text();
					setInput(text);
				}
			} catch (error) {
				console.error("Failed to process file:", error);
			}
		},
		[mode],
	);

	const handleClear = useCallback(() => {
		setInput("");
		setFileInfo(null);
	}, []);

	const handleLoadSample = useCallback(() => {
		setInput(getSampleData(mode));
		setInputType("text");
		setFileInfo(null);
	}, [mode]);

	const handleSwapMode = useCallback(() => {
		const newMode = mode === "encode" ? "decode" : "encode";
		setMode(newMode);
		// Swap input/output if valid
		if (output && validation.isValid) {
			setInput(output);
		}
	}, [mode, output, validation.isValid]);

	const handleCopyInput = useCallback(async () => {
		return await copyToClipboard(input);
	}, [input]);

	const handleCopyOutput = useCallback(async () => {
		return await copyToClipboard(output);
	}, [output]);

	const handleDownloadInput = useCallback(() => {
		const filename = mode === "encode" ? "input.txt" : "input.base64";
		const mimeType = mode === "encode" ? "text/plain" : "text/plain";
		downloadAsFile(input, filename, mimeType);
	}, [input, mode]);

	const handleDownloadOutput = useCallback(() => {
		const filename = mode === "encode" ? "output.base64" : "output.txt";
		const mimeType = mode === "encode" ? "text/plain" : "text/plain";
		downloadAsFile(output, filename, mimeType);
	}, [output, mode]);

	return {
		// State
		input,
		output,
		mode,
		inputType,
		fileInfo,
		validation,
		stats,

		// Handlers
		handleInputChange,
		handleModeChange,
		handleInputTypeChange,
		handleFileUpload,
		handleClear,
		handleLoadSample,
		handleSwapMode,
		handleCopyInput,
		handleCopyOutput,
		handleDownloadInput,
		handleDownloadOutput,
		setInput,
		setMode,
		setInputType,
	};
}
