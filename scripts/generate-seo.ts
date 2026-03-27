import { writeFileSync } from "fs";
import { resolve } from "path";
import { SitemapStream, streamToPromise } from "sitemap";
import { allProjectsSortedByPriority } from "../src/data/projects/index.js";
import { ROUTES } from "../src/constants/routes.js";

const SITE_URL = process.env.VITE_SITE_URL;

if (!SITE_URL) {
  console.error("❌ ERROR: VITE_SITE_URL environment variable is required");
  process.exit(1);
}

/**
 * Generate sitemap.xml
 */
async function generateSitemap(): Promise<void> {
  const staticRoutes = [
    { url: ROUTES.HOME, changefreq: "weekly", priority: 1.0 },
    { url: ROUTES.ABOUT, changefreq: "monthly", priority: 0.8 },
    { url: ROUTES.PROJECTS, changefreq: "weekly", priority: 0.9 },
    { url: ROUTES.LEGAL, changefreq: "yearly", priority: 0.3 },
  ];

  const projectRoutes = allProjectsSortedByPriority.map((project) => ({
    url: `/projects/${project.id}`,
    changefreq: "monthly",
    priority: 0.7,
  }));

  const routes = [...staticRoutes, ...projectRoutes];
  const sitemapStream = new SitemapStream({ hostname: SITE_URL });

  routes.forEach((route) => {
    sitemapStream.write({
      url: route.url,
      changefreq: route.changefreq,
      priority: route.priority,
    });
  });

  sitemapStream.end();

  const sitemapXml = await streamToPromise(sitemapStream);
  const outputPath = resolve("./dist/sitemap.xml");

  writeFileSync(outputPath, sitemapXml.toString());
  console.log("✅ Generated sitemap.xml");
}

/**
 * Generate robots.txt
 */
function generateRobots(): void {
  const robotsTxt = `User-agent: *
Allow: /
Sitemap: ${SITE_URL}/sitemap.xml`;

  const outputPath = resolve("./dist/robots.txt");
  writeFileSync(outputPath, robotsTxt);
  console.log("✅ Generated robots.txt");
}

/**
 * Main entry point - generate all SEO artifacts
 */
async function main() {
  console.log(`🚀 Generating SEO artifacts for ${SITE_URL}\n`);

  try {
    await generateSitemap();
    generateRobots();
    console.log("\n✅ All SEO artifacts generated successfully");
  } catch (error) {
    console.error("❌ Error generating SEO artifacts:", error);
    process.exit(1);
  }
}

main();
