import type { Metadata } from "next";
import { UrlEncoderDecoder } from '@/features/url-converter';

export const metadata: Metadata = {
  title: "URL Encoder/Decoder - Convert URLs Online | ConvertSit",
  description:
    "Encode and decode URLs with support for component and full URL encoding. Handle special characters, query parameters, and international characters safely.",
  keywords: [
    "URL encoder",
    "URL decoder",
    "percent encoding",
    "URI encoding",
    "URL escape",
    "URL unescape",
    "query parameter encoding",
    "web development tools",
  ],
  openGraph: {
    title: "URL Encoder/Decoder - Convert URLs Online",
    description:
      "Encode and decode URLs with support for component and full URL encoding. Handle special characters safely.",
    type: "website",
  },
};

export default function UrlConverterPage() {
  return <UrlEncoderDecoder />;
}