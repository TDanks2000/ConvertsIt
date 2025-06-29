import { FileText, Hash, Type } from "lucide-react";
import type { TextStats } from "../types";
import { StatCard } from "./stat-card";

interface StatsGridProps {
	stats: TextStats;
}

export function StatsGrid({ stats }: StatsGridProps) {
	return (
		<div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
			<StatCard
				icon={Type}
				value={stats.words}
				label="Words"
				iconColor="text-primary"
				bgColor="bg-primary/10"
			/>

			<StatCard
				icon={Hash}
				value={stats.characters}
				label="Characters"
				iconColor="text-blue-500"
				bgColor="bg-blue-500/10"
			/>

			<StatCard
				icon={Hash}
				value={stats.charactersNoSpaces}
				label="Characters (no spaces)"
				iconColor="text-green-500"
				bgColor="bg-green-500/10"
			/>

			<StatCard
				icon={FileText}
				value={stats.lines}
				label="Lines"
				iconColor="text-orange-500"
				bgColor="bg-orange-500/10"
			/>

			<StatCard
				icon={FileText}
				value={stats.paragraphs}
				label="Paragraphs"
				iconColor="text-purple-500"
				bgColor="bg-purple-500/10"
			/>

			<StatCard
				icon={Type}
				value={stats.readingTimeMinutes}
				label="Minutes to read"
				iconColor="text-pink-500"
				bgColor="bg-pink-500/10"
			/>
		</div>
	);
}
