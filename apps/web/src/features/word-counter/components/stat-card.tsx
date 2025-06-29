import type { LucideIcon } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

interface StatCardProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	iconColor?: string;
	bgColor?: string;
}

export function StatCard({
	icon: Icon,
	value,
	label,
	iconColor = "text-primary",
	bgColor = "bg-primary/10",
}: StatCardProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex items-center space-x-4">
					<div className={`rounded-lg p-2 ${bgColor}`}>
						<Icon className={`h-6 w-6 ${iconColor}`} />
					</div>
					<div>
						<p className="font-bold text-2xl">
							{typeof value === "number" ? value.toLocaleString() : value}
						</p>
						<p className="text-muted-foreground text-sm">{label}</p>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
