import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  Carousel,
  CarouselContent,
  CarouselControls,
  CarouselDots,
  CarouselItem,
  CarouselNext,
  CarouselPlayButton,
  CarouselPrevious,
} from "@/components/ui/carousel"

const DOT = /^Go to slide/
const SLIDESHOW = /slideshow/

const SLIDES = ["Breakfast", "Lunch", "Dinner"]

function Slides({ autoplay }: { autoplay?: boolean | number }) {
  return (
    <div className="flex flex-col items-start gap-8 p-16">
      <button type="button">Outside</button>
      <div className="mx-12 w-72">
        <Carousel aria-label="Menu" autoplay={autoplay}>
          <CarouselContent>
            {SLIDES.map((slide) => (
              <CarouselItem key={slide} aria-label={slide}>
                <div className="flex aspect-square items-center justify-center rounded-2xl bg-surface-secondary">
                  {slide}
                </div>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
          <CarouselControls>
            <CarouselDots />
            <CarouselPlayButton />
          </CarouselControls>
        </Carousel>
      </div>
    </div>
  )
}

const carousel = () => page.getByRole("region", { name: "Menu" })
const previous = () => page.getByRole("button", { name: "Previous slide" })
const next = () => page.getByRole("button", { name: "Next slide" })
const dot = (index: number) =>
  page.getByRole("button", { name: `Go to slide ${index}` })
const outside = () => page.getByRole("button", { name: "Outside" })

const current = () =>
  page
    .getByRole("button", { name: DOT })
    .elements()
    .findIndex((element) => element.getAttribute("aria-current") === "true") + 1

function shown() {
  const viewport = document
    .querySelector("[data-slot=carousel-content]")
    ?.getBoundingClientRect()
  if (!viewport) return ""
  const slides = page.getByRole("group").elements()
  const distance = (slide: Element) =>
    Math.abs(slide.getBoundingClientRect().left + 16 - viewport.left)
  const closest = slides.reduce<Element | undefined>(
    (best, slide) => (best && distance(best) <= distance(slide) ? best : slide),
    undefined
  )
  return closest?.getAttribute("aria-label") ?? ""
}

async function renderSlides(autoplay?: boolean | number) {
  const screen = await render(<Slides autoplay={autoplay} />)
  await outside().hover()
  return screen
}

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

function setHidden(hidden: boolean) {
  if (hidden) {
    Object.defineProperty(document, "visibilityState", {
      configurable: true,
      get: () => "hidden",
    })
  } else {
    Reflect.deleteProperty(document, "visibilityState")
  }
  document.dispatchEvent(new Event("visibilitychange"))
}

function reduceMotion() {
  const original = window.matchMedia.bind(window)
  vi.spyOn(window, "matchMedia").mockImplementation((query: string) =>
    query.includes("prefers-reduced-motion")
      ? original("(min-width: 0px)")
      : original(query)
  )
}

afterEach(() => {
  vi.restoreAllMocks()
  Reflect.deleteProperty(document, "visibilityState")
})

describe("Carousel navigation", () => {
  it("keeps keyboard focus when next disables on the last slide", async () => {
    await renderSlides()
    next().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.poll(current).toBe(2)
    await userEvent.keyboard("{Enter}")
    await expect.poll(current).toBe(3)
    await expect.element(next()).toBeDisabled()
    await expect.element(previous()).toHaveFocus()
    await userEvent.keyboard("{ArrowLeft}")
    await expect.poll(current).toBe(2)
  })

  it("keeps keyboard focus when previous disables on the first slide", async () => {
    await renderSlides()
    await dot(2).click()
    await expect.poll(current).toBe(2)
    previous().element().focus()
    await userEvent.keyboard("{Enter}")
    await expect.poll(current).toBe(1)
    await expect.element(next()).toHaveFocus()
  })

  it("falls back to the carousel when the other control is missing", async () => {
    await render(
      <Carousel aria-label="Menu">
        <CarouselContent>
          {SLIDES.map((slide) => (
            <CarouselItem key={slide} aria-label={slide}>
              <div className="aspect-square w-72">{slide}</div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselControls>
          <CarouselNext />
        </CarouselControls>
      </Carousel>
    )
    next().element().focus()
    await userEvent.keyboard("{Enter}")
    await userEvent.keyboard("{Enter}")
    await expect.element(next()).toBeDisabled()
    await expect.element(carousel()).toHaveFocus()
  })

  it("starts on the first slide with only next enabled", async () => {
    await renderSlides()
    await expect
      .element(carousel())
      .toHaveAttribute("aria-roledescription", "carousel")
    await expect.element(next()).toBeEnabled()
    await expect.element(previous()).toBeDisabled()
    expect(page.getByRole("group").elements()).toHaveLength(3)
    expect(current()).toBe(1)
    expect(shown()).toBe("Breakfast")
  })

  it("moves with the buttons and disables them at the ends", async () => {
    await renderSlides()
    await next().click()
    await expect.poll(current).toBe(2)
    await expect.element(previous()).toBeEnabled()
    await expect.poll(shown).toBe("Lunch")
    await next().click()
    await expect.poll(current).toBe(3)
    await expect.element(next()).toBeDisabled()
    await expect.poll(shown).toBe("Dinner")
    await previous().click()
    await expect.poll(current).toBe(2)
    await expect.element(next()).toBeEnabled()
    await expect.poll(shown).toBe("Lunch")
  })

  it("does not loop past the last slide", async () => {
    await renderSlides()
    await dot(3).click()
    await expect.poll(current).toBe(3)
    await userEvent.keyboard("{ArrowRight}")
    await wait(300)
    expect(current()).toBe(3)
    await expect.poll(shown).toBe("Dinner")
  })

  it("moves with the arrow keys", async () => {
    await renderSlides()
    await dot(1).click()
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(current).toBe(2)
    await userEvent.keyboard("{ArrowRight}")
    await expect.poll(current).toBe(3)
    await userEvent.keyboard("{ArrowLeft}")
    await userEvent.keyboard("{ArrowLeft}")
    await expect.poll(current).toBe(1)
    await expect.poll(shown).toBe("Breakfast")
  })

  it("renders a dot per slide that reflects and sets the selection", async () => {
    await renderSlides()
    await expect.element(dot(1)).toHaveAttribute("aria-current", "true")
    await expect.element(dot(2)).not.toHaveAttribute("aria-current")
    await dot(3).click()
    await expect.element(dot(3)).toHaveAttribute("aria-current", "true")
    await expect.element(dot(1)).not.toHaveAttribute("aria-current")
    await expect.element(next()).toBeDisabled()
    await expect.poll(shown).toBe("Dinner")
    await previous().click()
    await expect.element(dot(2)).toHaveAttribute("aria-current", "true")
  })

  it("hides the play button without autoplay", async () => {
    await renderSlides()
    await expect.element(dot(1)).toBeVisible()
    await expect
      .element(page.getByRole("button", { name: SLIDESHOW }))
      .not.toBeInTheDocument()
    await wait(400)
    expect(current()).toBe(1)
  })
})

describe("Carousel autoplay", () => {
  it("advances after the interval and wraps to the first slide", async () => {
    await renderSlides(300)
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(2)
    await expect.poll(current).toBe(3)
    await expect.poll(current).toBe(1)
    await expect.poll(shown).toBe("Breakfast")
  })

  it("waits for the full interval before advancing", async () => {
    await renderSlides(800)
    await wait(500)
    expect(current()).toBe(1)
    await expect.poll(current).toBe(2)
  })

  it("pauses while hovered and resumes after", async () => {
    await renderSlides(300)
    await carousel().hover()
    await expect.element(carousel()).not.toHaveAttribute("data-playing")
    await wait(900)
    expect(current()).toBe(1)
    await outside().hover()
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(2)
  })

  it("pauses while keyboard focus is inside and resumes on blur", async () => {
    await renderSlides(300)
    outside().element().focus()
    await userEvent.tab()
    await expect.element(next()).toHaveFocus()
    await expect.element(carousel()).not.toHaveAttribute("data-playing")
    await wait(900)
    expect(current()).toBe(1)
    await userEvent.tab()
    await expect.element(dot(1)).toHaveFocus()
    await wait(600)
    expect(current()).toBe(1)
    await userEvent.tab({ shift: true })
    await userEvent.tab({ shift: true })
    await expect.element(outside()).toHaveFocus()
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(2)
  })

  it("keeps playing when a control is clicked with the mouse", async () => {
    await renderSlides(300)
    await dot(2).click()
    await expect.poll(current).toBe(2)
    await outside().hover()
    await expect.element(dot(2)).toHaveFocus()
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(3)
  })

  it("pauses while the tab is hidden and resumes when visible", async () => {
    await renderSlides(300)
    await expect.element(carousel()).toHaveAttribute("data-playing")
    setHidden(true)
    await expect.element(carousel()).not.toHaveAttribute("data-playing")
    await wait(900)
    expect(current()).toBe(1)
    setHidden(false)
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(2)
  })

  it("does not autoplay when reduced motion is preferred", async () => {
    reduceMotion()
    await renderSlides(300)
    await expect
      .element(page.getByRole("button", { name: "Play slideshow" }))
      .toBeVisible()
    await expect.element(carousel()).not.toHaveAttribute("data-playing")
    await wait(900)
    expect(current()).toBe(1)
  })

  it("toggles with the play button", async () => {
    await renderSlides(300)
    await page.getByRole("button", { name: "Pause slideshow" }).click()
    await outside().hover()
    await expect
      .element(page.getByRole("button", { name: "Play slideshow" }))
      .toBeVisible()
    await expect.element(carousel()).not.toHaveAttribute("data-playing")
    const paused = current()
    await wait(900)
    expect(current()).toBe(paused)
    await page.getByRole("button", { name: "Play slideshow" }).click()
    await outside().hover()
    await expect
      .element(page.getByRole("button", { name: "Pause slideshow" }))
      .toBeVisible()
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).not.toBe(paused)
  })

  it("lets the play button start a reduced-motion carousel", async () => {
    reduceMotion()
    await renderSlides(300)
    await page.getByRole("button", { name: "Play slideshow" }).click()
    await outside().hover()
    await expect.element(carousel()).toHaveAttribute("data-playing")
    await expect.poll(current).toBe(2)
  })
})
