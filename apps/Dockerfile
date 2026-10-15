ARG BUILD_IMAGE=node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df
ARG RUNTIME_IMAGE=gcr.io/distroless/nodejs24-debian13:nonroot@sha256:9eeb7f5887d0e239e78264b06f7f11d2e14be534050481803a9e4728fcdd278e

FROM --platform=$BUILDPLATFORM ${BUILD_IMAGE} AS build
ENV CI=true \
    NEXT_TELEMETRY_DISABLED=1 \
    npm_config_network_concurrency=8 \
    npm_config_fetch_retries=5 \
    npm_config_fetch_timeout=300000
WORKDIR /src
RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates \
 && rm -rf /var/lib/apt/lists/* \
 && git config --global --add safe.directory /src
RUN corepack enable
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY apps/ui/package.json apps/ui/
COPY packages/web/package.json packages/web/
COPY packages/mobile/package.json packages/mobile/
COPY packages/cli/package.json packages/cli/
COPY packages/tailwind/package.json packages/tailwind/
COPY packages/tokens/package.json packages/tokens/
RUN corepack install \
 && npm pkg delete scripts.prepare
ARG APP=ui
RUN pnpm install --frozen-lockfile --filter "./apps/${APP}..." --os=linux --cpu=x64 --cpu=arm64 --libc=glibc
COPY . .
ARG SITE_URL=https://ui.suiss.app
ENV NEXT_PUBLIC_SITE_URL=${SITE_URL}
ARG BUILD_SHA=dev
ENV BUILD_SHA=${BUILD_SHA}
RUN pnpm --filter "./apps/${APP}" build
RUN mkdir -p /out \
 && cp -r "apps/${APP}/.next/standalone/." /out/ \
 && mkdir -p "/out/apps/${APP}/.next" \
 && cp -r "apps/${APP}/.next/static" "/out/apps/${APP}/.next/static" \
 && if [ -d "apps/${APP}/public" ]; then cp -r "apps/${APP}/public" "/out/apps/${APP}/public"; fi

FROM ${RUNTIME_IMAGE}
ARG APP=ui
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=65532:65532 /out /app
WORKDIR /app/apps/${APP}
USER 65532:65532
EXPOSE 3000
CMD ["server.js"]
