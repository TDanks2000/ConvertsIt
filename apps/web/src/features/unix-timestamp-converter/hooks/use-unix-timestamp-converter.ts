import { useCallback, useMemo, useState } from "react";
import type {
	ConversionMode,
	ConversionOptions,
	ConversionResult,
	ConversionStats,
} from "../types";
import {
	calculateConversionStats,
	dateToTimestamp,
	timestampToDate,
} from "../utils/conversion-operations";

export function useUnixTimestampConverter() {
	const [input, setInput] = useState("");
	const [conversionMode, setConversionMode] =
		useState<ConversionMode>("timestamp-to-date");
	const [options, setOptions] = useState<ConversionOptions>({
		timestampFormat: "seconds",
		dateFormat: "iso",
		timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

	const conversionResult = useMemo((): ConversionResult => {
		if (!input.trim()) {
			return { isValid: true, data: "" };
		}

		const startTime = performance.now();
		let result: ConversionResult;

		if (conversionMode === "timestamp-to-date") {
			result = timestampToDate(input, options);
		} else {
			result = dateToTimestamp(input, options);
		}

		const endTime = performance.now();
		const conversionTime = endTime - startTime;

		// Store conversion time for stats
		if (result.isValid && result.data) {
			result.conversionTime = conversionTime;
		}

		return result;
	}, [input, conversionMode, options]);

	const stats = useMemo((): ConversionStats => {
		const conversionTime = conversionResult.conversionTime || 0;
		return calculateConversionStats(
			input,
			conversionResult.data || "",
			conversionTime,
		);
	}, [input, conversionResult]);

	const handleClear = useCallback(() => {
		setInput("");
	}, []);

	const handleModeSwitch = useCallback(() => {
		const newMode =
			conversionMode === "timestamp-to-date"
				? "date-to-timestamp"
				: "timestamp-to-date";
		setConversionMode(newMode);

		// If there's valid output, swap input and output
		if (conversionResult.isValid && conversionResult.data) {
			setInput(conversionResult.data);
		}
	}, [conversionMode, conversionResult]);

	const handleOptionsChange = useCallback(
		(newOptions: Partial<ConversionOptions>) => {
			setOptions((prev) => ({ ...prev, ...newOptions }));
		},
		[],
	);

	const handleLoadSample = useCallback(() => {
		if (conversionMode === "timestamp-to-date") {
			// Current timestamp in seconds
			const currentTimestamp = Math.floor(Date.now() / 1000);
			setInput(currentTimestamp.toString());
		} else {
			// Current date in ISO format
			const currentDate = new Date().toISOString();
			setInput(currentDate);
		}
	}, [conversionMode]);

	const handleLoadCurrentTimestamp = useCallback(() => {
		const currentTimestamp =
			options.timestampFormat === "seconds"
				? Math.floor(Date.now() / 1000)
				: Date.now();
		setInput(currentTimestamp.toString());
		setConversionMode("timestamp-to-date");
	}, [options.timestampFormat]);

	const handleLoadCurrentDate = useCallback(() => {
		const currentDate = new Date();
		let dateString: string;

		switch (options.dateFormat) {
			case "iso":
				dateString = currentDate.toISOString();
				break;
			case "local":
				dateString = currentDate.toLocaleString();
				break;
			case "utc":
				dateString = currentDate.toUTCString();
				break;
			default:
				dateString = currentDate.toISOString();
		}

		setInput(dateString);
		setConversionMode("date-to-timestamp");
	}, [options.dateFormat]);

	return {
		input,
		setInput,
		conversionMode,
		setConversionMode,
		options,
		conversionResult,
		stats,
		handleClear,
		handleModeSwitch,
		handleOptionsChange,
		handleLoadSample,
		handleLoadCurrentTimestamp,
		handleLoadCurrentDate,
	};
}
