import {
	BlobReader,
	BlobWriter,
	HttpReader,
	TextReader,
	Uint8ArrayReader,
	ZipReader,
	ZipWriter,
} from "@zip.js/zip.js";

export interface ZipFile {
	name: string;
	data: Blob | string | Uint8Array;
	mimeType?: string;
}

/**
 * Ensures unique filenames by adding a counter suffix for duplicates
 * @param files Array of ZipFile objects
 * @returns Array of ZipFile objects with unique filenames
 */
export function ensureUniqueFilenames(files: ZipFile[]): ZipFile[] {
	const usedNames = new Set<string>();
	const uniqueFiles: ZipFile[] = [];

	for (const file of files) {
		let uniqueName = file.name;
		let counter = 1;
		
		// If the name is already used, find the next available number
		while (usedNames.has(uniqueName)) {
			// Extract file extension and base name
			const lastDotIndex = file.name.lastIndexOf('.');
			if (lastDotIndex > 0) {
				const baseName = file.name.substring(0, lastDotIndex);
				const extension = file.name.substring(lastDotIndex);
				uniqueName = `${baseName} (${counter})${extension}`;
			} else {
				uniqueName = `${file.name} (${counter})`;
			}
			counter++;
		}
		
		usedNames.add(uniqueName);
		uniqueFiles.push({
			...file,
			name: uniqueName
		});
	}

	return uniqueFiles;
}

export interface ZipOptions {
	compressionLevel?: number; // 0-9, where 9 is maximum compression
	password?: string;
}

export interface ExtractedFile {
	name: string;
	data: Blob;
	size: number;
	lastModified: Date;
}

/**
 * Compresses multiple files into a ZIP archive
 * @param files Array of files to compress
 * @param options Compression options
 * @returns Promise that resolves to a Blob containing the ZIP file
 */
