import { Image as ImageIcon, Upload } from "lucide-react";
import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FileUploadProps {
	onFilesSelected: (files: File[]) => void;
	disabled?: boolean;
}

export function FileUpload({ onFilesSelected, disabled }: FileUploadProps) {
	const [isDragOver, setIsDragOver] = useState(false);

	const handleDragOver = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			if (!disabled) {
				setIsDragOver(true);
			}
		},
		[disabled],
	);

	const handleDragLeave = useCallback((e: React.DragEvent) => {
		e.preventDefault();
		setIsDragOver(false);
	}, []);

	const handleDrop = useCallback(
		(e: React.DragEvent) => {
			e.preventDefault();
			setIsDragOver(false);

			if (disabled) return;

			const files = Array.from(e.dataTransfer.files).filter((file) =>
				file.type.startsWith("image/"),
			);

			if (files.length > 0) {
				onFilesSelected(files);
			}
		},
		[onFilesSelected, disabled],
	);

	const handleFileSelect = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const files = Array.from(e.target.files || []);
			if (files.length > 0) {
				onFilesSelected(files);
			}
			// Reset input value to allow selecting the same file again
			e.target.value = "";
		},
		[onFilesSelected],
	);

	return (
		<Card
			className={cn(
				"border-2 border-dashed p-8 text-center transition-colors",
				isDragOver && !disabled && "border-primary bg-primary/5",
				disabled && "cursor-not-allowed opacity-50",
				!disabled && "cursor-pointer hover:border-primary/50",
			)}
			onDragOver={handleDragOver}
			onDragLeave={handleDragLeave}
			onDrop={handleDrop}
		>
			<div className="flex flex-col items-center gap-4">
				<div
					className={cn(
						"rounded-full p-4 transition-colors",
						isDragOver && !disabled
							? "bg-primary text-primary-foreground"
							: "bg-muted",
					)}
				>
					{isDragOver && !disabled ? (
						<Upload className="h-8 w-8" />
					) : (
						<ImageIcon className="h-8 w-8" />
					)}
				</div>

				<div className="space-y-2">
					<h3 className="font-semibold text-lg">
						{isDragOver && !disabled ? "Drop images here" : "Upload Images"}
					</h3>
					<p className="text-muted-foreground text-sm">
						Drag and drop your images here, or click to browse
					</p>
					<p className="text-muted-foreground text-xs">
						Supports: JPEG, PNG, GIF, WebP, BMP
					</p>
				</div>

				<div className="flex flex-col gap-2">
					<Button
						variant="outline"
						disabled={disabled}
						onClick={() => document.getElementById("file-input")?.click()}
					>
						<Upload className="mr-2 h-4 w-4" />
						Choose Files
					</Button>

					<input
						id="file-input"
						type="file"
						multiple
						accept="image/*"
						className="hidden"
						onChange={handleFileSelect}
						disabled={disabled}
					/>
				</div>
			</div>
		</Card>
	);
}
