"use client";

import Image from "next/image";
import { ModeToggle } from "./mode-toggle";
import { Navigation } from "./navigation";

export default function Header() {
	return (
		<div>
			<div className="flex flex-row items-center justify-between px-4 py-3">
				<div className="flex items-center gap-3">
					<Image
						src="/icon-64x64.png"
						alt="FlowTools Logo"
						width={32}
						height={32}
						className="rounded-md"
					/>
					<Navigation />
				</div>
				<div className="flex items-center gap-2">
					<ModeToggle />
				</div>
			</div>
			<hr />
		</div>
	);
}
