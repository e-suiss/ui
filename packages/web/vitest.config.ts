import { fileURLToPath } from "node:url"
import tailwindcss from "@tailwindcss/vite"
import { playwright } from "@vitest/browser-playwright"
import {
  defineConfig,
  type TestProjectInlineConfiguration,
} from "vitest/config"
import { resolveBase } from "./bases/resolve.ts"
import { iconPackages, swapIcons } from "./tests/icons.ts"

const root = fileURLToPath(new URL(".", import.meta.url))
const TEST_FILE = /\.test\.tsx$/
const STYLE = process.env.STYLE ?? "suiss"
const ICONS = process.env.ICONS
const SCREENSHOTS = ICONS ? `icons-${ICONS}` : STYLE

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
    provider: playwright({
      launchOptions: { channel: "chrome", args: ["--disable-lcd-text"] },
    }),
    instances: [{ browser: "chromium" as const, name }],
    viewport: { width: 1280, height: 800 },
  }
}

function examples(
  name: string,
  base?: "radix" | "aria"
): TestProjectInlineConfiguration {
  return {
    extends: true,
    plugins: [
      tailwindcss(),
      ...(base ? [resolveBase(root, base)] : []),
      ...(ICONS ? [swapIcons(ICONS)] : []),
    ],
    optimizeDeps: {
      entries: [
        "examples/*.tsx",
        "tests/examples/*.test.tsx",
        ...(base ? [`bases/${base}/**/*.tsx`] : []),
      ],
      include: ICONS ? iconPackages(ICONS) : [],
    },
    test: {
      name,
      include: ["tests/examples/*.test.tsx"],
      provide: {
        responsiveWidth: Number(process.env.WIDTH ?? 0),
        base: base ?? "base",
        style: STYLE,
      },
      maxWorkers: 4,
      sequence: { groupOrder: 2 },
      setupFiles: [
        "tests/setup.ts",
        "tests/examples-setup.ts",
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
        ...browser(name),
        ...(process.env.MOBILE && {
          instances: [
            {
              browser: "webkit" as const,
              name: `${name}-iphone`,
              provider: playwright({ contextOptions: IPHONE }),
            },
            {
              browser: "chromium" as const,
              name: `${name}-pixel`,
              provider: playwright({
                launchOptions: { channel: "chrome" },
                contextOptions: PIXEL,
              }),
            },
          ],
        }),
        ...(process.env.BROWSERS && {
          instances: [
            { browser: "chromium" as const, name: `${name}-chromium` },
            {
              browser: "webkit" as const,
              name: `${name}-webkit`,
              provider: playwright(),
            },
            {
              browser: "firefox" as const,
              name: `${name}-firefox`,
              provider: playwright(),
            },
          ],
        }),
        expect: {
          toMatchScreenshot: {
            comparatorName: "pixelmatch",
            comparatorOptions: { allowedMismatchedPixels: 10 },
            resolveScreenshotPath: ({ arg, ext, testFileName }) =>
              `${root}tests/screenshots/web/${base ?? "base"}/${SCREENSHOTS}/${testFileName.replace(TEST_FILE, "")}/${arg}${ext}`,
            resolveDiffPath: ({ arg, ext, testFileName }) =>
              `${root}.vitest/visual/${base ?? "base"}/${SCREENSHOTS}/${testFileName.replace(TEST_FILE, "")}/${arg}${ext}`,
          },
        },
      },
    },
  }
}

export default defineConfig({
  resolve: { alias: { "@": root } },
  test: {
    retry: process.env.CI ? 2 : 0,
    forceRerunTriggers: [
      "**/package.json/**",
      "**/{vitest,vite}.config.*/**",
      "**/styles/**",
      "**/tests/*.ts",
    ],
    projects: [
      {
        test: {
          name: "scripts",
          sequence: { groupOrder: 0 },
          environment: "node",
          include: ["tests/scripts/**/*.test.mjs"],
        },
      },
      {
        extends: true,
        plugins: [tailwindcss()],
        optimizeDeps: {
          entries: ["tests/{hooks,components,blocks}/**/*.test.tsx"],
          include: ["react-dom/server"],
        },
        test: {
          name: "browser",
          maxWorkers: 4,
          sequence: { groupOrder: 1 },
          include: ["tests/{hooks,components,blocks}/**/*.test.tsx"],
          setupFiles: ["tests/setup.ts", "tests/examples-setup.ts"],
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
      examples("examples"),
      examples("examples-radix", "radix"),
      examples("examples-aria", "aria"),
    ],
  },
})
