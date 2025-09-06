import fs from "fs";
import path from "path";

const DOMAIN = "https://utazon.fr";
const OUTPUT_PATH = path.join(process.cwd(), "dist", "sitemap.xml");
const PUBLIC_OUTPUT_PATH = path.join(process.cwd(), "public", "sitemap.xml");

const staticRoutes = [
  {
    path: "/",
    priority: 1.0,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/about",
    priority: 0.8,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/projects",
    priority: 0.9,
    changefreq: "weekly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/contact",
    priority: 0.7,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  },
  {
    path: "/legal",
    priority: 0.3,
    changefreq: "yearly",
    lastmod: new Date().toISOString().split("T")[0],
  },
];

// Project IDs - these should match your project data
const projectIds = [
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

const projectRoutes = projectIds.map((id) => ({
  path: `/projects/${id}`,
  priority: 0.6,
  changefreq: "monthly",
  lastmod: new Date().toISOString().split("T")[0],
}));

const allRoutes = [...staticRoutes, ...projectRoutes];

const generateSitemap = () => {
  const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`;

  const xmlFooter = `</urlset>`;

  const urls = allRoutes
    .map((route) => {
      return `  <url>
    <loc>${DOMAIN}${route.path}</loc>
    <lastmod>${route.lastmod}</lastmod>
    <changefreq>${route.changefreq}</changefreq>
    <priority>${route.priority}</priority>
  </url>`;
    })
    .join("\n");

  const sitemap = `${xmlHeader}\n${urls}\n${xmlFooter}`;

  // Ensure dist directory exists
  const distDir = path.dirname(OUTPUT_PATH);
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, sitemap, "utf-8");
  fs.writeFileSync(PUBLIC_OUTPUT_PATH, sitemap, "utf-8");
  console.log(`✅ Sitemap generated at ${OUTPUT_PATH} and ${PUBLIC_OUTPUT_PATH}`);
  console.log(`📊 Generated ${allRoutes.length} URLs`);
};

const generateImageSitemap = () => {
  const imageRoutes: Array<{ url: string; images: string[] }> = [];

  projectIds.forEach((projectId) => {
    const projectImages = [
      `${DOMAIN}/images/projects/${projectId}/cover.webp`,
      `${DOMAIN}/images/projects/${projectId}/background.webp`,
    ];

    for (let i = 1; i <= 5; i++) {
      projectImages.push(`${DOMAIN}/images/projects/${projectId}/${i}.webp`);
    }

    imageRoutes.push({
      url: `${DOMAIN}/projects/${projectId}`,
      images: projectImages,
    });
  });

  const imageXmlHeader = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">`;

  const imageXmlFooter = `</urlset>`;

  const imageUrls = imageRoutes
    .map((route) => {
      const images = route.images
        .map(
          (img) =>
            `    <image:image>
      <image:loc>${img}</image:loc>
    </image:image>`,
        )
        .join("\n");

      return `  <url>
    <loc>${route.url}</loc>
${images}
  </url>`;
    })
    .join("\n");

  const imageSitemap = `${imageXmlHeader}\n${imageUrls}\n${imageXmlFooter}`;
  const imageOutputPath = path.join(
    process.cwd(),
    "dist",
    "sitemap-images.xml",
  );
  const publicImageOutputPath = path.join(
    process.cwd(),
    "public", 
    "sitemap-images.xml",
  );

  fs.writeFileSync(imageOutputPath, imageSitemap, "utf-8");
  fs.writeFileSync(publicImageOutputPath, imageSitemap, "utf-8");
  console.log(`✅ Image sitemap generated at ${imageOutputPath} and ${publicImageOutputPath}`);
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateSitemap();
  generateImageSitemap();
}

export { generateSitemap, generateImageSitemap };

