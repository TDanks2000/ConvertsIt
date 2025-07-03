"use client";

import { Search, Zap } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toolCategories } from "@/constants/tools";

interface SearchBarProps {
	placeholder?: string;
	showSuggestions?: boolean;
}

export function SearchBar({
	placeholder = "Search tools...",
	showSuggestions = true,
}: SearchBarProps) {
	const [query, setQuery] = useState("");
	const [isOpen, setIsOpen] = useState(false);

	// Get all tools for search
	const allTools = toolCategories.flatMap((category) =>
		category.tools.map((tool) => ({ ...tool, category: category.label })),
	);

	// Filter tools based on query
	const filteredTools =
		query.length > 0
			? allTools
					.filter(
						(tool) =>
							tool.title.toLowerCase().includes(query.toLowerCase()) ||
							tool.description.toLowerCase().includes(query.toLowerCase()) ||
							tool.category.toLowerCase().includes(query.toLowerCase()),
					)
					.slice(0, 6)
			: [];

	const popularTools = allTools.filter((category) => category.isPopular);

	return (
		<div className="relative z-50 mx-auto w-full max-w-2xl">
			<div className="relative">
				<Search className="-translate-y-1/2 absolute top-1/2 left-4 h-5 w-5 transform text-muted-foreground" />
				<Input
					type="text"
					placeholder={placeholder}
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onFocus={() => setIsOpen(true)}
					onBlur={() => setTimeout(() => setIsOpen(false), 200)}
					className="border-2 py-6 pr-4 pl-12 text-lg transition-colors focus:border-primary/50"
				/>
			</div>

			{/* Search Results / Suggestions */}
			{showSuggestions && isOpen && (
				<Card className="absolute top-full z-50 mt-2 w-full border-2 shadow-lg">
					<CardContent className="p-4">
						{query.length > 0 ? (
							<div>
								<h4 className="mb-3 font-semibold text-muted-foreground text-sm">
									Search Results ({filteredTools.length})
								</h4>
								{filteredTools.length > 0 ? (
									<div className="space-y-2">
										{filteredTools.map((tool) => (
											<Link key={tool.href} href={tool.href}>
												<div className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
													<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
														{tool.icon}
													</div>
													<div className="flex-1">
														<div className="flex items-center gap-2">
															<span className="font-medium">{tool.title}</span>
															<Badge variant="outline" className="text-xs">
																{tool.category}
															</Badge>
														</div>
														<p className="line-clamp-1 flex-1 text-left text-muted-foreground text-sm">
															{tool.description}
														</p>
													</div>
												</div>
											</Link>
										))}
									</div>
								) : (
									<p className="py-4 text-center text-muted-foreground">
										No tools found for "{query}"
									</p>
								)}
							</div>
						) : (
							<div>
								<h4 className="mb-3 font-semibold text-muted-foreground text-sm">
									Popular Tools
								</h4>
								<div className="space-y-2">
									{popularTools.map((tool) => (
										<Link key={tool.href} href={tool.href}>
											<div className="flex cursor-pointer items-center gap-3 rounded-lg p-3 transition-colors hover:bg-muted/50">
												<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10">
													{tool.icon}
												</div>
												<div className="flex-1 text-left">
													<span className="font-medium">{tool.title}</span>
													<p className="line-clamp-1 text-muted-foreground text-sm">
														{tool.description}
													</p>
												</div>
												<Zap className="h-4 w-4 text-yellow-500" />
											</div>
										</Link>
									))}
								</div>
							</div>
						)}
					</CardContent>
				</Card>
			)}
		</div>
	);
}
