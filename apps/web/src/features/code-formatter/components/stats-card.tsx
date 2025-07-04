"use client";

import {
	BarChart3,
	Code2,
	FileText,
	Hash,
	Layers,
	MessageSquare,
	Type,
} from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { CodeStats, SupportedLanguage } from "../types";
import { languageConfigs } from "../utils/code-operations";

interface StatsCardProps {
	stats: CodeStats;
	language: SupportedLanguage;
	className?: string;
}

export const StatsCard = memo(function StatsCard({
	stats,
	language,
	className,
}: StatsCardProps) {
	const config = languageConfigs[language];

	const formatBytes = (bytes: number): string => {
		if (bytes === 0) return "0 B";
		const k = 1024;
		const sizes = ["B", "KB", "MB", "GB"];
		const i = Math.floor(Math.log(bytes) / Math.log(k));
		return `${Number.parseFloat((bytes / k ** i).toFixed(1))} ${sizes[i]}`;
	};

	const formatNumber = (num: number): string => {
		return num.toLocaleString();
	};

	return (
		<Card className={className}>
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-base">
					<BarChart3 className="h-4 w-4" />
					Code Statistics
				</CardTitle>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="space-y-4">
					{/* Basic Stats */}
					<div className="grid grid-cols-2 gap-4">
						<div className="flex items-center gap-2">
							<FileText className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="font-medium text-sm">
									{formatNumber(stats.lines)}
								</div>
								<div className="text-muted-foreground text-xs">Lines</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Type className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="font-medium text-sm">
									{formatNumber(stats.characters)}
								</div>
								<div className="text-muted-foreground text-xs">Characters</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Hash className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="font-medium text-sm">
									{formatNumber(stats.words)}
								</div>
								<div className="text-muted-foreground text-xs">Words</div>
							</div>
						</div>

						<div className="flex items-center gap-2">
							<Layers className="h-4 w-4 text-muted-foreground" />
							<div>
								<div className="font-medium text-sm">
									{formatBytes(stats.size)}
								</div>
								<div className="text-muted-foreground text-xs">Size</div>
							</div>
						</div>
					</div>

					<Separator />

					{/* Advanced Stats */}
					<div className="space-y-3">
						<div className="font-medium text-muted-foreground text-sm">
							{config.label} Analysis
						</div>

						<div className="grid grid-cols-2 gap-4">
							<div className="flex items-center gap-2">
								<Code2 className="h-4 w-4 text-muted-foreground" />
								<div>
									<div className="font-medium text-sm">
										{formatNumber(stats.functions)}
									</div>
									<div className="text-muted-foreground text-xs">Functions</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Layers className="h-4 w-4 text-muted-foreground" />
								<div>
									<div className="font-medium text-sm">
										{formatNumber(stats.classes)}
									</div>
									<div className="text-muted-foreground text-xs">Classes</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<MessageSquare className="h-4 w-4 text-muted-foreground" />
								<div>
									<div className="font-medium text-sm">
										{formatNumber(stats.comments)}
									</div>
									<div className="text-muted-foreground text-xs">Comments</div>
								</div>
							</div>

							<div className="flex items-center gap-2">
								<Type className="h-4 w-4 text-muted-foreground" />
								<div>
									<div className="font-medium text-sm">
										{formatNumber(stats.charactersNoSpaces)}
									</div>
									<div className="text-muted-foreground text-xs">
										Chars (no spaces)
									</div>
								</div>
							</div>
						</div>
					</div>

					{/* Language Info */}
					<Separator />

					<div className="space-y-2">
						<div className="font-medium text-muted-foreground text-sm">
							Language Info
						</div>
						<div className="space-y-1">
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Language:</span>
								<span className="font-medium">{config.label}</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Extensions:</span>
								<span className="font-medium">
									{config.extensions.join(", ")}
								</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Formatting:</span>
								<span className="font-medium">
									{config.supportsFormatting ? "Supported" : "Not supported"}
								</span>
							</div>
							<div className="flex justify-between text-xs">
								<span className="text-muted-foreground">Minification:</span>
								<span className="font-medium">
									{config.supportsMinification ? "Supported" : "Not supported"}
								</span>
							</div>
						</div>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
