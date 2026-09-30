import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable"

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
    (Story) => (
      <div className="h-80 w-[36rem] overflow-hidden rounded-2xl border">
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
