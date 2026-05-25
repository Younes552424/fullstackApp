# Multi‑stage Dockerfile for Railway deployment
# -------------------------------------------------
# Stage 1: Build the React frontend
FROM node:18-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package*.json ./
RUN npm ci
COPY frontend/ .
RUN npm run build

# Stage 2: Install backend production dependencies
FROM node:18-alpine AS backend-deps
WORKDIR /app/backend
COPY backend/package*.json ./
RUN npm ci --only=production

# Stage 3: Runtime image
FROM node:18-alpine
WORKDIR /app

# Copy backend source and production deps
COPY --from=backend-deps /app/backend ./backend
COPY backend/ ./backend

# Copy built frontend assets
COPY --from=frontend-builder /app/frontend/build ./frontend/build

# Expose the port (Railway provides $PORT automatically)
EXPOSE 5000

# Environment variables – will be overridden by Railway env vars
ENV NODE_ENV=production

# Start the backend server (it serves the static frontend)
CMD ["node", "backend/server.js"]
