"use client";

import { Palette, RotateCcw } from "lucide-react";
import {
	type ChangeEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import {
	type HSVColor,
	hexToHsv,
	hsvToHex,
	isValidHex,
	normalizeHex,
} from "@/lib/color-utils";
import { cn } from "@/lib/utils";
import { HexInput } from "./hex-input";
import { HueSlider } from "./hue-slider";
import { ColorPresets } from "./presets";
import { SaturationPicker } from "./saturation-picker";

export interface ColorPickerProps {
	value?: string;
	onChange?: (color: string) => void;
	className?: string;
	disabled?: boolean;
	disablePresets?: boolean;
	customPresets?: string[];
	hideHueSlider?: boolean;
	hideSaturationPicker?: boolean;
	hideHexInput?: boolean;
	hideCopyButton?: boolean;
	hideResetButton?: boolean;
	hexInputPlaceholder?: string;
}

const PRESET_COLORS = [
	"#000000",
	"#FFFFFF",
	"#FF0000",
	"#00FF00",
	"#0000FF",
	"#FFFF00",
	"#FF00FF",
	"#00FFFF",
	"#FFA500",
	"#800080",
	"#FFC0CB",
	"#A52A2A",
	"#808080",
	"#008000",
	"#000080",
	"#800000",
	"#808000",
	"#008080",
];

export function ColorPicker({
	value = "#1634D3",
	onChange,
	className,
	disabled = false,
	disablePresets = false,
	customPresets,
	hideHueSlider = false,
	hideSaturationPicker = false,
	hideHexInput = false,
	hideCopyButton = false,
	hideResetButton = false,
	hexInputPlaceholder = "#000000",
}: ColorPickerProps) {
	const [isOpen, setIsOpen] = useState(false);
	const [hsv, setHsv] = useState<HSVColor>(() => {
		const parsed = hexToHsv(value);
		return parsed || { h: 220, s: 85, v: 83 };
	});
	const [inputValue, setInputValue] = useState(value);

	const isInternalUpdate = useRef(false);
	const onChangeRef = useRef(onChange);

	// Keep the onChange ref up to date
	useEffect(() => {
		onChangeRef.current = onChange;
	});

	const effectivePresets = useMemo(() => {
		return customPresets && customPresets.length > 0
			? customPresets
			: PRESET_COLORS;
	}, [customPresets]);

	useEffect(() => {
		if (value && isValidHex(value)) {
			const normalized = normalizeHex(value);
			const parsed = hexToHsv(normalized);
			if (parsed) {
				isInternalUpdate.current = true;
				setHsv(parsed);
				setInputValue(normalized);
				isInternalUpdate.current = false;
			}
		}
	}, [value]);

	useEffect(() => {
		if (!isInternalUpdate.current) {
			const hexValue = hsvToHex(hsv);
			setInputValue(hexValue);
			onChangeRef.current?.(hexValue);
		}
	}, [hsv]);

	const handleHsvChange = useCallback((newHsv: Partial<HSVColor>) => {
		setHsv((prev) => ({ ...prev, ...newHsv }));
	}, []);

	const handleHueChange = useCallback((newHue: number) => {
		setHsv((prev) => ({ ...prev, h: newHue }));
	}, []);

	const handleInputChange = useCallback(
		(event: ChangeEvent<HTMLInputElement>) => {
			const newValue = event.target.value;
			setInputValue(newValue);

			if (isValidHex(newValue)) {
				const normalized = normalizeHex(newValue);
				const parsed = hexToHsv(normalized);
				if (parsed) {
					setHsv(parsed);
					onChange?.(normalized);
				}
			}
		},
		[onChange],
	);

	const handlePresetColorSelect = useCallback(
		(color: string) => {
			const parsed = hexToHsv(color);
			if (parsed) {
				setHsv(parsed);
				setInputValue(color);
				onChange?.(color);
			}
		},
		[onChange],
	);

	const currentColor = useMemo(() => hsvToHex(hsv), [hsv]);

	const handleResetColor = useCallback(() => {
		const defaultColor = "#1634D3";
		const parsed = hexToHsv(defaultColor);
		if (parsed) {
			setHsv(parsed);
			setInputValue(defaultColor);
			onChange?.(defaultColor);
		}
	}, [onChange]);

	return (
		<Popover open={isOpen} onOpenChange={setIsOpen}>
			<PopoverTrigger asChild>
				<Button
					variant="outline"
					className={cn(
						"group relative h-10 w-16 overflow-hidden border-2 p-0 transition-all hover:scale-105",
						disabled && "cursor-not-allowed opacity-50 hover:scale-100",
						className,
					)}
					disabled={disabled}
				>
					<div
						className="absolute inset-0 transition-all group-hover:scale-110"
						style={{ backgroundColor: currentColor }}
					/>
					<div className="absolute inset-0 bg-black/0 transition-all group-hover:bg-black/10" />
					<Palette className="relative z-10 h-4 w-4 text-white/80 opacity-0 transition-all group-hover:opacity-100" />
				</Button>
			</PopoverTrigger>
			<PopoverContent className="w-80 p-0" align="start" sideOffset={8}>
				<div className="space-y-0">
					<div className="flex items-center justify-between border-b p-4">
						<div className="flex items-center gap-2">
							<Palette className="h-4 w-4 text-muted-foreground" />
							<Label className="font-medium text-sm">Color Picker</Label>
						</div>
						{!hideResetButton && (
							<Button
								variant="ghost"
								size="sm"
								onClick={handleResetColor}
								disabled={disabled}
								className="h-8 w-8 p-0"
							>
								<RotateCcw className="h-3 w-3" />
							</Button>
						)}
					</div>

					<div className="space-y-3 p-4">
						{!hideHexInput && (
							<HexInput
								value={inputValue}
								onChange={handleInputChange}
								currentColor={currentColor}
								hideCopyButton={hideCopyButton}
								disabled={disabled}
								placeholder={hexInputPlaceholder}
							/>
						)}
					</div>

					{(!hideSaturationPicker || !hideHueSlider) && <Separator />}

					{(!hideSaturationPicker || !hideHueSlider) && (
						<div className="space-y-4 p-4">
							{!hideSaturationPicker && (
								<div className="space-y-2">
									<Label className="text-muted-foreground text-xs">
										Saturation & Brightness
									</Label>
									<SaturationPicker
										hsv={hsv}
										onChange={handleHsvChange}
										disabled={disabled}
									/>
								</div>
							)}

							{!hideHueSlider && (
								<div className="space-y-2">
									<Label className="text-muted-foreground text-xs">Hue</Label>
									<HueSlider
										hue={hsv.h}
										onChange={handleHueChange}
										disabled={disabled}
									/>
								</div>
							)}
						</div>
					)}

					{!disablePresets && (
						<>
							<Separator />
							<div className="space-y-3 p-4">
								<Label className="text-muted-foreground text-xs">
									Quick Colors
								</Label>
								<ColorPresets
									presets={effectivePresets}
									currentColor={currentColor}
									onSelect={handlePresetColorSelect}
									disabled={disabled}
								/>
							</div>
						</>
					)}
				</div>
			</PopoverContent>
		</Popover>
	);
}

export default ColorPicker;
