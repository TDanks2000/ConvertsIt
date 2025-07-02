"use client";

import { Hash, Loader2, RotateCcw, Settings, Trash2, Zap } from "lucide-react";
import { memo } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type { HashAlgorithm } from "../types";

interface ToolbarProps {
	algorithm: HashAlgorithm;
	onAlgorithmChange: (algorithm: HashAlgorithm) => void;
	onGenerateSingle: () => void;
	onGenerateAll: () => void;
	onClearResults: () => void;
	onClearAll: () => void;
	isGenerating: boolean;
	hasInput: boolean;
	hasResults: boolean;
}

const algorithmInfo = {
	md5: { name: "MD5", bits: "128-bit", color: "bg-red-100 text-red-800" },
	sha1: {
		name: "SHA-1",
		bits: "160-bit",
		color: "bg-orange-100 text-orange-800",
	},
	sha256: {
		name: "SHA-256",
		bits: "256-bit",
		color: "bg-green-100 text-green-800",
	},
	sha512: {
		name: "SHA-512",
		bits: "512-bit",
		color: "bg-blue-100 text-blue-800",
	},
};

export const Toolbar = memo(function Toolbar({
	algorithm,
	onAlgorithmChange,
	onGenerateSingle,
	onGenerateAll,
	onClearResults,
	onClearAll,
	isGenerating,
	hasInput,
	hasResults,
}: ToolbarProps) {
	return (
		<Card>
			<CardContent className="p-4">
				<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
					{/* Algorithm Selection */}
					<div className="flex flex-col gap-2 sm:flex-row sm:items-center">
						<div className="flex items-center gap-2">
							<Settings className="h-4 w-4" />
							<span className="font-medium text-sm">Algorithm:</span>
						</div>
						<div className="flex items-center gap-2">
							<Select
								value={algorithm}
								onValueChange={(value) =>
									onAlgorithmChange(value as HashAlgorithm)
								}
								disabled={isGenerating}
							>
								<SelectTrigger className="w-32">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{Object.entries(algorithmInfo).map(([key, info]) => (
										<SelectItem key={key} value={key}>
											{info.name}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Badge
								variant="secondary"
								className={`text-xs ${algorithmInfo[algorithm].color}`}
							>
								{algorithmInfo[algorithm].bits}
							</Badge>
						</div>
					</div>

					{/* Action Buttons */}
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={onGenerateSingle}
							disabled={!hasInput || isGenerating}
							size="sm"
							className="flex items-center gap-2"
						>
							{isGenerating ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Hash className="h-4 w-4" />
							)}
							Generate {algorithmInfo[algorithm].name}
						</Button>

						<Button
							onClick={onGenerateAll}
							disabled={!hasInput || isGenerating}
							variant="outline"
							size="sm"
							className="flex items-center gap-2"
						>
							{isGenerating ? (
								<Loader2 className="h-4 w-4 animate-spin" />
							) : (
								<Zap className="h-4 w-4" />
							)}
							Generate All
						</Button>

						<Separator orientation="vertical" className="h-8" />

						<Button
							onClick={onClearResults}
							disabled={!hasResults || isGenerating}
							variant="outline"
							size="sm"
							className="flex items-center gap-2"
						>
							<RotateCcw className="h-4 w-4" />
							Clear Results
						</Button>

						<Button
							onClick={onClearAll}
							disabled={(!hasInput && !hasResults) || isGenerating}
							variant="outline"
							size="sm"
							className="flex items-center gap-2 text-destructive hover:text-destructive"
						>
							<Trash2 className="h-4 w-4" />
							Clear All
						</Button>
					</div>
				</div>
			</CardContent>
		</Card>
	);
});
