import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { UrlStats } from "../types";

interface StatsCardProps {
	stats: UrlStats;
}

export function StatsCard({ stats }: StatsCardProps) {
	return (
		<Card>
			<CardHeader className="pb-3">
				<CardTitle className="text-base">URL Statistics</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-2 gap-4 md:grid-cols-4">
					<div className="space-y-1">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">
							Length
						</p>
						<p className="font-mono font-semibold text-lg">
							{stats.length.toLocaleString()}
						</p>
					</div>

					<div className="space-y-1">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">
							Parameters
						</p>
						<p className="font-mono font-semibold text-lg">
							{stats.paramCount}
						</p>
					</div>

					{stats.protocol && (
						<div className="space-y-1">
							<p className="text-muted-foreground text-xs uppercase tracking-wide">
								Protocol
							</p>
							<Badge variant="secondary" className="font-mono text-xs">
								{stats.protocol}
							</Badge>
						</div>
					)}

					{stats.hostname && (
						<div className="space-y-1">
							<p className="text-muted-foreground text-xs uppercase tracking-wide">
								Hostname
							</p>
							<Badge variant="outline" className="font-mono text-xs">
								{stats.hostname}
							</Badge>
						</div>
					)}
				</div>

				{(stats.pathname || stats.search || stats.hash) && (
					<div className="mt-4 space-y-2">
						<p className="text-muted-foreground text-xs uppercase tracking-wide">
							URL Components
						</p>
						<div className="flex flex-wrap gap-2">
							{stats.pathname && stats.pathname !== "/" && (
								<Badge variant="secondary" className="font-mono text-xs">
									Path: {stats.pathname}
								</Badge>
							)}
							{stats.search && (
								<Badge variant="secondary" className="font-mono text-xs">
									Query: {stats.search}
								</Badge>
							)}
							{stats.hash && (
								<Badge variant="secondary" className="font-mono text-xs">
									Hash: {stats.hash}
								</Badge>
							)}
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}