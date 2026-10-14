import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { BentoCloserLook } from "@/components/blocks/bento-closer-look"

const titles = [
  "Camera Control",
  "Fusion camera",
  "Aluminum body",
  "New colors",
]

const trigger = (name: string) => page.getByRole("button", { name })

const expanded = () =>
  titles.filter(
    (title) => trigger(title).element().getAttribute("aria-expanded") === "true"
  )

const activeImage = () =>
  document.querySelector<HTMLImageElement>("img[data-active]")?.alt

const pause = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

describe("BentoCloserLook", () => {
  it("opens the first feature with its photo", async () => {
    await render(<BentoCloserLook />)
    await expect
      .element(page.getByRole("heading", { name: "Take a closer look." }))
      .toBeVisible()
    await expect.poll(expanded).toEqual(["Camera Control"])
    await expect
      .element(page.getByText("A faster way to take photos.", { exact: false }))
      .toBeVisible()
    expect(activeImage()).toBe("An orange phone on a warm gradient")
    expect(document.querySelectorAll("img[aria-hidden=true]")).toHaveLength(3)
  })

  it("advances to the next feature on its own", async () => {
    await render(<BentoCloserLook />)
    await expect.poll(expanded).toEqual(["Camera Control"])
    await expect
      .poll(expanded, { timeout: 6000, interval: 100 })
      .toEqual(["Fusion camera"])
    expect(activeImage()).toBe("A camera lens lit in red and pink")
  })

  it("shows the picked feature and stops advancing", async () => {
    await render(<BentoCloserLook />)
    await trigger("Aluminum body").click()
    await expect.poll(expanded).toEqual(["Aluminum body"])
    await expect
      .poll(activeImage)
      .toBe("A silver phone on a light grey background")
    await expect
      .element(page.getByText("A unibody design", { exact: false }))
      .toBeVisible()
    await pause(4500)
    expect(expanded()).toEqual(["Aluminum body"])
  })

  it("keeps the open feature open when its trigger is pressed again", async () => {
    await render(<BentoCloserLook />)
    await trigger("New colors").click()
    await trigger("New colors").click()
    await expect.poll(expanded).toEqual(["New colors"])
    expect(activeImage()).toBe("Layered orange paper waves")
  })
})
