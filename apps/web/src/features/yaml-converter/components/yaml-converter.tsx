"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components";
import { useYamlConverter } from "../hooks/use-yaml-converter";
import type { ViewMode } from "../types";
import { ConverterInput } from "./converter-input";
import { ConverterOutput } from "./converter-output";
import { StatsCard } from "./stats-card";
import { Toolbar } from "./toolbar";

export function YamlConverter() {
	const {
		input,
		setInput,
		conversionMode,
		options,
		conversionResult,
		stats,
		handleClear,
		handleModeSwitch,
		handleOptionsChange,
		handleLoadSample,
	} = useYamlConverter();

	const [viewMode, setViewMode] = useState<ViewMode>("split");

	const handleCopyInput = async () => {
		if (!input) {
			toast.error("No input to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(input);
			toast.success("Input copied to clipboard");
		} catch {
			toast.error("Failed to copy input");
		}
	};

	const handleCopyOutput = async () => {
		if (!conversionResult.data) {
			toast.error("No output to copy");
			return;
		}

		try {
			await navigator.clipboard.writeText(conversionResult.data);
			toast.success("Output copied to clipboard");
		} catch {
			toast.error("Failed to copy output");
		}
	};

	const handleDownload = () => {
		if (!conversionResult.data) {
			toast.error("No data to download");
			return;
		}

		try {
			const outputType = conversionMode === "yaml-to-json" ? "json" : "yaml";
			const filename = `converted-data.${outputType}`;
			const mimeType =
				conversionMode === "yaml-to-json"
					? "application/json"
					: "application/x-yaml";

			const blob = new Blob([conversionResult.data], { type: mimeType });
			const url = URL.createObjectURL(blob);
			const link = document.createElement("a");
			link.href = url;
			link.download = filename;
			link.click();
			URL.revokeObjectURL(url);

			toast.success(`Downloaded ${filename}`);
		} catch {
			toast.error("Failed to download file");
		}
	};

	const handleClearWithToast = () => {
		handleClear();
		toast.success("Input cleared");
	};

	const handleLoadSampleWithToast = () => {
		handleLoadSample();
		toast.success("Sample data loaded");
	};

	return (
		<div className="container mx-auto max-w-6xl p-6">
			<div className="space-y-6">
				<PageHeader
					title="YAML Converter"
					description="Convert between YAML and JSON formats with ease. Transform YAML data to JSON objects or JSON data back to YAML with customizable formatting options and syntax validation."
				/>

				<Toolbar
					conversionMode={conversionMode}
					viewMode={viewMode}
					options={options}
					isValid={conversionResult.isValid}
					hasInput={!!input}
					hasOutput={!!conversionResult.data}
					onModeSwitch={handleModeSwitch}
					onViewModeChange={setViewMode}
					onOptionsChange={handleOptionsChange}
					onLoadSample={handleLoadSampleWithToast}
					onCopyInput={handleCopyInput}
					onCopyOutput={handleCopyOutput}
					onDownload={handleDownload}
					onClear={handleClearWithToast}
				/>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
					{/* Main Content Area */}
					<div className="lg:col-span-3">
						{viewMode === "split" && (
							<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
								<ConverterInput
									value={input}
									onChange={setInput}
									conversionMode={conversionMode}
									validationResult={conversionResult}
								/>
								<ConverterOutput
									value={conversionResult.data || ""}
									conversionMode={conversionMode}
									isValid={conversionResult.isValid}
								/>
							</div>
						)}

						{viewMode === "input" && (
							<ConverterInput
								value={input}
								onChange={setInput}
								conversionMode={conversionMode}
								validationResult={conversionResult}
							/>
						)}

						{viewMode === "output" && (
							<ConverterOutput
								value={conversionResult.data || ""}
								conversionMode={conversionMode}
								isValid={conversionResult.isValid}
							/>
						)}
					</div>

					{/* Stats Sidebar */}
					<div className="lg:col-span-1">
						<StatsCard stats={stats} isValid={conversionResult.isValid} />
					</div>
				</div>
			</div>
		</div>
	);
}
