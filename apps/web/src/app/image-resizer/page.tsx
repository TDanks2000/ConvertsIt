import type { Metadata } from "next";
import { ImageResizer } from "@/features/image-resizer/components/image-resizer";

export const metadata: Metadata = {
	title: "Image Resizer",
	description:
		"Resize your images to specific dimensions while maintaining quality and aspect ratio.",
};

export default function ImageResizerPage() {
	return <ImageResizer />;
}
