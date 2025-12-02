# Multi-stage Dockerfile for Next.js (suitable for docker-compose)
# Build stage
FROM node:20.9.0-alpine AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

# Install build dependencies (use cache for package files)
COPY package*.json ./
# Install devDependencies for build by forcing NODE_ENV=development for the install step.
RUN if [ -f package-lock.json ]; then NODE_ENV=development npm ci --silent; else NODE_ENV=development npm install --silent; fi

# Copy source and build
COPY . .
# Ensure build runs with production NODE_ENV for consistent prerender behavior
ENV NODE_ENV=production
RUN npm run build

# Remove devDependencies to keep final image small
RUN if [ -f package-lock.json ]; then npm prune --production --silent; else npm prune --production --silent; fi

# Production image
FROM node:22.6.0-alpine AS runner
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