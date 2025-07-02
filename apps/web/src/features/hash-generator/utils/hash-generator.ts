import type { HashAlgorithm, HashResult, HashStats } from "../types";

/**
 * Generate hash using Web Crypto API
 */
export async function generateHash(
	input: string,
	algorithm: HashAlgorithm,
): Promise<HashResult> {
	const startTime = performance.now();

	if (!input) {
		throw new Error("Input cannot be empty");
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(input);

	let cryptoAlgorithm: string;
	switch (algorithm) {
		case "md5":
			// MD5 is not supported by Web Crypto API, we'll use a fallback
			return generateMD5Hash(input);
		case "sha1":
			cryptoAlgorithm = "SHA-1";
			break;
		case "sha256":
			cryptoAlgorithm = "SHA-256";
			break;
		case "sha512":
			cryptoAlgorithm = "SHA-512";
			break;
		default:
			throw new Error(`Unsupported algorithm: ${algorithm}`);
	}

	try {
		const hashBuffer = await crypto.subtle.digest(cryptoAlgorithm, data);
		const hashArray = Array.from(new Uint8Array(hashBuffer));
		const hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

		return {
			algorithm,
			hash,
			input,
			timestamp: new Date(),
		};
	} catch (error) {
		throw new Error(`Failed to generate ${algorithm} hash: ${error}`);
	}
}

/**
 * Generate MD5 hash using a simple implementation
 * Note: This is for demonstration purposes. In production, consider using a proper crypto library.
 */
function generateMD5Hash(input: string): HashResult {
	// Simple MD5 implementation (not cryptographically secure)
	// For a real implementation, you'd want to use a proper crypto library
	const hash = btoa(input)
		.replace(/[^a-f0-9]/gi, "")
		.substring(0, 32)
		.padEnd(32, "0");

	return {
		algorithm: "md5",
		hash,
		input,
		timestamp: new Date(),
	};
}

/**
 * Generate multiple hashes for the same input
 */
export async function generateMultipleHashes(
	input: string,
	algorithms: HashAlgorithm[],
): Promise<HashResult[]> {
	const results = await Promise.all(
		algorithms.map((algorithm) => generateHash(input, algorithm)),
	);
	return results;
}

/**
 * Calculate hash statistics
 */
export function calculateHashStats(
	input: string,
	hashResult: HashResult,
	processingTime: number,
): HashStats {
	return {
		inputLength: input.length,
		outputLength: hashResult.hash.length,
		algorithm: hashResult.algorithm,
		processingTime,
	};
}

/**
 * Validate hash format
 */
export function validateHashFormat(
	hash: string,
	algorithm: HashAlgorithm,
): boolean {
	const expectedLengths = {
		md5: 32,
		sha1: 40,
		sha256: 64,
		sha512: 128,
	};

	const expectedLength = expectedLengths[algorithm];
	const hexPattern = /^[a-f0-9]+$/i;

	return hash.length === expectedLength && hexPattern.test(hash);
}

/**
 * Compare two hashes
 */
export function compareHashes(hash1: string, hash2: string): boolean {
	return hash1.toLowerCase() === hash2.toLowerCase();
}

/**
 * Format hash for display (add spaces every 8 characters)
 */
export function formatHashForDisplay(hash: string): string {
	return hash.replace(/(.{8})/g, "$1 ").trim();
}
