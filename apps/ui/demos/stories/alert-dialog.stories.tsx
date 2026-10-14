// @ts-nocheck
import { TrashIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogMedia,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"

const meta = {
  title: "Components/Alert Dialog",
  component: AlertDialog,
} satisfies Meta<typeof AlertDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Sign out
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Sign out of your account?</AlertDialogTitle>
          <AlertDialogDescription>
            You will need to sign in again to access your projects and settings.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction>Sign out</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Sign out" })

    await step("opens a named alert dialog and moves focus in", async () => {
      await userEvent.click(trigger)
      const dialog = await screen.findByRole("alertdialog", {
        name: "Sign out of your account?",
      })
      await expect(dialog).toHaveAccessibleDescription(
        "You will need to sign in again to access your projects and settings."
      )
      await waitFor(() =>
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step("closes from cancel and returns focus", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("closes with Escape", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("alertdialog")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders open and closes from the action", async () => {
      const dialog = await screen.findByRole("alertdialog", {
        name: "Sign out of your account?",
      })
      await waitFor(() => expect(dialog).toBeVisible())
      await userEvent.click(
        await screen.findByRole("button", { name: "Sign out" })
      )
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    })
  },
}

export const Small: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="outline" />}>
        Discard draft
      </AlertDialogTrigger>
      <AlertDialogContent size="sm">
        <AlertDialogHeader>
          <AlertDialogTitle>Discard draft?</AlertDialogTitle>
          <AlertDialogDescription>
            Your unsaved message will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Keep</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Discard</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ step }) => {
    await step("renders a named alert dialog open on mount", async () => {
      const dialog = await screen.findByRole("alertdialog", {
        name: "Discard draft?",
      })
      await waitFor(() => expect(dialog).toBeVisible())
      await expect(dialog).toHaveAccessibleDescription(
        "Your unsaved message will be lost."
      )
    })

    await step("closes from cancel", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Keep" }))
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    })
  },
}

export const WithMedia: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <AlertDialog {...args}>
      <AlertDialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogMedia className="bg-danger/10 text-danger">
            <TrashIcon />
          </AlertDialogMedia>
          <AlertDialogTitle>Delete this project?</AlertDialogTitle>
          <AlertDialogDescription>
            This permanently removes the project and all of its files. This
            action cannot be undone.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction variant="destructive">Delete</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  ),
  play: async ({ step }) => {
    await step("renders a named alert dialog with its media", async () => {
      const dialog = await screen.findByRole("alertdialog", {
        name: "Delete this project?",
      })
      await waitFor(() => expect(dialog).toBeVisible())
      await expect(
        dialog.querySelector('[data-slot="alert-dialog-media"] svg')
      ).toBeInTheDocument()
    })

    await step("closes from cancel", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Cancel" }))
      await waitFor(() => expect(screen.queryByRole("alertdialog")).toBeNull())
    })
  },
}
