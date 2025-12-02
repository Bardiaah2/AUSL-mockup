# Multi-stage Dockerfile for Next.js (suitable for docker-compose)
# Build stage
FROM node:18-alpine AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
WORKDIR /app

# Install build dependencies (use cache for package files)
COPY package*.json ./
COPY yarn.lock ./
# Install with npm if package-lock.json exists, otherwise fallback to npm install (works for yarn too if lock not present)
RUN if [ -f package-lock.json ]; then npm ci --silent; else npm install --silent; fi

# Copy source and build
COPY . .
RUN npm run build

# Remove devDependencies to keep final image small
RUN if [ -f package-lock.json ]; then npm prune --production --silent; else npm prune --production --silent; fi

# Production image
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy only the necessary files from the builder
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/next.config.js ./next.config.js

# Use non-root user
USER node

EXPOSE 3000

# Start command (expects "start" script to run `next start -p $PORT` in package.json)
CMD ["npm", "run", "start"]