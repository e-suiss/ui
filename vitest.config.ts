import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    projects: [
      {
        test: {
          name: "cli",
          environment: "node",
          include: ["tests/cli/**/*.test.mjs"],
        },
      },
    ],
  },
})
