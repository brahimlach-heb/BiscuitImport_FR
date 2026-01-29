# Stage 1: Build stage
FROM node:18-alpine@sha256:f0d8c7c5e4d9c8b5a7f9e1d3c5b7a9f0e2d4c6b8a0f2e4d6c8b0a2e4d6c8b0 AS builder

WORKDIR /app

# Build arguments for environment variables
ARG VITE_API_BASE_URL

# Copy package files
COPY package.json package-lock.json* ./

# Install dependencies
RUN npm install

# Copy project files
COPY . .

# Build the application with environment variables
RUN VITE_API_BASE_URL=$VITE_API_BASE_URL npm run build

# Stage 2: Production stage
FROM node:18-alpine@sha256:f0d8c7c5e4d9c8b5a7f9e1d3c5b7a9f0e2d4c6b8a0f2e4d6c8b0a2e4d6c8b0

WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S appuser && \
    adduser -S appuser -u 1001

# Install a simple HTTP server to serve the built app
RUN npm install -g serve

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist

# Change ownership of app directory to appuser
RUN chown -R appuser:appuser /app

# Switch to non-root user
USER appuser

# Expose port
EXPOSE 5173

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:5173', (r) => {if (r.statusCode !== 200) throw new Error(r.statusCode)})"
# Start the application
CMD ["serve", "-s", "dist", "-l", "5173"]
