"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useUrlEncoderDecoder } from "../hooks/use-url-encoder-decoder";
import type { ViewMode } from "../types";
import { StatsCard } from "./stats-card";
import { Toolbar } from "./toolbar";
import { UrlInput } from "./url-input";
import { UrlOutput } from "./url-output";

export function UrlEncoderDecoder() {
	const {
		input,
		setInput,
		output,
		mode,
		setMode,
		encodingType,
		validation,
		stats,
		handleClear,
		handleSwapMode,
		handleLoadSample,
		handleEncodingTypeChange,
	} = useUrlEncoderDecoder();

	const [viewMode, setViewMode] = useState<ViewMode>("split");

	const hasInput = useMemo(() => !!input.trim(), [input]);
	const hasOutput = useMemo(() => !!output.trim(), [output]);

	const handleCopyInput = useCallback(async () => {
		if (!hasInput) return;
		try {
			await navigator.clipboard.writeText(input);
			toast.success("Input copied to clipboard");
		} catch {
			toast.error("Failed to copy input");
		}
	}, [input, hasInput]);

	const handleCopyOutput = useCallback(async () => {
		if (!hasOutput) return;
		try {
			await navigator.clipboard.writeText(output);
			toast.success("Output copied to clipboard");
		} catch {
			toast.error("Failed to copy output");
		}
	}, [output, hasOutput]);

	const handleDownload = useCallback(() => {
		if (!hasOutput) return;
		try {
			const blob = new Blob([output], { type: "text/plain" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `${mode}-result.txt`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			toast.success("File downloaded successfully");
		} catch {
			toast.error("Failed to download file");
		}
	}, [output, hasOutput, mode]);

	return (
		<div className="container mx-auto px-4 py-8">
			<div className="mx-auto max-w-7xl">
				{/* Header */}
				<PageHeader
					title="URL Encoder & Decoder"
					description="Encode and decode URLs with support for component and full URL encoding. Perfect for handling special characters in URLs and query parameters."
				/>

				{/* Toolbar */}
				<div className="mb-6">
					<Toolbar
						mode={mode}
						onModeChange={setMode}
						encodingType={encodingType}
						onEncodingTypeChange={handleEncodingTypeChange}
						viewMode={viewMode}
						onViewModeChange={setViewMode}
						isValid={validation.isValid}
						hasInput={hasInput}
						hasOutput={hasOutput}
						onClear={handleClear}
						onSwapMode={handleSwapMode}
						onCopyInput={handleCopyInput}
						onCopyOutput={handleCopyOutput}
						onLoadSample={handleLoadSample}
						onDownload={handleDownload}
					/>
				</div>

				{/* Main Content */}
				<div className="space-y-6">
					{/* Input/Output Section */}
					{viewMode === "split" && (
						<div className="grid gap-6 lg:grid-cols-2">
							<UrlInput
								value={input}
								onChange={setInput}
								validation={validation}
								mode={mode}
							/>
							<UrlOutput
								value={output}
								mode={mode}
								isValid={validation.isValid}
							/>
						</div>
					)}

					{viewMode === "input" && (
						<UrlInput
							value={input}
							onChange={setInput}
							validation={validation}
							mode={mode}
						/>
					)}

					{viewMode === "output" && (
						<UrlOutput
							value={output}
							mode={mode}
							isValid={validation.isValid}
						/>
					)}

					{/* Statistics */}
					{hasInput && <StatsCard stats={stats} />}
				</div>

				{/* Features Section */}
				<div className="mt-12">
					<div className="rounded-lg border bg-card p-6">
						<h2 className="mb-4 font-semibold text-lg">Features</h2>
						<div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Component Encoding</h3>
								<p className="text-muted-foreground text-xs">
									Encode/decode individual URL components like query parameters
									and form data.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Full URL Encoding</h3>
								<p className="text-muted-foreground text-xs">
									Encode/decode complete URLs while preserving URL structure and
									reserved characters.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Real-time Processing</h3>
								<p className="text-muted-foreground text-xs">
									Instant encoding/decoding as you type with live validation and
									error detection.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">URL Analysis</h3>
								<p className="text-muted-foreground text-xs">
									Detailed breakdown of URL components including protocol,
									hostname, and parameters.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Copy & Download</h3>
								<p className="text-muted-foreground text-xs">
									Easily copy results to clipboard or download as text files for
									later use.
								</p>
							</div>
							<div className="space-y-2">
								<h3 className="font-medium text-sm">Sample Data</h3>
								<p className="text-muted-foreground text-xs">
									Quick start with pre-loaded sample URLs and text for testing
									and learning.
								</p>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
