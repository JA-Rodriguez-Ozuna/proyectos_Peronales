# Multi-stage build for Next.js frontend and Flask backend
FROM node:18-alpine AS frontend-builder

# Build frontend
WORKDIR /app/frontend
COPY fronted-vo/package*.json ./
RUN npm install
COPY fronted-vo/ ./
RUN npm run build

# Python backend stage
FROM python:3.11-slim

WORKDIR /app

# Install Python dependencies
COPY requirements-clean.txt requirements.txt
RUN pip install --no-cache-dir -r requirements.txt

# Copy backend files
COPY app.py .
COPY models.py .
COPY database.db .

# Copy built frontend
COPY --from=frontend-builder /app/frontend/out ./frontend/out
COPY --from=frontend-builder /app/frontend/.next ./frontend/.next
COPY --from=frontend-builder /app/frontend/public ./frontend/public

# Create directory for static files if needed
RUN mkdir -p /app/static

# Expose port
EXPOSE 5000

# Environment variables
ENV FLASK_APP=app.py
ENV FLASK_ENV=production
ENV PORT=5000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:5000/ || exit 1

# Start command
CMD ["python", "app.py"]