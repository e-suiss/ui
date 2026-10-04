import type { Meta, StoryObj } from "@storybook/react-vite"

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

export const Default: Story = {}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
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
}

export const Floating: Story = {
  args: { floating: true },
}
