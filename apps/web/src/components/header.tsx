"use client";

import { ModeToggle } from "./mode-toggle";
import { Navigation } from "./navigation";

export default function Header() {
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<Navigation />
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
