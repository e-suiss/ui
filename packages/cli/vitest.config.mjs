import { defineConfig } from "vitest/config"

export default defineConfig({
  test: {
    environment: "node",
    include: ["tests/**/*.test.mjs"],
    env: { npm_config_user_agent: "" },
  },
})
