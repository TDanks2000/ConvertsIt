"use client";

import { Check, Copy } from "lucide-react";
import { type ChangeEvent, useCallback, useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface HexInputProps {
	value: string;
	onChange: (event: ChangeEvent<HTMLInputElement>) => void;
	currentColor: string;
	hideCopyButton?: boolean;
	disabled?: boolean;
	placeholder?: string;
}

export function HexInput({
	value,
	onChange,
	currentColor,
	hideCopyButton = false,
	disabled = false,
	placeholder = "#000000",
}: HexInputProps) {
	const [copied, setCopied] = useState(false);

	const handleCopyColor = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(currentColor);
			setCopied(true);
			setTimeout(() => setCopied(false), 2000);
		} catch (error) {
			console.error("Failed to copy color:", error);
		}
	}, [currentColor]);

	return (
		<div className="flex items-center gap-3">
			<div
				className="h-12 w-12 rounded-lg border-2 shadow-sm"
				style={{ backgroundColor: currentColor }}
			/>
			<div className="flex-1 space-y-1">
				<div className="flex items-center gap-2">
					<Label className="text-muted-foreground text-xs">Hex Color</Label>
					{!hideCopyButton && (
						<Button
							variant="ghost"
							size="sm"
							onClick={handleCopyColor}
							disabled={disabled}
							className="h-6 w-6 p-0"
						>
							{copied ? (
								<Check className="h-3 w-3 text-green-600" />
							) : (
								<Copy className="h-3 w-3" />
							)}
						</Button>
					)}
				</div>
				<Input
					value={value}
					onChange={onChange}
					className="h-8 font-mono text-sm"
					placeholder={placeholder}
					disabled={disabled}
				/>
			</div>
		</div>
	);
}
