FROM node:22-alpine AS build

WORKDIR /app

COPY package*.json ./

RUN npm install --frozen-lockfile

COPY . .

ARG VITE_UTAZON_API_URL
ARG VITE_SITE_URL
ENV VITE_UTAZON_API_URL=$VITE_UTAZON_API_URL
ENV VITE_SITE_URL=$VITE_SITE_URL

RUN npm run build

# Production stage for serving static files
FROM nginx:stable-alpine as production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

# Utility stage for sitemap generation (init container)
FROM node:22-alpine as sitemap-generator

WORKDIR /app

# Copy package files and install dependencies (need tsx for TypeScript execution)
COPY package*.json ./
RUN npm ci

# Copy scripts needed for sitemap generation
COPY scripts/ ./scripts/

# Set default command for sitemap generation
CMD ["npm", "run", "sitemap:docker"]

# Utility stage for robots.txt generation (init container)
FROM node:22-alpine as robots-generator

WORKDIR /app

# Copy package files and install dependencies (need tsx for TypeScript execution)
COPY package*.json ./
RUN npm ci

# Copy scripts needed for robots.txt generation
COPY scripts/ ./scripts/

# Set default command for robots.txt generation
CMD ["npm", "run", "robots:docker"]
