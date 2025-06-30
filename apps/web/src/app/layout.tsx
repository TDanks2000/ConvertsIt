import "../index.css";

import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Header from "@/components/header";
import Providers from "@/components/providers";
import "highlight.js/styles/github.css";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

export const metadata: Metadata = {
	title: {
		default: "Convertsit - A collection of free tools for developers",
		template: "%s | Convertsit",
	},
	description: "A collection of free tools for developers",
	keywords: [
		"Convertsit",
		"Developer Tools",
		"Free Tools",
		"Web Development",
		"Productivity",
	],
	creator: "Convertsit",
	openGraph: {
		type: "website",
		locale: "en_US",
		title: {
			default: "Convertsit - A collection of free tools for developers",
			template: "%s | Convertsit",
		},
		description: "A collection of free tools for developers",
		siteName: "Convertsit",
	},
	twitter: {
		card: "summary_large_image",
		title: {
			default: "Convertsit - A collection of free tools for developers",
			template: "%s | Convertsit",
		},
		description: "A collection of free tools for developers",
	},
	icons: {
		icon: "/favicon.ico",
		shortcut: "/icon-16x16.png",
		apple: "/icon-180x180.png",
	},
	manifest: "/site.webmanifest",
};

export default function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang="en" suppressHydrationWarning>
			<body
				className={`${geistSans.variable} ${geistMono.variable} antialiased`}
			>
				<Providers>
					<div className="grid h-svh grid-rows-[auto_1fr]">
						<Header />
						{children}
					</div>
				</Providers>
			</body>
		</html>
	);
}
