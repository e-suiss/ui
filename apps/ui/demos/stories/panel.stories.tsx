// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import {
  Panel,
  PanelBody,
  PanelClose,
  PanelContent,
  PanelDescription,
  PanelFooter,
  PanelHeader,
  PanelTitle,
  PanelTrigger,
} from "@/components/patterns/panel"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

type Side = "top" | "right" | "bottom" | "left"

function ProfilePanel({
  side,
  showCloseButton,
  closeLabel,
}: {
  side?: Side
  showCloseButton?: boolean
  closeLabel?: string
}) {
  return (
    <PanelContent
      side={side}
      showCloseButton={showCloseButton}
      closeLabel={closeLabel}
    >
      <PanelHeader>
        <PanelTitle>Edit profile</PanelTitle>
        <PanelDescription>
          Update your details and save when you are done.
        </PanelDescription>
      </PanelHeader>
      <PanelBody className="grid gap-4">
        <div className="grid gap-2">
          <Label htmlFor="panel-name">Name</Label>
          <Input id="panel-name" defaultValue="Jordan Lee" />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="panel-username">Username</Label>
          <Input id="panel-username" defaultValue="@jordanlee" />
        </div>
      </PanelBody>
      <PanelFooter>
        <Button>Save changes</Button>
        <PanelClose render={<Button variant="secondary" />}>Cancel</PanelClose>
      </PanelFooter>
    </PanelContent>
  )
}

const meta = {
  title: "Patterns/Panel",
  component: Panel,
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
  render: (args) => (
    <Panel {...args}>
      <PanelTrigger render={<Button variant="outline" />}>
        Edit profile
      </PanelTrigger>
      <ProfilePanel />
    </Panel>
  ),
} satisfies Meta<typeof Panel>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Edit profile" })

    await step("opens a named panel with its form", async () => {
      await userEvent.click(trigger)
      const panel = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(panel).toHaveAccessibleDescription(
        "Update your details and save when you are done."
      )
      await expect(screen.getByLabelText("Name")).toHaveValue("Jordan Lee")
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
  play: async ({ step }) => {
    await step("starts open and closes from the close button", async () => {
      const panel = await screen.findByRole("dialog", { name: "Edit profile" })
      await userEvent.click(
        within(panel).getByRole("button", { name: "Close" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Sides: Story = {
  render: (args) => (
    <div className="flex flex-wrap items-center gap-3">
      {(["top", "right", "bottom", "left"] as const).map((side) => (
        <Panel key={side} {...args}>
          <PanelTrigger render={<Button variant="outline" />}>
            {side.charAt(0).toUpperCase() + side.slice(1)}
          </PanelTrigger>
          <ProfilePanel side={side} />
        </Panel>
      ))}
    </div>
  ),
  play: async ({ canvas, step }) => {
    for (const side of ["Top", "Right", "Bottom", "Left"]) {
      await step(
        `opens and closes the ${side.toLowerCase()} panel`,
        async () => {
          await userEvent.click(canvas.getByRole("button", { name: side }))
          const panel = await screen.findByRole("dialog", {
            name: "Edit profile",
          })
          await waitFor(() => expect(panel).toBeVisible())
          await userEvent.keyboard("{Escape}")
          await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
        }
      )
    }
  },
}

export const WithCloseLabel: Story = {
  render: (args) => (
    <Panel {...args}>
      <PanelTrigger render={<Button variant="outline" />}>
        Edit profile
      </PanelTrigger>
      <ProfilePanel closeLabel="Done" />
    </Panel>
  ),
  play: async ({ canvas, step }) => {
    await step("closes from the labelled close button", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Edit profile" })
      )
      const panel = await screen.findByRole("dialog", { name: "Edit profile" })
      await userEvent.click(within(panel).getByRole("button", { name: "Done" }))
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const WithoutCloseButton: Story = {
  render: (args) => (
    <Panel {...args}>
      <PanelTrigger render={<Button variant="outline" />}>
        Edit profile
      </PanelTrigger>
      <ProfilePanel showCloseButton={false} />
    </Panel>
  ),
  play: async ({ canvas, step }) => {
    await step("omits the close button and closes from cancel", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Edit profile" })
      )
      const panel = await screen.findByRole("dialog", { name: "Edit profile" })
      await expect(
        within(panel).queryByRole("button", { name: "Close" })
      ).toBeNull()
      await userEvent.click(
        within(panel).getByRole("button", { name: "Cancel" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Floating: Story = {
  args: { floating: true },
}
