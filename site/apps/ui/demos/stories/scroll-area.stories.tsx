// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor } from "storybook/test"

import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"

const releases = Array.from({ length: 40 }, (_, index) => `v2.${40 - index}.0`)

const albums = [
  { title: "Morning Light", artist: "Nora Hale" },
  { title: "Open Roads", artist: "The Fieldnotes" },
  { title: "Paper Moons", artist: "Ivy Grant" },
  { title: "Low Tide", artist: "Harbor Lines" },
  { title: "Glass Garden", artist: "Mira Stone" },
  { title: "Northbound", artist: "Echo Park" },
  { title: "Slow Motion", artist: "Luca Reyes" },
]

const meta = {
  title: "Components/Scroll Area",
  component: ScrollArea,
} satisfies Meta<typeof ScrollArea>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ScrollArea className="h-72 w-48 rounded-2xl border" {...args}>
      <div className="p-4">
        <h4 className="mb-4 text-sm font-medium">Releases</h4>
        {releases.map((release) => (
          <div key={release}>
            <div className="text-sm">{release}</div>
            <Separator className="my-2" />
          </div>
        ))}
      </div>
    </ScrollArea>
  ),
  play: async ({ canvasElement, step }) => {
    const viewport = canvasElement.querySelector<HTMLElement>(
      '[data-slot="scroll-area-viewport"]'
    )

    await step("scrolls the overflowing list vertically", async () => {
      await expect(viewport).not.toBeNull()
      if (!viewport) return
      await expect(viewport.scrollHeight).toBeGreaterThan(viewport.clientHeight)
      viewport.scrollTop = viewport.scrollHeight
      await waitFor(() => expect(viewport.scrollTop).toBeGreaterThan(0))
    })

    await step("keeps the viewport reachable by keyboard", async () => {
      await userEvent.tab()
      await expect(viewport).toHaveFocus()
    })
  },
}

export const Horizontal: Story = {
  render: (args) => (
    <ScrollArea className="w-96 rounded-2xl border whitespace-nowrap" {...args}>
      <div className="flex w-max gap-4 p-4">
        {albums.map((album) => (
          <figure key={album.title} className="w-32 shrink-0">
            <div className="bg-surface-secondary aspect-square rounded-xl" />
            <figcaption className="text-label-secondary pt-2 text-xs">
              <span className="text-label font-medium">{album.title}</span>
              <br />
              {album.artist}
            </figcaption>
          </figure>
        ))}
      </div>
      <ScrollBar orientation="horizontal" />
    </ScrollArea>
  ),
  play: async ({ canvas, canvasElement, step }) => {
    await step("overflows horizontally with every album", async () => {
      const viewport = canvasElement.querySelector<HTMLElement>(
        '[data-slot="scroll-area-viewport"]'
      )
      await expect(viewport?.scrollWidth).toBeGreaterThan(
        viewport?.clientWidth ?? 0
      )
      await expect(canvas.getAllByRole("figure")).toHaveLength(7)
    })
  },
}
