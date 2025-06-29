export interface MarkdownContent {
	markdown: string;
	html: string;
}

export interface MarkdownToHtmlConfig {
	defaultMarkdown?: string;
	enableGfm?: boolean;
	enableHighlight?: boolean;
	enableRawHtml?: boolean;
}

export interface PreviewMode {
	mode: "split" | "preview" | "editor";
}

export type ViewMode = "split" | "preview" | "editor";
