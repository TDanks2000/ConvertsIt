"use client";

import { memo } from "react";
import { useBase64Converter } from "../hooks/use-base64-converter";
import { Base64Input } from "./base64-input";
import { Base64Output } from "./base64-output";
import { StatsCard } from "./stats-card";
import { Toolbar } from "./toolbar";

export const Base64Converter = memo(function Base64Converter() {
	const {
		input,
		output,
		mode,
		inputType,
		fileInfo,
		validation,
		stats,
		handleInputChange,
		handleModeChange,
		handleInputTypeChange,
		handleFileUpload,
		handleClear,
		handleLoadSample,
		handleSwapMode,
		handleCopyInput,
		handleCopyOutput,
		handleDownloadInput,
		handleDownloadOutput,
	} = useBase64Converter();

	const hasInput = Boolean(input.trim());
	const hasOutput = Boolean(output.trim()) && validation.isValid;

	return (
		<div className="space-y-6">
			{/* Toolbar */}
			<Toolbar
				mode={mode}
				onModeChange={handleModeChange}
				inputType={inputType}
				onInputTypeChange={handleInputTypeChange}
				hasInput={hasInput}
				hasOutput={hasOutput}
				onClear={handleClear}
				onLoadSample={handleLoadSample}
				onSwapMode={handleSwapMode}
				onCopyInput={handleCopyInput}
				onCopyOutput={handleCopyOutput}
				onDownloadInput={handleDownloadInput}
				onDownloadOutput={handleDownloadOutput}
			/>

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Input Section */}
				<Base64Input
					value={input}
					onChange={handleInputChange}
					mode={mode}
					inputType={inputType}
					onInputTypeChange={handleInputTypeChange}
					onFileUpload={handleFileUpload}
					fileInfo={fileInfo}
				/>

				{/* Output Section */}
				<Base64Output
					value={output}
					mode={mode}
					validation={validation}
				/>
			</div>

			{/* Statistics */}
			<StatsCard
				stats={stats}
				mode={mode}
				hasInput={hasInput}
				hasOutput={hasOutput}
			/>
		</div>
	);
});