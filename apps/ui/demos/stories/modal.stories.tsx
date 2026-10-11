// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Modal,
  ModalBody,
  ModalClose,
  ModalContent,
  ModalDescription,
  ModalFooter,
  ModalHeader,
  ModalTitle,
  ModalTrigger,
} from "@/components/patterns/modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Patterns/Modal",
  component: Modal,
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
} satisfies Meta<typeof Modal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger render={<Button variant="outline" />}>
        Edit profile
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Edit profile</ModalTitle>
          <ModalDescription>
            Update your name and username. Click save when you are done.
          </ModalDescription>
        </ModalHeader>
        <ModalBody className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="modal-name">Name</Label>
            <Input id="modal-name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="modal-username">Username</Label>
            <Input id="modal-username" defaultValue="@ada" />
          </div>
        </ModalBody>
        <ModalFooter>
          <ModalClose render={<Button variant="secondary" />}>
            Cancel
          </ModalClose>
          <Button>Save changes</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" })

    await step("opens a named modal with its form", async () => {
      await userEvent.click(trigger)
      const modal = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(modal).toHaveAccessibleDescription(
        "Update your name and username. Click save when you are done."
      )
      await expect(screen.getByLabelText("Name")).toHaveValue("Ada Lovelace")
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
    await step("starts open and closes from the close button", async () => {
      const modal = await screen.findByRole("dialog", { name: "Edit profile" })
      await waitFor(() => expect(modal).toBeVisible())
      await userEvent.click(screen.getByRole("button", { name: "Close" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const WithCloseButton: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger render={<Button variant="outline" />}>
        Share project
      </ModalTrigger>
      <ModalContent>
        <ModalHeader>
          <ModalTitle>Share project</ModalTitle>
          <ModalDescription>
            Anyone with the link can view this project.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Input
            readOnly
            aria-label="Project link"
            defaultValue="https://esuiss.dev/p/1042"
          />
        </ModalBody>
        <ModalFooter>
          <Button>Copy link</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, step }) => {
    await step("opens and closes from the close button", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Share project" })
      )
      const modal = await screen.findByRole("dialog", { name: "Share project" })
      await expect(
        screen.getByRole("textbox", { name: "Project link" })
      ).toHaveValue("https://esuiss.dev/p/1042")
      await userEvent.click(
        within(modal).getByRole("button", { name: "Close" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const WithCloseLabel: Story = {
  render: (args) => (
    <Modal {...args}>
      <ModalTrigger render={<Button variant="outline" />}>
        Share project
      </ModalTrigger>
      <ModalContent closeLabel="Close">
        <ModalHeader>
          <ModalTitle>Share project</ModalTitle>
          <ModalDescription>
            Anyone with the link can view this project.
          </ModalDescription>
        </ModalHeader>
        <ModalBody>
          <Input
            readOnly
            aria-label="Project link"
            defaultValue="https://esuiss.dev/p/1042"
          />
        </ModalBody>
        <ModalFooter>
          <Button>Copy link</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  ),
  play: async ({ canvas, step }) => {
    await step("closes from the labelled close button", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Share project" })
      )
      const modal = await screen.findByRole("dialog", { name: "Share project" })
      await expect(
        screen.getByRole("textbox", { name: "Project link" })
      ).toHaveValue("https://esuiss.dev/p/1042")
      await userEvent.click(
        within(modal).getByRole("button", { name: "Close" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Floating: Story = {
  ...Default,
  args: { floating: true },
}
