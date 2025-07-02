export type HashAlgorithm = "md5" | "sha1" | "sha256" | "sha512";

export interface HashResult {
	algorithm: HashAlgorithm;
	hash: string;
	input: string;
	timestamp: Date;
}

export interface HashGeneratorConfig {
	defaultAlgorithm: HashAlgorithm;
	maxInputLength: number;
	defaultPlaceholder: string;
}

export interface HashStats {
	inputLength: number;
	outputLength: number;
	algorithm: HashAlgorithm;
	processingTime: number;
}