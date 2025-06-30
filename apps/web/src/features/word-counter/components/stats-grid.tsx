import { Clock, FileText, Hash, Layers, Type } from "lucide-react";
import { StatCard } from "@/components";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TextStats } from "../types";

interface StatsGridProps {
	stats: TextStats;
	viewMode: "compact" | "detailed";
}

export function StatsGrid({ stats, viewMode }: StatsGridProps) {
	if (viewMode === "compact") {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Type className="h-5 w-5" />
						Text Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid grid-cols-2 gap-4">
						<div className="space-y-1">
							<p className="font-bold text-2xl text-primary">
								{stats.words.toLocaleString()}
							</p>
							<p className="text-muted-foreground text-sm">Words</p>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-2xl text-blue-500">
								{stats.characters.toLocaleString()}
							</p>
							<p className="text-muted-foreground text-sm">Characters</p>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-2xl text-orange-500">
								{stats.lines.toLocaleString()}
							</p>
							<p className="text-muted-foreground text-sm">Lines</p>
						</div>
						<div className="space-y-1">
							<p className="font-bold text-2xl text-pink-500">
								{stats.readingTimeMinutes}m
							</p>
							<p className="text-muted-foreground text-sm">Reading time</p>
						</div>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<div className="space-y-4">
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Type className="h-5 w-5" />
						Primary Statistics
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
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
					</div>
				</CardContent>
			</Card>

			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Layers className="h-5 w-5" />
						Structure
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="grid gap-4">
						<StatCard
							icon={FileText}
							value={stats.lines}
							label="Lines"
							iconColor="text-orange-500"
							bgColor="bg-orange-500/10"
						/>

						<StatCard
							icon={Layers}
							value={stats.paragraphs}
							label="Paragraphs"
							iconColor="text-purple-500"
							bgColor="bg-purple-500/10"
						/>

						<StatCard
							icon={Clock}
							value={stats.readingTimeMinutes}
							label="Minutes to read"
							iconColor="text-pink-500"
							bgColor="bg-pink-500/10"
						/>
					</div>
				</CardContent>
			</Card>
		</div>
	);
}
