# Multi-stage Dockerfile for Next.js (suitable for docker-compose)
# Build stage
FROM node:20.9.0-bullseye AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

# Install build dependencies (use cache for package files)
COPY package*.json ./
# Ensure minimal build tools are available for native modules (avoids Alpine issues on some builders)
RUN apt-get update -y && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*
# Install devDependencies so build-time tools (TypeScript, Next.js) are available.
# Run with `unsafe-perm` and a small retry to be more robust on Render; leave logs enabled
# so build failures show detailed errors in Render logs.
RUN npm config set unsafe-perm true && npm config set fetch-retries 5 && npm config set fetch-retry-factor 2 && \
		if [ -f package-lock.json ]; then \
			(npm ci --include=dev --loglevel=info --no-audit || (echo "npm ci failed, retrying..." && sleep 2 && npm ci --include=dev --loglevel=info --no-audit)); \
		else \
			(npm install --include=dev --loglevel=info --no-audit || (echo "npm install failed, retrying..." && sleep 2 && npm install --include=dev --loglevel=info --no-audit)); \
		fi

# Copy source and build
COPY . .
# Ensure build runs with production NODE_ENV for consistent prerender behavior
ENV NODE_ENV=production
RUN npm run build

# Remove devDependencies to keep final image small
RUN if [ -f package-lock.json ]; then npm prune --production --silent; else npm prune --production --silent; fi

# Production image
FROM node:20.9.0-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
# Do not copy `next.config.ts` into the runtime image; Next.js would try
# to compile it at startup and require `typescript` as a runtime dependency.
# The build already ran in the builder stage using the TypeScript config.

# Use non-root user
USER node

EXPOSE 3000

# Start command (expects "start" script to run `next start -p $PORT` in package.json)
CMD ["npm", "run", "start"]