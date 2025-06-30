import type { Metadata } from "next";
import { YamlConverter } from "@/features/yaml-converter/components/yaml-converter";

export const metadata: Metadata = {
	title: "YAML Converter",
	description:
		"Convert YAML to JSON and JSON to YAML for free. Bidirectional data conversion tool with syntax validation.",
};

export default function YamlConverterPage() {
	return <YamlConverter />;
}