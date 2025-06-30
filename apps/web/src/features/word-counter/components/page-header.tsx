import { Hash, Type } from "lucide-react";
import { PageHeader as BasePageHeader } from "@/components/page-header";

interface PageHeaderProps {
	title?: string;
	description?: string;
}

export function PageHeader({
	title = "Word Counter",
	description = "Analyze your text with real-time word, character, and line counting plus advanced text statistics",
}: PageHeaderProps) {
	return (
		<BasePageHeader
			title={title}
			description={description}
			icons={[Type, Hash]}
		/>
	);
}
