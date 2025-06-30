import { Code, FileText } from "lucide-react";
import { PageHeader as BasePageHeader } from "@/components/page-header";

interface PageHeaderProps {
	title?: string;
	description?: string;
}

export function PageHeader({
	title = "Markdown to HTML Converter",
	description = "Convert your markdown text to HTML with live preview and syntax highlighting",
}: PageHeaderProps) {
	return (
		<BasePageHeader
			title={title}
			description={description}
			icons={[FileText, Code]}
		/>
	);
}
