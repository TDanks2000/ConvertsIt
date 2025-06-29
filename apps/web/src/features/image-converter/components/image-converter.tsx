"use client";

import { Download, Play, Settings2, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useImageConverter } from "../hooks/use-image-converter";
import { ConversionOptionsComponent as ConversionOptions } from "./conversion-options";
import { FileUpload } from "./file-upload";
import { ImagePreview } from "./image-preview";
import { PageHeader } from "./page-header";
import { StatsGrid } from "./stats-grid";

export function ImageConverter() {
	const [showOptions, setShowOptions] = useState(false);
	const {
		images,
		isConverting,
		conversionOptions,
		setConversionOptions,
		addImages,
		removeImage,
		clearAllImages,
		convertImage,
		convertAllImages,
		downloadImage,
		downloadAllImages,
		getStats,
	} = useImageConverter();

	const stats = getStats();
	const hasImages = images.length > 0;
	const hasPendingImages = images.some((img) => img.status === "pending");
	const hasCompletedImages = images.some((img) => img.status === "completed");

	const handleFilesSelected = (files: File[]) => {
		const addedCount = addImages(files);
		const rejectedCount = files.length - addedCount;

		if (addedCount > 0) {
			toast.success(`Added ${addedCount} image${addedCount > 1 ? "s" : ""}`);
		}

		if (rejectedCount > 0) {
			toast.error(
				`${rejectedCount} file${rejectedCount > 1 ? "s" : ""} rejected (invalid format)`,
			);
		}
	};

	const handleConvertAll = async () => {
		if (!hasPendingImages) return;

		toast.info("Starting conversion...");
		await convertAllImages();
		toast.success("All images converted!");
	};

	const handleDownloadAll = () => {
		if (!hasCompletedImages) return;

		downloadAllImages();
		toast.success("Download started!");
	};

	const handleClearAll = () => {
		clearAllImages();
		toast.info("All images cleared");
	};

	return (
		<div className="container mx-auto max-w-6xl p-6">
			<div className="space-y-6">
				<PageHeader
					title="Image Converter"
					description="Convert images between different formats with customizable quality and resize options"
				/>

				{/* File Upload */}
				<FileUpload
					onFilesSelected={handleFilesSelected}
					disabled={isConverting}
				/>

				{/* Stats */}
				<StatsGrid stats={stats} />

				{hasImages && (
					<>
						{/* Action Bar */}
						<Card className="p-4">
							<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
								<div className="flex flex-wrap gap-2">
									<Button
										onClick={() => setShowOptions(!showOptions)}
										variant="outline"
										size="sm"
									>
										<Settings2 className="mr-2 h-4 w-4" />
										{showOptions ? "Hide" : "Show"} Options
									</Button>

									{hasPendingImages && (
										<Button
											onClick={handleConvertAll}
											disabled={isConverting}
											size="sm"
										>
											<Play className="mr-2 h-4 w-4" />
											Convert All
										</Button>
									)}

									{hasCompletedImages && (
										<Button
											onClick={handleDownloadAll}
											variant="outline"
											size="sm"
										>
											<Download className="mr-2 h-4 w-4" />
											Download All
										</Button>
									)}
								</div>

								<Button
									onClick={handleClearAll}
									variant="destructive"
									size="sm"
									disabled={isConverting}
								>
									<Trash2 className="mr-2 h-4 w-4" />
									Clear All
								</Button>
							</div>
						</Card>

						{/* Conversion Options */}
						{showOptions && (
							<ConversionOptions
								options={conversionOptions}
								onChange={setConversionOptions}
								disabled={isConverting}
							/>
						)}

						<Separator />

						{/* Images Grid */}
						<div className="space-y-4">
							<h3 className="font-semibold text-lg">
								Images ({images.length})
							</h3>

							<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
								{images.map((image) => (
									<ImagePreview
										key={image.id}
										image={image}
										onRemove={removeImage}
										onConvert={convertImage}
										onDownload={downloadImage}
										disabled={isConverting}
									/>
								))}
							</div>
						</div>
					</>
				)}

				{/* Empty State */}
				{!hasImages && (
					<Card className="p-8 text-center">
						<div className="space-y-2">
							<h3 className="font-semibold text-lg">No images uploaded</h3>
							<p className="text-muted-foreground">
								Upload some images to get started with conversion
							</p>
						</div>
					</Card>
				)}
			</div>
		</div>
	);
}
