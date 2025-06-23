# Stage 1: Build
FROM node:24-slim AS builder

WORKDIR /app

# Install deps
COPY package*.json tsconfig.json ./
RUN npm install

# Copy source
COPY app ./app

# Compile TypeScript
RUN npx tsc

# Stage 2: Runtime
FROM node:24-slim

WORKDIR /app

# Only copy compiled output + dependencies
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY package*.json ./

ENV NODE_ENV=production

CMD ["node", "dist/index.js"]
