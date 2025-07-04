import type { Metadata } from "next";
import { PageHeader } from "@/components";
import { CodeFormatter } from "@/features/code-formatter";

export const metadata: Metadata = {
	title: "Code Formatter - Format, Minify & Beautify Code Online | ConvertSit",
	description:
		"Free online code formatter and beautifier. Format, minify, and validate JavaScript, TypeScript, Python, Java, C++, HTML, CSS, JSON, XML, SQL and more. Real-time syntax highlighting and error detection.",
	keywords: [
		"code formatter",
		"code beautifier",
		"code minifier",
		"javascript formatter",
		"typescript formatter",
		"python formatter",
		"java formatter",
		"html formatter",
		"css formatter",
		"json formatter",
		"xml formatter",
		"sql formatter",
		"code validator",
		"syntax checker",
		"online code editor",
		"code statistics",
		"programming tools",
		"developer tools",
		"free code formatter",
	],
	openGraph: {
		title: "Code Formatter - Format & Beautify Code Online",
		description:
			"Professional code formatter supporting 15+ programming languages. Format, minify, validate code with real-time syntax highlighting and detailed statistics.",
		type: "website",
		url: "https://convertSit.com/code-formatter",
	},
	twitter: {
		card: "summary_large_image",
		title: "Code Formatter - Format & Beautify Code Online",
		description:
			"Professional code formatter supporting 15+ programming languages. Format, minify, validate code with real-time syntax highlighting.",
	},
	alternates: {
		canonical: "https://convertSit.com/code-formatter",
	},
};

export default function CodeFormatterPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<PageHeader
					title="Code Formatter & Beautifier"
					description="Format, minify, and validate code in 15+ programming languages.
						Real-time syntax highlighting, error detection, and detailed code
						statistics."
				/>

				{/* Main Tool */}
				<CodeFormatter />

				{/* Features Section */}
				<div className="mt-16">
					<h2 className="mb-8 text-center font-semibold text-2xl">
						Powerful Code Formatting Features
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Multi-Language Support</h3>
							<p className="text-muted-foreground text-sm">
								Supports 15+ programming languages including JavaScript,
								TypeScript, Python, Java, C++, HTML, CSS, and more.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Format & Minify</h3>
							<p className="text-muted-foreground text-sm">
								Beautify code with proper indentation or minify for production
								with customizable formatting options.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Real-time Validation</h3>
							<p className="text-muted-foreground text-sm">
								Instant syntax checking and error detection with detailed error
								messages and line numbers.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Auto-Detection</h3>
							<p className="text-muted-foreground text-sm">
								Automatically detect programming language from code content for
								seamless formatting experience.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Code Statistics</h3>
							<p className="text-muted-foreground text-sm">
								Detailed analysis including lines, characters, functions,
								classes, comments, and file size metrics.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Export & Share</h3>
							<p className="text-muted-foreground text-sm">
								Copy formatted code to clipboard or download as files with
								proper file extensions.
							</p>
						</div>
					</div>
				</div>

				{/* Supported Languages */}
				<div className="mt-16">
					<h2 className="mb-8 text-center font-semibold text-2xl">
						Supported Programming Languages
					</h2>
					<div className="flex flex-wrap justify-center gap-3">
						{[
							"JavaScript",
							"TypeScript",
							"Python",
							"Java",
							"C++",
							"C#",
							"PHP",
							"Ruby",
							"Go",
							"Rust",
							"HTML",
							"CSS",
							"JSON",
							"XML",
							"SQL",
						].map((lang) => (
							<span
								key={lang}
								className="rounded-full bg-secondary px-3 py-1 font-medium text-secondary-foreground text-sm"
							>
								{lang}
							</span>
						))}
					</div>
				</div>
			</div>
		</div>
	);
}
