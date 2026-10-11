// @ts-nocheck
import { CashRegisterIcon, CookingPotIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"
import { ScrollArea } from "@/components/ui/scroll-area"

const meta = {
  title: "Components/Resizable",
  component: ResizablePanelGroup,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
  decorators: [
    (Story, { parameters }) => (
      <div
        className={
          parameters.bare
            ? "h-80 w-[36rem]"
            : "h-80 w-[36rem] overflow-hidden rounded-2xl border"
        }
      >
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof ResizablePanelGroup>

export default meta

type Story = StoryObj<typeof meta>

function Pane({ label }: { label: string }) {
  return (
    <div className="flex h-full items-center justify-center p-6 text-sm font-medium">
      {label}
    </div>
  )
}

export const Default: Story = {
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="50%">
        <Pane label="Inbox" />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel defaultSize="50%">
        <Pane label="Message" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvas, step }) => {
    const handle = canvas.getByRole("separator")

    await step("starts split evenly", async () => {
      await expect(handle).toHaveAttribute("aria-valuenow", "50")
    })

    await step("resizes with the arrow keys", async () => {
      await userEvent.tab()
      await expect(handle).toHaveFocus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(
        Number(handle.getAttribute("aria-valuenow"))
      ).toBeGreaterThan(50)
      await userEvent.keyboard("{ArrowLeft}{ArrowLeft}")
      await expect(Number(handle.getAttribute("aria-valuenow"))).toBeLessThan(
        50
      )
    })
  },
}

export const WithHandle: Story = {
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="30%" minSize="20%">
        <Pane label="Sidebar" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="70%">
        <Pane label="Content" />
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvas, step }) => {
    const handle = canvas.getByRole("separator")

    await step("stops at the sidebar's minimum size", async () => {
      await expect(handle).toHaveAttribute("aria-valuenow", "30")
      handle.focus()
      await userEvent.keyboard("{Home}")
      await expect(handle).toHaveAttribute("aria-valuenow", "20")
    })
  },
}

export const Vertical: Story = {
  args: { orientation: "vertical" },
  render: WithHandle.render,
  play: async ({ canvas, step }) => {
    const handle = canvas.getByRole("separator")

    await step("resizes with the up and down keys", async () => {
      await expect(handle).toHaveAttribute("aria-orientation", "horizontal")
      handle.focus()
      await userEvent.keyboard("{ArrowDown}")
      await expect(
        Number(handle.getAttribute("aria-valuenow"))
      ).toBeGreaterThan(30)
    })
  },
}

export const Nested: Story = {
  render: (args) => (
    <ResizablePanelGroup {...args}>
      <ResizablePanel defaultSize="30%" minSize="20%">
        <Pane label="Files" />
      </ResizablePanel>
      <ResizableHandle withHandle />
      <ResizablePanel defaultSize="70%">
        <ResizablePanelGroup orientation="vertical">
          <ResizablePanel defaultSize="65%">
            <Pane label="Editor" />
          </ResizablePanel>
          <ResizableHandle withHandle />
          <ResizablePanel defaultSize="35%">
            <Pane label="Terminal" />
          </ResizablePanel>
        </ResizablePanelGroup>
      </ResizablePanel>
    </ResizablePanelGroup>
  ),
  play: async ({ canvas, step }) => {
    const [outer, inner] = canvas.getAllByRole("separator")
    if (!outer || !inner) throw new Error("separators not rendered")

    await step("starts each group at its default split", async () => {
      await expect(outer).toHaveAttribute("aria-valuenow", "30")
      await expect(outer).toHaveAttribute("aria-orientation", "vertical")
      await expect(inner).toHaveAttribute("aria-valuenow", "65")
      await expect(inner).toHaveAttribute("aria-orientation", "horizontal")
    })

    await step("resizes the side panel with left and right", async () => {
      outer.focus()
      await userEvent.keyboard("{ArrowRight}")
      await expect(Number(outer.getAttribute("aria-valuenow"))).toBeGreaterThan(
        30
      )
      await expect(inner).toHaveAttribute("aria-valuenow", "65")
    })

    await step("resizes the nested panels with up and down", async () => {
      await userEvent.tab()
      await expect(inner).toHaveFocus()
      await userEvent.keyboard("{ArrowUp}")
      await expect(Number(inner.getAttribute("aria-valuenow"))).toBeLessThan(65)
    })
  },
}

