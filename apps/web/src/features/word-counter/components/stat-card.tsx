import type { LucideIcon } from "lucide-react";
import { StatCard as BaseStatCard } from "@/components/stat-card";

interface StatCardProps {
	icon: LucideIcon;
	value: string | number;
	label: string;
	iconColor?: string;
	bgColor?: string;
}

export function StatCard(props: StatCardProps) {
	return <BaseStatCard {...props} />;
}
