// @ts-nocheck
import {
  CopyIcon,
  PencilSimpleIcon,
  ShareIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"

const meta = {
  title: "Patterns/Context Actions",
  component: ContextActions,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center p-4">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ContextActions>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContextActions {...args}>
      <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-label-secondary">
        Right click or long press
      </ContextActionsTrigger>
      <ContextActionsContent>
        <ContextActionsLabel>Photo.jpg</ContextActionsLabel>
        <ContextActionsItem>Edit</ContextActionsItem>
        <ContextActionsItem>Duplicate</ContextActionsItem>
        <ContextActionsItem>Share</ContextActionsItem>
        <ContextActionsSeparator />
        <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
      </ContextActionsContent>
    </ContextActions>
  ),
  play: async ({ canvas, step }) => {
    const target = canvas.getByText("Right click or long press")

    await step("right click opens the actions", async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target })
      await screen.findByRole("menu")
      await waitFor(() => expect(screen.getByText("Photo.jpg")).toBeVisible())
      await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
    })

    await step("Escape closes the actions", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })

    await step("arrow to an action and run it with Enter", async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target })
      const menu = await screen.findByRole("menu")
      await waitFor(() => expect(menu).toHaveFocus())
      await userEvent.keyboard("{ArrowDown}")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
      )
      await userEvent.keyboard("{Enter}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })

    await step("clicking an action closes the menu", async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target })
      await userEvent.click(
        await screen.findByRole("menuitem", { name: "Share" })
      )
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const WithIcons: Story = {
  render: (args) => (
    <ContextActions {...args}>
      <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm text-label-secondary">
        Right click or long press
      </ContextActionsTrigger>
      <ContextActionsContent>
        <ContextActionsItem>
          <PencilSimpleIcon />
          Edit
        </ContextActionsItem>
        <ContextActionsItem>
          <CopyIcon />
          Duplicate
        </ContextActionsItem>
        <ContextActionsItem>
          <ShareIcon />
          Share
        </ContextActionsItem>
        <ContextActionsSeparator />
        <ContextActionsItem variant="destructive">
          <TrashIcon />
          Delete
        </ContextActionsItem>
      </ContextActionsContent>
    </ContextActions>
  ),
  play: async ({ canvas, step }) => {
    const target = canvas.getByText("Right click or long press")

    await step("right click opens actions with icons", async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target })
      await screen.findByRole("menu")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: "Edit" })).toBeVisible()
      )
      const actions = screen.getAllByRole("menuitem")
      await expect(actions).toHaveLength(4)
      for (const action of actions) {
        await expect(action.querySelector("svg")).not.toBeNull()
      }
    })

    await step("clicking an action closes the menu", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: "Delete" }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const NotDismissible: Story = {
  ...Default,
  args: { dismissible: false },
}