function CardPane({
  icon,
  label,
  size,
}: {
  icon: React.ReactNode
  label: string
  size: number | undefined
}) {
  return (
    <div className="size-full p-2">
      <ScrollArea className="size-full">
        <div className="flex min-h-full flex-col items-center justify-center gap-3 p-3 text-center">
          <span className="flex size-13 shrink-0 items-center justify-center rounded-2xl bg-control text-label [&_svg]:size-6">
            {icon}
          </span>
          <div className="flex flex-col gap-0.5">
            <p className="text-sm font-semibold">{label}</p>
            <p className="text-sm text-label-secondary tabular-nums">
              {size === undefined ? "" : `${Math.round(size)}%`}
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  )
}

function CardsExample(args: React.ComponentProps<typeof ResizablePanelGroup>) {
  const [layout, setLayout] = React.useState<Record<string, number>>({})

  return (
    <ResizablePanelGroup {...args} variant="cards" onLayoutChange={setLayout}>
      <ResizablePanel
        id="pos"
        defaultSize="50%"
        minSize="25%"
        collapsible
        collapsedSize="0%"
        collapsedThreshold="1%"
      >
        <CardPane
          icon={<CashRegisterIcon />}
          label="Point of sale"
          size={layout.pos}
        />
      </ResizablePanel>
      <ResizableHandle />
      <ResizablePanel
        id="kitchen"
        defaultSize="50%"
        minSize="25%"
        collapsible
        collapsedSize="0%"
        collapsedThreshold="1%"
      >
        <CardPane
          icon={<CookingPotIcon />}
          label="Kitchen display"
          size={layout.kitchen}
        />
      </ResizablePanel>
    </ResizablePanelGroup>
  )
}

export const Cards: Story = {
  parameters: { bare: true },
  render: (args) => <CardsExample {...args} />,
  play: async ({ canvas, canvasElement, step }) => {
    const handle = canvas.getByRole("separator")

    await step("reports each card's share", async () => {
      await waitFor(() => expect(canvas.getAllByText("50%")).toHaveLength(2))
    })

    await step("collapses the first card past its minimum", async () => {
      handle.focus()
      await userEvent.keyboard("{Home}")
      await waitFor(() => expect(canvas.getByText("100%")).toBeVisible())
      await expect(handle).toHaveAttribute("data-collapsed", "start")
    })

    await step("keeps the collapsed card out of the tab order", async () => {
      const collapsed = canvasElement.querySelector("#pos")
      await waitFor(() => expect(collapsed).toHaveAttribute("inert"))
      await userEvent.keyboard("{End}")
      await waitFor(() => expect(collapsed).not.toHaveAttribute("inert"))
      await userEvent.keyboard("{Home}")
      await waitFor(() => expect(collapsed).toHaveAttribute("inert"))
    })
  },
}

export const CardsVertical: Story = {
  args: { orientation: "vertical" },
  parameters: { bare: true },
  render: Cards.render,
  play: async ({ canvas, step }) => {
    const handle = canvas.getByRole("separator")

    await step("splits the cards evenly", async () => {
      await expect(handle).toHaveAttribute("aria-orientation", "horizontal")
      await expect(handle).toHaveAttribute("aria-valuenow", "50")
      await waitFor(() => expect(canvas.getAllByText("50%")).toHaveLength(2))
    })

    await step("resizes with the up and down keys", async () => {
      handle.focus()
      await userEvent.keyboard("{ArrowDown}")
      await waitFor(() =>
        expect(Number(handle.getAttribute("aria-valuenow"))).toBeGreaterThan(50)
      )
      await waitFor(() => expect(canvas.queryAllByText("50%")).toHaveLength(0))
      await userEvent.keyboard("{ArrowUp}{ArrowUp}")
      await expect(Number(handle.getAttribute("aria-valuenow"))).toBeLessThan(
        50
      )
    })
  },
}
