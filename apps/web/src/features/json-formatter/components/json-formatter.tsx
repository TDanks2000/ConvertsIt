"use client";

import { useCallback, useMemo, useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useJsonFormatter } from "../hooks/use-json-formatter";
import type { ViewMode } from "../types";
import { JsonInput } from "./json-input";
import { JsonOutput } from "./json-output";
import { StatsCard } from "./stats-card";
import { Toolbar } from "./toolbar";

export function JsonFormatter() {
	const {
		input,
		setInput,
		output,
		validation,
		stats,
		formatMode,
		indentSize,
		handleClear,
		handleFormat,
		handleIndentChange,
		handleLoadSample,
	} = useJsonFormatter();

	const [viewMode, setViewMode] = useState<ViewMode>("split");

	const hasContent = useMemo(() => !!input.trim(), [input]);

	const handleCopyInput = useCallback(async () => {
		if (!hasContent) {
			toast.error("No input to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(input);
			toast.success("Input copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy input:", err);
			toast.error("Failed to copy input to clipboard");
		}
	}, [input, hasContent]);

	const handleCopyOutput = useCallback(async () => {
		if (!hasContent || !validation.isValid) {
			toast.error("No valid output to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(output);
			toast.success("Output copied to clipboard!");
		} catch (err) {
			console.error("Failed to copy output:", err);
			toast.error("Failed to copy output to clipboard");
		}
	}, [output, hasContent, validation.isValid]);

	const handleDownload = useCallback(() => {
		if (!hasContent || !validation.isValid) {
			toast.error("No valid JSON to download");
			return;
		}

		try {
			const blob = new Blob([output], { type: "application/json" });
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = `formatted-json-${Date.now()}.json`;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			URL.revokeObjectURL(url);
			toast.success("JSON file downloaded!");
		} catch (err) {
			console.error("Failed to download file:", err);
			toast.error("Failed to download file");
		}
	}, [output, hasContent, validation.isValid]);

	const handleClearWithToast = useCallback(() => {
		handleClear();
		toast.success("JSON cleared successfully");
	}, [handleClear]);

	const handleLoadSampleWithToast = useCallback(() => {
		handleLoadSample();
		toast.success("Sample JSON loaded");
	}, [handleLoadSample]);

	return (
		<div className="container mx-auto max-w-6xl p-6">
			<div className="space-y-6">
				<PageHeader
					title="JSON Formatter"
					description="Validate, format, beautify, and minify your JSON data with our powerful online tool. Perfect for developers and data analysts."
				/>

				<Toolbar
					formatMode={formatMode}
					viewMode={viewMode}
					indentSize={indentSize}
					isValid={validation.isValid}
					hasContent={hasContent}
					onFormatModeChange={handleFormat}
					onViewModeChange={setViewMode}
					onIndentSizeChange={handleIndentChange}
					onClear={handleClearWithToast}
					onCopyInput={handleCopyInput}
					onCopyOutput={handleCopyOutput}
					onLoadSample={handleLoadSampleWithToast}
					onDownload={handleDownload}
				/>

				<div className="grid gap-6">
					{viewMode === "split" && (
						<div className="grid gap-6 lg:grid-cols-2">
							<JsonInput
								value={input}
								onChange={setInput}
								validation={validation}
							/>
							<JsonOutput
								value={output}
								formatMode={formatMode}
								isValid={validation.isValid}
							/>
						</div>
					)}

					{viewMode === "input" && (
						<JsonInput
							value={input}
							onChange={setInput}
							validation={validation}
						/>
					)}

					{viewMode === "output" && (
						<JsonOutput
							value={output}
							formatMode={formatMode}
							isValid={validation.isValid}
						/>
					)}

					{hasContent && (
						<div className="lg:mx-auto lg:max-w-md">
							<StatsCard stats={stats} isValid={validation.isValid} />
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
