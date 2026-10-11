ARG BUILD_IMAGE=node:24.19.0-bookworm-slim@sha256:a9f5f7c91a432850b2a8a7797adf5eadb6c733ceed61167806cee7ea7fbc29df
ARG RUNTIME_IMAGE=gcr.io/distroless/nodejs24-debian13:nonroot@sha256:9eeb7f5887d0e239e78264b06f7f11d2e14be534050481803a9e4728fcdd278e

FROM --platform=$BUILDPLATFORM ${BUILD_IMAGE} AS build
ARG APP
ARG SITE_URL
ENV NEXT_TELEMETRY_DISABLED=1 \
    NEXT_PUBLIC_SITE_URL=${SITE_URL}
WORKDIR /src
RUN corepack enable
COPY . .
RUN pnpm install --frozen-lockfile --os=linux --cpu=x64 --cpu=arm64 --libc=glibc
RUN pnpm exec turbo run build --filter="${APP}"
RUN mkdir -p /out \
 && cp -r "apps/${APP}/.next/standalone/." /out/ \
 && mkdir -p "/out/apps/${APP}/.next" \
 && cp -r "apps/${APP}/.next/static" "/out/apps/${APP}/.next/static" \
 && if [ -d "apps/${APP}/public" ]; then cp -r "apps/${APP}/public" "/out/apps/${APP}/public"; fi

FROM ${RUNTIME_IMAGE}
ARG APP
ENV NODE_ENV=production \
    NEXT_TELEMETRY_DISABLED=1 \
    HOSTNAME=0.0.0.0 \
    PORT=3000
COPY --from=build --chown=65532:65532 /out /app
WORKDIR /app/apps/${APP}
USER 65532:65532
EXPOSE 3000
CMD ["server.js"]
