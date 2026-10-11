// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Components/Dialog",
  component: Dialog,
} satisfies Meta<typeof Dialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit profile</DialogTitle>
          <DialogDescription>
            Update your name and username. Click save when you are done.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input id="name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="username">Username</Label>
            <Input id="username" defaultValue="@ada" />
          </div>
        </div>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>
            Cancel
          </DialogClose>
          <Button>Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" })

    await step("opens a named dialog and moves focus into it", async () => {
      await userEvent.click(trigger)
      const dialog = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(dialog).toHaveAccessibleDescription(
        "Update your name and username. Click save when you are done."
      )
      await waitFor(() =>
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step(
      "closes with Escape and returns focus to the trigger",
      async () => {
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
        await expect(trigger).toHaveFocus()
      }
    )

    await step("closes from the cancel button", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("button", { name: "Cancel" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders a named dialog open on mount", async () => {
      const dialog = await screen.findByRole("dialog", { name: "Edit profile" })
      await waitFor(() => expect(dialog).toBeVisible())
      await expect(dialog).toHaveAccessibleDescription(
        "Update your name and username. Click save when you are done."
      )
    })

    await step("closes with Escape", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const WithoutCloseButton: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="outline" />}>
        Show terms
      </DialogTrigger>
      <DialogContent showCloseButton={false}>
        <DialogHeader>
          <DialogTitle>Terms updated</DialogTitle>
          <DialogDescription>
            We have updated our terms of service. Please review the changes
            before continuing.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter showCloseButton>
          <Button>Accept</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async () => {
    const dialog = await screen.findByRole("dialog", { name: "Terms updated" })
    await expect(within(dialog).getAllByRole("button")).toHaveLength(2)
    await expect(
      within(dialog).getByRole("button", { name: "Accept" })
    ).toBeEnabled()
    await userEvent.click(within(dialog).getByRole("button", { name: "Close" }))
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  },
}

export const Destructive: Story = {
  render: (args) => (
    <Dialog {...args}>
      <DialogTrigger render={<Button variant="destructive" />}>
        Delete project
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete this project?</DialogTitle>
          <DialogDescription>
            This permanently removes the project and all of its deployments.
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose render={<Button variant="secondary" />}>
            Cancel
          </DialogClose>
          <Button variant="destructive">Delete</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Delete project" })
    await userEvent.click(trigger)
    const dialog = await screen.findByRole("dialog", {
      name: "Delete this project?",
    })
    await expect(
      within(dialog).getByRole("button", { name: "Delete" })
    ).toBeEnabled()
    await userEvent.click(
      within(dialog).getByRole("button", { name: "Cancel" })
    )
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await waitFor(() => expect(trigger).toHaveFocus())
  },
}
