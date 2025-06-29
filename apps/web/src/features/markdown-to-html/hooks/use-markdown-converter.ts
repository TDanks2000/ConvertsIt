"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { MarkdownToHtmlConfig } from "../types";
import {
	getDefaultMarkdown,
	processMarkdownToHtml,
} from "../utils/markdown-processor";

export function useMarkdownConverter(config: MarkdownToHtmlConfig = {}) {
	const [markdown, setMarkdown] = useState(
		() => config.defaultMarkdown || getDefaultMarkdown(),
	);
	const [html, setHtml] = useState("");
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Use ref to track the latest conversion request
	const conversionIdRef = useRef(0);
	const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

	const convertMarkdown = useCallback(
		async (markdownText: string, immediate = false) => {
			// Clear existing debounce timeout
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
				debounceTimeoutRef.current = null;
			}

			const performConversion = async () => {
				const currentId = ++conversionIdRef.current;

				setIsLoading(true);
				setError(null);

				try {
					const convertedHtml = await processMarkdownToHtml(markdownText, {
						enableGfm: config.enableGfm,
						enableHighlight: config.enableHighlight,
						enableRawHtml: config.enableRawHtml,
					});

					// Only update HTML if this is still the latest conversion
					if (currentId === conversionIdRef.current) {
						setHtml(convertedHtml);
					}
				} catch (err) {
					// Only update error if this is still the latest conversion
					if (currentId === conversionIdRef.current) {
						setError(
							err instanceof Error ? err.message : "Failed to convert markdown",
						);
					}
				} finally {
					// Only update processing state if this is still the latest conversion
					if (currentId === conversionIdRef.current) {
						setIsLoading(false);
					}
				}
			};

			if (immediate) {
				await performConversion();
			} else {
				// Debounce for 300ms to avoid excessive processing
				debounceTimeoutRef.current = setTimeout(performConversion, 300);
			}
		},
		[config.enableGfm, config.enableHighlight, config.enableRawHtml],
	);

	const handleMarkdownChange = useCallback(
		(newMarkdown: string) => {
			console.log(newMarkdown);
			// Update markdown state immediately to prevent cursor jumping
			setMarkdown(newMarkdown);
			// For empty strings, convert immediately to ensure preview updates
			if (newMarkdown.trim() === "") {
				convertMarkdown(newMarkdown, true);
			} else {
				// Then trigger debounced conversion for non-empty content
				convertMarkdown(newMarkdown, false);
			}
		},
		[convertMarkdown],
	);

	const resetToDefault = useCallback(() => {
		const defaultMarkdown = getDefaultMarkdown();
		setMarkdown(defaultMarkdown);
		convertMarkdown(defaultMarkdown, true); // Immediate conversion for reset
	}, [convertMarkdown]);

	// Initial conversion - only run once
	useEffect(() => {
		convertMarkdown(markdown, true);
		// Cleanup function to clear timeouts
		return () => {
			if (debounceTimeoutRef.current) {
				clearTimeout(debounceTimeoutRef.current);
			}
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [convertMarkdown, markdown]); // Only run on mount

	return {
		markdown,
		setMarkdown: handleMarkdownChange,
		html,
		isLoading,
		error,
		resetToDefault,
	};
}
