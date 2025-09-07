import fs from "fs";
import path from "path";

// Environment-aware domain detection (same as sitemap)
const getDomainFromEnv = (): string => {
  if (process.env.VITE_SITE_URL) {
    return process.env.VITE_SITE_URL;
  }
  
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  if (process.env.DEPLOY_PRIME_URL) {
    return process.env.DEPLOY_PRIME_URL;
  }
  
  if (process.env.URL) {
    return process.env.URL;
  }
  
  if (process.env.NODE_ENV === 'development') {
    return 'http://localhost:5173';
  }
  
  if (process.env.NODE_ENV === 'preview') {
    return 'http://localhost:4173';
  }
  
  return 'https://utazon.fr';
};

const generateRobotsTxt = () => {
  const domain = getDomainFromEnv();
  const isProduction = domain.includes('utazon.fr') && !domain.includes('staging');
  
  const robotsContent = `# Robots.txt for ${domain}

User-agent: *
${isProduction ? 'Allow: /' : 'Disallow: /'}

# Block access to development and build files
Disallow: /src/
Disallow: /node_modules/
Disallow: /.git/
Disallow: /dist/
Disallow: /scripts/

${isProduction ? `
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
` : ''}

# Sitemap location
Sitemap: ${domain}/sitemap.xml
Sitemap: ${domain}/sitemap-images.xml

# Crawl-delay (optional - adjust based on server capacity)
# Crawl-delay: 1
`;

  const outputPath = path.join(process.cwd(), "public", "robots.txt");
  fs.writeFileSync(outputPath, robotsContent, "utf-8");
  
  console.log(`🤖 Robots.txt generated for domain: ${domain}`);
  console.log(`📍 Generated at: ${outputPath}`);
  if (!isProduction) {
    console.log(`⚠️  Non-production environment detected - crawling disabled`);
  }
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  generateRobotsTxt();
}

export { generateRobotsTxt };