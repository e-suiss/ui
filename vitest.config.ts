import { fileURLToPath } from "node:url"
import { storybookTest } from "@storybook/addon-vitest/vitest-plugin"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import { defineConfig } from "vitest/config"

const root = fileURLToPath(new URL(".", import.meta.url))
const STORY_FILE = /\.stories\.tsx$/

const IPHONE = {
  viewport: { width: 393, height: 659 },
  screen: { width: 393, height: 852 },
  deviceScaleFactor: 3,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_5 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/26.6 Mobile/15E148 Safari/604.1",
}

const PIXEL = {
  viewport: { width: 412, height: 839 },
  screen: { width: 412, height: 915 },
  deviceScaleFactor: 2.625,
  isMobile: true,
  hasTouch: true,
  userAgent:
    "Mozilla/5.0 (Linux; Android 14; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/153.0.8010.12 Mobile Safari/537.36",
}

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
    forceRerunTriggers: [
      "**/package.json/**",
      "**/{vitest,vite}.config.*/**",
      "**/styles/**",
      "**/packages/tailwind/**",
      "**/.storybook/**",
      "**/tests/*.ts",
    ],
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
      ...(process.env.PERF
        ? [
            {
              extends: true,
              plugins: [tailwindcss()],
              optimizeDeps: { entries: ["tests/perf/**/*.test.tsx"] },
              test: {
                name: "perf",
                include: ["tests/perf/**/*.test.tsx"],
                setupFiles: ["tests/setup.ts"],
                fileParallelism: false,
                testTimeout: 120_000,
                browser: browser("perf"),
              },
            },
          ]
        : []),
      {
        extends: true,
        plugins: [storybookTest({ configDir: ".storybook" })],
        test: {
          name: "stories",
          provide: { responsiveWidth: Number(process.env.WIDTH ?? 0) },
          maxWorkers: 4,
          sequence: { groupOrder: 2 },
          setupFiles: [
            "tests/setup.ts",
            "tests/stories-setup.ts",
            ...(process.env.RTL ? ["tests/rtl-setup.ts"] : []),
            ...(process.env.LONG_TEXT ? ["tests/long-text-setup.ts"] : []),
            ...(process.env.VISUAL ? ["tests/visual-setup.ts"] : []),
            ...(process.env.A11Y ? ["tests/a11y-setup.ts"] : []),
            ...(process.env.MOTION ? ["tests/motion-setup.ts"] : []),
            ...(process.env.TEXT ? ["tests/text-setup.ts"] : []),
            ...(process.env.MOBILE ? ["tests/mobile-setup.ts"] : []),
            ...(process.env.WIDTH ? ["tests/responsive-setup.ts"] : []),
          ],
          browser: {
            ...browser("stories"),
            ...(process.env.MOBILE && {
              instances: [
                {
                  browser: "webkit" as const,
                  name: "stories-iphone",
                  provider: playwright({ contextOptions: IPHONE }),
                },
                {
                  browser: "chromium" as const,
                  name: "stories-pixel",
                  provider: playwright({
                    launchOptions: { channel: "chrome" },
                    contextOptions: PIXEL,
                  }),
                },
              ],
            }),
            ...(process.env.BROWSERS && {
              instances: [
                { browser: "chromium" as const, name: "stories-chromium" },
                {
                  browser: "webkit" as const,
                  name: "stories-webkit",
                  provider: playwright(),
                },
                {
                  browser: "firefox" as const,
                  name: "stories-firefox",
                  provider: playwright(),
                },
              ],
            }),
            expect: {
              toMatchScreenshot: {
                comparatorName: "pixelmatch",
                comparatorOptions: { allowedMismatchedPixels: 10 },
                resolveScreenshotPath: ({ arg, ext, testFileName }) =>
                  `${root}tests/screenshots/${testFileName.replace(STORY_FILE, "")}/${arg}${ext}`,
              },
            },
          },
        },
      },
    ],
  },
})
