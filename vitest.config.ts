import { fileURLToPath } from "node:url"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const root = fileURLToPath(new URL(".", import.meta.url))

function browser(name: string) {
  return {
    enabled: true,
    headless: true,
    screenshotFailures: false,
    provider: playwright({ launchOptions: { channel: "chrome" } }),
    instances: [{ browser: "chromium" as const, name }],
    viewport: { width: 1280, height: 800 },
  }
}

export default defineConfig({
  resolve: { alias: { "@": root } },
  test: {
    projects: [
      {
        test: {
          name: "cli",
          sequence: { groupOrder: 0 },
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
          maxWorkers: 4,
          sequence: { groupOrder: 1 },
          include: ["tests/{hooks,components,blocks}/**/*.test.tsx"],
          setupFiles: ["tests/setup.ts"],
          browser: browser("browser"),
        },
      },
      {
        extends: true,
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "stories",
          maxWorkers: 4,
          sequence: { groupOrder: 2 },
          setupFiles: ["tests/setup.ts", "tests/stories-setup.ts"],
          browser: browser("stories"),
        },
      },
    ],
  },
})
