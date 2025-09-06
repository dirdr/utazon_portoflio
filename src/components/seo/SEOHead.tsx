import { useEffect } from 'react';

export interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  ogType?: 'website' | 'article' | 'profile';
  canonicalUrl?: string;
  structuredData?: object;
  noIndex?: boolean;
}

const DEFAULT_SEO: SEOProps = {
  title: 'utazon - Antoine Vernez | Creative Director & Visual Artist',
  description: 'Portfolio of Antoine Vernez (utazon) - Creative Director, Visual Artist and Video Producer. Discover innovative projects in advertising, music videos, and digital art.',
  keywords: 'Antoine Vernez, utazon, creative director, visual artist, video producer, advertising, music videos, digital art, motion graphics, post-production, France',
  ogImage: 'https://utazon.com/images/og-image.jpg', // Add this image to public/images/
  ogType: 'website',
  canonicalUrl: 'https://utazon.com',
};

export const SEOHead: React.FC<SEOProps> = ({
  title,
  description,
  keywords,
  ogImage,
  ogType = 'website',
  canonicalUrl,
  structuredData,
  noIndex = false,
}) => {
  const seoTitle = title || DEFAULT_SEO.title;
  const seoDescription = description || DEFAULT_SEO.description;
  const seoKeywords = keywords || DEFAULT_SEO.keywords;
  const seoOgImage = ogImage || DEFAULT_SEO.ogImage;
  const seoCanonicalUrl = canonicalUrl || DEFAULT_SEO.canonicalUrl;

  useEffect(() => {
    // Update document title
    document.title = seoTitle;

    // Update meta tags
    updateMetaTag('description', seoDescription);
    updateMetaTag('keywords', seoKeywords);
    
    // Open Graph meta tags
    updateMetaTag('og:title', seoTitle, 'property');
    updateMetaTag('og:description', seoDescription, 'property');
    updateMetaTag('og:image', seoOgImage, 'property');
    updateMetaTag('og:type', ogType, 'property');
    updateMetaTag('og:url', seoCanonicalUrl, 'property');
    updateMetaTag('og:site_name', 'utazon - Antoine Vernez', 'property');

    // Twitter Card meta tags
    updateMetaTag('twitter:card', 'summary_large_image');
    updateMetaTag('twitter:title', seoTitle);
    updateMetaTag('twitter:description', seoDescription);
    updateMetaTag('twitter:image', seoOgImage);
    updateMetaTag('twitter:creator', '@utazon'); // Replace with actual Twitter handle

    // Additional meta tags
    updateMetaTag('author', 'Antoine Vernez');
    updateMetaTag('robots', noIndex ? 'noindex, nofollow' : 'index, follow');

    // Canonical URL
    updateLinkTag('canonical', seoCanonicalUrl);

    // Structured Data (JSON-LD)
    if (structuredData) {
      updateStructuredData(structuredData);
    }
  }, [seoTitle, seoDescription, seoKeywords, seoOgImage, ogType, seoCanonicalUrl, structuredData, noIndex]);

  return null; // This component doesn't render anything
};

// Helper function to update meta tags
const updateMetaTag = (name: string, content: string, attribute: 'name' | 'property' = 'name') => {
  let element = document.querySelector(`meta[${attribute}="${name}"]`) as HTMLMetaElement;
  
  if (!element) {
    element = document.createElement('meta');
    element.setAttribute(attribute, name);
    document.head.appendChild(element);
  }
  
  element.content = content;
};

// Helper function to update link tags
const updateLinkTag = (rel: string, href: string) => {
  let element = document.querySelector(`link[rel="${rel}"]`) as HTMLLinkElement;
  
  if (!element) {
    element = document.createElement('link');
    element.rel = rel;
    document.head.appendChild(element);
  }
  
  element.href = href;
};

// Helper function to add/update structured data
const updateStructuredData = (data: object) => {
  // Remove existing structured data
  const existingScript = document.querySelector('script[type="application/ld+json"]');
  if (existingScript) {
    existingScript.remove();
  }

  // Add new structured data
  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(data);
  document.head.appendChild(script);
};