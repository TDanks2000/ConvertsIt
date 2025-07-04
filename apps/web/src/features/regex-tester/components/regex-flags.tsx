"use client";

import { Settings } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import type { RegexFlags } from "../types";

interface RegexFlagsProps {
	flags: RegexFlags;
	onFlagChange: (flag: keyof RegexFlags, value: boolean) => void;
}

const flagDescriptions = {
	global: "Find all matches (g)",
	ignoreCase: "Case insensitive (i)",
	multiline: "Multiline mode (m)",
	dotAll: "Dot matches newlines (s)",
	unicode: "Unicode mode (u)",
	sticky: "Sticky mode (y)",
};

export function RegexFlagsComponent({ flags, onFlagChange }: RegexFlagsProps) {
	return (
		<Card>
			<CardHeader>
				<CardTitle className="flex items-center gap-2">
					<Settings className="h-4 w-4" />
					Flags
				</CardTitle>
			</CardHeader>
			<CardContent>
				<div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
					{Object.entries(flags).map(([flag, enabled]) => (
						<div key={flag} className="flex items-center space-x-2">
							<Checkbox
								id={flag}
								checked={enabled}
								onCheckedChange={(checked) =>
									onFlagChange(flag as keyof RegexFlags, !!checked)
								}
							/>
							<Label
								htmlFor={flag}
								className="font-medium text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
							>
								{flagDescriptions[flag as keyof RegexFlags]}
							</Label>
						</div>
					))}
				</div>
			</CardContent>
		</Card>
	);
}
