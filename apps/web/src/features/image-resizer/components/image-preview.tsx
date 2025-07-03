"use client";

import { AlertCircle, Download, Eye, Loader2 } from "lucide-react";
import Image from "next/image";
import { useCallback } from "react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { ImageData, ResizeResult } from "../types";
import { downloadBlob, formatFileSize } from "../utils/image-utils";

interface ImagePreviewProps {
	originalImage: ImageData | null;
	resizedImage: ResizeResult | null;
	isProcessing: boolean;
	error: string | null;
}

export function ImagePreview({
	originalImage,
	resizedImage,
	isProcessing,
	error,
}: ImagePreviewProps) {
	const handleDownload = useCallback(() => {
		if (!resizedImage) return;

		const extension = resizedImage.blob.type.split("/")[1];
		const filename = `resized-image.${extension}`;
		downloadBlob(resizedImage.blob, filename);
	}, [resizedImage]);

	if (error) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5" />
						Preview
					</CardTitle>
				</CardHeader>
				<CardContent>
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>{error}</AlertDescription>
					</Alert>
				</CardContent>
			</Card>
		);
	}

	if (!originalImage) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<Eye className="h-5 w-5" />
						Preview
					</CardTitle>
					<CardDescription>
						Upload an image to see the preview and comparison.
					</CardDescription>
				</CardHeader>
				<CardContent>
					<div className="flex h-64 items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed">
						<p className="text-muted-foreground text-sm">No image uploaded</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Eye className="h-5 w-5" />
					Preview
				</CardTitle>
				<CardDescription>
					Compare the original and resized images.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<Tabs defaultValue="original" className="w-full">
					<TabsList className="grid w-full grid-cols-2">
						<TabsTrigger value="original">Original</TabsTrigger>
						<TabsTrigger value="resized" disabled={!resizedImage}>
							Resized
						</TabsTrigger>
					</TabsList>

					<TabsContent value="original" className="space-y-4">
						<div className="space-y-2">
							<div className="flex items-center justify-between">
								<h4 className="font-medium text-sm">Original Image</h4>
								<div className="flex gap-2">
									<Badge variant="secondary">
										{originalImage.width} × {originalImage.height}
									</Badge>
									<Badge variant="outline">
										{formatFileSize(originalImage.size)}
									</Badge>
								</div>
							</div>
							<div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
								<Image
									src={originalImage.url}
									alt="Original image"
									fill
									className="object-contain"
									sizes="(max-width: 768px) 100vw, 50vw"
								/>
							</div>
						</div>
					</TabsContent>

					<TabsContent value="resized" className="space-y-4">
						{isProcessing ? (
							<div className="flex h-64 items-center justify-center rounded-lg border bg-muted">
								<div className="flex items-center gap-2 text-muted-foreground">
									<Loader2 className="h-4 w-4 animate-spin" />
									<span className="text-sm">Processing image...</span>
								</div>
							</div>
						) : resizedImage ? (
							<div className="space-y-2">
								<div className="flex items-center justify-between">
									<h4 className="font-medium text-sm">Resized Image</h4>
									<div className="flex gap-2">
										<Badge variant="secondary">
											{resizedImage.width} × {resizedImage.height}
										</Badge>
										<Badge variant="outline">
											{formatFileSize(resizedImage.size)}
										</Badge>
										{originalImage && (
											<Badge
												variant={
													resizedImage.size < originalImage.size
														? "default"
														: "secondary"
												}
											>
												{resizedImage.size < originalImage.size
													? "Smaller"
													: "Larger"}
											</Badge>
										)}
									</div>
								</div>
								<div className="relative aspect-video overflow-hidden rounded-lg border bg-muted">
									<Image
										src={resizedImage.url}
										alt="Resized image"
										fill
										className="object-contain"
										sizes="(max-width: 768px) 100vw, 50vw"
									/>
								</div>
								<Button onClick={handleDownload} className="w-full">
									<Download className="mr-2 h-4 w-4" />
									Download Resized Image
								</Button>
							</div>
						) : (
							<div className="flex h-64 items-center justify-center rounded-lg border-2 border-muted-foreground/25 border-dashed">
								<p className="text-muted-foreground text-sm">
									No resized image yet
								</p>
							</div>
						)}
					</TabsContent>
				</Tabs>

				{/* Comparison Stats */}
				{originalImage && resizedImage && (
					<div className="mt-4 rounded-lg bg-muted/50 p-3">
						<h5 className="mb-2 font-medium text-sm">Comparison</h5>
						<div className="grid grid-cols-2 gap-4 text-xs">
							<div>
								<p className="text-muted-foreground">Size reduction:</p>
								<p className="font-medium">
									{(
										((originalImage.size - resizedImage.size) /
											originalImage.size) *
										100
									).toFixed(1)}
									%
								</p>
							</div>
							<div>
								<p className="text-muted-foreground">Dimension change:</p>
								<p className="font-medium">
									{originalImage.width}×{originalImage.height} →{" "}
									{resizedImage.width}×{resizedImage.height}
								</p>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
}
