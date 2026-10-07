import { afterEach, describe, expect, it, vi } from "vitest"
import { renderHook } from "vitest-browser-react"

let load = 0

async function loadOn(platform: string, userAgentPlatform?: string) {
  vi.stubGlobal("navigator", {
    platform,
    userAgentData:
      userAgentPlatform === undefined
        ? undefined
        : { platform: userAgentPlatform },
  })
  load++
  const module: typeof import("@/hooks/use-platform") = await import(
    /* @vite-ignore */ `/hooks/use-platform.ts?load=${load}`
  )
  return module
}

afterEach(() => {
  vi.unstubAllGlobals()
  vi.restoreAllMocks()
})

describe("isMacPlatform", () => {
  it.each([
    ["MacIntel", true],
    ["iPhone", true],
    ["iPad", true],
    ["Win32", false],
    ["Linux x86_64", false],
  ])("detects %s", async (platform, expected) => {
    const { isMacPlatform } = await loadOn(platform)
    expect(isMacPlatform()).toBe(expected)
  })

  it("prefers userAgentData when the browser provides it", async () => {
    const { isMacPlatform } = await loadOn("", "macOS")
    expect(isMacPlatform()).toBe(true)
  })
})

describe("useModifierKey", () => {
  it("shows the command symbol on a Mac", async () => {
    const { useModifierKey } = await loadOn("MacIntel")
    const { result } = await renderHook(() => useModifierKey())
    expect(result.current).toBe("⌘")
  })

  it("shows Ctrl elsewhere, with a plus sign when combined with a key", async () => {
    const { useModifierKey } = await loadOn("Win32")
    const plain = await renderHook(() => useModifierKey())
    const combined = await renderHook(() => useModifierKey(true))
    expect(plain.result.current).toBe("Ctrl")
    expect(combined.result.current).toBe("Ctrl+")
  })

  it("keeps the command symbol without a plus sign on a Mac", async () => {
    const { useModifierKey } = await loadOn("MacIntel")
    const { result } = await renderHook(() => useModifierKey(true))
    expect(result.current).toBe("⌘")
  })
})
