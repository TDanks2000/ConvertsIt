"use client";

import { memo } from "react";
import { useCodeFormatter } from "../hooks/use-code-formatter";
import { CodeInput } from "./code-input";
import { CodeOutput } from "./code-output";
import { StatsCard } from "./stats-card";
import { Toolbar } from "./toolbar";

export const CodeFormatter = memo(function CodeFormatter() {
	const {
		input,
		setInput,
		output,
		language,
		setLanguage,
		formatMode,
		setFormatMode,
		viewMode,
		setViewMode,
		formattingOptions,
		validation,
		stats,
		handleAutoDetect,
		handleLoadSample,
		handleClear,
		handleFormat,
		handleMinify,
		handleReset,
		handleOptionsChange,
		handleCopyInput,
		handleCopyOutput,
		handleDownloadInput,
		handleDownloadOutput,
	} = useCodeFormatter();

	const renderContent = () => {
		switch (viewMode) {
			case "input":
				return (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
						<div className="lg:col-span-3">
							<CodeInput
								value={input}
								onChange={setInput}
								language={language}
							/>
						</div>
						<div className="lg:col-span-1">
							<StatsCard stats={stats} language={language} />
						</div>
					</div>
				);

			case "output":
				return (
					<div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
						<div className="lg:col-span-3">
							<CodeOutput
								value={output}
								language={language}
								formatMode={formatMode}
								isValid={validation.isValid}
							/>
						</div>
						<div className="lg:col-span-1">
							<StatsCard stats={stats} language={language} />
						</div>
					</div>
				);

			default:
				return (
					<div className="space-y-6">
						<div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
							<CodeInput
								value={input}
								onChange={setInput}
								language={language}
							/>
							<CodeOutput
								value={output}
								language={language}
								formatMode={formatMode}
								isValid={validation.isValid}
							/>
						</div>
						<StatsCard stats={stats} language={language} />
					</div>
				);
		}
	};

	return (
		<div className="space-y-6">
			<Toolbar
				language={language}
				onLanguageChange={setLanguage}
				formatMode={formatMode}
				onFormatModeChange={setFormatMode}
				viewMode={viewMode}
				onViewModeChange={setViewMode}
				formattingOptions={formattingOptions}
				onFormattingOptionsChange={handleOptionsChange}
				validation={validation}
				hasInput={input.length > 0}
				hasOutput={output.length > 0}
				onAutoDetect={handleAutoDetect}
				onLoadSample={handleLoadSample}
				onClear={handleClear}
				onFormat={handleFormat}
				onMinify={handleMinify}
				onReset={handleReset}
				onCopyInput={handleCopyInput}
				onCopyOutput={handleCopyOutput}
				onDownloadInput={handleDownloadInput}
				onDownloadOutput={handleDownloadOutput}
			/>
			{renderContent()}
		</div>
	);
});
