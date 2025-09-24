import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';
import { allProjectsSortedByPriority } from '../src/data/projects/index.js';
import { ROUTES } from '../src/constants/routes.js';

const SITE_URL = process.env.VITE_SITE_URL;

if (!SITE_URL) {
  console.error('ERROR: VITE_SITE_URL environment variable is required');
  process.exit(1);
}

async function generateSitemap() {
  
  // Static routes with priorities
  const staticRoutes = [
    { url: ROUTES.HOME, changefreq: 'weekly', priority: 1.0 },
    { url: ROUTES.ABOUT, changefreq: 'monthly', priority: 0.8 },
    { url: ROUTES.PROJECTS, changefreq: 'weekly', priority: 0.9 },
    { url: ROUTES.LEGAL, changefreq: 'yearly', priority: 0.3 },
  ];

  // Dynamic project routes
  const projectRoutes = allProjectsSortedByPriority.map((project) => ({
    url: `/projects/${project.id}`,
    changefreq: 'monthly',
    priority: 0.6,
  }));

  // Combine all routes
  const routes = [...staticRoutes, ...projectRoutes];

  // Create a stream to write to
  const sitemapStream = new SitemapStream({ hostname: SITE_URL });
  const outputPath = process.env.NODE_ENV === 'production' 
    ? '/usr/share/nginx/html/seo/sitemap.xml'
    : './public/sitemap.xml';
  const writeStream = createWriteStream(resolve(outputPath));
  
  sitemapStream.pipe(writeStream);

  try {
    // Add each route to the sitemap
    routes.forEach((route) => {
      sitemapStream.write({
        url: route.url,
        changefreq: route.changefreq,
        priority: route.priority,
        lastmod: new Date().toISOString().split('T')[0], // YYYY-MM-DD format
      });
    });

    sitemapStream.end();

    // Wait for the sitemap to be written
    await streamToPromise(sitemapStream);
    
  } catch (error) {
    console.error('❌ Error generating sitemap:', error);
    process.exit(1);
  }
}

generateSitemap().catch((error) => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});