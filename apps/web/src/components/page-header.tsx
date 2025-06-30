import type { LucideIcon } from "lucide-react";

interface PageHeaderProps {
	title: string;
	description: string;
	icons?: LucideIcon[];
	iconClassName?: string;
}

export function PageHeader({
	title,
	description,
	icons = [],
	iconClassName = "h-8 w-8 text-primary",
}: PageHeaderProps) {
	return (
		<div className="space-y-2 text-center">
			{icons.length > 0 && (
				<div className="flex items-center justify-center gap-2">
					{icons.map((Icon, index) => (
						<Icon key={Icon.displayName ?? index} className={iconClassName} />
					))}
				</div>
			)}
			<h1 className="font-bold text-3xl tracking-tight">{title}</h1>
			<p className="mx-auto max-w-2xl text-muted-foreground">{description}</p>
		</div>
	);
}
