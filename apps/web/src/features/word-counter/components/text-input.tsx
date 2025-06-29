import { FileText } from "lucide-react";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";

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
				<CardDescription>
					Enter or paste your text below to get instant statistics
				</CardDescription>
			</CardHeader>
			<CardContent>
				<div className="space-y-2">
					<Label htmlFor="text-input">Your Text</Label>
					<textarea
						id="text-input"
						placeholder={
							placeholder || "Start typing or paste your text here..."
						}
						value={value}
						onChange={(e) => onChange(e.target.value)}
						className="min-h-[300px] w-full resize-y rounded-md border border-input bg-transparent px-3 py-2 text-base shadow-xs placeholder:text-muted-foreground focus-visible:border-ring focus-visible:outline-none focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:cursor-not-allowed disabled:opacity-50"
					/>
				</div>
			</CardContent>
		</Card>
	);
}
