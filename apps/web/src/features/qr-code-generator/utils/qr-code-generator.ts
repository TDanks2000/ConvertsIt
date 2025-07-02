import type {
	QRCodeLevel,
	QRCodeOptions,
	QRCodeResult,
	QRCodeStats,
} from "../types";

/**
 * Generate QR code result with metadata
 */
export function generateQRCodeResult(
	value: string,
	options: QRCodeOptions,
): QRCodeResult {
	return {
		value,
		options,
		timestamp: new Date(),
		stats: calculateQRCodeStats(value, options),
	};
}

/**
 * Calculate QR code statistics
 */
export function calculateQRCodeStats(
	value: string,
	options: QRCodeOptions,
): QRCodeStats {
	// Estimated capacity based on error correction level
	const capacityMap: Record<QRCodeLevel, number> = {
		L: 2953, // Low (7%)
		M: 2331, // Medium (15%)
		Q: 1663, // Quartile (25%)
		H: 1273, // High (30%)
	};

	return {
		inputLength: value.length,
		size: options.size,
		errorCorrectionLevel: options.level,
		estimatedCapacity: capacityMap[options.level],
	};
}

/**
 * Validate QR code input
 */
export function validateQRCodeInput(value: string): {
	isValid: boolean;
	error?: string;
} {
	if (!value.trim()) {
		return {
			isValid: false,
			error: "Please enter some text or data to generate QR code",
		};
	}

	if (value.length > 2953) {
		return {
			isValid: false,
			error: "Input is too long. Maximum length is 2953 characters.",
		};
	}

	return { isValid: true };
}

/**
 * Get error correction level description
 */
export function getErrorCorrectionDescription(level: QRCodeLevel): string {
	const descriptions = {
		L: "Low (7%) - Good for clean environments",
		M: "Medium (15%) - Balanced option for most uses",
		Q: "Quartile (25%) - Good for industrial environments",
		H: "High (30%) - Best for damaged or dirty surfaces",
	};
	return descriptions[level];
}

/**
 * Generate filename for QR code download
 */
export function generateFilename(value: string, format = "png"): string {
	return generateQRCodeFilename(value, format);
}

/**
 * Generate filename for QR code download
 */
export function generateQRCodeFilename(value: string, format = "png"): string {
	// Create a safe filename from the QR code value
	const safeValue = value
		.replace(/[^a-zA-Z0-9]/g, "_")
		.substring(0, 50)
		.replace(/_+/g, "_")
		.replace(/^_|_$/g, "");

	const timestamp = new Date().toISOString().slice(0, 10);
	return `qrcode_${safeValue || "generated"}_${timestamp}.${format}`;
}

/**
 * Convert canvas to data URL for download
 */
export function canvasToDataUrl(
	canvas: HTMLCanvasElement,
	format = "png",
): string {
	const mimeType = `image/${format}`;
	return canvas.toDataURL(mimeType);
}

/**
 * Download QR code as image
 */
export function downloadQRCode(
	options: QRCodeOptions,
	format: "png" | "svg",
	filename: string,
): Promise<void> {
	return new Promise((resolve, reject) => {
		try {
			if (format === "svg") {
				// For SVG, we need to create the SVG content
				const svgElement = document.querySelector("#qr-code-container svg");
				if (svgElement) {
					const svgData = new XMLSerializer().serializeToString(svgElement);
					const svgBlob = new Blob([svgData], {
						type: "image/svg+xml;charset=utf-8",
					});
					const svgUrl = URL.createObjectURL(svgBlob);

					const link = document.createElement("a");
					link.download = filename;
					link.href = svgUrl;
					document.body.appendChild(link);
					link.click();
					document.body.removeChild(link);

					URL.revokeObjectURL(svgUrl);
					resolve();
				} else {
					reject(new Error("SVG element not found"));
				}
			} else {
				// For PNG, convert SVG to canvas
				const svgElement = document.querySelector("#qr-code-container svg");
				if (svgElement) {
					const canvas = document.createElement("canvas");
					const ctx = canvas.getContext("2d");
					const img = new Image();

					canvas.width = options.size;
					canvas.height = options.size;

					img.onload = () => {
						if (ctx) {
							ctx.fillStyle =
								options.bgColor === "transparent" ? "#FFFFFF" : options.bgColor;
							ctx.fillRect(0, 0, canvas.width, canvas.height);
							ctx.drawImage(img, 0, 0);

							const dataUrl = canvas.toDataURL("image/png");
							const link = document.createElement("a");
							link.download = filename;
							link.href = dataUrl;
							document.body.appendChild(link);
							link.click();
							document.body.removeChild(link);

							resolve();
						} else {
							reject(new Error("Canvas context not available"));
						}
					};

					img.onerror = () => reject(new Error("Failed to load SVG"));

					const svgData = new XMLSerializer().serializeToString(svgElement);
					const svgBlob = new Blob([svgData], {
						type: "image/svg+xml;charset=utf-8",
					});
					img.src = URL.createObjectURL(svgBlob);
				} else {
					reject(new Error("SVG element not found"));
				}
			}
		} catch (error) {
			reject(error);
		}
	});
}

/**
 * Simple download function for data URLs
 */
export function downloadDataUrl(dataUrl: string, filename: string): void {
	const link = document.createElement("a");
	link.download = filename;
	link.href = dataUrl;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
}

/**
 * Get recommended QR code size based on content length
 */
export function getRecommendedSize(contentLength: number): number {
	if (contentLength <= 50) return 200;
	if (contentLength <= 100) return 250;
	if (contentLength <= 200) return 300;
	if (contentLength <= 500) return 350;
	return 400;
}

/**
 * Validate hex color
 */
export function isValidHexColor(color: string): boolean {
	return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(color);
}

/**
 * Get contrast color (black or white) for given background
 */
export function getContrastColor(hexColor: string): string {
	// Remove # if present
	const color = hexColor.replace("#", "");

	// Convert to RGB
	const r = Number.parseInt(color.substr(0, 2), 16);
	const g = Number.parseInt(color.substr(2, 2), 16);
	const b = Number.parseInt(color.substr(4, 2), 16);

	// Calculate luminance
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

	// Return black or white based on luminance
	return luminance > 0.5 ? "#000000" : "#FFFFFF";
}
