import type { HashAlgorithm, HashResult, HashStats } from "../types";
import { md5 } from "./md5";

export async function generateHash(
	input: string,
	algorithm: HashAlgorithm,
): Promise<HashResult> {
	if (!input) {
		throw new Error("Input cannot be empty");
	}

	const encoder = new TextEncoder();
	const data = encoder.encode(input);

	let hash: string;
	switch (algorithm) {
		case "md5":
			hash = md5(input);
			break;
		case "sha1":
		case "sha256":
		case "sha512": {
			const cryptoAlgorithm =
				algorithm === "sha1"
					? "SHA-1"
					: algorithm === "sha256"
						? "SHA-256"
						: "SHA-512";
			try {
				const hashBuffer = await crypto.subtle.digest(cryptoAlgorithm, data);
				const hashArray = Array.from(new Uint8Array(hashBuffer));
				hash = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
			} catch (error) {
				throw new Error(`Failed to generate ${algorithm} hash: ${error}`);
			}
			break;
		}
		default:
			throw new Error(`Unsupported algorithm: ${algorithm}`);
	}

	return {
		algorithm,
		hash,
		input,
		timestamp: new Date(),
	};
}

export async function generateMultipleHashes(
	input: string,
	algorithms: HashAlgorithm[],
): Promise<HashResult[]> {
	const results = await Promise.all(
		algorithms.map((algorithm) => generateHash(input, algorithm)),
	);
	return results;
}

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

export function validateHashFormat(
	hash: string,
	algorithm: HashAlgorithm,
): boolean {
	const expectedLengths: Record<HashAlgorithm, number> = {
		md5: 32,
		sha1: 40,
		sha256: 64,
		sha512: 128,
	};

	const expectedLength = expectedLengths[algorithm];
	const hexPattern = /^[a-f0-9]+$/i;

	return hash.length === expectedLength && hexPattern.test(hash);
}

export function compareHashes(hash1: string, hash2: string): boolean {
	return hash1.toLowerCase() === hash2.toLowerCase();
}

export function formatHashForDisplay(hash: string): string {
	return hash.replace(/(.{8})/g, "$1 ").trim();
}
