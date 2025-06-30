import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { ConversionStats } from "../types";

interface StatsCardProps {
	stats: ConversionStats;
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

	const formatTime = (ms: number): string => {
		if (ms < 1) return "< 1ms";
		return `${ms.toFixed(1)}ms`;
	};

	return (
		<Card>
			<CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
				<CardTitle className="font-medium text-sm">Conversion Stats</CardTitle>
				<Badge variant={isValid ? "default" : "destructive"}>
					{isValid ? "Valid" : "Invalid"}
				</Badge>
			</CardHeader>
			<CardContent className="space-y-4">
				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<p className="font-bold text-2xl">
							{formatBytes(stats.inputSize)}
						</p>
						<p className="text-muted-foreground text-xs">Input Size</p>
					</div>
					<div className="space-y-1">
						<p className="font-bold text-2xl">
							{formatBytes(stats.outputSize)}
						</p>
						<p className="text-muted-foreground text-xs">Output Size</p>
					</div>
				</div>

				<Separator />

				<div className="grid grid-cols-2 gap-4">
					<div className="space-y-1">
						<p className="font-bold text-2xl">{stats.inputLines.toLocaleString()}</p>
						<p className="text-muted-foreground text-xs">Input Lines</p>
					</div>
					<div className="space-y-1">
						<p className="font-bold text-2xl">
							{stats.outputLines.toLocaleString()}
						</p>
						<p className="text-muted-foreground text-xs">Output Lines</p>
					</div>
				</div>

				<Separator />

				<div className="space-y-1">
					<p className="font-bold text-2xl">
						{formatTime(stats.processingTime)}
					</p>
					<p className="text-muted-foreground text-xs">Processing Time</p>
				</div>
			</CardContent>
		</Card>
	);
}