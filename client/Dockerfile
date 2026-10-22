# ── Stage 1: Build ──────────────────────────────────────────────────────────
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files first (layer cache: only reinstall when deps change)
COPY package*.json ./
RUN npm ci --omit=dev

# Copy source
COPY . .

# Build the production React bundle
RUN npm run build

# ── Stage 2: Serve ──────────────────────────────────────────────────────────
# Use a lightweight static file server (serve) instead of the Vite dev server
FROM node:20-alpine AS runner

WORKDIR /app

RUN npm install -g serve@14

# Copy built assets from the builder stage
COPY --from=builder /app/dist ./dist

EXPOSE 5173

# serve the dist folder on port 5173
CMD ["serve", "-s", "dist", "-l", "5173"]
