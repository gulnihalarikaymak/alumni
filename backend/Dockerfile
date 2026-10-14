FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Prisma's migration engine needs OpenSSL, which the Alpine image does not include.
RUN apk add --no-cache openssl

COPY package*.json ./
RUN npm install --omit=dev

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/views ./views
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/prisma.config.ts ./

EXPOSE 3000

# Apply pending migrations first, then start the API. "migrate deploy" only runs
# migration files that are already in git; it never creates new ones.
CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]
