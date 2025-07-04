import type { Metadata } from "next";
import { PageHeader } from "@/components";
import { Base64Converter } from "@/features/base64-converter";

export const metadata: Metadata = {
	title: "Base64 Encoder & Decoder - Convert Text & Files Online | ConvertSit",
	description:
		"Free online Base64 encoder and decoder. Convert text to Base64, decode Base64 to text, upload files for encoding. Real-time conversion with file upload support and detailed statistics.",
	keywords: [
		"base64 encoder",
		"base64 decoder",
		"base64 converter",
		"text to base64",
		"base64 to text",
		"file to base64",
		"base64 file converter",
		"online base64",
		"base64 tool",
		"encode decode",
		"data encoding",
		"binary to text",
		"ascii converter",
		"data url",
		"email attachment",
		"web development",
		"api integration",
		"free converter",
	],
	openGraph: {
		title: "Base64 Encoder & Decoder - Convert Text & Files Online",
		description:
			"Professional Base64 encoder and decoder with file upload support. Convert text and files to Base64 format or decode Base64 back to original content.",
		type: "website",
		url: "https://convertSit.com/base64-converter",
	},
	twitter: {
		card: "summary_large_image",
		title: "Base64 Encoder & Decoder - Convert Text & Files Online",
		description:
			"Professional Base64 encoder and decoder with file upload support. Convert text and files to Base64 format instantly.",
	},
	alternates: {
		canonical: "https://convertSit.com/base64-converter",
	},
};

export default function Base64ConverterPage() {
	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<PageHeader
					title="Base64 Encoder & Decoder"
					description="Convert text and files to Base64 format or decode Base64 back to original content.
						Supports file upload, real-time conversion, and detailed statistics."
				/>

				{/* Main Tool */}
				<Base64Converter />

				{/* Features Section */}
				<div className="mt-16">
					<h2 className="mb-8 text-center font-semibold text-2xl">
						Powerful Base64 Conversion Features
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Text & File Support</h3>
							<p className="text-muted-foreground text-sm">
								Encode text input or upload any file type for Base64 conversion.
								Supports images, documents, and binary files.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Bidirectional Conversion</h3>
							<p className="text-muted-foreground text-sm">
								Encode text/files to Base64 or decode Base64 back to original
								content with instant mode switching.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Real-time Validation</h3>
							<p className="text-muted-foreground text-sm">
								Instant validation of Base64 format with detailed error messages
								and format checking.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">File Information</h3>
							<p className="text-muted-foreground text-sm">
								Detailed file metadata including size, type, and modification
								date for uploaded files.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Conversion Statistics</h3>
							<p className="text-muted-foreground text-sm">
								Comprehensive statistics including size changes, compression
								ratios, and efficiency metrics.
							</p>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-2 font-semibold">Export & Share</h3>
							<p className="text-muted-foreground text-sm">
								Copy results to clipboard or download as files with proper file
								extensions and formats.
							</p>
						</div>
					</div>
				</div>

				{/* Use Cases Section */}
				<div className="mt-16">
					<h2 className="mb-8 text-center font-semibold text-2xl">
						Common Use Cases
					</h2>
					<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-3 font-semibold">Web Development</h3>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>• Data URLs for embedding images in CSS/HTML</li>
								<li>• API request/response encoding</li>
								<li>• JSON data transmission</li>
								<li>• Authentication tokens</li>
							</ul>
						</div>
						<div className="rounded-lg border bg-card p-6">
							<h3 className="mb-3 font-semibold">Data Processing</h3>
							<ul className="space-y-2 text-muted-foreground text-sm">
								<li>• Email attachment encoding</li>
								<li>• Binary data storage in databases</li>
								<li>• File transfer over text protocols</li>
								<li>• Configuration file encoding</li>
							</ul>
						</div>
					</div>
				</div>

				{/* Technical Information */}
				<div className="mt-16">
					<h2 className="mb-8 text-center font-semibold text-2xl">
						About Base64 Encoding
					</h2>
					<div className="rounded-lg border bg-muted/50 p-6">
						<div className="prose prose-sm dark:prose-invert max-w-none">
							<p>
								Base64 is a binary-to-text encoding scheme that represents
								binary data in an ASCII string format. It's commonly used when
								there's a need to encode binary data for storage or transmission
								over media designed to deal with textual data.
							</p>
							<p>
								The encoding process converts every 3 bytes of binary data into
								4 characters from a 64-character alphabet (A-Z, a-z, 0-9, +, /),
								which results in approximately 33% size increase.
							</p>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
