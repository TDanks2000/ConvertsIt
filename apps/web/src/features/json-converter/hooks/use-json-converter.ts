import { useCallback, useMemo, useState } from "react";
import type {
	ConversionMode,
	ConversionOptions,
	ConversionResult,
	ConversionStats,
} from "../types";
import {
	calculateConversionStats,
	csvToJson,
	jsonToCsv,
} from "../utils/conversion-operations";

export function useJsonConverter() {
	const [input, setInput] = useState("");
	const [conversionMode, setConversionMode] =
		useState<ConversionMode>("json-to-csv");
	const [options, setOptions] = useState<ConversionOptions>({
		delimiter: ",",
		quoteChar: '"',
		escapeChar: '"',
		includeHeaders: true,
		flattenObjects: true,
		maxDepth: 3,
	});

	const conversionResult = useMemo((): ConversionResult => {
		if (!input.trim()) {
			return { isValid: true, data: "" };
		}

		const startTime = performance.now();
		let result: ConversionResult;

		if (conversionMode === "json-to-csv") {
			result = jsonToCsv(input, options);
		} else {
			result = csvToJson(input, options);
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
			conversionMode === "json-to-csv" ? "csv-to-json" : "json-to-csv";
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
		if (conversionMode === "json-to-csv") {
			const sampleJson = [
				{
					id: 1,
					name: "John Doe",
					email: "john.doe@example.com",
					age: 30,
					city: "New York",
					isActive: true,
					address: {
						street: "123 Main St",
						zipCode: "10001",
					},
				},
				{
					id: 2,
					name: "Jane Smith",
					email: "jane.smith@example.com",
					age: 25,
					city: "Los Angeles",
					isActive: false,
					address: {
						street: "456 Oak Ave",
						zipCode: "90210",
					},
				},
				{
					id: 3,
					name: "Bob Johnson",
					email: "bob.johnson@example.com",
					age: 35,
					city: "Chicago",
					isActive: true,
					address: {
						street: "789 Pine Rd",
						zipCode: "60601",
					},
				},
			];
			setInput(JSON.stringify(sampleJson, null, 2));
		} else {
			const sampleCsv = `id,name,email,age,city,isActive,address.street,address.zipCode
1,"John Doe","john.doe@example.com",30,"New York",true,"123 Main St","10001"
2,"Jane Smith","jane.smith@example.com",25,"Los Angeles",false,"456 Oak Ave","90210"
3,"Bob Johnson","bob.johnson@example.com",35,"Chicago",true,"789 Pine Rd","60601"`;
			setInput(sampleCsv);
		}
	}, [conversionMode]);

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
	};
}
