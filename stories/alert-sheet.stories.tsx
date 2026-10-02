import type { Meta, StoryObj } from "@storybook/react-vite"

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
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
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
}
