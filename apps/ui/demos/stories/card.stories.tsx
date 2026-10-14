// @ts-nocheck
import { DotsThreeIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const meta = {
  title: "Components/Card",
  component: Card,
  args: {
    size: "default",
  },
  argTypes: {
    size: {
      control: "select",
      options: ["default", "sm"],
    },
  },
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Card>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Team plan</CardTitle>
        <CardDescription>
          Everything your team needs to ship faster.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p>
          Unlimited projects, shared workspaces, and priority support for up to
          ten members.
        </p>
      </CardContent>
      <CardFooter className="gap-2">
        <Button>Upgrade</Button>
        <Button variant="ghost">Learn more</Button>
      </CardFooter>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(canvas.getByText("Team plan")).toBeVisible()
    await expect(
      canvas.getByText("Everything your team needs to ship faster.")
    ).toBeVisible()
    await expect(canvas.getAllByRole("button")).toHaveLength(2)
  },
}

export const Small: Story = {
  args: { size: "sm" },
  render: Default.render,
}

export const Filled: Story = {
  args: { variant: "filled" },
  render: Default.render,
}

export const WithAction: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader>
        <CardTitle>Monthly revenue</CardTitle>
        <CardDescription>Updated five minutes ago</CardDescription>
        <CardAction>
          <Button variant="ghost" size="icon-sm" aria-label="More options">
            <DotsThreeIcon />
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent>
        <p className="text-3xl font-semibold tabular-nums">$24,380</p>
      </CardContent>
    </Card>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("button", { name: "More options" })
    ).toBeVisible()
  },
}

export const WithBorders: Story = {
  render: (args) => (
    <Card {...args}>
      <CardHeader className="border-b">
        <CardTitle>Notifications</CardTitle>
        <CardDescription>Choose what you want to hear about.</CardDescription>
      </CardHeader>
      <CardContent>
        <p>You have three unread messages and one pending invite.</p>
      </CardContent>
      <CardFooter className="justify-end border-t">
        <Button variant="outline">Mark all as read</Button>
      </CardFooter>
    </Card>
  ),
}

export const WithImage: Story = {
  render: (args) => (
    <Card {...args}>
      <img
        src="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&q=80"
        alt="Mountain lake at sunrise"
        className="aspect-video w-full object-cover"
      />
      <CardHeader>
        <CardTitle>Lake Louise</CardTitle>
        <CardDescription>Banff National Park, Canada</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button className="w-full">Book a stay</Button>
      </CardFooter>
    </Card>
  ),
}
