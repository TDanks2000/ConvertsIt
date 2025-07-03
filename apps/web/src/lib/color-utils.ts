export interface HSVColor {
	h: number; // 0-360
	s: number; // 0-100
	v: number; // 0-100
}

export interface RGBColor {
	r: number; // 0-255
	g: number; // 0-255
	b: number; // 0-255
}

/**
 * Convert HSV to RGB
 */
export function hsvToRgb(hsv: HSVColor): RGBColor {
	const { h, s, v } = hsv;
	const c = (v / 100) * (s / 100);
	const x = c * (1 - Math.abs(((h / 60) % 2) - 1));
	const m = v / 100 - c;

	let r = 0;
	let g = 0;
	let b = 0;

	if (h >= 0 && h < 60) {
		r = c;
		g = x;
		b = 0;
	} else if (h >= 60 && h < 120) {
		r = x;
		g = c;
		b = 0;
	} else if (h >= 120 && h < 180) {
		r = 0;
		g = c;
		b = x;
	} else if (h >= 180 && h < 240) {
		r = 0;
		g = x;
		b = c;
	} else if (h >= 240 && h < 300) {
		r = x;
		g = 0;
		b = c;
	} else if (h >= 300 && h < 360) {
		r = c;
		g = 0;
		b = x;
	}

	return {
		r: Math.round((r + m) * 255),
		g: Math.round((g + m) * 255),
		b: Math.round((b + m) * 255),
	};
}

/**
 * Convert RGB to HSV
 */
export function rgbToHsv(rgb: RGBColor): HSVColor {
	const { r, g, b } = rgb;
	const rNorm = r / 255;
	const gNorm = g / 255;
	const bNorm = b / 255;

	const max = Math.max(rNorm, gNorm, bNorm);
	const min = Math.min(rNorm, gNorm, bNorm);
	const delta = max - min;

	let h = 0;
	if (delta !== 0) {
		if (max === rNorm) {
			h = ((gNorm - bNorm) / delta) % 6;
		} else if (max === gNorm) {
			h = (bNorm - rNorm) / delta + 2;
		} else {
			h = (rNorm - gNorm) / delta + 4;
		}
	}
	h = Math.round(h * 60);
	if (h < 0) h += 360;

	const s = max === 0 ? 0 : Math.round((delta / max) * 100);
	const v = Math.round(max * 100);

	return { h, s, v };
}

/**
 * Convert RGB to HEX
 */
export function rgbToHex(rgb: RGBColor): string {
	const { r, g, b } = rgb;
	return `#${[r, g, b]
		.map((x) => x.toString(16).padStart(2, "0"))
		.join("")
		.toUpperCase()}`;
}

/**
 * Convert HEX to RGB
 */
export function hexToRgb(hex: string): RGBColor | null {
	const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
	return result
		? {
				r: Number.parseInt(result[1], 16),
				g: Number.parseInt(result[2], 16),
				b: Number.parseInt(result[3], 16),
			}
		: null;
}

/**
 * Convert HSV to HEX
 */
export function hsvToHex(hsv: HSVColor): string {
	return rgbToHex(hsvToRgb(hsv));
}

/**
 * Convert HEX to HSV
 */
export function hexToHsv(hex: string): HSVColor | null {
	const rgb = hexToRgb(hex);
	return rgb ? rgbToHsv(rgb) : null;
}

/**
 * Validate hex color format
 * @param hex - The hex color string to validate
 * @returns True if the hex color is valid, false otherwise
 */
export function isValidHex(hex: string): boolean {
	return /^#?([a-f\d]{3}|[a-f\d]{6})$/i.test(hex);
}

/**
 * Get the contrast ratio between two colors
 * @param color1 - First color in hex format
 * @param color2 - Second color in hex format
 * @returns Contrast ratio between 1 and 21
 */
export function getContrastRatio(color1: string, color2: string): number {
	const rgb1 = hexToRgb(color1);
	const rgb2 = hexToRgb(color2);

	if (!rgb1 || !rgb2) return 1;

	const getLuminance = (rgb: RGBColor): number => {
		const { r, g, b } = rgb;
		const [rs, gs, bs] = [r, g, b].map((c) => {
			const cNorm = c / 255;
			return cNorm <= 0.03928
				? cNorm / 12.92
				: ((cNorm + 0.055) / 1.055) ** 2.4;
		});
		return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
	};

	const lum1 = getLuminance(rgb1);
	const lum2 = getLuminance(rgb2);
	const brightest = Math.max(lum1, lum2);
	const darkest = Math.min(lum1, lum2);

	return (brightest + 0.05) / (darkest + 0.05);
}

/**
 * Check if a color is considered light or dark
 * @param hex - The hex color to check
 * @returns True if the color is light, false if dark
 */
export function isLightColor(hex: string): boolean {
	const rgb = hexToRgb(hex);
	if (!rgb) return false;

	// Using relative luminance formula
	const { r, g, b } = rgb;
	const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
	return luminance > 0.5;
}

/**
 * Normalize hex color (ensure 6 digits with #)
 */
export function normalizeHex(hex: string): string {
	let normalizedHex = hex.replace("#", "");
	if (normalizedHex.length === 3) {
		normalizedHex = normalizedHex
			.split("")
			.map((char) => char + char)
			.join("");
	}
	return `#${normalizedHex.toUpperCase()}`;
}
