import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = process.env.VITE_SITE_URL;

if (!SITE_URL) {
  console.error('ERROR: VITE_SITE_URL environment variable is required');
  process.exit(1);
}

function generateRobotsTxt() {
  
  const robotsTxtContent = `# Robots.txt for ${SITE_URL}

User-agent: *
Allow: /

# Block access to development and build files
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /dist/
Disallow: /scripts/

# Allow crawling of all portfolio content
Allow: /projects/
Allow: /images/
Allow: /videos/
Allow: /fonts/

# Block specific file types that shouldn't be indexed
Disallow: /*.json$
Disallow: /*.ts$
Disallow: /*.tsx$
Disallow: /*.js.map$
Disallow: /*.css.map$

# Allow common social media crawlers
User-agent: facebookexternalhit/*
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

User-agent: WhatsApp
Allow: /

# Sitemaps
Sitemap: ${SITE_URL}/sitemap.xml
Sitemap: ${SITE_URL}/sitemap-images.xml

# Crawl delay (optional - adjust based on server capacity)
Crawl-delay: 1
`;

  try {
    const outputPath = process.env.NODE_ENV === 'production' 
      ? '/usr/share/nginx/html/seo/robots.txt'
      : './public/robots.txt';
    const resolvedPath = resolve(outputPath);
    writeFileSync(resolvedPath, robotsTxtContent, 'utf8');
    
  } catch (error) {
    console.error('❌ Error generating robots.txt:', error);
    process.exit(1);
  }
}

try {
  generateRobotsTxt();
} catch (error) {
  console.error('❌ Fatal error:', error);
  process.exit(1);
}