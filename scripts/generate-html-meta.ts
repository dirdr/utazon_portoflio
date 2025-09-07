import fs from "fs";
import path from "path";

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

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:5173";
  }

  if (process.env.NODE_ENV === "preview") {
    return "http://localhost:4173";
  }

  return "https://utazon.fr";
};

const updateIndexHtml = () => {
  const domain = getDomainFromEnv();
  const indexPath = path.join(process.cwd(), "index.html");

  if (!fs.existsSync(indexPath)) {
    console.warn("⚠️  index.html not found, skipping meta update");
    return;
  }

  let content = fs.readFileSync(indexPath, "utf-8");

  // Update canonical URL
  content = content.replace(
    /(<link rel="canonical" href=")[^"]*(")/,
    `$1${domain}/$2`,
  );

  // Update Open Graph URL
  content = content.replace(
    /(<meta property="og:url" content=")[^"]*(")/,
    `$1${domain}/$2`,
  );

  // Update Open Graph image
  content = content.replace(
    /(<meta property="og:image" content=")[^"]*(")/,
    `$1${domain}/images/og-image.jpg$2`,
  );

  // Update Twitter URL
  content = content.replace(
    /(<meta property="twitter:url" content=")[^"]*(")/,
    `$1${domain}/$2`,
  );

  // Update Twitter image
  content = content.replace(
    /(<meta property="twitter:image" content=")[^"]*(")/,
    `$1${domain}/images/og-image.jpg$2`,
  );

  // Update locale based on domain
  const locale = domain.includes(".fr") ? "fr_FR" : "en_US";
  content = content.replace(
    /(<meta property="og:locale" content=")[^"]*(")/,
    `$1${locale}$2`,
  );

  // Update structured data URL
  content = content.replace(/("url": ")[^"]*(",)/g, `$1${domain}$2`);

  // Update structured data image URLs
  content = content.replace(
    /("image": ")[^"]*\/images\/([^"]*")/g,
    `$1${domain}/images/$2`,
  );

  fs.writeFileSync(indexPath, content, "utf-8");

  console.log(`🏠 Updated index.html meta tags for domain: ${domain}`);
};

const isMainModule = import.meta.url === `file://${process.argv[1]}`;
if (isMainModule) {
  updateIndexHtml();
}

export { updateIndexHtml };

