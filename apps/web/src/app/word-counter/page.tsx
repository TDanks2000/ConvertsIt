import type { Metadata } from "next";
import { WordCounter } from "@/features/word-counter/components/word-counter";

export const metadata: Metadata = {
	title: "Word Counter",
	description: "Count words in a text for free.",
};

export default function WordCounterPage() {
	return <WordCounter />;
}
