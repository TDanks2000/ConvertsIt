import type { Metadata } from "next";
import { QRCodeGenerator } from "@/features/qr-code-generator/components/qr-code-generator";

export const metadata: Metadata = {
	title: "QR Code Generator - ConvertSit",
	description:
		"Generate customizable QR codes for text, URLs, and any data. Choose from different error correction levels, colors, and sizes. Free online QR code generator tool.",
	keywords: [
		"QR code generator",
		"QR code",
		"barcode",
		"URL to QR",
		"text to QR",
		"custom QR code",
		"QR code colors",
		"error correction",
		"download QR code",
		"free QR generator",
	],
	openGraph: {
		title: "QR Code Generator - ConvertSit",
		description:
			"Generate customizable QR codes for text, URLs, and any data. Choose from different error correction levels, colors, and sizes.",
		type: "website",
	},
	twitter: {
		card: "summary_large_image",
		title: "QR Code Generator - ConvertSit",
		description:
			"Generate customizable QR codes for text, URLs, and any data. Choose from different error correction levels, colors, and sizes.",
	},
};

export default function QRCodeGeneratorPage() {
	return <QRCodeGenerator />;
}