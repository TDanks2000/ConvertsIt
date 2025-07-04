import type {
	Base64ConversionResult,
	Base64Stats,
	ConversionMode,
	FileInfo,
} from "../types";

export function encodeToBase64(text: string): Base64ConversionResult {
	if (!text) {
		return { isValid: true, output: "" };
	}
	try {
		const encoded = Buffer.from(text, "utf8").toString("base64");
		return { isValid: true, output: encoded };
	} catch (error) {
		const errorMessage =
			error instanceof Error ? error.message : "Encoding failed";
		return { isValid: false, error: errorMessage, output: "" };
	}
}

export function decodeFromBase64(base64: string): Base64ConversionResult {
	if (!base64) {
		return { isValid: true, output: "" };
	}

	const cleanBase64 = base64.replace(/\s/g, "");
	if (!isValidBase64(cleanBase64)) {
		return { isValid: false, error: "Invalid Base64 format.", output: "" };
	}

	try {
		const decoded = Buffer.from(cleanBase64, "base64").toString("utf8");
		return { isValid: true, output: decoded };
	} catch (error) {
		const errorMessage =
			error instanceof Error
				? `Decoding failed: ${error.message}`
				: "Decoding failed due to unknown error.";
		return { isValid: false, error: errorMessage, output: "" };
	}
}

export function isValidBase64(str: string): boolean {
	if (!str) return true;

	const base64Regex = /^[A-Za-z0-9+/]*={0,2}$/;
	if (!base64Regex.test(str)) {
		return false;
	}

	const withoutPadding = str.replace(/=/g, "");
	return withoutPadding.length % 4 !== 1;
}

export function calculateBase64Stats(
	input: string,
	output: string,
	mode: ConversionMode,
): Base64Stats {
	const inputSize = new Blob([input]).size;
	const outputSize = new Blob([output]).size;

	const originalSize = mode === "encode" ? inputSize : outputSize;
	const encodedSize = mode === "encode" ? outputSize : inputSize;

	const compressionRatio = originalSize > 0 ? encodedSize / originalSize : 0;

	return {
		originalSize,
		encodedSize,
		compressionRatio,
		characters: input.length,
		lines: input.split("\n").length,
	};
}

export function fileToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onload = () => {
			if (typeof reader.result === "string") {
				const base64 = reader.result.split(",")[1];
				if (base64) {
					resolve(base64);
				} else {
					reject(new Error("File content not found in Data URL."));
				}
			} else {
				reject(new Error("Failed to read file as string."));
			}
		};
		reader.onerror = () =>
			reject(new Error(`Error reading file: ${reader.error?.message}`));
		reader.readAsDataURL(file);
	});
}

export function getFileInfo(file: File): FileInfo {
	return {
		name: file.name,
		size: file.size,
		type: file.type,
		lastModified: file.lastModified,
	};
}

export function formatFileSize(bytes: number): string {
	if (bytes === 0) return "0 Bytes";

	const k = 1024;
	const sizes = ["Bytes", "KB", "MB", "GB"];
	const i = Math.floor(Math.log(bytes) / Math.log(k));

	return `${Number.parseFloat((bytes / k ** i).toFixed(2))} ${sizes[i]}`;
}

export function downloadAsFile(
	content: string,
	filename: string,
	mimeType = "text/plain",
): void {
	const blob = new Blob([content], { type: mimeType });
	const url = URL.createObjectURL(blob);
	const link = document.createElement("a");
	link.href = url;
	link.download = filename;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}

export async function copyToClipboard(text: string): Promise<boolean> {
	try {
		if (navigator.clipboard && window.isSecureContext) {
			await navigator.clipboard.writeText(text);
			return true;
		}
		console.warn(
			"Clipboard API not available or context is not secure.",
		);
		return false;
	} catch (error) {
		console.error("Failed to copy to clipboard:", error);
		return false;
	}
}

export function getSampleData(mode: ConversionMode): string {
	if (mode === "encode") {
		return `Hello, World! 🌍

This is a sample text for Base64 encoding.
It includes:
- Multiple lines
- Special characters: @#$%^&*()
- Unicode emoji: 🚀✨🎉
- Numbers: 12345

Base64 encoding converts binary data into ASCII text format.`;
	}
	return "SGVsbG8sIFdvcmxkISDwn4yNCgpUaGlzIGlzIGEgc2FtcGxlIHRleHQgZm9yIEJhc2U2NCBlbmNvZGluZy4KSXQgaW5jbHVkZXM6Ci0gTXVsdGlwbGUgbGluZXMKLyBTcGVjaWFsIGNoYXJhY3RlcnM6IEAjJCVeJigpCi0gVW5pY29kZSBlbW9qaTog8J+agOKcqPCfjonwn46JCi0gTnVtYmVyczogMTIzNDUKCkJhc2U2NCBlbmNvZGluZyBjb252ZXJ0cyBiaW5hcnkgZGF0YSBpbnRvIEFTQ0lJIHRleHQgZm9ybWF0Lg==";
}
