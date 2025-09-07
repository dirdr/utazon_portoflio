import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = process.env.VITE_SITE_URL || 'https://utazon.fr';

function generateRobotsTxt() {
  console.log(`Generating robots.txt for ${SITE_URL}`);
  
  const robotsTxtContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: ${SITE_URL}/sitemap.xml

# Crawl delay
Crawl-delay: 1
`;

  const outputPath = resolve('/usr/share/nginx/html/seo/robots.txt');
  writeFileSync(outputPath, robotsTxtContent, 'utf8');
  
  console.log(`Robots.txt generated successfully at ${outputPath}`);
}

generateRobotsTxt();