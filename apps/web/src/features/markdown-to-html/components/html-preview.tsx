"use client";

import { Eye, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef } from "react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";

interface HtmlPreviewProps {
	html: string;
	isLoading?: boolean;
}

export function HtmlPreview({ html, isLoading = false }: HtmlPreviewProps) {
	const iframeRef = useRef<HTMLIFrameElement>(null);
	const lastHtmlRef = useRef<string>("");
	const isInitializedRef = useRef(false);

	// Memoize the CSS styles to avoid recreating them
	const cssStyles = `
		body {
			font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
			line-height: 1.6;
			color: #333;
			max-width: 100%;
			margin: 0;
			padding: 20px;
			background: white;
		}
		h1, h2, h3, h4, h5, h6 {
			margin-top: 24px;
			margin-bottom: 16px;
			font-weight: 600;
			line-height: 1.25;
		}
		h1 { font-size: 2em; border-bottom: 1px solid #eaecef; padding-bottom: 10px; }
		h2 { font-size: 1.5em; border-bottom: 1px solid #eaecef; padding-bottom: 8px; }
		h3 { font-size: 1.25em; }
		p { margin-bottom: 16px; }
		code {
			background: #f6f8fa;
			border-radius: 6px;
			font-size: 85%;
			margin: 0;
			padding: 0.2em 0.4em;
			font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', Menlo, monospace;
		}
		pre {
			background: #f6f8fa;
			border-radius: 6px;
			font-size: 85%;
			line-height: 1.45;
			overflow: auto;
			padding: 16px;
			margin-bottom: 16px;
		}
		pre code {
			background: transparent;
			border: 0;
			font-size: 100%;
			margin: 0;
			padding: 0;
			white-space: pre;
			word-break: normal;
		}
		blockquote {
			border-left: 4px solid #dfe2e5;
			color: #6a737d;
			margin: 0 0 16px 0;
			padding: 0 16px;
		}
		table {
			border-collapse: collapse;
			border-spacing: 0;
			width: 100%;
			margin-bottom: 16px;
		}
		table th, table td {
			border: 1px solid #dfe2e5;
			padding: 6px 13px;
			text-align: left;
		}
		table th {
			background: #f6f8fa;
			font-weight: 600;
		}
		ul, ol {
			margin-bottom: 16px;
			padding-left: 2em;
		}
		li {
			margin-bottom: 4px;
		}
		a {
			color: #0366d6;
			text-decoration: none;
		}
		a:hover {
			text-decoration: underline;
		}
		hr {
			border: 0;
			border-top: 1px solid #eaecef;
			height: 0;
			margin: 24px 0;
		}
		/* Syntax highlighting styles */
		.hljs {
			background: #f6f8fa !important;
			color: #24292e;
		}
		.hljs-comment { color: #6a737d; }
		.hljs-keyword { color: #d73a49; }
		.hljs-string { color: #032f62; }
		.hljs-number { color: #005cc5; }
		.hljs-function { color: #6f42c1; }
	`;

	const initializeIframe = useCallback(() => {
		if (!iframeRef.current) return;

		const iframe = iframeRef.current;
		const doc = iframe.contentDocument || iframe.contentWindow?.document;

		if (doc && !isInitializedRef.current) {
			// Create the document structure using DOM methods instead of doc.write
			doc.documentElement.innerHTML = `
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<title>Preview</title>
	<style>${cssStyles}</style>
</head>
<body>
	<div id="content"></div>
</body>`;
			isInitializedRef.current = true;
		}
	}, []);

	const updateContent = useCallback(() => {
		if (!iframeRef.current || html === lastHtmlRef.current) return;

		const iframe = iframeRef.current;
		const doc = iframe.contentDocument || iframe.contentWindow?.document;

		if (doc) {
			const contentDiv = doc.getElementById("content");
			if (contentDiv) {
				contentDiv.innerHTML = html;
				lastHtmlRef.current = html;
			}
		}
	}, [html]);

	useEffect(() => {
		initializeIframe();
	}, [initializeIframe]);

	useEffect(() => {
		if (isInitializedRef.current) {
			updateContent();
		}
	}, [updateContent]);

	// Cleanup on unmount
	useEffect(() => {
		return () => {
			isInitializedRef.current = false;
			lastHtmlRef.current = "";
		};
	}, []);

	return (
		<Card className="h-full">
			<CardHeader className="pb-3">
				<CardTitle className="flex items-center gap-2 text-lg">
					{isLoading ? (
						<Loader2 className="h-5 w-5 animate-spin" />
					) : (
						<Eye className="h-5 w-5" />
					)}
					HTML Preview
				</CardTitle>
				<CardDescription>
					Live preview of your converted HTML content
				</CardDescription>
			</CardHeader>
			<CardContent className="h-[calc(100%-120px)]">
				<div className="h-full overflow-hidden rounded-md border">
					<iframe
						ref={iframeRef}
						className="h-full w-full border-0"
						title="HTML Preview"
						sandbox="allow-same-origin"
						style={{ minHeight: "400px" }}
					/>
				</div>
			</CardContent>
		</Card>
	);
}
