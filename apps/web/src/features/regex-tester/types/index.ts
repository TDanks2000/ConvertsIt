export interface RegexMatch {
	id: string;
	match: string;
	index: number;
	length: number;
	groups?: string[];
}

export interface RegexTestResult {
	isValid: boolean;
	matches: RegexMatch[];
	totalMatches: number;
	error?: string;
	executionTime?: number;
}

export interface RegexFlags {
	global: boolean;
	ignoreCase: boolean;
	multiline: boolean;
	dotAll: boolean;
	unicode: boolean;
	sticky: boolean;
}

export interface RegexTesterConfig {
	defaultPattern: string;
	defaultTestString: string;
	maxMatches: number;
}