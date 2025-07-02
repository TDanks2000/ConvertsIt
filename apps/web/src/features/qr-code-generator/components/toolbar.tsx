"use client";

import { Eraser, QrCode, RotateCcw, Wand2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface ToolbarProps {
	onGenerate: () => void;
	onAutoAdjustSize: () => void;
	onClearInput: () => void;
	onClearAll: () => void;
	isGenerating: boolean;
	hasInput: boolean;
	hasResult: boolean;
	disabled?: boolean;
}

export function Toolbar({
	onGenerate,
	onAutoAdjustSize,
	onClearInput,
	onClearAll,
	isGenerating,
	hasInput,
	hasResult,
	disabled = false,
}: ToolbarProps) {
	return (
		<Card>
			<CardContent className="pt-6">
				<div className="flex flex-wrap items-center gap-3">
					{/* Generate Button */}
					<Button
						onClick={onGenerate}
						disabled={disabled || !hasInput || isGenerating}
						size="sm"
						className="flex items-center gap-2"
					>
						<QrCode className="h-4 w-4" />
						{isGenerating ? "Generating..." : "Generate QR Code"}
					</Button>

					<Separator orientation="vertical" className="h-6" />

					{/* Auto Adjust Size */}
					<Button
						variant="outline"
						onClick={onAutoAdjustSize}
						disabled={disabled || !hasInput || isGenerating}
						size="sm"
						className="flex items-center gap-2"
					>
						<Wand2 className="h-4 w-4" />
						Auto Size
					</Button>

					<Separator orientation="vertical" className="h-6" />

					{/* Clear Input */}
					<Button
						variant="outline"
						onClick={onClearInput}
						disabled={disabled || !hasInput || isGenerating}
						size="sm"
						className="flex items-center gap-2"
					>
						<Eraser className="h-4 w-4" />
						Clear Input
					</Button>

					{/* Clear All */}
					<Button
						variant="outline"
						onClick={onClearAll}
						disabled={disabled || (!hasInput && !hasResult) || isGenerating}
						size="sm"
						className="flex items-center gap-2"
					>
						<RotateCcw className="h-4 w-4" />
						Clear All
					</Button>
				</div>

				{/* Status Messages */}
				{isGenerating && (
					<div className="mt-3 text-center text-muted-foreground text-sm">
						Generating QR code...
					</div>
				)}

				{!hasInput && !isGenerating && (
					<div className="mt-3 text-center text-muted-foreground text-sm">
						Enter some text to generate a QR code
					</div>
				)}
			</CardContent>
		</Card>
	);
}
