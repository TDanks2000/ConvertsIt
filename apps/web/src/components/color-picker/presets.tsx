"use client";

import { cn } from "@/lib/utils";

interface ColorPresetsProps {
	presets: string[];
	currentColor: string;
	onSelect: (color: string) => void;
	disabled?: boolean;
}

export function ColorPresets({
	presets,
	currentColor,
	onSelect,
	disabled,
}: ColorPresetsProps) {
	return (
		<div className="grid grid-cols-9 gap-2">
			{presets.map((color) => (
				<button
					key={color}
					type="button"
					onClick={() => onSelect(color)}
					disabled={disabled}
					className={cn(
						"h-8 w-8 rounded-md border-2 transition-all hover:scale-110 focus:scale-110 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
						currentColor.toLowerCase() === color.toLowerCase() &&
							"ring-2 ring-primary ring-offset-2",
					)}
					style={{ backgroundColor: color }}
					title={color}
				/>
			))}
		</div>
	);
}
