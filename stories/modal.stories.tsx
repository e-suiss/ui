import type { Meta, StoryObj } from "@storybook/react-vite"

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
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
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
}

export const Floating: Story = {
  ...Default,
  args: { floating: true },
}
