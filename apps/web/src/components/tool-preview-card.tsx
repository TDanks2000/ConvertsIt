"use client";

import { ArrowRight, Star, TrendingUp } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import type { Tool } from "@/constants/tools";
import { cn } from "@/lib/utils";

interface ToolPreviewCardProps extends Tool {
	category?: string;
	isPopular?: boolean;
	isNew?: boolean;
	isFeatured?: boolean;
	usageCount?: string;
	size?: "default" | "large";
}

const categoryColors = {
	"Text & Content":
		"bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400",
	"Data & Code":
		"bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400",
	"Image & Media":
		"bg-purple-100 text-purple-700 dark:bg-purple-900/20 dark:text-purple-400",
	"Security & Utilities":
		"bg-orange-100 text-orange-700 dark:bg-orange-900/20 dark:text-orange-400",
};

export function ToolPreviewCard({
	title,
	href,
	description,
	icon,
	category,
	isPopular = false,
	isNew = false,
	isFeatured = false,
	usageCount,
	size = "default",
}: ToolPreviewCardProps) {
	const cardClassName = cn(
		"group cursor-pointer transition-all duration-300",
		size === "large"
			? "hover:-translate-y-2 border-2 bg-gradient-to-br from-background to-muted/20 hover:border-primary/30 hover:shadow-primary/20 hover:shadow-xl"
			: "hover:-translate-y-1 bg-gradient-to-br from-background to-muted/10 hover:border-primary/20 hover:shadow-lg hover:shadow-primary/10",
	);

	const categoryColorClass = category
		? categoryColors[category as keyof typeof categoryColors] ||
			"bg-gray-100 text-gray-700 dark:bg-gray-900/20 dark:text-gray-400"
		: "";

	return (
		<Link href={href}>
			<Card className={cardClassName}>
				<CardHeader className={cn(size === "large" ? "p-6" : "p-4")}>
					<div className="flex items-start gap-4">
						<div
							className={cn(
								"flex items-center justify-center rounded-xl bg-primary/10 transition-all duration-300 group-hover:scale-110 group-hover:bg-primary/20 group-hover:shadow-lg",
								size === "large" ? "h-14 w-14" : "h-10 w-10",
							)}
						>
							<div className={cn(size === "large" ? "scale-125" : "scale-110")}>
								{icon}
							</div>
						</div>
						<div className="flex-1 space-y-2">
							<div className="flex items-center justify-between">
								<CardTitle
									className={cn(
										"font-semibold leading-tight transition-colors group-hover:text-primary",
										size === "large" ? "text-xl" : "text-lg",
									)}
								>
									{title}
								</CardTitle>
								<div className="flex flex-wrap gap-1">
									{isPopular && (
										<Badge
											variant="default"
											className="bg-[#3D2900] text-xs text-yellow-300 shadow-sm"
										>
											<Star className="mr-1 h-3 w-3" />
											Popular
										</Badge>
									)}
									{isNew && (
										<Badge
											variant="default"
											className="bg-green-100 text-green-800 text-xs shadow-sm dark:bg-green-900/20 dark:text-green-400"
										>
											New
										</Badge>
									)}
									{isFeatured && (
										<Badge
											variant="default"
											className="bg-purple-600 text-white text-xs shadow-sm"
										>
											<TrendingUp className="mr-1 h-3 w-3" />
											Featured
										</Badge>
									)}
								</div>
							</div>
							{category && (
								<Badge
									variant="secondary"
									className={cn("font-medium text-xs", categoryColorClass)}
								>
									{category}
								</Badge>
							)}
						</div>
					</div>
				</CardHeader>
				<CardContent
					className={cn(size === "large" ? "px-6 pt-0 pb-6" : "px-4 pt-0 pb-4")}
				>
					<div className="space-y-4">
						<CardDescription
							className={cn(
								"leading-relaxed",
								size === "large"
									? "text-base text-muted-foreground/90"
									: "text-muted-foreground text-sm",
							)}
						>
							{description}
						</CardDescription>

						{size === "large" && (
							<div className="flex items-center justify-between pt-2">
								{usageCount && (
									<div className="flex items-center gap-2">
										<div className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
										<span className="font-medium text-muted-foreground text-sm">
											{usageCount} uses this month
										</span>
									</div>
								)}
								<Button
									variant="default"
									size="sm"
									className="ml-auto bg-primary/90 shadow-md transition-all duration-300 hover:bg-primary group-hover:scale-105 group-hover:shadow-lg"
								>
									Try Now
									<ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>
		</Link>
	);
}
