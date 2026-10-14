import { describe, expect, it } from "vitest"
import { page } from "vitest/browser"
import { render } from "vitest-browser-react"

import { HeroCinematic } from "@/components/blocks/hero-cinematic"

const finishes = [
  {
    label: "Cosmic Orange",
    alt: "An orange phone on a warm gradient",
    color: "var(--orange)",
  },
  {
    label: "Deep Graphite",
    alt: "A dark textured surface with soft light",
    color: "var(--gray)",
  },
  {
    label: "Silver",
    alt: "A silver phone on a light grey background",
    color: "var(--label)",
  },
]

const swatch = (name: string) =>
  page.getByRole("group", { name: "Finish" }).getByRole("button", { name })
const caption = () =>
  document.querySelector<HTMLElement>("p[aria-live=polite]")?.textContent
const section = () => {
  const node = document.querySelector<HTMLElement>("section")
  if (!node) throw new Error("hero not rendered")
  return node
}

function shown() {
  return Array.from(
    document.querySelectorAll<HTMLImageElement>("img[data-active]"),
    (image) => image.alt
  )
}

describe("HeroCinematic", () => {
  it("opens on the cosmic orange finish", async () => {
    await render(<HeroCinematic />)
    await expect
      .element(page.getByRole("heading", { name: "Pro." }))
      .toBeVisible()
    await expect.poll(caption).toBe("Cosmic Orange")
    expect(shown()).toEqual([finishes[0]?.alt])
    await expect
      .element(swatch("Cosmic Orange"))
      .toHaveAttribute("aria-pressed", "true")
    expect(page.getByRole("img").elements()).toHaveLength(1)
    await expect
      .element(page.getByRole("img", { name: finishes[0]?.alt }))
      .toBeInTheDocument()
    expect(section().style.getPropertyValue("--finish")).toBe("var(--orange)")
  })

  it.each(finishes)("switches the product to $label", async (finish) => {
    await render(<HeroCinematic />)
    await swatch(finish.label).click()
    await expect.poll(caption).toBe(finish.label)
    expect(shown()).toEqual([finish.alt])
    await expect
      .element(swatch(finish.label))
      .toHaveAttribute("aria-pressed", "true")
    expect(page.getByRole("img").elements()).toHaveLength(1)
    await expect
      .element(page.getByRole("img", { name: finish.alt }))
      .toBeInTheDocument()
    expect(section().style.getPropertyValue("--finish")).toBe(finish.color)
    for (const other of finishes.filter((item) => item !== finish)) {
      await expect
        .element(swatch(other.label))
        .toHaveAttribute("aria-pressed", "false")
    }
  })

  it("fades the chosen image in and the others out", async () => {
    await render(<HeroCinematic />)
    await swatch("Silver").click()
    const opacity = (alt: string) => {
      const image = document.querySelector<HTMLImageElement>(
        `img[alt="${alt}"]`
      )
      return image ? Number(getComputedStyle(image).opacity) : -1
    }
    await expect.poll(() => opacity(finishes[2]?.alt ?? "")).toBe(1)
    await expect.poll(() => opacity(finishes[0]?.alt ?? "")).toBe(0)
  })

  it("keeps the finish when its swatch is pressed again", async () => {
    await render(<HeroCinematic />)
    await swatch("Deep Graphite").click()
    await expect.poll(caption).toBe("Deep Graphite")
    await swatch("Deep Graphite").click()
    await expect
      .element(swatch("Deep Graphite"))
      .toHaveAttribute("aria-pressed", "true")
    expect(caption()).toBe("Deep Graphite")
    expect(shown()).toEqual([finishes[1]?.alt])
  })
})
