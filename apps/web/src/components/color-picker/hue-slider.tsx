"use client";

import { useCallback } from "react";

import { Slider } from "@/components/ui/slider";

interface HueSliderProps {
	hue: number;
	onChange: (hue: number) => void;
	disabled?: boolean;
}

export function HueSlider({ hue, onChange, disabled }: HueSliderProps) {
	const handleHueChange = useCallback(
		(values: number[]) => {
			if (values.length > 0 && typeof values[0] === "number") {
				const newHue = Math.max(0, Math.min(360, values[0]));
				onChange(newHue);
			}
		},
		[onChange],
	);

	return (
		<div className="relative">
			<div
				className="absolute inset-0 h-6 rounded-md border shadow-sm"
				style={{
					background:
						"linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
				}}
			/>
			<Slider
				value={[hue]}
				onValueChange={handleHueChange}
				max={360}
				step={1}
				disabled={disabled}
				className="relative z-10 w-full [&>*]:bg-transparent"
			/>
		</div>
	);
}