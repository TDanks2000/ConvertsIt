import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	iconColor?: string;
	bgColor?: string;
	valueClassName?: string;
	labelClassName?: string;
}

export function StatCard({
	icon: Icon,
	value,
	label,
	iconColor = "text-primary",
	bgColor = "bg-primary/10",
	valueClassName = "font-bold text-2xl",
	labelClassName = "text-muted-foreground text-sm",
}: StatCardProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center space-x-4">
					<div className={`rounded-lg p-2 ${bgColor}`}>
						<Icon className={`h-6 w-6 ${iconColor}`} />
					</div>
					<div>
						<p className={valueClassName}>
							{typeof value === "number" ? value.toLocaleString() : value}
						</p>
						<p className={labelClassName}>{label}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}