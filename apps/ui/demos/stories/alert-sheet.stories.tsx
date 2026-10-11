// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  AlertSheet,
  AlertSheetAction,
  AlertSheetCancel,
  AlertSheetContent,
  AlertSheetDescription,
  AlertSheetGroup,
  AlertSheetHeader,
  AlertSheetTitle,
  AlertSheetTrigger,
} from "@/components/ui/alert-sheet"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Alert Sheet",
  component: AlertSheet,
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
} satisfies Meta<typeof AlertSheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AlertSheet {...args}>
      <AlertSheetTrigger render={<Button variant="outline" />}>
        Delete order
      </AlertSheetTrigger>
      <AlertSheetContent>
        <AlertSheetGroup>
          <AlertSheetHeader>
            <AlertSheetTitle className="sr-only">Delete order</AlertSheetTitle>
            <AlertSheetDescription>
              Order #1042 will be permanently deleted. This action cannot be
              undone.
            </AlertSheetDescription>
          </AlertSheetHeader>
          <AlertSheetAction variant="destructive">
            Delete Order
          </AlertSheetAction>
        </AlertSheetGroup>
        <AlertSheetCancel>Cancel</AlertSheetCancel>
      </AlertSheetContent>
    </AlertSheet>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Delete order" })

    await step("opens a named sheet with focus on cancel", async () => {
      await userEvent.click(trigger)
      const sheet = await screen.findByRole("dialog", { name: "Delete order" })
      await expect(sheet).toHaveAccessibleDescription(
        "Order #1042 will be permanently deleted. This action cannot be undone."
      )
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
      )
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("closes from the action", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("button", { name: "Delete Order" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders a named sheet open on mount", async () => {
      const sheet = await screen.findByRole("dialog", { name: "Delete order" })
      await waitFor(() => expect(sheet).toBeVisible())
      await waitFor(() =>
        expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
      )
    })

    await step("closes from cancel", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const NotDismissible: Story = {
  args: { dismissible: false },
  render: Default.render,
  play: async ({ canvas, step }) => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete order" }))

    await step("opens as an alert dialog", async () => {
      await expect(
        await screen.findByRole("alertdialog", { name: "Delete order" })
      ).toBeVisible()
    })

    await step("closes from cancel", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    })
  },
}

export const WithTitle: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertSheet {...args}>
      <AlertSheetTrigger render={<Button variant="outline" />}>
        Sign out
      </AlertSheetTrigger>
      <AlertSheetContent>
        <AlertSheetGroup>
          <AlertSheetHeader>
            <AlertSheetTitle>Sign out of your account?</AlertSheetTitle>
            <AlertSheetDescription>
              You will need to sign in again to access your projects.
            </AlertSheetDescription>
          </AlertSheetHeader>
          <AlertSheetAction variant="destructive">Sign Out</AlertSheetAction>
        </AlertSheetGroup>
        <AlertSheetCancel>Cancel</AlertSheetCancel>
      </AlertSheetContent>
    </AlertSheet>
  ),
  play: async ({ step }) => {
    await step("names the sheet from its visible title", async () => {
      const sheet = await screen.findByRole("dialog", {
        name: "Sign out of your account?",
      })
      await expect(sheet).toHaveAccessibleDescription(
        "You will need to sign in again to access your projects."
      )
      await expect(screen.getByText("Sign out of your account?")).toBeVisible()
    })

    await step("closes from the action", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Sign Out" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const MultipleActions: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertSheet {...args}>
      <AlertSheetTrigger render={<Button variant="outline" />}>
        Close draft
      </AlertSheetTrigger>
      <AlertSheetContent>
        <AlertSheetGroup>
          <AlertSheetHeader>
            <AlertSheetTitle>Save changes to this draft?</AlertSheetTitle>
          </AlertSheetHeader>
          <AlertSheetAction>Save Draft</AlertSheetAction>
          <AlertSheetAction variant="destructive">
            Delete Draft
          </AlertSheetAction>
        </AlertSheetGroup>
        <AlertSheetCancel>Cancel</AlertSheetCancel>
      </AlertSheetContent>
    </AlertSheet>
  ),
  play: async () => {
    const sheet = await screen.findByRole("dialog", {
      name: "Save changes to this draft?",
    })
    await expect(sheet).toContainElement(
      screen.getByRole("button", { name: "Save Draft" })
    )
    await expect(sheet).toContainElement(
      screen.getByRole("button", { name: "Delete Draft" })
    )
    await waitFor(() =>
      expect(screen.getByRole("button", { name: "Cancel" })).toHaveFocus()
    )
  },
}
