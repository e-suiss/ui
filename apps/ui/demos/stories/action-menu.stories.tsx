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
  ActionMenu,
  ActionMenuContent,
  ActionMenuItem,
  ActionMenuLabel,
  ActionMenuSeparator,
  ActionMenuTrigger,
} from "@/components/patterns/action-menu"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Patterns/Action Menu",
  component: ActionMenu,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ActionMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ActionMenu {...args}>
      <ActionMenuTrigger render={<Button variant="outline" />}>
        Order actions
      </ActionMenuTrigger>
      <ActionMenuContent>
        <ActionMenuLabel>Order #1042</ActionMenuLabel>
        <ActionMenuItem>Edit</ActionMenuItem>
        <ActionMenuItem>Duplicate</ActionMenuItem>
        <ActionMenuItem>Share</ActionMenuItem>
        <ActionMenuSeparator />
        <ActionMenuItem variant="destructive">Delete</ActionMenuItem>
      </ActionMenuContent>
    </ActionMenu>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Order actions" })

    await step("opens a menu of actions from the trigger", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("menu")
      await waitFor(() => expect(screen.getByText("Order #1042")).toBeVisible())
      await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
    })

    await step("Escape closes and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("arrow to an action and run it with Enter", async () => {
      await userEvent.keyboard("{ArrowDown}")
      await screen.findByRole("menu")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
      )
      await userEvent.keyboard("{ArrowDown}")
      await expect(
        screen.getByRole("menuitem", { name: "Duplicate" })
      ).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("clicking an action closes the menu", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("menuitem", { name: "Delete" })
      )
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const WithIcons: Story = {
  render: (args) => (
    <ActionMenu {...args}>
      <ActionMenuTrigger render={<Button variant="outline" />}>
        Order actions
      </ActionMenuTrigger>
      <ActionMenuContent>
        <ActionMenuItem>
          <PencilSimpleIcon />
          Edit
        </ActionMenuItem>
        <ActionMenuItem>
          <CopyIcon />
          Duplicate
        </ActionMenuItem>
        <ActionMenuItem>
          <ShareIcon />
          Share
        </ActionMenuItem>
        <ActionMenuSeparator />
        <ActionMenuItem variant="destructive">
          <TrashIcon />
          Delete
        </ActionMenuItem>
      </ActionMenuContent>
    </ActionMenu>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Order actions" })

    await step("shows an icon beside every action", async () => {
      await userEvent.click(trigger)
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

    await step("arrow to an action and run it with Enter", async () => {
      await userEvent.keyboard("{ArrowDown}")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: "Edit" })).toHaveFocus()
      )
      await userEvent.keyboard("{ArrowDown}")
      await expect(
        screen.getByRole("menuitem", { name: "Duplicate" })
      ).toHaveFocus()
      await userEvent.keyboard("{Enter}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  },
}

export const NotDismissible: Story = {
  ...Default,
  args: { dismissible: false },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders open and closes when an action runs", async () => {
      await userEvent.click(
        await screen.findByRole("menuitem", { name: "Share" })
      )
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}
