"use client";

import {
	BarChart3,
	FileText,
	HardDrive,
	TrendingDown,
	TrendingUp,
	Type,
} from "lucide-react";
import { memo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Base64Stats, ConversionMode } from "../types";
import { formatFileSize } from "../utils/base64-operations";

interface StatsCardProps {
	stats: Base64Stats;
	mode: ConversionMode;
	hasInput: boolean;
	hasOutput: boolean;
	className?: string;
}

export const StatsCard = memo(function StatsCard({
	stats,
	mode,
	hasInput,
	hasOutput,
	className,
}: StatsCardProps) {
	const formatNumber = (num: number): string => {
		return num.toLocaleString();
	};

	const formatPercentage = (ratio: number): string => {
		return `${((ratio - 1) * 100).toFixed(1)}%`;
	};

	const getSizeChangeIcon = () => {
		if (stats.compressionRatio > 1) {
			return <TrendingUp className="h-4 w-4 text-orange-500" />;
		}
		if (stats.compressionRatio < 1) {
			return <TrendingDown className="h-4 w-4 text-green-500" />;
		}
		return <BarChart3 className="h-4 w-4 text-blue-500" />;
	};

	const getSizeChangeText = () => {
		if (stats.compressionRatio > 1) {
			return `+${formatPercentage(stats.compressionRatio)} larger`;
		}
		if (stats.compressionRatio < 1) {
			return `${formatPercentage(stats.compressionRatio)} smaller`;
		}
		return "Same size";
	};

	const getEfficiencyColor = () => {
		if (mode === "encode") {
			// For encoding, Base64 typically increases size by ~33%
			if (stats.compressionRatio <= 1.35)
				return "text-green-600 dark:text-green-400";
			if (stats.compressionRatio <= 1.5)
				return "text-yellow-600 dark:text-yellow-400";
			return "text-orange-600 dark:text-orange-400";
		}
		// For decoding, we expect size reduction
		if (stats.compressionRatio <= 0.8)
			return "text-green-600 dark:text-green-400";
		if (stats.compressionRatio <= 1.0)
			return "text-yellow-600 dark:text-yellow-400";
		return "text-orange-600 dark:text-orange-400";
	};

	if (!hasInput && !hasOutput) {
		return (
			<Card className={className}>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<BarChart3 className="h-5 w-5" />
						Conversion Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex h-32 items-center justify-center text-center text-muted-foreground">
						<div>
							<BarChart3 className="mx-auto mb-2 h-8 w-8 opacity-50" />
							<p className="text-sm">
								Statistics will appear here once you add input
							</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<BarChart3 className="h-5 w-5" />
					Conversion Statistics
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4">
					{/* Input Size */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<HardDrive className="h-4 w-4" />
							{mode === "encode" ? "Original Size" : "Encoded Size"}
						</div>
						<div className="font-semibold text-lg">
							{formatFileSize(stats.originalSize)}
						</div>
					</div>

					{/* Output Size */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<HardDrive className="h-4 w-4" />
							{mode === "encode" ? "Encoded Size" : "Decoded Size"}
						</div>
						<div className="font-semibold text-lg">
							{formatFileSize(stats.encodedSize)}
						</div>
					</div>

					{/* Characters */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<Type className="h-4 w-4" />
							Characters
						</div>
						<div className="font-semibold text-lg">
							{formatNumber(stats.characters)}
						</div>
					</div>

					{/* Lines */}
					<div className="space-y-2">
						<div className="flex items-center gap-2 text-muted-foreground text-sm">
							<FileText className="h-4 w-4" />
							Lines
						</div>
						<div className="font-semibold text-lg">
							{formatNumber(stats.lines)}
						</div>
					</div>
				</div>

				{/* Size Change Indicator */}
				{hasOutput && stats.compressionRatio > 0 && (
					<div className="mt-4 rounded-lg border bg-muted/50 p-3">
						<div className="flex items-center justify-between">
							<div className="flex items-center gap-2">
								{getSizeChangeIcon()}
								<span className="font-medium text-sm">Size Change</span>
							</div>
							<div className={`font-semibold text-sm ${getEfficiencyColor()}`}>
								{getSizeChangeText()}
							</div>
						</div>
						<div className="mt-2 text-muted-foreground text-xs">
							{mode === "encode"
								? "Base64 encoding typically increases size by ~33% due to character set conversion."
								: "Base64 decoding restores original size by removing encoding overhead."}
						</div>
					</div>
				)}

				{/* Efficiency Tips */}
				{hasInput && (
					<div className="mt-4 rounded-lg border bg-blue-50 p-3 dark:bg-blue-950">
						<div className="text-blue-800 text-sm dark:text-blue-200">
							<div className="mb-1 font-medium">💡 Tip:</div>
							{mode === "encode" ? (
								<div>
									Base64 is ideal for embedding binary data in text formats like
									JSON or XML. For large files, consider compression before
									encoding.
								</div>
							) : (
								<div>
									Always validate decoded content, especially when handling user
									input. Base64 can contain any type of data.
								</div>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
});
