import type { Metadata } from "next";

/** Build consistent route metadata for pages that render through client components. */
export function pageMetadata(title: string, description: string, path: string): Metadata {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: { title, description, type: "website", locale: "en_US", images: [{ url: "/og-image.webp", width: 1200, height: 630, alt: "Uptown Hair Unisex Salon" }] },
  };
}
