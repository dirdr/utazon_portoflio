import fs from "fs";
import path from "path";
import { SitemapStream, streamToPromise } from "sitemap";

// Docker-specific sitemap generation using npm sitemap package
// Reads VITE_SITE_URL from environment variable
const getDomainFromEnv = () => {
  const siteUrl = process.env.VITE_SITE_URL;
  
  if (!siteUrl) {
    console.error("❌ VITE_SITE_URL environment variable is required");
    process.exit(1);
  }
  
  return siteUrl;
};

const DOMAIN = getDomainFromEnv();
console.log(`🌍 Generating sitemap for domain: ${DOMAIN}`);

// Output to /app for volume mounting at root (sitemap.xml accessible at /)
const OUTPUT_DIR = "/app";
const OUTPUT_PATH = path.join(OUTPUT_DIR, "sitemap.xml");

const staticRoutes = [
  {
    url: "/",
    priority: 1.0,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/about",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/projects",
    priority: 0.9,
    changefreq: "weekly", 
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/contact",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    url: "/legal",
    priority: 0.3,
    changefreq: "yearly",
    lastmod: new Date().toISOString().split("T")[0],
  },
];

// Dynamic import of project data
const getProjectIds = async () => {
  try {
    // Import the project data
    const projectsModule = await import("../src/data/projects/index.js");
    return projectsModule.allProjectsSortedByPriority.map((project) => project.id);
  } catch (error) {
    // Fallback to manual list if import fails
    console.warn("Could not import project data, using fallback list");
    return [
      "aurum-nova",
      "dune",
      "eco-cleaner", 
      "family-tech-drive",
      "paris-music-2024",
      "fooh",
      "karmin-corp-lec-reveal",
      "limova-movali",
      "spiderman-timefreeze",
      "lyner",
      "mr-help",
      "dals",
      "yassencore",
      "pixel-break",
      "trybz",
    ];
  }
};

const generateSitemap = async () => {
  const projectIds = await getProjectIds();
  
  // Create project routes
  const projectRoutes = projectIds.map((id) => ({
    url: `/projects/${id}`,
    priority: 0.6,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
    // Add image references for better SEO
    img: [
      {
        url: `${DOMAIN}/images/projects/${id}/cover.webp`,
        caption: `${id} project cover`,
      },
    ],
  }));

  const allRoutes = [...staticRoutes, ...projectRoutes];

  // Create sitemap stream
  const sitemap = new SitemapStream({ hostname: DOMAIN });

  // Add all routes to sitemap
  allRoutes.forEach((route) => {
    sitemap.write(route);
  });

  sitemap.end();

  // Convert stream to string
  const sitemapXML = await streamToPromise(sitemap);

  // Ensure output directory exists
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }

  // Write sitemap to file
  fs.writeFileSync(OUTPUT_PATH, sitemapXML.toString(), "utf-8");
  
  console.log(`✅ Sitemap generated at ${OUTPUT_PATH}`);
  console.log(`📊 Generated ${allRoutes.length} URLs`);
  console.log(`🌐 Sitemap will be accessible at: ${DOMAIN}/sitemap.xml`);
};

// Main execution
(async () => {
  try {
    await generateSitemap();
    console.log("🎉 Sitemap generation completed successfully");
  } catch (error) {
    console.error("💥 Sitemap generation failed:", error);
    process.exit(1);
  }
})();