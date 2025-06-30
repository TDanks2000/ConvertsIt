"use client";

import { FileJsonIcon, FileText, Hash, ImageIcon } from "lucide-react";
import Link from "next/link";
import * as React from "react";

import {
	NavigationMenu,
	NavigationMenuContent,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
	NavigationMenuTrigger,
	navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

interface Tool {
	title: string;
	href: string;
	description: string;
	icon: React.ReactNode;
}

interface ToolCategory {
	label: string;
	icon: React.ReactNode;
	tools: Tool[];
}

const toolCategories: {
	text: ToolCategory;
	image: ToolCategory;
	data: ToolCategory;
} = {
	text: {
		label: "Text Tools",
		icon: <FileText className="h-4 w-4" />,
		tools: [
			{
				title: "Markdown to HTML",
				href: "/markdown-to-html",
				description:
					"Convert your markdown text to HTML with live preview and syntax highlighting.",
				icon: <FileText className="h-4 w-4" />,
			},
			{
				title: "Word Counter",
				href: "/word-counter",
				description: "Count words, characters, and analyze text statistics.",
				icon: <Hash className="h-4 w-4" />,
			},
		],
	},
	image: {
		label: "Image Tools",
		icon: <ImageIcon className="h-4 w-4" />,
		tools: [
			{
				title: "Image Converter",
				href: "/image-converter",
				description:
					"Convert images between different formats with customizable quality and resize options.",
				icon: <ImageIcon className="h-4 w-4" />,
			},
		],
	},
	data: {
		label: "Data Tools",
		icon: <FileJsonIcon className="h-4 w-4" />,
		tools: [
			{
				title: "JSON Formatter",
				href: "/json-formatter",
				description:
					"Validate, format, beautify, and minify your JSON data with our powerful online tool.",
				icon: <FileJsonIcon className="h-4 w-4" />,
			},
			{
				title: "JSON Converter",
				href: "/json-converter",
				description:
					"Convert your JSON data between different formats with our powerful online tool.",
				icon: <FileJsonIcon className="h-4 w-4" />,
			},
		],
	},
};

export function Navigation() {
	return (
		<NavigationMenu>
			<NavigationMenuList>
				<NavigationMenuItem>
					<NavigationMenuLink asChild className={navigationMenuTriggerStyle()}>
						<Link href="/" className="flex items-center">
							Home
						</Link>
					</NavigationMenuLink>
				</NavigationMenuItem>
				
				{/* Text Tools */}
				<NavigationMenuItem>
					<NavigationMenuTrigger className="flex items-center gap-2">
						{toolCategories.text.icon}
						{toolCategories.text.label}
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[350px] gap-3 p-4 md:w-[400px]">
							{toolCategories.text.tools.map((tool) => (
								<ListItem
									key={tool.title}
									title={tool.title}
									href={tool.href}
									icon={tool.icon}
								>
									{tool.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				
				{/* Image Tools */}
				<NavigationMenuItem>
					<NavigationMenuTrigger className="flex items-center gap-2">
						{toolCategories.image.icon}
						{toolCategories.image.label}
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[350px] gap-3 p-4 md:w-[400px]">
							{toolCategories.image.tools.map((tool) => (
								<ListItem
									key={tool.title}
									title={tool.title}
									href={tool.href}
									icon={tool.icon}
								>
									{tool.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
				
				{/* Data Tools */}
				<NavigationMenuItem>
					<NavigationMenuTrigger className="flex items-center gap-2">
						{toolCategories.data.icon}
						{toolCategories.data.label}
					</NavigationMenuTrigger>
					<NavigationMenuContent>
						<ul className="grid w-[350px] gap-3 p-4 md:w-[400px] md:grid-cols-1">
							{toolCategories.data.tools.map((tool) => (
								<ListItem
									key={tool.title}
									title={tool.title}
									href={tool.href}
									icon={tool.icon}
								>
									{tool.description}
								</ListItem>
							))}
						</ul>
					</NavigationMenuContent>
				</NavigationMenuItem>
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = React.forwardRef<
	React.ElementRef<typeof Link>, // Adjusted type for ref
	React.ComponentPropsWithoutRef<typeof Link> & {
		// Adjusted type for props
		title: string;
		icon?: React.ReactNode;
	}
>(({ className, title, children, icon, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="flex items-center gap-2 font-medium text-sm leading-none">
						{icon}
						{title}
					</div>
					<p className="line-clamp-2 min-h-[calc(2*1.375*1em)] text-muted-foreground text-sm leading-snug">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
