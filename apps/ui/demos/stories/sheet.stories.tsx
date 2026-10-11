// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

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
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Open sheet" })

    await step("opens a named sheet and moves focus into it", async () => {
      await userEvent.click(trigger)
      const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(sheet).toHaveAccessibleDescription(
        "Update your details and save when you are done."
      )
      await waitFor(() =>
        expect(sheet).toContainElement(document.activeElement as HTMLElement)
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

    await step("closes from the close button", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("button", { name: "Close" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Open: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("closes from the cancel button", async () => {
      await userEvent.click(
        await screen.findByRole("button", { name: "Cancel" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
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
  play: async ({ canvas, step }) => {
    for (const side of ["top", "right", "bottom", "left"]) {
      const label = side.charAt(0).toUpperCase() + side.slice(1)

      await step(`opens and closes the ${side} sheet`, async () => {
        const trigger = canvas.getByRole("button", { name: label })
        await userEvent.click(trigger)
        const sheet = await screen.findByRole("dialog", {
          name: "Edit profile",
        })
        await expect(sheet).toHaveAttribute("data-side", side)
        await waitFor(() => expect(sheet).toBeVisible())
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
        await waitFor(() => expect(trigger).toHaveFocus())
      })
    }
  },
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
  play: async ({ step }) => {
    await step("renders open on the left side", async () => {
      const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(sheet).toHaveAttribute("data-side", "left")
      await waitFor(() =>
        expect(sheet.getBoundingClientRect().left).toBeLessThan(
          window.innerWidth / 2
        )
      )
    })

    await step("closes from the close button", async () => {
      await userEvent.click(screen.getByRole("button", { name: "Close" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
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
  play: async ({ step }) => {
    await step("renders open on the bottom side", async () => {
      const sheet = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(sheet).toHaveAttribute("data-side", "bottom")
      await waitFor(() =>
        expect(sheet.getBoundingClientRect().top).toBeGreaterThan(
          window.innerHeight / 2
        )
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
    <Sheet {...args}>
      <SheetTrigger render={<Button variant="outline" />}>
        Open sheet
      </SheetTrigger>
      <ProfileSheet showCloseButton={false} />
    </Sheet>
  ),
  play: async ({ step }) => {
    await step("leaves out the icon close button", async () => {
      await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(screen.queryByRole("button", { name: "Close" })).toBeNull()
    })
  },
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
  play: async ({ step }) => {
    await step("closes from the text close button", async () => {
      await userEvent.click(await screen.findByRole("button", { name: "Done" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}
