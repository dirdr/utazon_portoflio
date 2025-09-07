import fs from "fs";
import path from "path";

// Environment-aware domain detection
const getDomainFromEnv = (): string => {
  // Check for explicit environment variable first
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL;
  }
  
  // Check for Vercel deployment URL
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // Check for Netlify deployment URL
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL;
  }
  
  // Check for other common deployment platforms
  if (process.env.URL) {
    return process.env.URL;
  }
  
  // Check NODE_ENV for different defaults
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5173'; // Vite dev server default
  }
  
  if (process.env.NODE_ENV === 'preview') {
    return 'http://localhost:4173'; // Vite preview default
  }
  
  // Production fallback
  return 'https://utazon.fr';
};

const DOMAIN = getDomainFromEnv();
console.log(`🌍 Generating sitemap for domain: ${DOMAIN}`);
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

// Dynamic import of project data
const getProjectIds = async (): Promise<string[]> => {
  try {
    // Import the project data
    const projectsModule = await import("../src/data/projects/index.js");
    return projectsModule.allProjectsSortedByPriority.map((project: { id: string }) => project.id);
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
  const projectRoutes = projectIds.map((id) => ({
    path: `/projects/${id}`,
    priority: 0.6,
    changefreq: "monthly",
    lastmod: new Date().toISOString().split("T")[0],
  }));

  const allRoutes = [...staticRoutes, ...projectRoutes];
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

  // Ensure directories exist
  const distDir = path.dirname(OUTPUT_PATH);
  const publicDir = path.dirname(PUBLIC_OUTPUT_PATH);
  
  if (!fs.existsSync(distDir)) {
    fs.mkdirSync(distDir, { recursive: true });
  }
  
  if (!fs.existsSync(publicDir)) {
    fs.mkdirSync(publicDir, { recursive: true });
  }

  fs.writeFileSync(OUTPUT_PATH, sitemap, "utf-8");
  fs.writeFileSync(PUBLIC_OUTPUT_PATH, sitemap, "utf-8");
  console.log(`✅ Sitemap generated at ${OUTPUT_PATH} and ${PUBLIC_OUTPUT_PATH}`);
  console.log(`📊 Generated ${allRoutes.length} URLs`);
};

const generateImageSitemap = async () => {
  const projectIds = await getProjectIds();
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

  // Ensure directories exist
  const imageDistDir = path.dirname(imageOutputPath);
  const imagePublicDir = path.dirname(publicImageOutputPath);
  
  if (!fs.existsSync(imageDistDir)) {
    fs.mkdirSync(imageDistDir, { recursive: true });
  }
  
  if (!fs.existsSync(imagePublicDir)) {
    fs.mkdirSync(imagePublicDir, { recursive: true });
  }

  fs.writeFileSync(imageOutputPath, imageSitemap, "utf-8");
  fs.writeFileSync(publicImageOutputPath, imageSitemap, "utf-8");
  console.log(`✅ Image sitemap generated at ${imageOutputPath} and ${publicImageOutputPath}`);
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  (async () => {
    await generateSitemap();
    await generateImageSitemap();
  })();
}

export { generateSitemap, generateImageSitemap };

