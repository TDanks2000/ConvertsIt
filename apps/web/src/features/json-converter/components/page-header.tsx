import { PageHeader as BasePageHeader } from "@/components/page-header";

export function PageHeader() {
	return (
		<BasePageHeader
			title="JSON Converter"
			description="Convert between JSON and CSV formats with ease. Transform JSON arrays to CSV tables or CSV data back to JSON objects with customizable options."
		/>
	);
}
