import { PageHeader as BasePageHeader } from "@/components/page-header";

interface PageHeaderProps {
	title: string;
	description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return <BasePageHeader title={title} description={description} />;
}
