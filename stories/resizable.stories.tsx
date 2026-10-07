import { CashRegisterIcon, CookingPotIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

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
}

export const Vertical: Story = {
  ...WithHandle,
  args: { orientation: "vertical" },
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
}

export const CardsVertical: Story = {
  ...Cards,
  args: { orientation: "vertical" },
}
