import type { Metadata } from "next";
import { HashGenerator } from "@/features/hash-generator/components/hash-generator";

export const metadata: Metadata = {
	title: "Hash Generator",
	description:
		"Generate secure hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms for data integrity verification.",
};

export default function HashGeneratorPage() {
	return <HashGenerator />;
}
