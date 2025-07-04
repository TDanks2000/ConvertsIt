"use client";

import {
	Activity,
	ArrowRight,
	Github,
	Shield,
	Sparkles,
	Users,
	Zap,
} from "lucide-react";
import Link from "next/link";
import { CategoryTabs } from "@/components/category-tabs"; // Added CategoryTabs import
import { SearchBar } from "@/components/search-bar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const features = [
	{
		icon: Zap,
		title: "Lightning Fast",
		description: "All tools run locally in your browser for instant results",
	},
	{
		icon: Shield,
		title: "Privacy First",
		description: "Your data never leaves your device - 100% secure processing",
	},
	{
		icon: Users,
		title: "Developer Friendly",
		description:
			"Built by developers, for developers with intuitive interfaces",
	},
];

export default function Home() {
	return (
		<div className="flex flex-col">
			{/* Structured Data for SEO */}
			<script type="application/ld+json" suppressHydrationWarning>
				{JSON.stringify({
					"@context": "https://schema.org",
					"@type": "WebApplication",
					name: "Convertsit",
					description:
						"Free online developer tools for text processing, data conversion, image optimization, and security utilities. Convert JSON, YAML, markdown, generate hashes, QR codes + more.",
					url: "https://convertsit.com",
					applicationCategory: "DeveloperApplication",
					operatingSystem: "Any",
					offers: {
						"@type": "Offer",
						price: "0",
						priceCurrency: "USD",
					},
					featureList: [
						"JSON Formatter and Validator",
						"Markdown to HTML Converter",
						"Image Format Converter",
						"Hash Generator (MD5, SHA-256, SHA-512)",
						"QR Code Generator",
						"Word Counter and Text Analysis",
						"YAML Converter",
						"Image Resizer",
					],
				})}
			</script>

			{/* Hero Section */}
			<section className="relative ">
				{/* Background Gradient */}
				<div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/10" />
				<div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent" />

				<div className="container relative mx-auto px-4 py-16 text-center lg:py-24">
					<div className="mx-auto max-w-4xl space-y-8">
						<div className="space-y-6">
							<div className="flex items-center justify-center gap-2">
								<Badge
									variant="outline"
									className="border-primary/20 bg-primary/5"
								>
									<Sparkles className="mr-1 h-3 w-3" />
									Free Developer Tools
								</Badge>
								<Badge
									variant="outline"
									className="border-green-200 bg-green-50 text-green-700 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400"
								>
									<Activity className="mr-1 h-3 w-3" />
									Live
								</Badge>
							</div>

							<h1 className="font-bold text-4xl tracking-tight sm:text-5xl lg:text-6xl">
								Powerful Tools for
								<span className="bg-gradient-to-r from-primary via-primary/80 to-primary/60 bg-clip-text text-transparent">
									{" "}
									Developers
								</span>
							</h1>

							<p className="mx-auto max-w-2xl text-lg text-muted-foreground leading-relaxed sm:text-xl">
								Transform, convert, and optimize your data with our collection
								of free online tools. All processing happens locally in your
								browser for
								<span className="font-semibold text-foreground">
									{" "}
									maximum privacy and speed
								</span>
								.
							</p>
						</div>

						{/* Search Bar */}
						<div className="relative space-y-4">
							<SearchBar placeholder="Search tools or try 'JSON formatter', 'image converter'..." />
							<p className="text-muted-foreground text-sm">
								Or browse by category below
							</p>
						</div>

						{/* Quick Actions */}
						<div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
							<Button
								size="lg"
								asChild
								className="shadow-lg transition-shadow hover:shadow-xl"
							>
								<Link href="#tools">
									Explore All Tools
									<ArrowRight className="ml-2 h-4 w-4" />
								</Link>
							</Button>
							<Button variant="outline" size="lg" asChild>
								<Link
									href="https://github.com/tdanks2000/convertsit"
									target="_blank"
									rel="noopener noreferrer"
								>
									<Github className="mr-2 h-4 w-4" />
									View on GitHub
								</Link>
							</Button>
						</div>
					</div>
				</div>
			</section>

			{/* Features Section */}
			<section className="border-t bg-muted/30 py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto max-w-2xl text-center">
						<h2 className="font-bold text-3xl tracking-tight">
							Why Choose Convertsit?
						</h2>
						<p className="mt-4 text-muted-foreground">
							Built with modern web technologies for the best developer
							experience
						</p>
					</div>

					<div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
						{features.map((feature) => {
							const Icon = feature.icon;
							return (
								<Card key={feature.title} className="text-center ">
									<CardHeader>
										<div className="mx-auto flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
											<Icon className="h-6 w-6 text-primary" />
										</div>
										<CardTitle className="text-xl">{feature.title}</CardTitle>
									</CardHeader>
									<CardContent>
										<p className="text-muted-foreground">
											{feature.description}
										</p>
									</CardContent>
								</Card>
							);
						})}
					</div>
				</div>
			</section>

			{/* Tools Section */}
			<section id="tools" className="py-16">
				<div className="container mx-auto px-4">
					<div className="mx-auto mb-12 max-w-3xl text-center">
						<h2 className="mb-4 font-bold text-3xl tracking-tight">
							Developer Tools Collection
						</h2>
						<p className="text-lg text-muted-foreground leading-relaxed">
							Everything you need for data transformation, image processing, and
							development workflows. Choose a category or browse all tools.
						</p>
					</div>

					{/* Category Tabs Component */}
					<CategoryTabs defaultCategory="all" />
				</div>
			</section>
		</div>
	);
}
