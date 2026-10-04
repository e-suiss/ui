import type { Meta, StoryObj } from "@storybook/react-vite"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

type Side = "top" | "right" | "bottom" | "left"

function ProfileSheet({
  side = "right",
  showCloseButton = true,
  closeLabel,
}: {
  side?: Side
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <SheetContent
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
    >
      <SheetHeader>
        <SheetTitle>Edit profile</SheetTitle>
        <SheetDescription>
          Update your details and save when you are done.
        </SheetDescription>
      </SheetHeader>
      <div className="grid gap-4 px-6">
        <div className="grid gap-2">
          <Label htmlFor="sheet-name">Name</Label>
          <Input id="sheet-name" defaultValue="Jordan Lee" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="sheet-username">Username</Label>
          <Input id="sheet-username" defaultValue="@jordanlee" />
        </div>
      </div>
      <SheetFooter>
        <Button type="submit">Save changes</Button>
        <SheetClose render={<Button variant="secondary" />}>Cancel</SheetClose>
      </SheetFooter>
    </SheetContent>
  )
}

const meta = {
  title: "Components/Sheet",
  component: Sheet,
} satisfies Meta<typeof Sheet>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet />
    </Sheet>
  ),
}

export const Open: Story = {
  ...Default,
  args: { defaultOpen: true },
}

export const Sides: Story = {
  render: (args) => (
    <div className="grid grid-cols-2 gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Sheet key={side} {...args}>
          <SheetTrigger render={<Button variant="outline" />}>
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </SheetTrigger>
          <ProfileSheet side={side} />
        </Sheet>
      ))}
    </div>
  ),
}

export const OpenLeft: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet side="left" />
    </Sheet>
  ),
}

export const OpenBottom: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet side="bottom" />
    </Sheet>
  ),
}

export const WithoutCloseButton: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet showCloseButton={false} />
    </Sheet>
  ),
}

export const WithCloseLabel: Story = {
  args: { defaultOpen: true },
  render: (args) => (
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet closeLabel="Done" />
    </Sheet>
  ),
}
