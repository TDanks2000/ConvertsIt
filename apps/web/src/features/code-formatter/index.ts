export { CodeFormatter } from "./components/code-formatter";
export { CodeInput } from "./components/code-input";
export { CodeOutput } from "./components/code-output";
export { StatsCard } from "./components/stats-card";
export { Toolbar } from "./components/toolbar";

export { useCodeFormatter } from "./hooks/use-code-formatter";

export type {
	CodeFormatterState,
	CodeStats,
	CodeValidationResult,
	FormatMode,
	FormattingOptions,
	LanguageConfig,
	SupportedLanguage,
	ViewMode,
} from "./types";

export {
	calculateCodeStats,
	defaultFormattingOptions,
	detectLanguage,
	formatCode,
	getSampleCode,
	languageConfigs,
	minifyCode,
	validateCode,
} from "./utils/code-operations";
