// Runs before `vite dev` and `vite build` (predev/prebuild hooks); writes public/sitemap.xml.
import { writeFileSync, readFileSync } from "fs";
import { resolve } from "path";

const BASE_URL = "https://suchandra.vercel.app";

interface SitemapEntry {
  path: string;
  changefreq?: "always" | "hourly" | "daily" | "weekly" | "monthly" | "yearly" | "never";
  priority?: string;
}

// Extract IDs via regex so this script doesn't need to resolve binary asset imports.
function extractIds(filePath: string): string[] {
  const src = readFileSync(resolve(filePath), "utf8");
  const ids = new Set<string>();
  for (const m of src.matchAll(/^\s*id:\s*["'`]([^"'`]+)["'`]/gm)) {
    ids.add(m[1]);
  }
  return [...ids];
}

const projectIds = extractIds("src/data/projects.ts");
const certificateIds = extractIds("src/data/certificates.ts");

const staticEntries: SitemapEntry[] = [
  { path: "/", changefreq: "weekly", priority: "1.0" },
  { path: "/about", changefreq: "monthly", priority: "0.8" },
  { path: "/projects", changefreq: "weekly", priority: "0.9" },
  { path: "/skills", changefreq: "monthly", priority: "0.7" },
  { path: "/experience", changefreq: "monthly", priority: "0.7" },
  { path: "/certificates", changefreq: "monthly", priority: "0.7" },
  { path: "/contact", changefreq: "yearly", priority: "0.6" },
];

const dynamicEntries: SitemapEntry[] = [
  ...projectIds.map((id) => ({ path: `/projects/${id}`, changefreq: "monthly" as const, priority: "0.6" })),
  ...certificateIds.map((id) => ({ path: `/certificates/${id}`, changefreq: "yearly" as const, priority: "0.5" })),
];

const entries = [...staticEntries, ...dynamicEntries];

function generateSitemap(items: SitemapEntry[]) {
  const urls = items.map((e) =>
    [
      `  <url>`,
      `    <loc>${BASE_URL}${e.path}</loc>`,
      e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
      e.priority ? `    <priority>${e.priority}</priority>` : null,
      `  </url>`,
    ]
      .filter(Boolean)
      .join("\n")
  );
  return [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
    ...urls,
    `</urlset>`,
  ].join("\n");
}

writeFileSync(resolve("public/sitemap.xml"), generateSitemap(entries));
console.log(`sitemap.xml written (${entries.length} entries)`);
