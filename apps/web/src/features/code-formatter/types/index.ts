export interface CodeValidationResult {
	isValid: boolean;
	error?: string;
	lineNumber?: number;
	columnNumber?: number;
}

export interface CodeStats {
	size: number;
	lines: number;
	characters: number;
	charactersNoSpaces: number;
	words: number;
	functions: number;
	classes: number;
	comments: number;
}

export type SupportedLanguage = 
	| "javascript"
	| "typescript"
	| "python"
	| "java"
	| "cpp"
	| "csharp"
	| "php"
	| "ruby"
	| "go"
	| "rust"
	| "html"
	| "css"
	| "scss"
	| "json"
	| "xml"
	| "yaml"
	| "sql"
	| "markdown";

export interface LanguageConfig {
	name: string;
	label: string;
	extensions: string[];
	commentSyntax: {
		single?: string;
		multiStart?: string;
		multiEnd?: string;
	};
	supportsFormatting: boolean;
	supportsMinification: boolean;
}

export type FormatMode = "format" | "minify" | "original";
export type ViewMode = "split" | "input" | "output";

export interface FormattingOptions {
	indentSize: number;
	indentType: "spaces" | "tabs";
	maxLineLength: number;
	insertFinalNewline: boolean;
	trimTrailingWhitespace: boolean;
	semicolons: boolean; // for JS/TS
	singleQuotes: boolean; // for JS/TS
	trailingCommas: boolean; // for JS/TS
}

export interface CodeFormatterState {
	input: string;
	output: string;
	language: SupportedLanguage;
	formatMode: FormatMode;
	formattingOptions: FormattingOptions;
	validation: CodeValidationResult;
	stats: CodeStats;
}