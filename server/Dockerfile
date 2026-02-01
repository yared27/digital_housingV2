# Multi-stage build for server
FROM node:18-alpine AS base
WORKDIR /app
ENV NODE_ENV=production

# Install deps for production stage separately
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci --omit=dev

# Development stage
FROM base AS development
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
EXPOSE 5000
EXPOSE 9229
USER node
CMD ["npm", "run", "dev"]

# Build stage
FROM base AS build
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM base AS production
WORKDIR /app
COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./
# Use a non-root user
RUN addgroup -S backend && adduser -S backend -G backend
USER backend
EXPOSE 5000
CMD ["node", "dist/index.js"]