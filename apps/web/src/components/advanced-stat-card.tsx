"use client";

import type { LucideIcon } from "lucide-react";
import { Loader2, TrendingDown, TrendingUp } from "lucide-react";
import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type StatCardVariant = "default" | "success" | "warning" | "danger" | "info";
type StatCardSize = "sm" | "md" | "lg";

interface StatCardProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	iconColor?: string;
	bgColor?: string;
	valueClassName?: string;
	labelClassName?: string;
	trend?: {
		value: number;
		label: string;
		isPositive: boolean;
	};
	animated?: boolean;
	variant?: StatCardVariant;
	size?: StatCardSize;
	isLoading?: boolean;
	clickable?: boolean;
	onClick?: () => void;
	description?: string;
	showProgress?: boolean;
	progressValue?: number;
}

const variantStyles = {
	default: {
		card: "from-background to-muted/20",
		icon: "bg-primary/10 text-primary",
		accent: "from-primary/20 via-primary/40 to-primary/20",
	},
	success: {
		card: "from-background to-emerald-50/50 dark:to-emerald-950/20",
		icon: "bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400",
		accent: "from-emerald-400/20 via-emerald-500/40 to-emerald-400/20",
	},
	warning: {
		card: "from-background to-amber-50/50 dark:to-amber-950/20",
		icon: "bg-amber-100 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400",
		accent: "from-amber-400/20 via-amber-500/40 to-amber-400/20",
	},
	danger: {
		card: "from-background to-red-50/50 dark:to-red-950/20",
		icon: "bg-red-100 text-red-600 dark:bg-red-950/50 dark:text-red-400",
		accent: "from-red-400/20 via-red-500/40 to-red-400/20",
	},
	info: {
		card: "from-background to-blue-50/50 dark:to-blue-950/20",
		icon: "bg-blue-100 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400",
		accent: "from-blue-400/20 via-blue-500/40 to-blue-400/20",
	},
};

const sizeStyles = {
	sm: {
		card: "p-4",
		icon: "h-8 w-8",
		iconSize: "h-4 w-4",
		value: "text-xl font-bold",
		label: "text-xs",
		spacing: "mb-3 space-y-1",
	},
	md: {
		card: "p-6",
		icon: "h-12 w-12",
		iconSize: "h-6 w-6",
		value: "text-3xl font-bold",
		label: "text-sm",
		spacing: "mb-4 space-y-2",
	},
	lg: {
		card: "p-8",
		icon: "h-16 w-16",
		iconSize: "h-8 w-8",
		value: "text-4xl font-bold",
		label: "text-base",
		spacing: "mb-6 space-y-3",
	},
};

