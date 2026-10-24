import type { MetadataRoute } from "next";
import { env } from "@/config/env";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/admin/", "/dashboard/", "/api/", "/auth/"] }],
    sitemap: new URL("/sitemap.xml", env.siteUrl).toString(),
  };
}
