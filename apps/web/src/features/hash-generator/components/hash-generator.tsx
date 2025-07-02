"use client";

import { Hash, Shield } from "lucide-react";
import { PageHeader } from "@/components";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useHashGenerator } from "../hooks/use-hash-generator";
import { HashResults } from "./hash-results";
import { TextInput } from "./text-input";
import { Toolbar } from "./toolbar";

export function HashGenerator() {
	const {
		input,
		setInput,
		algorithm,
		setAlgorithm,
		results,
		isGenerating,
		error,
		generateSingleHash,
		generateAllHashes,
		clearResults,
		clearAll,
		hasInput,
		hasResults,
	} = useHashGenerator();

	return (
		<div className="container mx-auto space-y-6 p-6">
			<PageHeader
				title="Hash Generator"
				description="Generate secure hashes using MD5, SHA-1, SHA-256, and SHA-512 algorithms for data integrity verification"
				icons={[Hash, Shield]}
			/>

			<Toolbar
				algorithm={algorithm}
				onAlgorithmChange={setAlgorithm}
				onGenerateSingle={generateSingleHash}
				onGenerateAll={generateAllHashes}
				onClearResults={clearResults}
				onClearAll={clearAll}
				isGenerating={isGenerating}
				hasInput={hasInput}
				hasResults={hasResults}
			/>

			{error && (
				<Alert variant="destructive">
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			<div className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-6">
					<TextInput
						value={input}
						onChange={setInput}
						placeholder="Enter text, password, or any data to generate hash..."
						disabled={isGenerating}
					/>
				</div>

				<div className="lg:sticky lg:top-6 lg:self-start">
					<HashResults results={results} />
				</div>
			</div>

			{/* Information Section */}
			<div className="mt-8 rounded-lg border bg-muted/50 p-6">
				<h3 className="mb-4 font-semibold text-lg">About Hash Algorithms</h3>
				<div className="grid gap-4 md:grid-cols-2">
					<div>
						<h4 className="mb-2 font-medium text-sm">MD5 (128-bit)</h4>
						<p className="text-muted-foreground text-sm">
							Fast but cryptographically broken. Use only for non-security
							purposes like checksums.
						</p>
					</div>
					<div>
						<h4 className="mb-2 font-medium text-sm">SHA-1 (160-bit)</h4>
						<p className="text-muted-foreground text-sm">
							Deprecated for security use. Still used in some legacy systems.
						</p>
					</div>
					<div>
						<h4 className="mb-2 font-medium text-sm">SHA-256 (256-bit)</h4>
						<p className="text-muted-foreground text-sm">
							Secure and widely used. Recommended for most applications
							requiring cryptographic security.
						</p>
					</div>
					<div>
						<h4 className="mb-2 font-medium text-sm">SHA-512 (512-bit)</h4>
						<p className="text-muted-foreground text-sm">
							Highest security level. Ideal for applications requiring maximum
							hash strength.
						</p>
					</div>
				</div>
			</div>
		</div>
	);
}
