import { createWriteStream } from 'fs';
import { resolve } from 'path';
import { SitemapStream, streamToPromise } from 'sitemap';

const SITE_URL = process.env.VITE_SITE_URL || 'https://utazon.fr';

async function generateSitemap() {
  console.log(`Generating sitemap for ${SITE_URL}`);
  
  // Define your routes here
  const routes = [
    { url: '/', changefreq: 'weekly', priority: 1.0 },
    { url: '/about', changefreq: 'monthly', priority: 0.8 },
    { url: '/projects', changefreq: 'weekly', priority: 0.9 },
    { url: '/contact', changefreq: 'monthly', priority: 0.7 },
  ];

  // Create a stream to write to
  const sitemapStream = new SitemapStream({ hostname: SITE_URL });
  const writeStream = createWriteStream(resolve('/app/sitemap.xml'));
  
  sitemapStream.pipe(writeStream);

  // Add each route to the sitemap
  routes.forEach((route) => {
    sitemapStream.write({
      url: route.url,
      changefreq: route.changefreq,
      priority: route.priority,
      lastmod: new Date().toISOString(),
    });
  });

  sitemapStream.end();

  // Wait for the sitemap to be written
  await streamToPromise(sitemapStream);
  
  console.log('Sitemap generated successfully at /app/sitemap.xml');
}

generateSitemap().catch(console.error);