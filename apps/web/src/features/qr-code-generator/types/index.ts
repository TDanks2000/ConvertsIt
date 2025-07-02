export type QRCodeLevel = "L" | "M" | "Q" | "H";

export type QRCodeFormat = "png" | "svg" | "jpeg";

export interface QRCodeOptions {
	value: string;
	size: number;
	level: QRCodeLevel;
	bgColor: string;
	fgColor: string;
	includeMargin: boolean;
}

export interface QRCodeResult {
	value: string;
	options: QRCodeOptions;
	timestamp: Date;
	dataUrl?: string;
	stats: QRCodeStats;
}

export interface QRCodeStats {
	inputLength: number;
	size: number;
	errorCorrectionLevel: QRCodeLevel;
	estimatedCapacity: number;
}

export interface QRCodeGeneratorConfig {
	defaultSize: number;
	defaultLevel: QRCodeLevel;
	defaultBgColor: string;
	defaultFgColor: string;
	maxInputLength: number;
	defaultPlaceholder: string;
}