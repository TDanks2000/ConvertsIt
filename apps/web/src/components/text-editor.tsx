import { AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

interface ValidationError {
	message: string;
	line?: number;
	column?: number;
}

interface TextEditorProps {
	title: string;
	value: string;
	onChange?: (value: string) => void;
	placeholder?: string;
	readOnly?: boolean;
	error?: ValidationError | null;
	label?: string;
	minHeight?: string;
	className?: string;
}

export function TextEditor({
	title,
	value,
	onChange,
	placeholder = "Enter text here...",
	readOnly = false,
	error = null,
	label,
	minHeight = "min-h-[400px]",
	className = "",
}: TextEditorProps) {
	return (
		<Card className={`flex-1 ${className}`}>
			<CardHeader>
				<CardTitle>{title}</CardTitle>
			</CardHeader>
			<CardContent className="space-y-4">
				{label && (
					<div className="space-y-2">
						<Label
							htmlFor={`text-editor-${title.toLowerCase().replace(/\s+/g, "-")}`}
						>
							{label}
						</Label>
					</div>
				)}
				<Textarea
					id={`text-editor-${title.toLowerCase().replace(/\s+/g, "-")}`}
					value={value}
					onChange={onChange ? (e) => onChange(e.target.value) : undefined}
					placeholder={placeholder}
					readOnly={readOnly}
					className={`${minHeight} resize-none ${readOnly ? "bg-muted/50" : ""} font-mono text-sm`}
				/>
				{error && (
					<Alert variant="destructive">
						<AlertCircle className="h-4 w-4" />
						<AlertDescription>
							{error.message}
							{error.line && error.column && (
								<span className="mt-1 block text-xs">
									Line {error.line}, Column {error.column}
								</span>
							)}
						</AlertDescription>
					</Alert>
				)}
			</CardContent>
		</Card>
	);
}
