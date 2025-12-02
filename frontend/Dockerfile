FROM node:20-bullseye AS builder

WORKDIR /app

# Copy the entire repo into the image. We'll build whichever package.json exists
# (either /app/frontend or /app) and normalize outputs to /app/.next and /app/node_modules.
COPY . .

# Install minimal build tools for native dependencies
RUN apt-get update -y && apt-get install -y --no-install-recommends python3 make g++ ca-certificates && rm -rf /var/lib/apt/lists/*

# Install deps and build. Handle two layouts: repo-root with `frontend/` or frontend-only context.
RUN if [ -d /app/frontend ]; then \
			cd /app/frontend && \
			if [ -f package-lock.json ]; then npm ci --include=dev --unsafe-perm --loglevel=error; else npm install --include=dev --unsafe-perm --loglevel=error; fi && \
			npm run build; \
		else \
			cd /app && \
			if [ -f package-lock.json ]; then npm ci --include=dev --unsafe-perm --loglevel=error; else npm install --include=dev --unsafe-perm --loglevel=error; fi && \
			npm run build && \
			# ensure artifacts live under /app/frontend for the runner to copy consistently
			mkdir -p /app/frontend && \
			if [ -d ".next" ]; then mv .next /app/frontend/.next; fi && \
			if [ -d "node_modules" ]; then mv node_modules /app/frontend/node_modules; fi && \
			if [ -f package.json ]; then cp package.json /app/frontend/package.json; fi && \
			if [ -f package-lock.json ]; then cp package-lock.json /app/frontend/package-lock.json; fi; \
		fi

# Normalize public directory so runner can always copy from /app/frontend/public
RUN mkdir -p /app/frontend && \
	if [ -d /app/frontend/public ]; then \
		echo "/app/frontend/public exists"; \
	elif [ -d /app/public ]; then \
		cp -a /app/public /app/frontend/public; \
	else \
		mkdir -p /app/frontend/public; \
	fi

# Production image
FROM node:20-bullseye-slim AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000

# Copy built assets and production deps from builder
COPY --from=builder /app/frontend/.next ./.next
COPY --from=builder /app/frontend/public ./public
COPY --from=builder /app/frontend/node_modules ./node_modules
COPY --from=builder /app/frontend/package*.json ./

USER node

EXPOSE 3000

CMD ["npm", "run", "start"]
