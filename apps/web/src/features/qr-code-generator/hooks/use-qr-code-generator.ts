"use client";

import { useCallback, useState } from "react";
import type { QRCodeOptions, QRCodeResult } from "../types";
import {
	generateQRCodeResult,
	getRecommendedSize,
	validateQRCodeInput,
} from "../utils/qr-code-generator";

const DEFAULT_OPTIONS: QRCodeOptions = {
	value: "",
	size: 200,
	level: "M",
	bgColor: "#FFFFFF",
	fgColor: "#000000",
	includeMargin: true,
};

export function useQRCodeGenerator() {
	const [input, setInput] = useState("");
	const [options, setOptions] = useState<QRCodeOptions>(DEFAULT_OPTIONS);
	const [result, setResult] = useState<QRCodeResult | null>(null);
	const [isGenerating, setIsGenerating] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const updateOption = useCallback(
		<K extends keyof QRCodeOptions>(key: K, value: QRCodeOptions[K]) => {
			setOptions((prev) => ({ ...prev, [key]: value }));
		},
		[],
	);

	const generateQRCode = useCallback(async () => {
		const validation = validateQRCodeInput(input);
		if (!validation.isValid) {
			setError(validation.error || "Invalid input");
			return;
		}

		setIsGenerating(true);
		setError(null);

		try {
			// Small delay to show loading state
			await new Promise((resolve) => setTimeout(resolve, 100));

			const qrOptions: QRCodeOptions = {
				...options,
				value: input,
			};

			const qrResult = generateQRCodeResult(input, qrOptions);
			setResult(qrResult);
		} catch (err) {
			setError(
				err instanceof Error ? err.message : "Failed to generate QR code",
			);
		} finally {
			setIsGenerating(false);
		}
	}, [input, options]);

	const autoAdjustSize = useCallback(() => {
		const recommendedSize = getRecommendedSize(input.length);
		updateOption("size", recommendedSize);
	}, [input.length, updateOption]);

	const resetOptions = useCallback(() => {
		setOptions(DEFAULT_OPTIONS);
	}, []);

	const clearAll = useCallback(() => {
		setInput("");
		setResult(null);
		setError(null);
		setOptions(DEFAULT_OPTIONS);
	}, []);

	const updateInput = useCallback((value: string) => {
		setInput(value);
		setError(null); // Clear error when input changes
	}, []);

	const clearInput = useCallback(() => {
		setInput("");
		setError(null);
	}, []);

	const clearResult = useCallback(() => {
		setResult(null);
		setError(null);
	}, []);

	return {
		input,
		updateInput,
		options,
		updateOption,
		result,
		isGenerating,
		error,
		generateQRCode,
		autoAdjustSize,
		resetOptions,
		clearInput,
		clearAll,
		clearResult,
		hasInput: !!input.trim(),
		hasResult: !!result,
	};
}
