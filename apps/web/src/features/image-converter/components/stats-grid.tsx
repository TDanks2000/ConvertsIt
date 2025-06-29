import { CheckCircle, FileImage, HardDrive, TrendingDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import type { ImageStats } from "../types";
import { ImageConverter } from "../utils/image-converter";

interface StatsGridProps {
	stats: ImageStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
	const statItems = [
		{
			label: "Total Images",
			value: stats.totalFiles.toString(),
			icon: FileImage,
			description: "Images uploaded",
		},
		{
			label: "Completed",
			value: `${stats.completedFiles}/${stats.totalFiles}`,
			icon: CheckCircle,
			description: "Successfully converted",
		},
		{
			label: "Total Size",
			value: ImageConverter.formatFileSize(stats.totalSize),
			icon: HardDrive,
			description: "Original file size",
		},
		{
			label: "Space Saved",
			value: `${stats.compressionRatio.toFixed(1)}%`,
			icon: TrendingDown,
			description: "Compression achieved",
		},
	];

	if (stats.totalFiles === 0) {
		return null;
	}

	return (
		<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
			{statItems.map((item) => {
				const Icon = item.icon;
				return (
					<Card key={item.label} className="p-4">
						<div className="flex items-center space-x-3">
							<div className="rounded-full bg-primary/10 p-2">
								<Icon className="h-4 w-4 text-primary" />
							</div>
							<div className="space-y-1">
								<p className="font-medium text-sm leading-none">{item.label}</p>
								<p className="text-muted-foreground text-xs">
									{item.description}
								</p>
							</div>
						</div>
						<div className="mt-3">
							<p className="font-bold text-2xl">{item.value}</p>
						</div>
					</Card>
				);
			})}
		</div>
	);
}
