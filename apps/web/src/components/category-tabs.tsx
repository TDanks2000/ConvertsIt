"use client";

import { useState } from "react";
import { ToolPreviewCard } from "@/components/tool-preview-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toolCategories } from "@/constants/tools";

interface CategoryTabsProps {
	defaultCategory?: string;
	showAllTab?: boolean;
}

const categoryAccentColors = {
	"Text & Content": "border-blue-500 bg-blue-50 dark:bg-blue-950/50",
	"Data & Code": "border-green-500 bg-green-50 dark:bg-green-950/50",
	"Image & Media": "border-purple-500 bg-purple-50 dark:bg-purple-950/50",
	"Security & Utilities":
		"border-orange-500 bg-orange-50 dark:bg-orange-950/50",
};

const categoryButtonColors = {
	"Text & Content":
		"data-[state=active]:bg-blue-100 data-[state=active]:text-blue-700 dark:data-[state=active]:bg-blue-900/20 dark:data-[state=active]:text-blue-400",
	"Data & Code":
		"data-[state=active]:bg-green-100 data-[state=active]:text-green-700 dark:data-[state=active]:bg-green-900/20 dark:data-[state=active]:text-green-400",
	"Image & Media":
		"data-[state=active]:bg-purple-100 data-[state=active]:text-purple-700 dark:data-[state=active]:bg-purple-900/20 dark:data-[state=active]:text-purple-400",
	"Security & Utilities":
		"data-[state=active]:bg-orange-100 data-[state=active]:text-orange-700 dark:data-[state=active]:bg-orange-900/20 dark:data-[state=active]:text-orange-400",
};

export function CategoryTabs({
	defaultCategory,
	showAllTab = true,
}: CategoryTabsProps) {
	const [activeCategory, setActiveCategory] = useState<string>(
		defaultCategory || "all",
	);

	// Get all tools for "All" tab
	const allTools = toolCategories.flatMap((category) =>
		category.tools.map((tool) => ({ ...tool, category: category.label })),
	);

	// Add popular and featured flags to tools
	const enhancedAllTools = allTools.map((tool, index) => ({
		...tool,
		isPopular: index < 3, // First 3 tools are popular
		isFeatured: index === 0, // First tool is featured
		usageCount:
			index === 0
				? "2.1k"
				: index === 1
					? "1.8k"
					: index === 2
						? "1.5k"
						: undefined,
	}));

	const getCurrentTools = () => {
		if (activeCategory === "all") {
			return enhancedAllTools;
		}
		const category = toolCategories.find((cat) => cat.label === activeCategory);
		return category
			? category.tools.map((tool) => ({ ...tool, category: category.label }))
			: [];
	};

	const currentTools = getCurrentTools();
	const currentCategory = toolCategories.find(
		(cat) => cat.label === activeCategory,
	);

	return (
		<div className="space-y-8">
			{/* Category Tabs */}
			<div className="flex flex-wrap justify-center gap-2">
				{showAllTab && (
					<Button
						variant={activeCategory === "all" ? "default" : "outline"}
						onClick={() => setActiveCategory("all")}
						className="transition-all duration-200"
					>
						All Tools
						<Badge variant="secondary" className="ml-2">
							{allTools.length}
						</Badge>
					</Button>
				)}
				{toolCategories.map((category) => {
					const isActive = activeCategory === category.label;
					const colorClass =
						categoryButtonColors[
							category.label as keyof typeof categoryButtonColors
						] || "";

					return (
						<Button
							key={category.label}
							variant={isActive ? "default" : "outline"}
							onClick={() => setActiveCategory(category.label)}
							className={`transition-all duration-200 ${isActive ? colorClass : ""}`}
							data-state={isActive ? "active" : "inactive"}
						>
							<span className="mr-2">{category.icon}</span>
							{category.label}
							<Badge variant="secondary" className="ml-2">
								{category.tools.length}
							</Badge>
						</Button>
					);
				})}
			</div>

			{/* Category Description */}
			{activeCategory !== "all" && currentCategory && (
				<Card
					className={`border-l-4 ${categoryAccentColors[activeCategory as keyof typeof categoryAccentColors] || ""}`}
				>
					<CardContent className="pt-6">
						<div className="mb-2 flex items-center gap-3">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
								{currentCategory.icon}
							</div>
							<h3 className="font-semibold text-lg">{currentCategory.label}</h3>
						</div>
						<p className="text-muted-foreground">
							{currentCategory.description}
						</p>
					</CardContent>
				</Card>
			)}

			{/* Tools Grid */}
			<div className="space-y-8">
				{/* Featured Tools Section (All Tools view only) */}
				{activeCategory === "all" && (
					<div className="space-y-6">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-xl">Featured Tools</h3>
							<Badge variant="secondary" className="bg-primary/10 text-primary">
								Most Popular
							</Badge>
						</div>
						<div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
							{currentTools
								.filter((tool) => tool.isFeatured)
								.map((tool) => (
									<ToolPreviewCard key={tool.href} {...tool} size="large" />
								))}
						</div>
					</div>
				)}

				{/* Popular Tools Section (All Tools view only) */}
				{activeCategory === "all" && (
					<div className="space-y-6">
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-xl">Popular Tools</h3>
							<Badge variant="outline">Trending</Badge>
						</div>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
							{currentTools
								.filter((tool) => tool.isPopular && !tool.isFeatured)
								.map((tool) => (
									<ToolPreviewCard key={tool.href} {...tool} size="default" />
								))}
						</div>
					</div>
				)}

				{/* All Other Tools Section */}
				<div className="space-y-6">
					{activeCategory === "all" && (
						<div className="flex items-center gap-2">
							<h3 className="font-semibold text-xl">All Tools</h3>
							<Badge variant="secondary">
								{currentTools.filter((tool) => !tool.isPopular).length} tools
							</Badge>
						</div>
					)}
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{(activeCategory === "all"
							? currentTools.filter((tool) => !tool.isPopular)
							: currentTools
						).map((tool) => (
							<ToolPreviewCard key={tool.href} {...tool} size="default" />
						))}

						{/* Coming Soon Card */}
						{activeCategory !== "all" && (
							<Card className="border-2 border-muted-foreground/20 border-dashed bg-muted/30 transition-all duration-300 hover:border-muted-foreground/40 hover:bg-muted/50">
								<CardContent className="flex min-h-[200px] items-center justify-center p-8">
									<div className="text-center">
										<div className="mb-4 flex justify-center">
											<div className="flex h-16 w-16 items-center justify-center rounded-xl bg-muted-foreground/10">
												<div className="scale-150 opacity-60">
													{currentCategory?.icon}
												</div>
											</div>
										</div>
										<h3 className="mb-2 font-semibold text-lg text-muted-foreground">
											More Coming Soon
										</h3>
										<p className="text-muted-foreground text-sm leading-relaxed">
											We're actively developing new{" "}
											<span className="font-medium">
												{activeCategory.toLowerCase()}
											</span>{" "}
											tools for you
										</p>
									</div>
								</CardContent>
							</Card>
						)}
					</div>
				</div>
			</div>
		</div>
	);
}
