"use client";

import {
	Code2,
	Database,
	FileJsonIcon,
	FileText,
	Hash,
	ImageIcon,
	Maximize2,
	Palette,
	QrCode,
	Settings,
	Shield,
	Type,
	Zap,
} from "lucide-react";
import Link from "next/link";
import {
	type ComponentPropsWithoutRef,
	type ComponentRef,
	forwardRef,
	type ReactNode,
} from "react";
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
	icon: ReactNode;
}

interface ToolCategory {
	label: string;
	icon: ReactNode;
	tools: Tool[];
	ulClassName?: string;
}

const toolCategories: ToolCategory[] = [
	{
		label: "Text & Content",
		icon: <Type className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		tools: [
			{
				title: "Markdown to HTML",
				href: "/markdown-to-html",
				description:
					"Transform markdown into clean HTML with live preview and syntax highlighting.",
				icon: <FileText className="h-4 w-4" />,
			},
			{
				title: "Word Counter",
				href: "/word-counter",
				description:
					"Analyze text statistics including words, characters, and readability metrics.",
				icon: <Hash className="h-4 w-4" />,
			},
		],
	},
	{
		label: "Data & Code",
		icon: <Database className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
		tools: [
			{
				title: "JSON Formatter",
				href: "/json-formatter",
				description:
					"Validate, format, and beautify JSON data with advanced formatting options.",
				icon: <Code2 className="h-4 w-4" />,
			},
			{
				title: "JSON Converter",
				href: "/json-converter",
				description:
					"Convert JSON to CSV, XML, YAML and other formats seamlessly.",
				icon: <FileJsonIcon className="h-4 w-4" />,
			},
			{
				title: "YAML Converter",
				href: "/yaml-converter",
				description:
					"Transform YAML data between multiple formats with validation.",
				icon: <Settings className="h-4 w-4" />,
			},
		],
	},
	{
		label: "Image & Media",
		icon: <Palette className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		tools: [
			{
				title: "Image Converter",
				href: "/image-converter",
				description:
					"Convert between image formats with quality control and batch processing.",
				icon: <ImageIcon className="h-4 w-4" />,
			},
			{
				title: "Image Resizer",
				href: "/image-resizer",
				description:
					"Resize images with smart cropping and aspect ratio preservation.",
				icon: <Maximize2 className="h-4 w-4" />,
			},
		],
	},
	{
		label: "Security & Utilities",
		icon: <Zap className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		tools: [
			{
				title: "Hash Generator",
				href: "/hash-generator",
				description:
					"Generate secure hashes with MD5, SHA-1, SHA-256, and SHA-512 algorithms.",
				icon: <Shield className="h-4 w-4" />,
			},
			{
				title: "QR Code Generator",
				href: "/qr-code-generator",
				description:
					"Create customizable QR codes with logo embedding and styling options.",
				icon: <QrCode className="h-4 w-4" />,
			},
		],
	},
];

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

				{toolCategories.map((category) => (
					<NavigationMenuItem key={category.label}>
						<NavigationMenuTrigger className="flex items-center gap-2">
							{category.icon}
							{category.label}
						</NavigationMenuTrigger>
						<NavigationMenuContent>
							<div className="w-[400px] p-6 md:w-[500px] lg:w-[600px] xl:w-[700px]">
								<div className="mb-4 flex items-center gap-2 border-border border-b pb-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
										{category.icon}
									</div>
									<h3 className="font-semibold text-foreground text-sm">
										{category.label}
									</h3>
								</div>
								<ul className={cn("grid gap-2", category.ulClassName)}>
									{category.tools.map((tool) => (
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
							</div>
						</NavigationMenuContent>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

const ListItem = forwardRef<
	ComponentRef<typeof Link>,
	ComponentPropsWithoutRef<typeof Link> & {
		title: string;
		icon?: ReactNode;
	}
>(({ className, title, children, icon, ...props }, ref) => {
	return (
		<li>
			<NavigationMenuLink asChild>
				<Link
					ref={ref}
					className={cn(
						"group block select-none space-y-2 rounded-lg border border-transparent p-4 leading-none no-underline outline-none transition-all duration-200 hover:border-border hover:bg-accent/50 hover:shadow-sm focus:bg-accent focus:text-accent-foreground",
						className,
					)}
					{...props}
				>
					<div className="flex items-center gap-3">
						<div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
							{icon}
						</div>
						<div className="font-medium text-foreground text-sm leading-none group-hover:text-accent-foreground">
							{title}
						</div>
					</div>
					<p className="line-clamp-2 text-muted-foreground text-xs leading-relaxed group-hover:text-muted-foreground/80">
						{children}
					</p>
				</Link>
			</NavigationMenuLink>
		</li>
	);
});
ListItem.displayName = "ListItem";
