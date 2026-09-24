FROM node:22-bookworm-slim AS base

WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS deps

COPY package.json package-lock.json ./
COPY apps/website/package.json ./apps/website/package.json
COPY apps/client-area/package.json ./apps/client-area/package.json
RUN npm ci

FROM base AS builder

ARG APP_NAME=website
ARG NEXT_PUBLIC_CLIENT_SITE_URL=https://client.sg-berjangka.com
ARG NEXT_PUBLIC_SITE_URL=https://sg-berjangka.com
ARG NEXT_PUBLIC_ENABLE_CLIENT_AREA=false
ENV NEXT_PUBLIC_CLIENT_SITE_URL=${NEXT_PUBLIC_CLIENT_SITE_URL} \
    NEXT_PUBLIC_SITE_URL=${NEXT_PUBLIC_SITE_URL} \
    NEXT_PUBLIC_ENABLE_CLIENT_AREA=${NEXT_PUBLIC_ENABLE_CLIENT_AREA}

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Next.js inlines NEXT_PUBLIC_* values at build time. Use the same production
# environment file for that build and for the Compose runtime environment.
RUN cp .env.prod "apps/${APP_NAME}/.env.production" \
    && npm run "build:${APP_NAME}" \
    && rm "apps/${APP_NAME}/.env.production"

FROM base AS runner

ENV NODE_ENV=production \
    HOSTNAME=0.0.0.0 \
    PORT=6969

ARG APP_NAME=website
ENV APP_NAME=${APP_NAME}

RUN addgroup --system --gid 1001 nodejs \
    && adduser --system --uid 1001 --ingroup nodejs nextjs

COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/public ./apps/${APP_NAME}/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/${APP_NAME}/.next/static ./apps/${APP_NAME}/.next/static

RUN mkdir -p "/app/apps/${APP_NAME}/.next/cache" \
    && chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 6969

CMD ["sh", "-c", "node apps/${APP_NAME}/server.js"]
