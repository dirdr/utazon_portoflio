/**
 * Environment configuration - Single source of truth for URL resolution
 */

export const ENVIRONMENTS = {
  DEVELOPMENT: "development",
  INTEGRATION: "integration",
  PRODUCTION: "production",
} as const;

export type Environment = (typeof ENVIRONMENTS)[keyof typeof ENVIRONMENTS];

export interface EnvironmentConfig {
  environment: Environment;
  siteUrl: string;
  apiUrl: string;
}

/**
 * Resolve site URL with fallback chain
 * Priority: VITE_SITE_URL > runtime detection > defaults
 */
function resolveSiteUrl(): string {
  // Build-time: explicit environment variable (highest priority)
  if (import.meta.env.VITE_SITE_URL) {
    return import.meta.env.VITE_SITE_URL;
  }

  // Runtime: browser location
  if (typeof window !== "undefined") {
    return window.location.origin;
  }

  // Development fallback
  if (import.meta.env.DEV) {
    return "http://localhost:5173";
  }

  // Production fallback
  return "https://utazon.fr";
}

/**
 * Determine environment from URL
 */
function resolveEnvironment(siteUrl: string): Environment {
  if (siteUrl.includes("localhost")) {
    return ENVIRONMENTS.DEVELOPMENT;
  }
  if (siteUrl.includes("integration")) {
    return ENVIRONMENTS.INTEGRATION;
  }
  return ENVIRONMENTS.PRODUCTION;
}

/**
 * Build environment configuration
 */
export function buildConfig(): EnvironmentConfig {
  const siteUrl = resolveSiteUrl();
  const environment = resolveEnvironment(siteUrl);

  return {
    environment,
    siteUrl,
    apiUrl: import.meta.env.VITE_UTAZON_API_URL || "",
  };
}

// Export singleton config
export const config = buildConfig();
