# Production Dockerfile for MediFind Full-Stack Application
FROM node:20-alpine

WORKDIR /app

# Copy dependency specifications
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy application codebase
COPY . .

# Expose server port
EXPOSE 5000

# Environment Defaults
ENV PORT=5000
ENV NODE_ENV=production

# Start MediFind Full-Stack Server
CMD ["node", "backend/server.js"]
