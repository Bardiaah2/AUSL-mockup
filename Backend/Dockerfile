# Completed Dockerfile for a generic Python web backend
FROM python:3.11-slim

# Runtime and pip behavior
ENV PYTHONDONTWRITEBYTECODE=1 \
    PYTHONUNBUFFERED=1 \
    PIP_NO_CACHE_DIR=1 \
    PORT=5000

WORKDIR /app

# Install build deps, curl (used by HEALTHCHECK), and system libs (e.g. libpq for postgres)
# Then install Python requirements and remove build deps to keep image small
COPY Backend/requirements.txt /app/requirements.txt
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends build-essential libpq-dev gcc curl && \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    apt-get purge -y --auto-remove build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY Backend/ /app

# Create a non-root user and give ownership of the app folder
RUN groupadd -r app && useradd -r -g app app && chown -R app:app /app
USER app

EXPOSE 5000

# Healthcheck - verify the combined points endpoint
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-5000}/api/points || exit 1

# Default command: run the Flask app directly (uses `PORT` env var)
CMD ["python", "Flask_backend_collection.py"]