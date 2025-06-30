import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { JsonStats } from "../types";

interface StatsCardProps {
	stats: JsonStats;
	isValid: boolean;
}

export function StatsCard({ stats, isValid }: StatsCardProps) {
	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	const statItems = [
		{ label: "Size", value: formatBytes(stats.size) },
		{ label: "Keys", value: stats.keys.toLocaleString() },
		{ label: "Depth", value: stats.depth.toString() },
		{ label: "Objects", value: stats.objects.toLocaleString() },
		{ label: "Arrays", value: stats.arrays.toLocaleString() },
		{ label: "Strings", value: stats.strings.toLocaleString() },
		{ label: "Numbers", value: stats.numbers.toLocaleString() },
		{ label: "Booleans", value: stats.booleans.toLocaleString() },
		{ label: "Nulls", value: stats.nulls.toLocaleString() },
	];

	return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center justify-between text-lg">
						JSON Statistics
						<Badge variant={isValid ? "default" : "destructive"}>
							{isValid ? "Valid" : "Invalid"}
						</Badge>
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4 md:grid-cols-3">
						{statItems.map((item) => (
							<div key={item.label} className="space-y-1">
								<p className="text-muted-foreground text-sm">{item.label}</p>
								<p className="font-bold text-2xl">{item.value}</p>
							</div>
						))}
					</div>
				</CardContent>
			</Card>
		);
}
