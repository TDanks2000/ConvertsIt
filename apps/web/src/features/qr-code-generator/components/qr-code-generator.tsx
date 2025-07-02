"use client";

import { AlertCircle, Info, QrCode } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useQRCodeGenerator } from "../hooks/use-qr-code-generator";
import { QRCodeDisplay } from "./qr-code-display";
import { QRCodeOptionsComponent } from "./qr-code-options";
import { TextInput } from "./text-input";
import { Toolbar } from "./toolbar";

export function QRCodeGenerator() {
	const {
		input,
		options,
		result,
		isGenerating,
		error,
		updateInput,
		updateOption,
		generateQRCode,
		autoAdjustSize,
		resetOptions,
		clearInput,

		clearAll,
	} = useQRCodeGenerator();

	const hasInput = input.trim().length > 0;
	const hasResult = result !== null;

	return (
		<div className="container mx-auto max-w-7xl px-4 py-8">
			{/* Header */}
			<div className="mb-8 text-center">
				<div className="mb-4 flex items-center justify-center gap-3">
					<QrCode className="h-8 w-8 text-primary" />
					<h1 className="font-bold text-3xl">QR Code Generator</h1>
				</div>
				<p className="mx-auto max-w-2xl text-lg text-muted-foreground">
					Generate customizable QR codes for text, URLs, and any data. Choose
					from different error correction levels, colors, and sizes.
				</p>
			</div>

			{/* Error Alert */}
			{error && (
				<Alert variant="destructive" className="mb-6">
					<AlertCircle className="h-4 w-4" />
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}

			{/* Main Content */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				{/* Left Column - Input and Options */}
				<div className="space-y-6">
					{/* Text Input */}
					<TextInput
						value={input}
						onChange={updateInput}
						disabled={isGenerating}
					/>

					{/* Toolbar */}
					<Toolbar
						onGenerate={generateQRCode}
						onAutoAdjustSize={autoAdjustSize}
						onClearInput={clearInput}
						onClearAll={clearAll}
						isGenerating={isGenerating}
						hasInput={hasInput}
						hasResult={hasResult}
						disabled={isGenerating}
					/>

					{/* QR Code Options */}
					<QRCodeOptionsComponent
						options={options}
						onUpdateOption={updateOption}
						onAutoAdjustSize={autoAdjustSize}
						onResetOptions={resetOptions}
						inputLength={input.length}
						disabled={isGenerating}
					/>
				</div>

				{/* Right Column - QR Code Display */}
				<div className="space-y-6">
					{/* QR Code Display */}
					<QRCodeDisplay
						result={result}
						options={options}
						disabled={isGenerating}
					/>
				</div>
			</div>

			{/* Information Section */}
			<div className="mt-12">
				<Card>
					<CardHeader>
						<CardTitle className="flex items-center gap-2">
							<Info className="h-5 w-5" />
							About QR Codes
						</CardTitle>
					</CardHeader>
					<CardContent>
						<div className="grid grid-cols-1 gap-6 md:grid-cols-2">
							<div>
								<h3 className="mb-3 flex items-center gap-2 font-semibold">
									Error Correction Levels
								</h3>
								<div className="space-y-2 text-sm">
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Badge variant="outline">L</Badge>
											Low (7%)
										</span>
										<span className="text-muted-foreground">
											Fastest scanning
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Badge variant="outline">M</Badge>
											Medium (15%)
										</span>
										<span className="text-muted-foreground">Balanced</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Badge variant="outline">Q</Badge>
											Quartile (25%)
										</span>
										<span className="text-muted-foreground">
											Good reliability
										</span>
									</div>
									<div className="flex items-center justify-between">
										<span className="flex items-center gap-2">
											<Badge variant="outline">H</Badge>
											High (30%)
										</span>
										<span className="text-muted-foreground">
											Best for damaged codes
										</span>
									</div>
								</div>
							</div>

							<div>
								<h3 className="mb-3 font-semibold">Best Practices</h3>
								<ul className="space-y-2 text-muted-foreground text-sm">
									<li>• Use high contrast colors for better scanning</li>
									<li>• Include margin around the QR code</li>
									<li>• Test with different devices and apps</li>
									<li>• Choose appropriate size for your use case</li>
									<li>• Higher error correction for physical prints</li>
									<li>• Keep URLs short for better reliability</li>
								</ul>
							</div>
						</div>

						<Separator className="my-6" />

						<div className="text-center">
							<h3 className="mb-2 font-semibold">Supported Data Types</h3>
							<div className="flex flex-wrap justify-center gap-2">
								<Badge variant="secondary">URLs</Badge>
								<Badge variant="secondary">Plain Text</Badge>
								<Badge variant="secondary">Email Addresses</Badge>
								<Badge variant="secondary">Phone Numbers</Badge>
								<Badge variant="secondary">WiFi Credentials</Badge>
								<Badge variant="secondary">Contact Info</Badge>
								<Badge variant="secondary">SMS Messages</Badge>
								<Badge variant="secondary">Geographic Coordinates</Badge>
							</div>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