export function AdvancedStatCard({
	icon: Icon,
	value,
	label,
	iconColor,
	bgColor,
	valueClassName,
	labelClassName,
	trend,
	animated = false,
	variant = "default",
	size = "md",
	isLoading = false,
	clickable = false,
	onClick,
	description,
	showProgress = false,
	progressValue = 0,
}: StatCardProps) {
	const [isHovered, setIsHovered] = useState(false);
	const [displayValue, setDisplayValue] = useState(0);

	const variantStyle = variantStyles[variant];
	const sizeStyle = sizeStyles[size];

	// Animated counter effect
	useEffect(() => {
		if (animated && typeof value === "number" && !isLoading) {
			const duration = 2000;
			const steps = 60;
			const increment = value / steps;
			let current = 0;

			const timer = setInterval(() => {
				current += increment;
				if (current >= value) {
					current = value;
					clearInterval(timer);
				}
				setDisplayValue(Math.floor(current));
			}, duration / steps);

			return () => clearInterval(timer);
		}
		setDisplayValue(typeof value === "number" ? value : 0);
	}, [value, animated, isLoading]);
	return (
		<Card
			className={cn(
				"group relative overflow-hidden border-0 bg-gradient-to-br transition-all duration-500",
				variantStyle.card,
				clickable
					? "hover:-translate-y-3 cursor-pointer hover:shadow-2xl active:scale-[0.98]"
					: "hover:-translate-y-2 hover:shadow-xl",
				isHovered && "shadow-xl",
				isLoading && "animate-pulse",
			)}
			onClick={clickable ? onClick : undefined}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
			role={clickable ? "button" : undefined}
			tabIndex={clickable ? 0 : undefined}
			aria-label={clickable ? `${label}: ${value}` : undefined}
		>
			<CardContent className={sizeStyle.card}>
				{/* Header with Icon and Trend */}
				<div
					className={cn("flex items-start justify-between", sizeStyle.spacing)}
				>
					<div
						className={cn(
							"flex items-center justify-center rounded-xl transition-all duration-500 group-hover:rotate-3 group-hover:scale-110 group-hover:shadow-lg",
							sizeStyle.icon,
							bgColor || variantStyle.icon,
							isLoading && "animate-spin",
						)}
					>
						{isLoading ? (
							<Loader2 className={cn(sizeStyle.iconSize, "animate-spin")} />
						) : (
							<Icon className={cn(sizeStyle.iconSize, iconColor)} />
						)}
					</div>

					{trend && !isLoading && (
						<Badge
							variant="secondary"
							className={cn(
								"flex items-center gap-1 border-0 font-semibold text-xs shadow-sm transition-all duration-300 hover:scale-105",
								trend.isPositive
									? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-400"
									: "bg-red-50 text-red-700 dark:bg-red-950/50 dark:text-red-400",
							)}
						>
							{trend.isPositive ? (
								<TrendingUp className="h-3 w-3" />
							) : (
								<TrendingDown className="h-3 w-3" />
							)}
							<span>
								{trend.value > 0 ? "+" : ""}
								{trend.value}%
							</span>
						</Badge>
					)}
				</div>

				{/* Main Content */}
				<div className={sizeStyle.spacing.replace("mb-", "space-y-")}>
					<div className="flex items-baseline gap-2">
						<p
							className={cn(
								valueClassName || sizeStyle.value,
								"bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent transition-all duration-500",
								isLoading && "blur-sm",
							)}
						>
							{isLoading
								? "---"
								: animated && typeof value === "number"
									? displayValue.toLocaleString()
									: typeof value === "number"
										? value.toLocaleString()
										: value}
						</p>
						{trend && !isLoading && (
							<span className="text-muted-foreground text-xs opacity-70">
								{trend.label}
							</span>
						)}
					</div>
					<p
						className={cn(
							labelClassName ||
								`${sizeStyle.label} font-medium text-muted-foreground`,
							"leading-relaxed transition-colors duration-300",
							isLoading && "blur-sm",
						)}
					>
						{isLoading ? "Loading..." : label}
					</p>
					{description && !isLoading && (
						<p className="text-muted-foreground/70 text-xs leading-relaxed">
							{description}
						</p>
					)}
				</div>

				{/* Progress Bar */}
				{showProgress && !isLoading && (
					<div className="mt-4 space-y-2">
						<div className="flex justify-between text-muted-foreground text-xs">
							<span>Progress</span>
							<span>{progressValue}%</span>
						</div>
						<div className="h-2 w-full overflow-hidden rounded-full bg-muted">
							<div
								className={cn(
									"h-full rounded-full bg-gradient-to-r transition-all duration-1000 ease-out",
									variantStyle.accent
										.replace("from-", "from-")
										.replace("via-", "to-")
										.split(" ")
										.slice(0, 2)
										.join(" "),
								)}
								style={{
									width: `${Math.min(100, Math.max(0, progressValue))}%`,
								}}
							/>
						</div>
					</div>
				)}

				{/* Enhanced accent line with variant colors */}
				<div
					className={cn(
						"absolute bottom-0 left-0 h-1 w-full bg-gradient-to-r opacity-0 transition-all duration-500 group-hover:opacity-100",
						variantStyle.accent,
						isHovered && "h-2 opacity-100",
					)}
				/>

				{/* Subtle glow effect on hover */}
				<div
					className={cn(
						"absolute inset-0 rounded-lg bg-gradient-to-r opacity-0 transition-opacity duration-500 group-hover:opacity-5",
						variantStyle.accent,
					)}
				/>
			</CardContent>
		</Card>
	);
}
