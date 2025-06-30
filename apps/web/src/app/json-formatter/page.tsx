import type { Metadata } from "next";
import { JsonFormatter } from "@/features/json-formatter/components/json-formatter";

export const metadata: Metadata = {
	title: "JSON Formatter",
	description: "Format, validate, beautify, and minify JSON data for free.",
};

export default function JsonFormatterPage() {
	return <JsonFormatter />;
}
