export interface DiffResult {
	original: string;
	modified: string;
	diffs: DiffChange[];
}

export interface DiffChange {
	type: "added" | "removed" | "unchanged";
	value: string;
	lineNumber?: number;
}

export interface TextDiffConfig {
	ignoreWhitespace?: boolean;
	ignoreCase?: boolean;
	showLineNumbers?: boolean;
	wordLevel?: boolean;
}

export type ViewMode = "split" | "unified" | "side-by-side";

export interface DiffStats {
	additions: number;
	deletions: number;
	modifications: number;
	totalLines: number;
}