export async function createZip(
	files: ZipFile[],
	options: ZipOptions = {},
): Promise<Blob> {
	const { compressionLevel = 6, password } = options;

	// Ensure unique filenames to prevent conflicts
	const uniqueFiles = ensureUniqueFilenames(files);

	const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
		level: compressionLevel,
		password,
	});

	try {
		for (const file of uniqueFiles) {
			let reader: BlobReader | TextReader | Uint8ArrayReader;

			if (file.data instanceof Blob) {
				reader = new BlobReader(file.data);
			} else if (typeof file.data === "string") {
				reader = new TextReader(file.data);
			} else if (file.data instanceof Uint8Array) {
				reader = new Uint8ArrayReader(file.data);
			} else {
				throw new Error(`Unsupported data type for file: ${file.name}`);
			}

			await zipWriter.add(file.name, reader, {
				lastModDate: new Date(),
			});
		}

		const zipBlob = await zipWriter.close();
		return zipBlob;
	} catch (error) {
		await zipWriter.close();
		throw new Error(
			`Failed to create ZIP: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Extracts files from a ZIP archive
 * @param zipBlob The ZIP file as a Blob
 * @param password Optional password for encrypted ZIP files
 * @returns Promise that resolves to an array of extracted files
 */
export async function extractZip(
	zipBlob: Blob,
	password?: string,
): Promise<ExtractedFile[]> {
	const zipReader = new ZipReader(new BlobReader(zipBlob), { password });

	try {
		const entries = await zipReader.getEntries();
		const extractedFiles: ExtractedFile[] = [];

		for (const entry of entries) {
			if (!entry.directory && entry.getData) {
				const data = await entry.getData(new BlobWriter());
				extractedFiles.push({
					name: entry.filename,
					data,
					size: entry.uncompressedSize,
					lastModified: entry.lastModDate || new Date(),
				});
			}
		}

		await zipReader.close();
		return extractedFiles;
	} catch (error) {
		await zipReader.close();
		throw new Error(
			`Failed to extract ZIP: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Downloads a ZIP file containing multiple files
 * @param files Array of files to include in the ZIP
 * @param filename Name of the ZIP file to download
 * @param options Compression options
 */
export async function downloadAsZip(
	files: ZipFile[],
	filename = "archive.zip",
	options: ZipOptions = {},
): Promise<void> {
	try {
		const zipBlob = await createZip(files, options);

		// Create download link
		const url = URL.createObjectURL(zipBlob);
		const link = document.createElement("a");
		link.href = url;
		link.download = filename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up the URL
		URL.revokeObjectURL(url);
	} catch (error) {
		throw new Error(
			`Failed to download ZIP: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Creates a ZIP file from URLs (useful for downloading remote files)
 * @param urls Array of objects containing URL and filename
 * @param zipFilename Name of the resulting ZIP file
 * @param options Compression options
 */
export async function createZipFromUrls(
	urls: Array<{ url: string; filename: string }>,
	zipFilename = "download.zip",
	options: ZipOptions = {},
): Promise<void> {
	const { compressionLevel = 6, password } = options;

	const zipWriter = new ZipWriter(new BlobWriter("application/zip"), {
		level: compressionLevel,
		password,
	});

	try {
		for (const { url, filename } of urls) {
			const reader = new HttpReader(url);
			await zipWriter.add(filename, reader, {
				lastModDate: new Date(),
			});
		}

		const zipBlob = await zipWriter.close();

		// Download the ZIP file
		const downloadUrl = URL.createObjectURL(zipBlob);
		const link = document.createElement("a");
		link.href = downloadUrl;
		link.download = zipFilename;
		document.body.appendChild(link);
		link.click();
		document.body.removeChild(link);

		// Clean up
		URL.revokeObjectURL(downloadUrl);
	} catch (error) {
		await zipWriter.close();
		throw new Error(
			`Failed to create ZIP from URLs: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Utility function to convert a File to a ZipFile
 * @param file The File object to convert
 * @param customName Optional custom name for the file in the ZIP
 * @returns ZipFile object
 */
export function fileToZipFile(file: File, customName?: string): ZipFile {
	return {
		name: customName || file.name,
		data: file,
		mimeType: file.type,
	};
}

/**
 * Utility function to convert a Blob URL to a ZipFile
 * @param url The Blob URL
 * @param filename The filename to use in the ZIP
 * @param mimeType Optional MIME type
 * @returns Promise that resolves to a ZipFile object
 */
export async function blobUrlToZipFile(
	url: string,
	filename: string,
	mimeType?: string,
): Promise<ZipFile> {
	try {
		const response = await fetch(url);
		const blob = await response.blob();

		return {
			name: filename,
			data: blob,
			mimeType: mimeType || blob.type,
		};
	} catch (error) {
		throw new Error(
			`Failed to convert blob URL to ZipFile: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}

/**
 * Gets information about a ZIP file without extracting it
 * @param zipBlob The ZIP file as a Blob
 * @param password Optional password for encrypted ZIP files
 * @returns Promise that resolves to ZIP file information
 */
export async function getZipInfo(
	zipBlob: Blob,
	password?: string,
): Promise<{
	fileCount: number;
	totalSize: number;
	compressedSize: number;
	files: Array<{
		name: string;
		size: number;
		compressedSize: number;
		lastModified: Date;
		isDirectory: boolean;
	}>;
}> {
	const zipReader = new ZipReader(new BlobReader(zipBlob), { password });

	try {
		const entries = await zipReader.getEntries();
		let totalSize = 0;
		let compressedSize = 0;

		const files = entries.map((entry) => {
			totalSize += entry.uncompressedSize;
			compressedSize += entry.compressedSize;

			return {
				name: entry.filename,
				size: entry.uncompressedSize,
				compressedSize: entry.compressedSize,
				lastModified: entry.lastModDate || new Date(),
				isDirectory: entry.directory,
			};
		});

		await zipReader.close();

		return {
			fileCount: entries.length,
			totalSize,
			compressedSize,
			files,
		};
	} catch (error) {
		await zipReader.close();
		throw new Error(
			`Failed to get ZIP info: ${error instanceof Error ? error.message : "Unknown error"}`,
		);
	}
}
