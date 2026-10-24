import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function sitemap(): MetadataRoute.Sitemap {
  const pages = ["", "/about", "/services", "/stylists", "/gallery", "/contact", "/consultation", "/privacy", "/terms", "/data-declaration"];
  return pages.map((path) => ({ url: new URL(path, env.siteUrl).toString(), changeFrequency: "weekly", priority: path ? 0.7 : 1 }));
}
