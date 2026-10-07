import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const root = fileURLToPath(new URL(".", import.meta.url))

export default defineConfig({
  resolve: { alias: { "@": root } },
  test: {
    projects: [
      {
        test: {
          name: "cli",
          environment: "node",
          include: ["tests/{cli,scripts}/**/*.test.mjs"],
        },
      },
      {
        extends: true,
        plugins: [tailwindcss()],
        optimizeDeps: {
          entries: ["tests/{hooks,components,blocks}/**/*.test.tsx"],
        },
        test: {
          name: "browser",
          include: ["tests/{hooks,components,blocks}/**/*.test.tsx"],
          setupFiles: ["tests/setup.ts"],
          browser: {
            enabled: true,
            headless: true,
            screenshotFailures: false,
            provider: playwright({ launchOptions: { channel: "chrome" } }),
            instances: [{ browser: "chromium" }],
            viewport: { width: 1280, height: 800 },
          },
        },
      },
    ],
  },
})
