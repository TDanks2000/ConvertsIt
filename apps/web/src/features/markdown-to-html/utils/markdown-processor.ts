import rehypeHighlight from "rehype-highlight";
import rehypeRaw from "rehype-raw";
import rehypeStringify from "rehype-stringify";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkRehype from "remark-rehype";

export interface ProcessorOptions {
	enableGfm?: boolean;
	enableHighlight?: boolean;
	enableRawHtml?: boolean;
}

export async function processMarkdownToHtml(
	markdown: string,
	options: ProcessorOptions = {},
): Promise<string> {
	const {
		enableGfm = true,
		enableHighlight = true,
		enableRawHtml = false,
	} = options;

	try {
		// Build the processor chain with type assertions to avoid conflicts
		const processor = remark();

		// Add GitHub Flavored Markdown support
		if (enableGfm) {
			processor.use(remarkGfm);
		}

		// Convert to HTML
		processor.use(remarkRehype, {
			allowDangerousHtml: enableRawHtml,
		});

		// Add syntax highlighting
		if (enableHighlight) {
			processor.use(rehypeHighlight);
		}

		// Allow raw HTML if enabled
		if (enableRawHtml) {
			processor.use(rehypeRaw);
		}

		// Convert to string
		processor.use(rehypeStringify);

		const result = await processor.process(markdown);
		return String(result);
	} catch (error) {
		console.error("Error processing markdown:", error);
		return "<p>Error processing markdown</p>";
	}
}

export function sanitizeHtml(html: string): string {
	// Basic HTML sanitization - in production, consider using DOMPurify
	return html
		.replace(/<script[^>]*>.*?<\/script>/gi, "")
		.replace(/<iframe[^>]*>.*?<\/iframe>/gi, "")
		.replace(/javascript:/gi, "")
		.replace(/on\w+\s*=/gi, "");
}

export function getDefaultMarkdown(): string {
	return `# Welcome to Markdown to HTML Converter

This is a **powerful** markdown editor with live preview.

## Features

- ✅ GitHub Flavored Markdown support
- ✅ Syntax highlighting
- ✅ Live preview
- ✅ Split view mode

### Code Example

\`\`\`javascript
function greet(name) {
  console.log(\`Hello, \${name}!\`);
}

greet('World');
\`\`\`

### Table Example

| Feature | Supported |
|---------|----------|
| Tables | ✅ |
| Lists | ✅ |
| Links | ✅ |

### Links and Images

[Visit GitHub](https://github.com)

> This is a blockquote example.

---

**Start editing** to see the magic happen! 🚀`;
}
