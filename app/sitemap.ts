import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/content";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: `${SITE_URL}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${SITE_URL}/apply`, changeFrequency: "monthly", priority: 0.9 },
    { url: `${SITE_URL}/activities`, changeFrequency: "weekly", priority: 0.7 },
    { url: `${SITE_URL}/connect`, changeFrequency: "monthly", priority: 0.6 },
  ];
}
