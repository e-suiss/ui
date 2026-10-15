import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import CarouselDemo from "@/examples/carousel-demo"
import CarouselFeatured from "@/examples/carousel-featured"
import CarouselGallery from "@/examples/carousel-gallery"
import CarouselLoop from "@/examples/carousel-loop"
import CarouselMultipleItems from "@/examples/carousel-multiple-items"
import CarouselShelf from "@/examples/carousel-shelf"
import CarouselShelfAutoplay from "@/examples/carousel-shelf-autoplay"
import CarouselSpotlight from "@/examples/carousel-spotlight"
import CarouselSpotlightAutoplay from "@/examples/carousel-spotlight-autoplay"
import CarouselTestimonials from "@/examples/carousel-testimonials"
import CarouselVertical from "@/examples/carousel-vertical"
import { renderExample } from "@/tests/render-example"

function trackOf(canvasElement: HTMLElement) {
  const track = canvasElement.querySelector<HTMLElement>(
    '[data-slot="carousel-content"] > div'
  )
  if (!track) throw new Error("carousel track not rendered")
  return track
}
function settledAtEnd(canvasElement: HTMLElement) {
  const viewport = canvasElement.querySelector('[data-slot="carousel-content"]')
  const last = canvasElement.querySelector(
    '[data-slot="carousel-item"]:last-child'
  )
  if (!viewport || !last) throw new Error("carousel slides not rendered")
  const edge = last.getBoundingClientRect()
  const frame = viewport.getBoundingClientRect()
  return Math.max(
    Math.abs(edge.right - frame.right),
    Math.abs(edge.bottom - frame.bottom)
  )
}
function offsetOf(track: HTMLElement) {
  const matrix = new DOMMatrix(getComputedStyle(track).transform)
  return { x: Math.round(matrix.m41) + 0, y: Math.round(matrix.m42) + 0 }
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<CarouselDemo />)

  const previous = canvas.getByRole("button", { name: "Previous slide" })
  const next = canvas.getByRole("button", { name: "Next slide" })

  await step("starts on the first of five slides", async () => {
    await expect(canvas.getByRole("region")).toHaveAttribute(
      "aria-roledescription",
      "carousel"
    )
    await expect(canvas.getAllByRole("group")).toHaveLength(5)
    await waitFor(() => expect(next).toBeEnabled())
    await expect(previous).toBeDisabled()
  })

  await step("advances with the next button", async () => {
    await userEvent.click(next)
    await waitFor(() => expect(previous).toBeEnabled())
  })

  await step("reaches the end with the arrow keys", async () => {
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}")
    await waitFor(() => expect(next).toBeDisabled())
    await expect(previous).toHaveFocus()
  })
})
test("Right To Left", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselDemo />,
    { direction: "rtl" }
  )

  const next = canvas.getByRole("button", { name: "Next slide" })
  const track = trackOf(canvasElement)

  await step("moves the track to the right for the next slide", async () => {
    await userEvent.click(next)
    await waitFor(() => expect(offsetOf(track).x).toBeGreaterThan(0))
  })

  await step("steps forward with the left arrow", async () => {
    const after = offsetOf(track).x
    canvas.getByRole("region").focus()
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(offsetOf(track).x).toBeGreaterThan(after))
  })
})
test("Multiple Items", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselMultipleItems />
  )

  const previous = canvas.getByRole("button", { name: "Previous slide" })
  const next = canvas.getByRole("button", { name: "Next slide" })
  const track = trackOf(canvasElement)

  await step("shows two slides at a time from the start", async () => {
    await expect(canvas.getAllByRole("group")).toHaveLength(5)
    await waitFor(() => expect(next).toBeEnabled())
    await expect(previous).toBeDisabled()
    await expect(offsetOf(track).x).toBe(0)
  })

  await step("moves the track with the next button", async () => {
    await userEvent.click(next)
    await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
    await expect(previous).toBeEnabled()
  })

  await step("disables next at the last slide", async () => {
    await userEvent.click(next)
    await userEvent.click(next)
    await waitFor(() => expect(next).toBeDisabled())
    await expect(previous).toHaveFocus()
    await waitFor(() =>
      expect(settledAtEnd(canvasElement)).toBeLessThanOrEqual(1.5)
    )
  })

  await step("moves back with the previous button", async () => {
    const end = offsetOf(track).x
    await userEvent.click(previous)
    await waitFor(() => expect(offsetOf(track).x).toBeGreaterThan(end))
    await expect(next).toBeEnabled()
  })
})
test("Loop", async () => {
  const { canvas } = await renderExample(<CarouselLoop />)

  await waitFor(() =>
    expect(canvas.getByRole("button", { name: "Previous slide" })).toBeEnabled()
  )
  await expect(canvas.getByRole("button", { name: "Next slide" })).toBeEnabled()
})
test("Vertical", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselVertical />
  )

  const previous = canvas.getByRole("button", { name: "Previous slide" })
  const next = canvas.getByRole("button", { name: "Next slide" })
  const track = trackOf(canvasElement)

  await step("places the controls above and below the track", async () => {
    await waitFor(() => expect(next).toBeEnabled())
    await expect(previous).toBeDisabled()
    const content = canvasElement
      .querySelector('[data-slot="carousel-content"]')
      ?.getBoundingClientRect()
    if (!content) throw new Error("carousel content not rendered")
    await expect(previous.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      content.top
    )
    await expect(next.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      content.bottom
    )
  })

  await step("moves the track up with the next button", async () => {
    await userEvent.click(next)
    await waitFor(() => expect(offsetOf(track).y).toBeLessThan(0))
    await expect(offsetOf(track).x).toBe(0)
    await expect(previous).toBeEnabled()
  })

  await step("disables next at the last slide", async () => {
    await userEvent.click(next)
    await userEvent.click(next)
    await waitFor(() => expect(next).toBeDisabled())
    await expect(previous).toHaveFocus()
    await waitFor(() =>
      expect(settledAtEnd(canvasElement)).toBeLessThanOrEqual(1.5)
    )
  })

  await step("returns to the start with the previous button", async () => {
    await userEvent.click(previous)
    await userEvent.click(previous)
    await userEvent.click(previous)
    await waitFor(() => expect(previous).toBeDisabled())
    await waitFor(() => expect(offsetOf(track).y).toBe(0))
  })

  await step(
    "moves with the up and down arrows, not left and right",
    async () => {
      next.focus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(Math.abs(offsetOf(track).y)).toBeLessThanOrEqual(1)
      await userEvent.keyboard("{ArrowDown}")
      await waitFor(() => expect(offsetOf(track).y).toBeLessThan(0))
      await userEvent.keyboard("{ArrowUp}")
      await waitFor(() => expect(offsetOf(track).y).toBe(0))
    }
  )
})
test("Featured", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselFeatured />
  )

  const track = trackOf(canvasElement)
  const first = await canvas.findByRole("button", { name: "Go to slide 1" })

  await step("shows a dot per slide without a play button", async () => {
    await expect(first).toHaveAttribute("aria-current", "true")
    await expect(
      canvas.queryByRole("button", { name: "Play slideshow" })
    ).toBeNull()
  })

  await step("takes taps around each small dot", async () => {
    const dot = canvas.getByRole("button", { name: "Go to slide 3" })
    const box = dot.getBoundingClientRect()
    const x = box.left + box.width / 2
    const y = box.top + box.height / 2
    await expect(document.elementFromPoint(x, y - 7)).toBe(dot)
    await expect(document.elementFromPoint(x, y + 7)).toBe(dot)
  })

  await step("moves the track to the chosen dot", async () => {
    const second = canvas.getByRole("button", { name: "Go to slide 2" })
    await userEvent.click(second)
    await waitFor(() => expect(second).toHaveAttribute("aria-current", "true"))
    await expect(first).not.toHaveAttribute("aria-current")
    await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
  })

  await step("returns to the start from the first dot", async () => {
    await userEvent.click(first)
    await waitFor(() => expect(first).toHaveAttribute("aria-current", "true"))
    await waitFor(() => expect(offsetOf(track).x).toBe(0))
  })
})
test("Spotlight", async () => {
  const { canvas, step } = await renderExample(<CarouselSpotlight />)

  const next = canvas.getByRole("button", { name: "Next slide" })
  const first = await canvas.findByRole("button", { name: "Go to slide 1" })
  const second = canvas.getByRole("button", { name: "Go to slide 2" })
  const third = canvas.getByRole("button", { name: "Go to slide 3" })

  await step("advances with the next button", async () => {
    await expect(first).toHaveAttribute("aria-current", "true")
    await userEvent.click(next)
    await waitFor(() => expect(second).toHaveAttribute("aria-current", "true"))
  })

  await step("jumps to a slide from its dot", async () => {
    await userEvent.click(third)
    await waitFor(() => expect(third).toHaveAttribute("aria-current", "true"))
  })

  await step("loops back to the first slide", async () => {
    await expect(next).toBeEnabled()
    await userEvent.click(next)
    await waitFor(() => expect(first).toHaveAttribute("aria-current", "true"))
  })
})
test("Shelf", async () => {
  const { canvas, canvasElement, step } = await renderExample(<CarouselShelf />)

  const track = trackOf(canvasElement)

  await step("shows the shelf without controls", async () => {
    await expect(canvas.getAllByRole("group")).toHaveLength(5)
    await expect(
      canvas.queryByRole("button", { name: "Next slide" })
    ).toBeNull()
    await expect(offsetOf(track).x).toBe(0)
  })

  await step("scrolls the shelf with the arrow keys", async () => {
    canvas.getByRole("region").focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(offsetOf(track).x).toBe(0))
  })
})
test("Testimonials", async () => {
  const { canvas, step } = await renderExample(<CarouselTestimonials />)

  const first = await canvas.findByRole("button", { name: "Go to slide 1" })

  await step("marks the current slide dot", async () => {
    await expect(first).toHaveAttribute("aria-current", "true")
    await expect(
      canvas.queryByRole("button", { name: "Pause slideshow" })
    ).toBeNull()
  })

  await step("jumps to a slide from its dot", async () => {
    const third = canvas.getByRole("button", { name: "Go to slide 3" })
    await userEvent.click(third)
    await waitFor(() => expect(third).toHaveAttribute("aria-current", "true"))
    await expect(first).not.toHaveAttribute("aria-current")
    await waitFor(() =>
      expect(canvas.getByRole("button", { name: "Next slide" })).toBeDisabled()
    )
  })
})
test("Gallery", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselGallery />
  )

  const previous = canvas.getByRole("button", { name: "Previous slide" })
  const next = canvas.getByRole("button", { name: "Next slide" })
  const track = trackOf(canvasElement)

  await step("starts at the first card", async () => {
    await waitFor(() => expect(next).toBeEnabled())
    await expect(previous).toBeDisabled()
    await expect(offsetOf(track).x).toBe(0)
  })

  await step("moves the track with the next button", async () => {
    await userEvent.click(next)
    await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
    await expect(previous).toBeEnabled()
  })

  await step("disables next at the last card", async () => {
    await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}")
    await waitFor(() => expect(next).toBeDisabled())
    await expect(previous).toHaveFocus()
    await waitFor(() =>
      expect(settledAtEnd(canvasElement)).toBeLessThanOrEqual(1.5)
    )
  })
})
test("Spotlight Autoplay", async () => {
  const { canvas, step } = await renderExample(<CarouselSpotlightAutoplay />)

  const toggle = await canvas.findByRole("button", {
    name: "Pause slideshow",
  })

  await step("hides the next button while autoplaying", async () => {
    await expect(
      canvas.queryByRole("button", { name: "Next slide" })
    ).toBeNull()
  })

  await step("pauses and resumes from the play button", async () => {
    await userEvent.click(toggle)
    await expect(toggle).toHaveAccessibleName("Play slideshow")
    await userEvent.click(toggle)
    await expect(toggle).toHaveAccessibleName("Pause slideshow")
  })
})
test("Shelf Autoplay", async () => {
  const { canvas, canvasElement, step } = await renderExample(
    <CarouselShelfAutoplay />
  )

  const track = trackOf(canvasElement)

  await step("shows the shelf without controls", async () => {
    await expect(canvas.getAllByRole("group")).toHaveLength(5)
    await expect(
      canvas.queryByRole("button", { name: "Next slide" })
    ).toBeNull()
    await expect(offsetOf(track).x).toBe(0)
  })

  await step("scrolls the shelf with the arrow keys", async () => {
    canvas.getByRole("region").focus()
    await userEvent.keyboard("{ArrowRight}")
    await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
    await userEvent.keyboard("{ArrowLeft}")
    await waitFor(() => expect(offsetOf(track).x).toBe(0))
  })
})
