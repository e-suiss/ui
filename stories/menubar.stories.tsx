import {
  ClipboardTextIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  Menubar,
  MenubarCheckboxItem,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarLabel,
  MenubarMenu,
  MenubarRadioGroup,
  MenubarRadioItem,
  MenubarSeparator,
  MenubarShortcut,
  MenubarSub,
  MenubarSubContent,
  MenubarSubTrigger,
  MenubarTrigger,
} from "@/components/ui/menubar"

const meta = {
  title: "Components/Menubar",
  component: Menubar,
  parameters: {
    layout: "padded",
  },
  decorators: [
    (Story) => (
      <div className="min-h-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Menubar>

export default meta

type Story = StoryObj<typeof meta>

function MenubarExample({ fileOpen = false }: { fileOpen?: boolean }) {
  return (
    <>
      <MenubarMenu defaultOpen={fileOpen}>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New tab
              <MenubarShortcut>⌘T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New window
              <MenubarShortcut>⌘N</MenubarShortcut>
            </MenubarItem>
            <MenubarItem disabled>New private window</MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarSub>
            <MenubarSubTrigger>Share</MenubarSubTrigger>
            <MenubarSubContent>
              <MenubarItem>Email link</MenubarItem>
              <MenubarItem>Messages</MenubarItem>
              <MenubarItem>Notes</MenubarItem>
            </MenubarSubContent>
          </MenubarSub>
          <MenubarSeparator />
          <MenubarItem>
            Print
            <MenubarShortcut>⌘P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <ScissorsIcon />
              Cut
              <MenubarShortcut>⌘X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <CopyIcon />
              Copy
              <MenubarShortcut>⌘C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <ClipboardTextIcon />
              Paste
              <MenubarShortcut>⌘V</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <TrashIcon />
            Delete
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>View</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarCheckboxItem defaultChecked>
              Show bookmarks bar
            </MenubarCheckboxItem>
            <MenubarCheckboxItem>Show full URLs</MenubarCheckboxItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Reload</MenubarItem>
          <MenubarItem inset>Toggle full screen</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Profiles</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarLabel>Switch profile</MenubarLabel>
            <MenubarRadioGroup defaultValue="alex">
              <MenubarRadioItem value="alex">Alex</MenubarRadioItem>
              <MenubarRadioItem value="sam">Sam</MenubarRadioItem>
              <MenubarRadioItem value="taylor">Taylor</MenubarRadioItem>
            </MenubarRadioGroup>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem inset>Manage profiles</MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </>
  )
}

export const Default: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarExample />
    </Menubar>
  ),
}

export const OpenByDefault: Story = {
  render: (args) => (
    <Menubar {...args}>
      <MenubarExample fileOpen />
    </Menubar>
  ),
}

export const Disabled: Story = {
  ...Default,
  args: { disabled: true },
}
