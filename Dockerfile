# Stage Dependencies
FROM node:21-alpine AS deps
WORKDIR /app

# Install dependencies termasuk sharp
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json ./
RUN npm ci --include=dev

# Stage Builder
FROM node:21-alpine AS builder
WORKDIR /app

# Salin dependencies dan kode
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build aplikasi
RUN npm run build:force

# Stage Runner
FROM node:21-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

# Install sharp dan dependencies produksi
RUN apk add --no-cache libc6-compat
RUN npm install sharp

# Tambahkan user non-root
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Salin file yang diperlukan
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Set user
USER nextjs

# Expose port
EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Jalankan aplikasi
CMD ["node", "server.js"]