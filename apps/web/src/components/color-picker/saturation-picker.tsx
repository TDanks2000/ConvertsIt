"use client";

import {
	type MouseEvent,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react";

import type { HSVColor } from "@/lib/color-utils";

interface SaturationPickerProps {
	hsv: HSVColor;
	onChange: (color: Partial<HSVColor>) => void;
	disabled?: boolean;
}

export function SaturationPicker({
	hsv,
	onChange,
	disabled,
}: SaturationPickerProps) {
	const saturationRef = useRef<HTMLDivElement>(null);
	const saturationRectRef = useRef<DOMRect | null>(null);
	const [isDragging, setIsDragging] = useState(false);
	const isDraggingRef = useRef(false);

	const updateHsvFromCoordinates = useCallback(
		(event: MouseEvent | globalThis.MouseEvent, rect: DOMRect) => {
			const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
			const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));

			const s = Math.round((x / rect.width) * 100);
			const v = Math.round(100 - (y / rect.height) * 100);

			onChange({ s, v });
		},
		[onChange],
	);

	const handleMouseDown = useCallback(
		(event: MouseEvent<HTMLDivElement>) => {
			if (!saturationRef.current || disabled) return;
			isDraggingRef.current = true;
			setIsDragging(true);
			saturationRectRef.current = saturationRef.current.getBoundingClientRect();
			updateHsvFromCoordinates(event, saturationRectRef.current);
		},
		[updateHsvFromCoordinates, disabled],
	);

	const handleMouseMove = useCallback(
		(event: globalThis.MouseEvent) => {
			if (!isDraggingRef.current || !saturationRectRef.current) return;
			updateHsvFromCoordinates(event, saturationRectRef.current);
		},
		[updateHsvFromCoordinates],
	);

	const handleMouseUp = useCallback(() => {
		isDraggingRef.current = false;
		setIsDragging(false);
		saturationRectRef.current = null;
	}, []);

	useEffect(() => {
		if (isDragging) {
			document.addEventListener("mousemove", handleMouseMove);
			document.addEventListener("mouseup", handleMouseUp);

			return () => {
				document.removeEventListener("mousemove", handleMouseMove);
				document.removeEventListener("mouseup", handleMouseUp);
			};
		}
	}, [isDragging, handleMouseMove, handleMouseUp]);

	const saturationX = useMemo(() => (hsv.s / 100) * 100, [hsv.s]);
	const saturationY = useMemo(() => (1 - hsv.v / 100) * 100, [hsv.v]);

	return (
		<div className="relative">
			<div
				ref={saturationRef}
				className="relative h-40 w-full cursor-crosshair overflow-hidden rounded-lg border shadow-sm"
				style={{
					background: `linear-gradient(to bottom, transparent, black), linear-gradient(to right, white, hsl(${hsv.h}, 100%, 50%))`,
				}}
				onMouseDown={handleMouseDown}
				role="slider"
				aria-label="Color saturation and brightness"
				aria-valuemin={0}
				aria-valuemax={100}
				aria-valuenow={hsv.s}
				tabIndex={disabled ? -1 : 0}
				onKeyDown={(e) => {
					const step = e.shiftKey ? 10 : 1;
					let newS = hsv.s;
					let newV = hsv.v;

					switch (e.key) {
						case "ArrowRight":
							e.preventDefault();
							newS = Math.min(100, hsv.s + step);
							break;
						case "ArrowLeft":
							e.preventDefault();
							newS = Math.max(0, hsv.s - step);
							break;
						case "ArrowUp":
							e.preventDefault();
							newV = Math.min(100, hsv.v + step);
							break;
						case "ArrowDown":
							e.preventDefault();
							newV = Math.max(0, hsv.v - step);
							break;
						default:
							return;
					}

					if (newS !== hsv.s || newV !== hsv.v) {
						onChange({ s: newS, v: newV });
					}
				}}
			>
				<div
					className="-translate-x-1/2 -translate-y-1/2 pointer-events-none absolute h-4 w-4 transform rounded-full border-2 border-white shadow-lg ring-1 ring-black/20"
					style={{
						left: `${saturationX}%`,
						top: `${saturationY}%`,
					}}
				/>
			</div>
		</div>
	);
}
