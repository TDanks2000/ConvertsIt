"use client";

import { Download, QrCode, Smartphone } from "lucide-react";
import QRCodeReact from "react-qr-code";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import type { QRCodeOptions, QRCodeResult } from "../types";
import { downloadQRCode, generateQRCodeFilename } from "../utils/qr-code-generator";

interface QRCodeDisplayProps {
	result: QRCodeResult | null;
	options: QRCodeOptions;
	onDownload?: (format: "png" | "svg") => void;
	disabled?: boolean;
}

export function QRCodeDisplay({
	result,
	options,
	onDownload,
	disabled = false,
}: QRCodeDisplayProps) {
	if (!result) {
		return (
			<Card>
				<CardHeader>
					<CardTitle className="flex items-center gap-2">
						<QrCode className="h-5 w-5" />
						QR Code Preview
					</CardTitle>
				</CardHeader>
				<CardContent>
					<div className="flex flex-col items-center justify-center py-12 text-center">
						<QrCode className="mb-4 h-16 w-16 text-muted-foreground" />
						<p className="text-muted-foreground text-sm">
							Enter some text to generate a QR code
						</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	const handleDownload = async (format: "png" | "svg") => {
		if (!result) return;

		try {
			const filename = generateQRCodeFilename(result.value, format);
			await downloadQRCode(options, format, filename);
			onDownload?.(format);
		} catch (error) {
			console.error("Download failed:", error);
		}
	};

	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<QrCode className="h-5 w-5" />
					QR Code Preview
				</CardTitle>
			</CardHeader>
			<CardContent>
				{/* QR Code Display */}
				<div className="mb-6 flex justify-center">
					<div
						id="qr-code-container"
						className="rounded-lg border bg-white p-4 shadow-sm"
						style={{
							backgroundColor:
								options.bgColor === "transparent" ? "white" : options.bgColor,
						}}
					>
						<QRCodeReact
							value={result.value}
							size={options.size}
							level={options.level}
							fgColor={options.fgColor}
							bgColor={options.bgColor}
						/>
					</div>
				</div>

				{/* Download Buttons */}
				<div className="space-y-3">
					<div className="flex items-center justify-center gap-2">
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleDownload("png")}
							disabled={disabled}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Download PNG
						</Button>
						<Button
							variant="outline"
							size="sm"
							onClick={() => handleDownload("svg")}
							disabled={disabled}
							className="flex items-center gap-2"
						>
							<Download className="h-4 w-4" />
							Download SVG
						</Button>
					</div>

					<Separator />

					{/* QR Code Stats */}
					<div className="grid grid-cols-2 gap-4 text-sm">
						<div className="text-center">
							<div className="font-medium text-muted-foreground">Size</div>
							<div className="font-mono">
								{result.stats.size}×{result.stats.size}px
							</div>
						</div>
						<div className="text-center">
							<div className="font-medium text-muted-foreground">
								Error Correction
							</div>
							<div className="font-mono">
								{result.stats.errorCorrectionLevel}
							</div>
						</div>
						<div className="text-center">
							<div className="font-medium text-muted-foreground">
								Data Length
							</div>
							<div className="font-mono">{result.stats.inputLength} chars</div>
						</div>
						<div className="text-center">
							<div className="font-medium text-muted-foreground">Capacity</div>
							<div className="font-mono">~{result.stats.estimatedCapacity}</div>
						</div>
					</div>

					{/* Mobile Scanning Tip */}
					<div className="mt-4 flex items-center justify-center gap-2 text-muted-foreground text-xs">
						<Smartphone className="h-4 w-4" />
						<span>Scan with your mobile device camera</span>
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
