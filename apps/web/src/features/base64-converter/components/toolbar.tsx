"use client";

import {
	ArrowLeftRight,
	Clipboard,
	ClipboardCheck,
	Copy,
	Download,
	Eraser,
	RefreshCw,
	Shuffle,
} from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import type { ConversionMode, InputType } from "../types";

interface ToolbarProps {
	mode: ConversionMode;
	onModeChange: (mode: ConversionMode) => void;
	inputType: InputType;
	onInputTypeChange: (type: InputType) => void;
	hasInput: boolean;
	hasOutput: boolean;
	onClear: () => void;
	onLoadSample: () => void;
	onSwapMode: () => void;
	onCopyInput: () => Promise<boolean>;
	onCopyOutput: () => Promise<boolean>;
	onDownloadInput: () => void;
	onDownloadOutput: () => void;
}

export function Toolbar({
	mode,
	onModeChange,
	hasInput,
	hasOutput,
	onClear,
	onLoadSample,
	onSwapMode,
	onCopyInput,
	onCopyOutput,
	onDownloadInput,
	onDownloadOutput,
}: ToolbarProps) {
	const [inputCopied, setInputCopied] = useState(false);
	const [outputCopied, setOutputCopied] = useState(false);

	const handleCopyInput = async () => {
		const success = await onCopyInput();
		if (success) {
			setInputCopied(true);
			setTimeout(() => setInputCopied(false), 2000);
		}
	};

	const handleCopyOutput = async () => {
		const success = await onCopyOutput();
		if (success) {
			setOutputCopied(true);
			setTimeout(() => setOutputCopied(false), 2000);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<RefreshCw className="h-5 w-5" />
					Conversion Controls
				</CardTitle>
			</CardHeader>
			<CardContent className="space-y-6">
				{/* Conversion Mode */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Conversion Mode</Label>
					<RadioGroup
						value={mode}
						onValueChange={(value) => onModeChange(value as ConversionMode)}
						className="flex gap-6"
					>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="encode" id="encode" />
							<Label htmlFor="encode" className="cursor-pointer">
								Encode to Base64
							</Label>
						</div>
						<div className="flex items-center space-x-2">
							<RadioGroupItem value="decode" id="decode" />
							<Label htmlFor="decode" className="cursor-pointer">
								Decode from Base64
							</Label>
						</div>
					</RadioGroup>
				</div>

				<Separator />

				{/* Quick Actions */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Quick Actions</Label>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onSwapMode}
							disabled={!hasInput && !hasOutput}
							className="flex items-center gap-2"
						>
							<ArrowLeftRight className="h-4 w-4" />
							Swap Mode
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onLoadSample}
							className="flex items-center gap-2"
						>
							<Shuffle className="h-4 w-4" />
							Load Sample
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onClear}
							disabled={!hasInput}
							className="flex items-center gap-2"
						>
							<Eraser className="h-4 w-4" />
							Clear
						</Button>
					</div>
				</div>

				<Separator />

				{/* Copy Actions */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Copy to Clipboard</Label>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyInput}
							disabled={!hasInput}
							className="flex items-center gap-2"
						>
							{inputCopied ? (
								<ClipboardCheck className="h-4 w-4 text-green-500" />
							) : (
								<Clipboard className="h-4 w-4" />
							)}
							Copy Input
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={handleCopyOutput}
							disabled={!hasOutput}
							className="flex items-center gap-2"
						>
							{outputCopied ? (
								<ClipboardCheck className="h-4 w-4 text-green-500" />
							) : (
								<Copy className="h-4 w-4" />
							)}
							Copy Output
						</Button>
					</div>
				</div>

				<Separator />

				{/* Download Actions */}
				<div className="space-y-3">
					<Label className="font-medium text-sm">Download as File</Label>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={onDownloadInput}
							disabled={!hasInput}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Download Input
						</Button>

						<Button
							variant="outline"
							size="sm"
							onClick={onDownloadOutput}
							disabled={!hasOutput}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Download Output
						</Button>
					</div>
				</div>

				{/* Usage Tips */}
				<div className="rounded-lg border bg-muted/50 p-3">
					<div className="text-muted-foreground text-sm">
						<div className="mb-1 font-medium">💡 Quick Tips:</div>
						<ul className="space-y-1 text-xs">
							<li>
								• Use "Swap Mode" to quickly switch between encoding and
								decoding
							</li>
							<li>
								• "Load Sample" provides example data to test the converter
							</li>
							<li>• File upload supports any file type for Base64 encoding</li>
							<li>
								• Base64 is commonly used for data URLs and email attachments
							</li>
						</ul>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
