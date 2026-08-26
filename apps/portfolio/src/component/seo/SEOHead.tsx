import { useEffect } from "react";
import { getCanonicalUrl, getOgImageUrl } from "../../utils/env";

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: "website" | "article" | "profile";
  canonicalUrl?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const DEFAULT_SEO: SEOProps = {
  title: "utazon - Antoine Vernez | 3D Artist & Motion Designer",
  description:
    "Portfolio of Antoine Vernez (utazon) - Creative Director, Visual Artist and Video Producer. Discover innovative projects in advertising, music videos, and digital art.",
  keywords:
    "Antoine Vernez, utazon, creative director, visual artist, video producer, advertising, music videos, digital art, motion graphics, post-production, France",
  ogImage: getOgImageUrl("images/og-image.png"),
  ogType: "website",
  canonicalUrl: getCanonicalUrl(),
};

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = "website",
  canonicalUrl,
  structuredData,
  noIndex = false,
}) => {
  const seoTitle = title || DEFAULT_SEO.title!;
  const seoDescription = description || DEFAULT_SEO.description!;
  const seoKeywords = keywords || DEFAULT_SEO.keywords!;
  const seoOgImage = ogImage || DEFAULT_SEO.ogImage!;
  const seoCanonicalUrl = canonicalUrl || DEFAULT_SEO.canonicalUrl!;

  useEffect(() => {
    document.title = seoTitle;

    updateMetaTag("description", seoDescription);
    updateMetaTag("keywords", seoKeywords);

    updateMetaTag("og:title", seoTitle, "property");
    updateMetaTag("og:description", seoDescription, "property");
    updateMetaTag("og:image", seoOgImage, "property");
    updateMetaTag("og:type", ogType, "property");
    updateMetaTag("og:url", seoCanonicalUrl, "property");
    updateMetaTag("og:site_name", "utazon - Antoine Vernez", "property");

    updateMetaTag("twitter:card", "summary_large_image");
    updateMetaTag("twitter:title", seoTitle);
    updateMetaTag("twitter:description", seoDescription);
    updateMetaTag("twitter:image", seoOgImage);

    updateMetaTag("author", "Antoine Vernez");
    updateMetaTag("robots", noIndex ? "noindex, nofollow" : "index, follow");

    updateLinkTag("canonical", seoCanonicalUrl);

    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [
    seoTitle,
    seoDescription,
    seoKeywords,
    seoOgImage,
    ogType,
    seoCanonicalUrl,
    structuredData,
    noIndex,
  ]);

  return null;
};

const updateMetaTag = (
  name: string,
  content: string,
  attribute: "name" | "property" = "name",
) => {
  let element = document.querySelector(
    `meta[${attribute}="${name}"]`,
  ) as HTMLMetaElement;

  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }

  element.content = content;
};

const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;

  if (!element) {
    element = document.createElement("link");
    element.rel = rel;
    document.head.appendChild(element);
  }

  element.href = href;
};

const updateStructuredData = (data: object) => {
  const existingScript = document.querySelector(
    'script[type="application/ld+json"]',
  );
  if (existingScript) {
    existingScript.remove();
  }

  const script = document.createElement("script");
  script.type = "application/ld+json";
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};
