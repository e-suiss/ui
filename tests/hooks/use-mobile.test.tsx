import { afterEach, describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { renderHook } from "vitest-browser-react"

import { useIsMobile } from "@/hooks/use-mobile"

afterEach(async () => {
  await page.viewport(1280, 800)
})

describe("useIsMobile", () => {
  it("is false on a desktop viewport", async () => {
    const { result } = await renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
  })

  it("is true below 768px", async () => {
    await page.viewport(767, 800)
    const { result } = await renderHook(() => useIsMobile())
    await expect.poll(() => result.current).toBe(true)
  })

  it("treats exactly 768px as desktop", async () => {
    await page.viewport(768, 800)
    const { result } = await renderHook(() => useIsMobile())
    await expect.poll(() => result.current).toBe(false)
  })

  it("follows the viewport when it is resized", async () => {
    const { result } = await renderHook(() => useIsMobile())
    expect(result.current).toBe(false)
    await page.viewport(390, 800)
    await expect.poll(() => result.current).toBe(true)
    await page.viewport(1024, 800)
    await expect.poll(() => result.current).toBe(false)
  })
})
