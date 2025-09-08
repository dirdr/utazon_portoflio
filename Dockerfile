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

FROM nginx:stable-alpine as production

COPY --from=build /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]

FROM node:22-alpine as sitemap-generator

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY scripts/ ./scripts/
COPY src/ ./src/

CMD ["npm", "run", "sitemap:docker"]

FROM node:22-alpine as robots-generator

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY scripts/ ./scripts/
COPY src/ ./src/

CMD ["npm", "run", "robots:docker"]
