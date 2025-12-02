# Multi-stage Dockerfile for Next.js (suitable for docker-compose)
# Build stage
FROM node:20.9.0-bullseye AS builder
ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}
# Work directory inside image
WORKDIR /app

# Copy full repo into the image; we'll detect where `package.json` lives and run
# install/build from that directory. This makes the Dockerfile robust when the
# build context is either the repo root (Render) or the `frontend` folder (local).
COPY . .

# Ensure minimal build tools are available for native modules
RUN apt-get update -y && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

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