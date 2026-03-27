import type { Plugin } from "vite";

/**
 * Vite plugin to inject SEO meta tags into index.html
 * Replaces regex-based HTML manipulation with clean template approach
 */
export function seoPlugin(): Plugin {
  return {
    name: "vite-plugin-seo",

    transformIndexHtml(html) {
      const siteUrl = process.env.VITE_SITE_URL || "http://localhost:5173";
      const isProduction =
        siteUrl.includes("utazon.fr") && !siteUrl.includes("integration");
      const locale = siteUrl.includes(".fr") ? "fr_FR" : "en_US";

      console.log(
        `🔧 SEO Plugin: Injecting meta tags for ${siteUrl} (${locale})`,
      );

      return html
        .replace(/\$\{SITE_URL\}/g, siteUrl)
        .replace(/\$\{OG_LOCALE\}/g, locale)
        .replace(
          /\$\{ENVIRONMENT\}/g,
          isProduction ? "production" : "integration",
        );
    },
  };
}
