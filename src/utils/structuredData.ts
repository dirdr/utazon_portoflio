import type { Project } from '../types/project';

// Base organization schema
export const getOrganizationSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "utazon",
  "alternateName": "Antoine Vernez",
  "url": "https://utazon.com",
  "logo": "https://utazon.com/src/assets/images/logo.svg",
  "sameAs": [
    "https://www.instagram.com/utazon/", // Replace with actual social links
    "https://www.linkedin.com/in/antoine-vernez/",
    "https://www.behance.net/utazon"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "business",
    "email": "contact@utazon.com" // Replace with actual email
  }
});

// Person schema for Antoine Vernez
export const getPersonSchema = () => ({
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Antoine Vernez",
  "alternateName": "utazon",
  "jobTitle": "Creative Director & Visual Artist",
  "worksFor": {
    "@type": "Organization",
    "name": "utazon"
  },
  "url": "https://utazon.com",
  "image": "https://utazon.com/images/antoine-vernez.jpg", // Add profile image
  "sameAs": [
    "https://www.instagram.com/utazon/",
    "https://www.linkedin.com/in/antoine-vernez/",
    "https://www.behance.net/utazon"
  ],
  "knowsAbout": [
    "Creative Direction",
    "Visual Arts",
    "Video Production",
    "Motion Graphics",
    "Post-Production",
    "Advertising",
    "Music Videos",
    "Digital Art"
  ]
});

// Website schema
export const getWebsiteSchema = () => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "utazon - Antoine Vernez Portfolio",
  "alternateName": "utazon",
  "url": "https://utazon.com",
  "author": {
    "@type": "Person",
    "name": "Antoine Vernez"
  },
  "description": "Portfolio of Antoine Vernez (utazon) - Creative Director, Visual Artist and Video Producer",
  "inLanguage": "fr-FR",
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://utazon.com/projects?search={search_term_string}",
    "query-input": "required name=search_term_string"
  }
});

// Creative work schema for projects
export const getCreativeWorkSchema = (project: Project) => ({
  "@context": "https://schema.org",
  "@type": "CreativeWork",
  "name": project.title,
  "description": project.description,
  "creator": {
    "@type": "Person",
    "name": "Antoine Vernez",
    "alternateName": "utazon"
  },
  "url": `https://utazon.com/projects/${project.id}`,
  "image": `https://utazon.com/images/projects/${project.id}/cover.webp`,
  "dateCreated": project.year.toString(),
  "genre": project.tags?.join(', '),
  "keywords": project.tags?.join(', '),
  "workExample": {
    "@type": "VideoObject",
    "name": project.title,
    "description": project.description,
    "thumbnailUrl": `https://utazon.com/images/projects/${project.id}/cover.webp`,
    "uploadDate": project.year.toString()
  }
});

// Portfolio collection schema
export const getPortfolioSchema = (projects: Project[]) => ({
  "@context": "https://schema.org",
  "@type": "CollectionPage",
  "name": "Projects - utazon Portfolio",
  "description": "Collection of creative projects by Antoine Vernez (utazon)",
  "url": "https://utazon.com/projects",
  "author": {
    "@type": "Person",
    "name": "Antoine Vernez",
    "alternateName": "utazon"
  },
  "mainEntity": {
    "@type": "ItemList",
    "numberOfItems": projects.length,
    "itemListElement": projects.map((project, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "item": {
        "@type": "CreativeWork",
        "name": project.title,
        "url": `https://utazon.com/projects/${project.id}`,
        "image": `https://utazon.com/images/projects/${project.id}/cover.webp`
      }
    }))
  }
});

// Breadcrumb schema
export const getBreadcrumbSchema = (breadcrumbs: Array<{name: string, url: string}>) => ({
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": breadcrumbs.map((crumb, index) => ({
    "@type": "ListItem",
    "position": index + 1,
    "name": crumb.name,
    "item": crumb.url
  }))
});

// FAQ schema for about page
export const getFAQSchema = () => ({
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "What services does Antoine Vernez (utazon) offer?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "Antoine Vernez specializes in creative direction, visual arts, video production, motion graphics, and post-production for advertising, music videos, and digital art projects."
      }
    },
    {
      "@type": "Question",
      "name": "How can I contact utazon for a project?",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "You can contact Antoine Vernez through the contact form on the website or via email at contact@utazon.com."
      }
    }
  ]
});