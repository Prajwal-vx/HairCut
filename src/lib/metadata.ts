import type { Metadata } from "next";

/** Build consistent route metadata for pages that render through client components. */
export function pageMetadata(title: string, description: string): Metadata {
  return {
    title,
    description,
    openGraph: { title, description, type: "website", locale: "en_US" },
  };
}
