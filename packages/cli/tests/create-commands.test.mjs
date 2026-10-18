import { describe, expect, it } from "vitest"

import {
  applyCommand,
  cliCommand,
  DEFAULT_STATE,
} from "../../../apps/ui/lib/create/options.ts"

const options = { pointer: false, rtl: false }

function state(overrides = {}) {
  return { ...DEFAULT_STATE, style: "nova", theme: "blue", ...overrides }
}

describe("create page commands", () => {
  it("names the base when a project is set up, so it can switch back", () => {
    for (const base of ["base", "radix", "aria"]) {
      expect(cliCommand(state({ base }), "npm", options)).toContain(
        `--base ${base}`
      )
    }
  })

  it("keeps --style out of Theme only on every platform", () => {
    for (const platform of ["web", "rn", "swift", "kotlin"]) {
      for (const style of ["nova", "suiss"]) {
        const command = applyCommand(state({ platform, style }), "theme", "npm")
        expect(command).not.toContain("--style")
        expect(command).toContain("--only theme")
      }
    }
  })

  it("still passes the own style to a full apply", () => {
    expect(applyCommand(state({ style: "suiss" }), "full", "npm")).toContain(
      "--style suiss"
    )
  })
})
