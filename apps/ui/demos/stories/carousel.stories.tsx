// @ts-nocheck
import { CaretRightIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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

const slides = [1, 2, 3, 4, 5]

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

const meta = {
  title: "Components/Carousel",
  component: Carousel,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div
        className={
          parameters.wide ? "w-[min(56rem,calc(100vw-2rem))]" : "mx-12 w-72"
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Carousel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide}>
            <Card>
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-4xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvas, step }) => {
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
  },
}

export const RightToLeft: Story = {
  globals: { direction: "rtl" },
  render: Default.render,
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const MultipleItems: Story = {
  args: { opts: { align: "start" } },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <Card size="sm">
              <CardContent className="flex aspect-square items-center justify-center">
                <span className="text-3xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const Loop: Story = {
  args: { opts: { loop: true } },
  render: Default.render,
  play: async ({ canvas }) => {
    await waitFor(() =>
      expect(
        canvas.getByRole("button", { name: "Previous slide" })
      ).toBeEnabled()
    )
    await expect(
      canvas.getByRole("button", { name: "Next slide" })
    ).toBeEnabled()
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical", opts: { align: "start" } },
  decorators: [
    (Story) => (
      <div className="my-12">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent className="h-64">
        {slides.map((slide) => (
          <CarouselItem key={slide} className="basis-1/2">
            <Card size="sm" className="h-full justify-center">
              <CardContent className="flex items-center justify-center">
                <span className="text-3xl font-semibold">{slide}</span>
              </CardContent>
            </Card>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious />
      <CarouselNext />
    </Carousel>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

const features = [
  {
    eyebrow: "Point of sale",
    title: "Take orders at the table.",
    tint: "from-blue to-indigo",
  },
  {
    eyebrow: "Kitchen",
    title: "Every ticket, right on time.",
    tint: "from-orange to-red",
  },
  {
    eyebrow: "Reservations",
    title: "A full room, every night.",
    tint: "from-green to-teal",
  },
  {
    eyebrow: "Analytics",
    title: "Know what sells.",
    tint: "from-purple to-pink",
  },
  {
    eyebrow: "Payments",
    title: "Split the bill in seconds.",
    tint: "from-cyan to-blue",
  },
]

const picks = [
  {
    eyebrow: "Today's pick",
    title: "Weekend breakfast",
    tint: "from-orange to-red",
  },
  { eyebrow: "New", title: "Grilled meatballs", tint: "from-red to-pink" },
  {
    eyebrow: "Chef's special",
    title: "Lentil soup",
    tint: "from-green to-teal",
  },
  { eyebrow: "Dessert", title: "Künefe", tint: "from-purple to-indigo" },
]

const popular = [
  { name: "Breakfast platter", price: "₺620", tint: "from-orange to-red" },
  { name: "Grilled meatballs", price: "₺280", tint: "from-red to-pink" },
  { name: "Menemen", price: "₺160", tint: "from-yellow to-orange" },
  { name: "Lentil soup", price: "₺90", tint: "from-green to-teal" },
  { name: "Künefe", price: "₺160", tint: "from-purple to-indigo" },
]

const quotes = [
  { quote: "The checkout line is half as long.", author: "Ayşe Y. · Kadıköy" },
  {
    quote: "The kitchen finally keeps up on Fridays.",
    author: "Mert K. · Beşiktaş",
  },
  { quote: "Splitting the bill takes seconds now.", author: "Deniz A. · Moda" },
]

export const Featured: Story = {
  parameters: { wide: true },
  args: { opts: { align: "start" } },
  render: (args) => (
    <div className="max-w-sm">
      <Carousel {...args}>
        <CarouselContent>
          {picks.map((pick) => (
            <CarouselItem key={pick.title} className="basis-[88%]">
              <div
                className={`relative isolate flex aspect-4/5 flex-col gap-1 overflow-hidden rounded-3xl bg-linear-to-br p-5 text-white before:absolute before:inset-0 before:-z-10 before:bg-linear-to-b before:from-black/45 before:to-black/10 ${pick.tint}`}
              >
                <p className="text-xs font-semibold uppercase">
                  {pick.eyebrow}
                </p>
                <p className="text-2xl font-bold tracking-tight">
                  {pick.title}
                </p>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselControls className="mt-4 justify-center">
          <CarouselDots variant="plain" />
          <CarouselPlayButton variant="ghost" />
        </CarouselControls>
      </Carousel>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
      await waitFor(() =>
        expect(second).toHaveAttribute("aria-current", "true")
      )
      await expect(first).not.toHaveAttribute("aria-current")
      await waitFor(() => expect(offsetOf(track).x).toBeLessThan(0))
    })

    await step("returns to the start from the first dot", async () => {
      await userEvent.click(first)
      await waitFor(() => expect(first).toHaveAttribute("aria-current", "true"))
      await waitFor(() => expect(offsetOf(track).x).toBe(0))
    })
  },
}

export const Spotlight: Story = {
  parameters: { wide: true },
  args: { opts: { loop: true } },
  render: (args) => (
    <div className="max-w-md">
      <Carousel {...args}>
        <CarouselContent>
          {features.slice(0, 3).map((feature) => (
            <CarouselItem key={feature.title}>
              <div className="flex aspect-10/7 flex-col items-center justify-center gap-3 rounded-3xl bg-surface-secondary p-8 text-center">
                <p className="text-3xl font-bold tracking-tight">Hestia POS</p>
                <p className="text-label-secondary">{feature.title}</p>
                <Button
                  size="sm"
                  className="mt-2 bg-label text-surface hover:bg-label/85"
                >
                  Learn more
                </Button>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselControls className="justify-center">
          <CarouselDots />
          <CarouselPlayButton />
          {!args.autoplay && <CarouselNext size="icon-sm" />}
        </CarouselControls>
      </Carousel>
    </div>
  ),
  play: async ({ canvas, step }) => {
    const next = canvas.getByRole("button", { name: "Next slide" })
    const first = await canvas.findByRole("button", { name: "Go to slide 1" })
    const second = canvas.getByRole("button", { name: "Go to slide 2" })
    const third = canvas.getByRole("button", { name: "Go to slide 3" })

    await step("advances with the next button", async () => {
      await expect(first).toHaveAttribute("aria-current", "true")
      await userEvent.click(next)
      await waitFor(() =>
        expect(second).toHaveAttribute("aria-current", "true")
      )
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
  },
}

export const Shelf: Story = {
  parameters: { wide: true },
  args: { opts: { align: "start", dragFree: true } },
  render: (args) => (
    <div className="max-w-md">
      <Carousel {...args}>
        <div className="mb-3 flex items-center justify-between">
          <a
            href="#popular"
            className="flex items-center gap-1 text-xl font-bold tracking-tight"
          >
            Popular
            <CaretRightIcon weight="bold" className="size-4" />
          </a>
          <div className="flex items-center gap-3">
            <CarouselPlayButton variant="ghost" />
            <a href="#popular-all" className="text-link">
              See all
            </a>
          </div>
        </div>
        <CarouselContent className="-ms-3">
          {popular.map((item) => (
            <CarouselItem key={item.name} className="basis-2/5 ps-3">
              <div
                className={`aspect-square rounded-2xl bg-linear-to-br ${item.tint}`}
              />
              <p className="mt-2 truncate text-sm font-semibold">{item.name}</p>
              <p className="text-xs text-label-secondary tabular-nums">
                {item.price}
              </p>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
  },
}

export const Testimonials: Story = {
  parameters: { wide: true },
  render: (args) => (
    <div className="max-w-md rounded-3xl bg-surface-secondary p-8">
      <Carousel {...args}>
        <CarouselContent>
          {quotes.map((item) => (
            <CarouselItem key={item.quote}>
              <blockquote className="flex min-h-28 flex-col gap-3">
                <p className="text-2xl font-bold tracking-tight">
                  “{item.quote}”
                </p>
                <footer className="text-label-secondary">{item.author}</footer>
              </blockquote>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselControls className="justify-between">
          <div className="flex items-center gap-2">
            <CarouselPlayButton variant="ghost" />
            <CarouselDots variant="plain" />
          </div>
          <div className="flex gap-3">
            <CarouselPrevious size="icon-lg" />
            <CarouselNext size="icon-lg" />
          </div>
        </CarouselControls>
      </Carousel>
    </div>
  ),
  play: async ({ canvas, step }) => {
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
        expect(
          canvas.getByRole("button", { name: "Next slide" })
        ).toBeDisabled()
      )
    })
  },
}

export const Gallery: Story = {
  parameters: { wide: true },
  args: { opts: { align: "start" } },
  render: (args) => (
    <Carousel {...args}>
      <CarouselContent>
        {features.map((feature) => (
          <CarouselItem key={feature.title} className="basis-4/5 sm:basis-2/5">
            <div
              className={`relative isolate flex aspect-3/4 flex-col gap-2 overflow-hidden rounded-3xl bg-linear-to-b p-7 text-white before:absolute before:inset-0 before:-z-10 before:bg-black/35 ${feature.tint}`}
            >
              <p className="text-sm font-semibold">{feature.eyebrow}</p>
              <p className="text-2xl font-semibold">{feature.title}</p>
            </div>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselControls className="justify-end">
        <CarouselPrevious />
        <CarouselNext />
      </CarouselControls>
    </Carousel>
  ),
  play: async ({ canvas, canvasElement, step }) => {
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
      await userEvent.keyboard(
        "{ArrowRight}{ArrowRight}{ArrowRight}{ArrowRight}"
      )
      await waitFor(() => expect(next).toBeDisabled())
      await expect(previous).toHaveFocus()
      await waitFor(() =>
        expect(settledAtEnd(canvasElement)).toBeLessThanOrEqual(1.5)
      )
    })
  },
}

export const FeaturedAutoplay: Story = {
  parameters: Featured.parameters,
  render: Featured.render,
  args: {
    ...Featured.args,
    autoplay: 4000,
    opts: { align: "start", loop: true },
  },
}

export const SpotlightAutoplay: Story = {
  ...Spotlight,
  args: { ...Spotlight.args, autoplay: true },
  play: async ({ canvas, step }) => {
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
  },
}

export const ShelfAutoplay: Story = {
  ...Shelf,
  args: { autoplay: 3000, opts: { align: "start", loop: true } },
}

export const TestimonialsAutoplay: Story = {
  parameters: Testimonials.parameters,
  render: Testimonials.render,
  args: { autoplay: 6000, opts: { loop: true } },
}
