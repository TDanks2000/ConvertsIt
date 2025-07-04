"use client";

import { ImageIcon, Upload } from "lucide-react";
import { useCallback, useRef } from "react";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ImageUploaderProps {
	onImageUpload: (file: File) => void;
	isProcessing: boolean;
}

export function ImageUploader({
	onImageUpload,
	isProcessing,
}: ImageUploaderProps) {
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleFileSelect = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				onImageUpload(file);
			}
		},
		[onImageUpload],
	);

	const handleDrop = useCallback(
		(event: React.DragEvent<HTMLButtonElement>) => {
			event.preventDefault();
			const file = event.dataTransfer.files[0];
			if (file?.type.startsWith("image/")) {
				onImageUpload(file);
			}
		},
		[onImageUpload],
	);

	const handleDragOver = useCallback(
		(event: React.DragEvent<HTMLButtonElement>) => {
			event.preventDefault();
		},
		[],
	);

	const handleClick = useCallback(() => {
		fileInputRef.current?.click();
	}, []);

	const handleKeyDown = useCallback(
		(event: React.KeyboardEvent<HTMLButtonElement>) => {
			if (event.key === "Enter" || event.key === " ") {
				event.preventDefault();
				handleClick();
			}
		},
		[handleClick],
	);

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Upload className="h-5 w-5" />
					Upload Image
				</CardTitle>
				<CardDescription>
					Select an image file to resize. Supports JPEG, PNG, and WebP formats.
				</CardDescription>
			</CardHeader>
			<CardContent>
				<button
					className={cn(
						"w-full cursor-pointer rounded-lg border-2 border-muted-foreground/25 border-dashed p-8 text-center transition-colors hover:border-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
						isProcessing && "pointer-events-none opacity-50",
					)}
					onDrop={handleDrop}
					onDragOver={handleDragOver}
					onClick={handleClick}
					onKeyDown={handleKeyDown}
					tabIndex={0}
					type="button"
				>
					<div className="flex flex-col items-center gap-4">
						<div className="rounded-full bg-muted p-4">
							<ImageIcon className="h-8 w-8 text-muted-foreground" />
						</div>
						<div className="space-y-2">
							<p className="font-medium text-sm">
								{isProcessing ? "Processing..." : "Drop your image here"}
							</p>
							<p className="text-muted-foreground text-xs">
								or click to browse files
							</p>
						</div>
						<Button
							variant="outline"
							size="sm"
							disabled={isProcessing}
							onClick={(e) => {
								e.stopPropagation();
								handleClick();
							}}
						>
							<Upload className="mr-2 h-4 w-4" />
							Select File
						</Button>
					</div>
				</button>
				<input
					ref={fileInputRef}
					type="file"
					accept="image/*"
					onChange={handleFileSelect}
					className="hidden"
				/>
				<div className="mt-4 text-muted-foreground text-xs">
					<p>• Maximum file size: 10MB</p>
					<p>• Supported formats: JPEG, PNG, WebP</p>
				</div>
			</CardContent>
		</Card>
	);
}
