interface PageHeaderProps {
	title: string;
	description: string;
}

export function PageHeader({ title, description }: PageHeaderProps) {
	return (
		<div className="space-y-2 text-center">
			<h1 className="font-bold text-3xl tracking-tight">{title}</h1>
			<p className="text-muted-foreground">{description}</p>
		</div>
	);
}
