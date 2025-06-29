import { FileText } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";

interface TextInputProps {
	value: string;
	onChange: (value: string) => void;
	placeholder?: string;
}

export function TextInput({ value, onChange, placeholder }: TextInputProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<FileText className="h-5 w-5" />
					Text Input
				</CardTitle>
			</CardHeader>
			<CardContent>
				<Textarea
					value={value}
					onChange={(e) => onChange(e.target.value)}
					placeholder={placeholder || "Enter your text here to analyze..."}
					className="max-h-[500px] min-h-[500px] resize-none border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
				/>
			</CardContent>
		</Card>
	);
}
