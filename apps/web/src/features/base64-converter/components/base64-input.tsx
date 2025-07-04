"use client";

import { FileText, Upload } from "lucide-react";
import { memo, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import type { ConversionMode, FileInfo, InputType } from "../types";
import { formatFileSize } from "../utils/base64-operations";

interface Base64InputProps {
	value: string;
	onChange: (value: string) => void;
	mode: ConversionMode;
	inputType: InputType;
	onInputTypeChange: (type: InputType) => void;
	onFileUpload: (file: File) => void;
	fileInfo?: FileInfo | null;
	placeholder?: string;
	readOnly?: boolean;
	className?: string;
}

export const Base64Input = memo(function Base64Input({
	value,
	onChange,
	mode,
	inputType,
	onInputTypeChange,
	onFileUpload,
	fileInfo,
	placeholder,
	readOnly = false,
	className,
}: Base64InputProps) {
	const handleFileChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const file = event.target.files?.[0];
			if (file) {
				onFileUpload(file);
			}
			// Reset input to allow selecting the same file again
			event.target.value = "";
		},
		[onFileUpload],
	);

	const getPlaceholder = () => {
		if (placeholder) return placeholder;

		if (mode === "encode") {
			return inputType === "text"
				? "Enter text to encode to Base64...\n\nExample:\nHello, World!\n\nThis will be converted to Base64 format."
				: "Upload a file to encode to Base64...";
		}
		return inputType === "text"
			? "Enter Base64 encoded text to decode...\n\nExample:\nU0dWc2JHOHNJRmR2Y214a0lRPT0=\n\nThis will be decoded to readable text."
			: "Upload a Base64 file to decode...";
	};

	const getModeLabel = () => {
		return mode === "encode" ? "Text/File to Encode" : "Base64 to Decode";
	};

	return (
		<Card className={className}>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					{getModeLabel()}
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{/* Input Type Selection */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Input Type</Label>
					<RadioGroup
						value={inputType}
						onValueChange={(value) => onInputTypeChange(value as InputType)}
						className="flex gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="text" id="text" />
							<Label htmlFor="text" className="cursor-pointer">
								Text Input
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="file" id="file" />
							<Label htmlFor="file" className="cursor-pointer">
								File Upload
							</Label>
						</div>
					</RadioGroup>
				</div>

				{/* File Upload Section */}
				{inputType === "file" && (
					<div className="space-y-3">
						<div className="flex items-center gap-3">
							<Button
								variant="outline"
								size="sm"
								asChild
								className="cursor-pointer"
							>
								<label>
									<Upload className="mr-2 h-4 w-4" />
									Choose File
									<input
										type="file"
										className="hidden"
										onChange={handleFileChange}
										accept="*/*"
									/>
								</label>
							</Button>
							{fileInfo && (
								<div className="text-muted-foreground text-sm">
									<div className="font-medium">{fileInfo.name}</div>
									<div className="text-xs">
										{formatFileSize(fileInfo.size)} •{" "}
										{fileInfo.type || "Unknown type"}
									</div>
								</div>
							)}
						</div>
					</div>
				)}

				{/* Text Input */}
				<div className="space-y-2">
					<Label className="font-medium text-sm">
						{inputType === "text" ? "Input" : "File Content"}
					</Label>
					<Textarea
						value={value}
						onChange={(e) => onChange(e.target.value)}
						placeholder={getPlaceholder()}
						readOnly={readOnly || (inputType === "file" && !value)}
						className="min-h-[200px] resize-y font-mono text-sm"
					/>
				</div>

				{/* File Info Display */}
				{inputType === "file" && fileInfo && (
					<div className="rounded-md border bg-muted/50 p-3">
						<div className="grid grid-cols-2 gap-2 text-sm">
							<div>
								<span className="text-muted-foreground">File:</span>
								<span className="ml-2 font-medium">{fileInfo.name}</span>
							</div>
							<div>
								<span className="text-muted-foreground">Size:</span>
								<span className="ml-2 font-medium">
									{formatFileSize(fileInfo.size)}
								</span>
							</div>
							<div>
								<span className="text-muted-foreground">Type:</span>
								<span className="ml-2 font-medium">
									{fileInfo.type || "Unknown"}
								</span>
							</div>
							<div>
								<span className="text-muted-foreground">Modified:</span>
								<span className="ml-2 font-medium">
									{new Date(fileInfo.lastModified).toLocaleDateString()}
								</span>
							</div>
						</div>
					</div>
				)}
			</CardContent>
		</Card>
	);
});
