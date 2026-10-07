import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { HeroCinematic } from "@/components/blocks/hero-cinematic"
import { HeroProduct } from "@/components/blocks/hero-product"
import { HeroTiles } from "@/components/blocks/hero-tiles"

const meta = {
  title: "Blocks/Hero",
  component: HeroProduct,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof HeroProduct>

export default meta

type Story = StoryObj<typeof meta>

export const Product: Story = {
  play: async ({ canvas, step }) => {
    await step("shows the product with its calls to action", async () => {
      await waitFor(() =>
        expect(
          canvas.getByRole("heading", { level: 1, name: "Phone Pro" })
        ).toBeVisible()
      )
      await expect(
        canvas.getByRole("button", { name: "Learn more" })
      ).toBeEnabled()
      await expect(canvas.getByRole("button", { name: "Buy" })).toBeEnabled()
      await expect(
        canvas.getByText("From $999 or $41.62/mo. for 24 mo.")
      ).toBeVisible()
    })
  },
}

export const Cinematic: Story = {
  render: () => <HeroCinematic />,
  play: async ({ canvas, canvasElement, step }) => {
    await step("picking a finish swaps the caption and photo", async () => {
      const finish = canvas.getByRole("group", { name: "Finish" })
      const silver = within(finish).getByRole("button", { name: "Silver" })
      await userEvent.click(silver)
      await expect(silver).toHaveAttribute("aria-pressed", "true")
      await expect(
        within(finish).getByRole("button", { name: "Cosmic Orange" })
      ).toHaveAttribute("aria-pressed", "false")
      await waitFor(() =>
        expect(
          canvasElement.querySelector("p[aria-live=polite]")
        ).toHaveTextContent("Silver")
      )
      await expect(
        canvas.getByRole("img", {
          name: "A silver phone on a light grey background",
        })
      ).toBeInTheDocument()
    })
  },
}

export const Tiles: Story = {
  render: () => <HeroTiles />,
  play: async ({ canvas, step }) => {
    await step("shows both tiles with their actions", async () => {
      for (const name of ["Book Air", "suissWatch"]) {
        const tile = canvas.getByRole("heading", { name }).closest("article")
        if (!(tile instanceof HTMLElement)) throw new Error(`Missing ${name}`)
        await expect(
          within(tile).getByRole("button", { name: "Learn more" })
        ).toBeEnabled()
        await expect(
          within(tile).getByRole("button", { name: "Buy" })
        ).toBeEnabled()
      }
    })
  },
}
