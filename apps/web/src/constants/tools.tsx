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
	Target,
	Type,
	Zap,
} from "lucide-react";
import type { ReactNode } from "react";

export interface Tool {
	title: string;
	href: string;
	description: string;
	icon: ReactNode;
	isNew?: boolean;
	isPopular?: boolean;
	isFeatured?: boolean;
	usageCount?: string;
	priority?: number;
}

export interface ToolCategory {
	label: string;
	icon: ReactNode;
	tools: Tool[];
	description: string;
	ulClassName?: string;
}

export const toolCategories: ToolCategory[] = [
	{
		label: "Text & Content",
		icon: <Type className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		description:
			"Tools for creating, analyzing, and transforming text and various content formats.",
		tools: [
			{
				title: "Markdown to HTML",
				href: "/markdown-to-html",
				description:
					"Transform markdown into clean HTML with live preview and syntax highlighting.",
				icon: <FileText className="h-4 w-4" />,
				isPopular: true,
				usageCount: "1.8k",
				priority: 2,
			},
			{
				title: "Word Counter",
				href: "/word-counter",
				description:
					"Analyze text statistics including words, characters, and readability metrics.",
				icon: <Hash className="h-4 w-4" />,
				priority: 4,
			},
		],
	},
	{
		label: "Data & Code",
		icon: <Database className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2 xl:grid-cols-3",
		description:
			"Utilities for formatting, converting, and validating structured data and code snippets.",
		tools: [
			{
				title: "JSON Formatter",
				href: "/json-formatter",
				description:
					"Validate, format, and beautify JSON data with advanced formatting options.",
				icon: <Code2 className="h-4 w-4" />,
				isFeatured: true,
				isPopular: true,
				usageCount: "2.1k",
				priority: 1,
			},
			{
				title: "JSON Converter",
				href: "/json-converter",
				description:
					"Convert JSON to CSV, XML, YAML and other formats seamlessly.",
				icon: <FileJsonIcon className="h-4 w-4" />,
				priority: 5,
			},
			{
				title: "YAML Converter",
				href: "/yaml-converter",
				description:
					"Transform YAML data between multiple formats with validation.",
				icon: <Settings className="h-4 w-4" />,
				priority: 6,
			},
			{
				title: "Regex Tester",
				href: "/regex-tester",
				description:
					"Test and debug regular expressions with real-time matching and capture groups.",
				icon: <Target className="h-4 w-4" />,
				priority: 3,
				isNew: true,
			},
		],
	},
	{
		label: "Image & Media",
		icon: <Palette className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		description:
			"Tools for converting, resizing, and optimizing various image and media files.",
		tools: [
			{
				title: "Image Converter",
				href: "/image-converter",
				description:
					"Convert between image formats with quality control and batch processing.",
				icon: <ImageIcon className="h-4 w-4" />,
				isPopular: true,
				usageCount: "1.5k",
				priority: 3,
			},
			{
				title: "Image Resizer",
				href: "/image-resizer",
				description:
					"Resize images with smart cropping and aspect ratio preservation.",
				icon: <Maximize2 className="h-4 w-4" />,
				priority: 7,
			},
		],
	},
	{
		label: "Security & Utilities",
		icon: <Zap className="h-4 w-4" />,
		ulClassName: "grid-cols-1 lg:grid-cols-2",
		description:
			"Essential utilities for security tasks, data encoding, and general helpful tools.",
		tools: [
			{
				title: "Hash Generator",
				href: "/hash-generator",
				description:
					"Generate secure hashes with MD5, SHA-1, SHA-256, and SHA-512 algorithms.",
				icon: <Shield className="h-4 w-4" />,
				priority: 8,
			},
			{
				title: "QR Code Generator",
				href: "/qr-code-generator",
				description:
					"Create customizable QR codes with logo embedding and styling options.",
				icon: <QrCode className="h-4 w-4" />,
				priority: 9,
			},
		],
	},
];

export const toolLength = toolCategories.flatMap(
	(category) => category.tools,
).length;

// Utility functions for tool management
export const getAllTools = () => {
	return toolCategories.flatMap((category) =>
		category.tools.map((tool) => ({ ...tool, category: category.label })),
	);
};

export const getFeaturedTools = () => {
	return getAllTools()
		.filter((tool) => tool.isFeatured)
		.sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

export const getPopularTools = () => {
	return getAllTools()
		.filter((tool) => tool.isPopular && !tool.isFeatured)
		.sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

export const getRegularTools = () => {
	return getAllTools()
		.filter((tool) => !tool.isPopular)
		.sort((a, b) => (a.priority || 999) - (b.priority || 999));
};

export const getToolsByCategory = (categoryLabel: string) => {
	const category = toolCategories.find((cat) => cat.label === categoryLabel);
	return category
		? category.tools
				.map((tool) => ({ ...tool, category: category.label }))
				.sort((a, b) => (a.priority || 999) - (b.priority || 999))
		: [];
};
