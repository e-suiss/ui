import { fileURLToPath } from "node:url"
import { defineConfig } from "vitest/config"

export default defineConfig({
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("../../apps/ui", import.meta.url)),
    },
  },
  test: {
    environment: "node",
    include: ["tests/**/*.test.mjs"],
    env: { npm_config_user_agent: "" },
  },
})
