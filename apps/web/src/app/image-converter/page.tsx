import type { Metadata } from "next";
import { ImageConverter } from "@/features/image-converter/components/image-converter";

export const metadata: Metadata = {
	title: "Image Converter",
	description: "Convert images to different formats for free.",
};

export default function ImageConverterPage() {
	return <ImageConverter />;
}
