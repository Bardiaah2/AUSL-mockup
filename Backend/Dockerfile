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
COPY ../requirements.txt /app/requirements.txt
RUN apt-get update -y && \
    apt-get install -y --no-install-recommends build-essential libpq-dev gcc curl && \
    pip install --upgrade pip setuptools wheel && \
    pip install --no-cache-dir -r /app/requirements.txt && \
    apt-get purge -y --auto-remove build-essential gcc && \
    rm -rf /var/lib/apt/lists/*

# Copy application code
COPY . /app

# Create a non-root user and give ownership of the app folder
RUN groupadd -r app && useradd -r -g app app && chown -R app:app /app
USER app

EXPOSE 8000

# Healthcheck (adjust path if your app exposes a different endpoint)
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:${PORT:-8000}/health || exit 1

# Default command:
# - Uses environment variables so you can override WSGI_APP, PORT, WORKERS at runtime.
# - Assumes a WSGI app entrypoint like "app:app". Override WSGI_APP if different.
CMD ["sh", "-c", "gunicorn --bind 0.0.0.0:${PORT} ${WSGI_APP:-app:app} --workers ${WORKERS:-2} --log-level ${LOG_LEVEL:-info}"]