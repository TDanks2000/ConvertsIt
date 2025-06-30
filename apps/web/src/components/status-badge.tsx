import { Badge } from "@/components/ui/badge";

interface StatusBadgeProps {
	isValid: boolean;
	validText?: string;
	invalidText?: string;
	variant?: {
		valid?: "default" | "destructive" | "outline" | "secondary";
		invalid?: "default" | "destructive" | "outline" | "secondary";
	};
}

export function StatusBadge({
	isValid,
	validText = "Valid",
	invalidText = "Invalid",
	variant = { valid: "default", invalid: "destructive" },
}: StatusBadgeProps) {
	return (
		<Badge variant={isValid ? variant.valid : variant.invalid}>
			{isValid ? validText : invalidText}
		</Badge>
	);
}