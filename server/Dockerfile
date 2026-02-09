# ---------- Base ----------
FROM node:18-alpine AS base
WORKDIR /app

# ---------- Dependencies ----------
FROM base AS deps
COPY package.json package-lock.json* ./
RUN npm ci

# ---------- Build ----------
FROM base AS build
COPY package.json package-lock.json* ./
COPY tsconfig*.json ./
RUN npm ci
COPY . .
RUN npm run build

# ---------- Production ----------
FROM node:18-alpine AS production
WORKDIR /app
ENV NODE_ENV=production

COPY --from=build /app/dist ./dist
COPY --from=deps /app/node_modules ./node_modules
COPY package.json ./

EXPOSE 3000

CMD ["node", "dist/index.js"]
