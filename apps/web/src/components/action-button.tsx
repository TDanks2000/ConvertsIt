import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ActionButtonProps {
	icon: LucideIcon;
	label: string;
	onClick: () => void;
	disabled?: boolean;
	variant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link";
	size?: "default" | "sm" | "lg" | "icon";
	hideLabel?: boolean;
	className?: string;
}

export function ActionButton({
	icon: Icon,
	label,
	onClick,
	disabled = false,
	variant = "outline",
	size = "sm",
	hideLabel = false,
	className = "",
}: ActionButtonProps) {
	return (
		<Button
			variant={variant}
			size={size}
			onClick={onClick}
			disabled={disabled}
			className={`gap-2 ${className}`}
		>
			<Icon className="h-4 w-4" />
			{!hideLabel && (
				<span className={hideLabel ? "sr-only" : ""}>{label}</span>
			)}
		</Button>
	);
}