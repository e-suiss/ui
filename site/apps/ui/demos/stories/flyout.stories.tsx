// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  Flyout,
  FlyoutBody,
  FlyoutClose,
  FlyoutContent,
  FlyoutDescription,
  FlyoutHeader,
  FlyoutTitle,
  FlyoutTrigger,
} from "@/components/patterns/flyout"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

const meta = {
  title: "Patterns/Flyout",
  component: Flyout,
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
} satisfies Meta<typeof Flyout>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Flyout {...args}>
      <FlyoutTrigger render={<Button variant="outline" />}>
        Dimensions
      </FlyoutTrigger>
      <FlyoutContent>
        <FlyoutHeader>
          <FlyoutTitle>Dimensions</FlyoutTitle>
          <FlyoutDescription>
            Set the dimensions for the layer.
          </FlyoutDescription>
        </FlyoutHeader>
        <FlyoutBody className="grid gap-3">
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="flyout-width">Width</Label>
            <Input
              id="flyout-width"
              defaultValue="100%"
              className="col-span-2"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-3">
            <Label htmlFor="flyout-height">Height</Label>
            <Input
              id="flyout-height"
              defaultValue="25px"
              className="col-span-2"
            />
          </div>
        </FlyoutBody>
      </FlyoutContent>
    </Flyout>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Dimensions" })

    await step("opens a named flyout and moves focus in", async () => {
      await userEvent.click(trigger)
      const flyout = await screen.findByRole("dialog", { name: "Dimensions" })
      await expect(flyout).toHaveAccessibleDescription(
        "Set the dimensions for the layer."
      )
      await waitFor(() =>
        expect(flyout).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step("edits a field inside the flyout", async () => {
      const width = screen.getByLabelText("Width")
      await userEvent.clear(width)
      await userEvent.type(width, "320px")
      await expect(width).toHaveValue("320px")
    })

    await step("Escape closes and returns focus to the trigger", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })

    await step("clicking outside closes it", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("dialog")
      await userEvent.click(document.body)
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const WithCloseButton: Story = {
  render: (args) => (
    <Flyout {...args}>
      <FlyoutTrigger render={<Button variant="outline" />}>
        Filters
      </FlyoutTrigger>
      <FlyoutContent showCloseButton>
        <FlyoutHeader>
          <FlyoutTitle>Filters</FlyoutTitle>
          <FlyoutDescription>Narrow down the orders list.</FlyoutDescription>
        </FlyoutHeader>
        <FlyoutBody className="grid gap-2">
          <Label htmlFor="flyout-search">Customer</Label>
          <Input id="flyout-search" placeholder="Search by name" />
        </FlyoutBody>
      </FlyoutContent>
    </Flyout>
  ),
}

export const WithCloseLabel: Story = {
  render: (args) => (
    <Flyout {...args}>
      <FlyoutTrigger render={<Button variant="outline" />}>
        Filters
      </FlyoutTrigger>
      <FlyoutContent showCloseButton closeLabel="Done">
        <FlyoutHeader>
          <FlyoutTitle>Filters</FlyoutTitle>
          <FlyoutDescription>Narrow down the orders list.</FlyoutDescription>
        </FlyoutHeader>
        <FlyoutBody className="grid gap-2">
          <Label htmlFor="flyout-search">Customer</Label>
          <Input id="flyout-search" placeholder="Search by name" />
        </FlyoutBody>
      </FlyoutContent>
    </Flyout>
  ),
}

export const WithClose: Story = {
  render: (args) => (
    <Flyout {...args}>
      <FlyoutTrigger render={<Button variant="outline" />}>Share</FlyoutTrigger>
      <FlyoutContent>
        <FlyoutHeader>
          <FlyoutTitle>Share link</FlyoutTitle>
          <FlyoutDescription>
            Anyone with the link can view this project.
          </FlyoutDescription>
        </FlyoutHeader>
        <FlyoutBody className="grid gap-3">
          <Input
            readOnly
            aria-label="Project link"
            defaultValue="https://esuiss.dev/p/1042"
          />
          <FlyoutClose render={<Button />}>Copy link</FlyoutClose>
        </FlyoutBody>
      </FlyoutContent>
    </Flyout>
  ),
  play: async ({ canvas, step }) => {
    await step("a close action inside the flyout closes it", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Share" }))
      await screen.findByRole("dialog", { name: "Share link" })
      await userEvent.click(
        await screen.findByRole("button", { name: "Copy link" })
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders open and closes with Escape", async () => {
      await screen.findByRole("dialog", { name: "Dimensions" })
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}

export const Floating: Story = {
  ...Default,
  args: { floating: true },
}
