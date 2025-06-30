import type { Metadata } from "next";
import { JsonConverter } from "@/features/json-converter/components/json-converter";

export const metadata: Metadata = {
	title: "JSON to CSV Converter",
	description:
		"Convert JSON to CSV and CSV to JSON for free. Bidirectional data conversion tool.",
};

export default function JsonConverterPage() {
	return <JsonConverter />;
}
