import { Calendar, Clock, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { ConversionStats } from "../types";

interface StatsCardProps {
	stats: ConversionStats;
	isValid: boolean;
}

export function StatsCard({ stats, isValid }: StatsCardProps) {
	const formatBytes = (bytes: number) => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	const formatTime = (ms: number) => {
		if (ms < 1) return "< 1ms";
		return `${ms.toFixed(2)}ms`;
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Zap className="h-4 w-4" />
					Conversion Stats
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="space-y-3">
					<div className="flex items-center justify-between">
						<span className="text-muted-foreground text-sm">Status</span>
						<Badge variant={isValid ? "default" : "destructive"}>
							{isValid ? "Valid" : "Invalid"}
						</Badge>
					</div>

					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1 text-muted-foreground text-sm">
							<Calendar className="h-3 w-3" />
							Input Size
						</span>
						<span className="font-mono text-sm">
							{formatBytes(stats.inputSize)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1 text-muted-foreground text-sm">
							<Calendar className="h-3 w-3" />
							Output Size
						</span>
						<span className="font-mono text-sm">
							{formatBytes(stats.outputSize)}
						</span>
					</div>

					<div className="flex items-center justify-between">
						<span className="flex items-center gap-1 text-muted-foreground text-sm">
							<Clock className="h-3 w-3" />
							Conversion Time
						</span>
						<span className="font-mono text-sm">
							{formatTime(stats.conversionTime)}
						</span>
					</div>
				</div>

				{isValid && (
					<div className="border-t pt-3">
						<div className="space-y-1 text-muted-foreground text-xs">
							<div>Current Time: {new Date().toLocaleString()}</div>
							<div>
								Timezone: {Intl.DateTimeFormat().resolvedOptions().timeZone}
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
