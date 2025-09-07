// Environment-aware configuration utilities

export const getBaseUrl = (): string => {
  // In browser, we can use window.location
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  
  // During build time, check environment variables
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }
  
  // Development fallback
  if (import.meta.env.DEV) {
    return 'http://localhost:5173';
  }
  
  // Production fallback
  return 'https://utazon.fr';
};

export const getCanonicalUrl = (path: string = ''): string => {
  const baseUrl = getBaseUrl();
  // Remove leading slash if present to avoid double slashes
  const cleanPath = path.startsWith('/') ? path.slice(1) : path;
  return cleanPath ? `${baseUrl}/${cleanPath}` : baseUrl;
};

export const getOgImageUrl = (imagePath: string = 'images/og-image.jpg'): string => {
  const baseUrl = getBaseUrl();
  const cleanPath = imagePath.startsWith('/') ? imagePath.slice(1) : imagePath;
  return `${baseUrl}/${cleanPath}`;
};

export const isProduction = (): boolean => {
  const baseUrl = getBaseUrl();
  return baseUrl.includes('utazon.fr') && !baseUrl.includes('staging');
};

export const isDevelopment = (): boolean => {
  return import.meta.env.DEV || getBaseUrl().includes('localhost');
};

export const isStaging = (): boolean => {
  return getBaseUrl().includes('staging');
};