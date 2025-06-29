import { Code, FileText } from "lucide-react";

interface PageHeaderProps {
	title?: string;
	description?: string;
}

export function PageHeader({
	title = "Markdown to HTML Converter",
	description = "Convert your markdown text to HTML with live preview and syntax highlighting",
}: PageHeaderProps) {
	return (
		<div className="space-y-2 text-center">
			<div className="flex items-center justify-center gap-2">
				<FileText className="h-8 w-8 text-primary" />
				<Code className="h-8 w-8 text-primary" />
			</div>
			<h1 className="font-bold text-3xl tracking-tight">{title}</h1>
			<p className="mx-auto max-w-2xl text-muted-foreground">{description}</p>
		</div>
	);
}
