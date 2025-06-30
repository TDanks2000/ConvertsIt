import type { Metadata } from "next";
import { MarkdownToHtml } from "@/features/markdown-to-html/components/markdown-to-html";

export const metadata: Metadata = {
	title: "Markdown to HTML",
	description: "Convert Markdown to HTML for free.",
};

export default function MarkdownToHtmlPage() {
	return <MarkdownToHtml />;
}
