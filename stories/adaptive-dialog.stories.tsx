import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  AdaptiveDialog,
  AdaptiveDialogBody,
  AdaptiveDialogClose,
  AdaptiveDialogContent,
  AdaptiveDialogDescription,
  AdaptiveDialogFooter,
  AdaptiveDialogHeader,
  AdaptiveDialogTitle,
  AdaptiveDialogTrigger,
} from "@/components/patterns/adaptive-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Patterns/Adaptive Dialog",
  component: AdaptiveDialog,
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
} satisfies Meta<typeof AdaptiveDialog>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <AdaptiveDialog {...args}>
      <AdaptiveDialogTrigger render={<Button variant="outline" />}>
        Edit profile
      </AdaptiveDialogTrigger>
      <AdaptiveDialogContent>
        <AdaptiveDialogHeader>
          <AdaptiveDialogTitle>Edit profile</AdaptiveDialogTitle>
          <AdaptiveDialogDescription>
            Update your name and username. Click save when you are done.
          </AdaptiveDialogDescription>
        </AdaptiveDialogHeader>
        <AdaptiveDialogBody className="grid gap-4">
          <div className="grid gap-2">
            <Label htmlFor="adaptive-name">Name</Label>
            <Input id="adaptive-name" defaultValue="Ada Lovelace" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="adaptive-username">Username</Label>
            <Input id="adaptive-username" defaultValue="@ada" />
          </div>
        </AdaptiveDialogBody>
        <AdaptiveDialogFooter>
          <AdaptiveDialogClose render={<Button variant="secondary" />}>
            Cancel
          </AdaptiveDialogClose>
          <Button>Save changes</Button>
        </AdaptiveDialogFooter>
      </AdaptiveDialogContent>
    </AdaptiveDialog>
  ),
}

export const OpenByDefault: Story = {
  ...Default,
  args: { defaultOpen: true },
}
