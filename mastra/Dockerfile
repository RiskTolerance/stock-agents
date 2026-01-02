# Stage 1: Build
FROM node:22-slim AS builder

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Install deps
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile

# Copy source
COPY src ./src
COPY tsconfig.json ./

# Build with mastra
RUN pnpm build

# Stage 2: Runtime
FROM node:22-slim

WORKDIR /app

# Install pnpm
RUN corepack enable && corepack prepare pnpm@latest --activate

# Copy built output and dependencies
COPY --from=builder /app/.mastra ./.mastra
COPY --from=builder /app/node_modules ./node_modules
COPY package.json pnpm-lock.yaml ./

ENV NODE_ENV=production

EXPOSE 3001

CMD ["pnpm", "start"]