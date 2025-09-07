# Deployment Instructions for Sitemap Generation

## Overview
This setup uses init containers to generate environment-specific sitemaps at deployment time, ensuring correct URLs for staging and production environments.

## Infrastructure Setup (utazon_portfolio_iac repository)

### 1. Environment Variables
Add these variables to your environment `.env` files:

**Staging (.env.staging):**
```bash
UTAZON_DOMAIN_STAGING=staging.utazon.fr
UTAZON_DOMAIN_PRODUCTION=utazon.fr
```

**Production (.env.production):**
```bash
UTAZON_DOMAIN_PRODUCTION=utazon.fr
```

### 2. Docker Compose Configuration
Replace your current docker-compose files with the provided examples, which include:
- Init container for sitemap generation
- Shared volume for sitemap files
- Proper dependency management

### 3. Nginx Configuration Update
Update your `nginx.conf` to serve sitemaps from the mounted volume:

```nginx
# Add this location block to serve sitemaps
location /sitemap.xml {
    alias /usr/share/nginx/html/sitemaps/sitemap.xml;
    add_header Content-Type application/xml;
}

location /sitemap-images.xml {
    alias /usr/share/nginx/html/sitemaps/sitemap-images.xml;
    add_header Content-Type application/xml;
}
```

## Deployment Process

### Current CD Pipeline Integration
Your existing CD pipeline will work with minimal changes:

1. **Build Phase** (CI): Creates single Docker image
2. **Deploy Phase** (CD): 
   ```bash
   # Generate sitemaps first
   docker-compose --profile init up utazon-sitemap-staging
   
   # Then start main application
   docker-compose up -d utazon-staging
   ```

### Manual Deployment Commands

**For Staging:**
```bash
cd /path/to/staging
docker-compose --profile init up utazon-sitemap-staging
docker-compose up -d utazon-staging
```

**For Production:**
```bash
cd /path/to/production
docker-compose --profile init up utazon-sitemap-production  
docker-compose up -d utazon-production
```

## Verification

After deployment, verify sitemaps are generated correctly:

```bash
# Check if sitemap exists and has correct domain
curl https://staging.utazon.fr/sitemap.xml
curl https://utazon.fr/sitemap.xml
```

## Troubleshooting

### Sitemap not found (404)
- Check if init container ran successfully: `docker logs utazon-sitemap-staging`
- Verify volume mounting in nginx container
- Check nginx configuration for sitemap location blocks

### Wrong URLs in sitemap
- Verify `VITE_SITE_URL` environment variable in init container
- Check if environment-specific domain variables are set correctly

### Init container fails
- Check container logs: `docker logs utazon-sitemap-staging`
- Verify project data can be imported (fallback list will be used if import fails)