import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, userEvent, waitFor, within } from "storybook/test"

import { EmptyBag } from "@/components/blocks/empty-bag"
import { EmptyOffline } from "@/components/blocks/empty-offline"
import { EmptySearch } from "@/components/blocks/empty-search"

const meta = {
  title: "Blocks/Empty",
  component: EmptySearch,
  parameters: { layout: "fullscreen" },
} satisfies Meta<typeof EmptySearch>

export default meta

type Story = StoryObj<typeof meta>

export const Search: Story = {
  play: async ({ canvas, step }) => {
    const search = canvas.getByRole("searchbox", { name: "Search suiss" })

    await step("typing a product name suggests matches", async () => {
      await expect(search).toHaveValue("book neo")
      await userEvent.clear(search)
      await userEvent.type(search, "book m")
      const suggested = await canvas.findByRole("navigation", {
        name: "Suggested",
      })
      await waitFor(() =>
        expect(within(suggested).getAllByRole("button")).toHaveLength(1)
      )
      await userEvent.click(
        within(suggested).getByRole("button", { name: "Book mini" })
      )
      await expect(search).toHaveValue("Book mini")
    })

    await step("clearing the search refocuses the field", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Clear search" })
      )
      await expect(search).toHaveValue("")
      await expect(search).toHaveFocus()
      await waitFor(() =>
        expect(canvas.getByText("What are you looking for?")).toBeVisible()
      )
    })
  },
}

export const Bag: Story = {
  render: () => <EmptyBag />,
  play: async ({ canvas, step }) => {
    await step("adding a recommendation fills the bag", async () => {
      await expect(canvas.getByText("Your bag is empty.")).toBeVisible()
      await userEvent.click(
        canvas.getByRole("button", { name: "Add Sport Band to bag" })
      )
      await expect(
        await canvas.findByText("There is 1 item in your bag.")
      ).toBeVisible()
      await expect(
        canvas.getByRole("button", { name: "Check Out" })
      ).toBeVisible()
    })

    await step("removing it empties the bag again", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Remove Sport Band from bag" })
      )
      await expect(await canvas.findByText("Your bag is empty.")).toBeVisible()
    })
  },
}

export const Offline: Story = {
  render: () => <EmptyOffline />,
  play: async ({ canvas, step }) => {
    await step("retrying connects and shows the library", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Try Again" }))
      await waitFor(
        () =>
          expect(
            canvas.getByRole("heading", { name: "suiss Music" })
          ).toBeVisible(),
        { timeout: 3000 }
      )
    })

    await step("disconnecting returns to the offline state", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Disconnect ›" })
      )
      await expect(
        await canvas.findByRole("button", { name: "Try Again" })
      ).toBeEnabled()
    })
  },
}
