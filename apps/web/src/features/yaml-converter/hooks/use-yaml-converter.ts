import * as yaml from "js-yaml";
import { useMemo, useState } from "react";
import type {
	ConversionMode,
	ConversionOptions,
	ConversionResult,
	ConversionStats,
} from "../types";

const DEFAULT_OPTIONS: ConversionOptions = {
	indent: 2,
	quotingType: "minimal",
	lineWidth: 80,
	noRefs: false,
	noCompatMode: false,
};

const SAMPLE_YAML = `name: John Doe
age: 30
email: john.doe@example.com
address:
  street: 123 Main St
  city: Anytown
  country: USA
hobbies:
  - reading
  - swimming
  - coding
active: true`;

const SAMPLE_JSON = `{
  "name": "John Doe",
  "age": 30,
  "email": "john.doe@example.com",
  "address": {
    "street": "123 Main St",
    "city": "Anytown",
    "country": "USA"
  },
  "hobbies": [
    "reading",
    "swimming",
    "coding"
  ],
  "active": true
}`;

export function useYamlConverter() {
	const [input, setInput] = useState("");
	const [conversionMode, setConversionMode] =
		useState<ConversionMode>("yaml-to-json");
	const [options, setOptions] = useState<ConversionOptions>(DEFAULT_OPTIONS);

	const conversionResult = useMemo<ConversionResult>(() => {
		if (!input.trim()) {
			return { data: null, isValid: true };
		}

		const startTime = performance.now();
		try {
			let result: string;

			if (conversionMode === "yaml-to-json") {
				// Parse YAML and convert to JSON
				const parsed = yaml.load(input);
				result = JSON.stringify(parsed, null, options.indent);
			} else {
				// Parse JSON and convert to YAML
				const parsed = JSON.parse(input);
				result = yaml.dump(parsed, {
					indent: options.indent,
					lineWidth: options.lineWidth,
					noRefs: options.noRefs,
					noCompatMode: options.noCompatMode,
					quotingType:
						options.quotingType === "single"
							? "'"
							: options.quotingType === "double"
								? '"'
								: undefined,
				});
			}

			return {
				data: result,
				isValid: true,
				processingTime: performance.now() - startTime,
			};
		} catch (error) {
			return {
				data: null,
				isValid: false,
				error: error instanceof Error ? error.message : "Unknown error",
				processingTime: performance.now() - startTime,
			};
		}
	}, [input, conversionMode, options]);

	const stats = useMemo<ConversionStats>(() => {
		const inputLines = input ? input.split("\n").length : 0;
		const outputLines = conversionResult.data
			? conversionResult.data.split("\n").length
			: 0;
		const inputSize = new Blob([input]).size;
		const outputSize = conversionResult.data
			? new Blob([conversionResult.data]).size
			: 0;

		return {
			inputLines,
			outputLines,
			inputSize,
			outputSize,
			processingTime: conversionResult.processingTime || 0,
		};
	}, [input, conversionResult]);

	const handleClear = () => {
		setInput("");
	};

	const handleModeSwitch = () => {
		setConversionMode((prev) =>
			prev === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json",
		);
		// Clear input when switching modes
		setInput("");
	};

	const handleOptionsChange = (newOptions: Partial<ConversionOptions>) => {
		setOptions((prev) => ({ ...prev, ...newOptions }));
	};

	const handleLoadSample = () => {
		const sample =
			conversionMode === "yaml-to-json" ? SAMPLE_YAML : SAMPLE_JSON;
		setInput(sample);
	};

	return {
		input,
		setInput,
		conversionMode,
		options,
		conversionResult,
		stats,
		handleClear,
		handleModeSwitch,
		handleOptionsChange,
		handleLoadSample,
	};
}
