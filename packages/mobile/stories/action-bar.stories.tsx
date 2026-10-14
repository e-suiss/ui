import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ClipboardTextIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "phosphor-react-native"
import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function FileMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <ActionBarMenu defaultOpen={defaultOpen}>
      <ActionBarTrigger>File</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarItem>New tab</ActionBarItem>
        <ActionBarItem>New window</ActionBarItem>
        <ActionBarItem disabled>New incognito window</ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem>Print</ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

function EditMenu({ withIcons = false }: { withIcons?: boolean }) {
  return (
    <ActionBarMenu>
      <ActionBarTrigger>Edit</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarItem>
          {withIcons ? <Icon as={ScissorsIcon} /> : null}
          <Text>Cut</Text>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons ? <Icon as={CopyIcon} /> : null}
          <Text>Copy</Text>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons ? <Icon as={ClipboardTextIcon} /> : null}
          <Text>Paste</Text>
        </ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem variant="destructive">
          {withIcons ? <Icon as={TrashIcon} /> : null}
          <Text>Delete</Text>
        </ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

function ViewMenu() {
  return (
    <ActionBarMenu>
      <ActionBarTrigger>View</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarLabel>Appearance</ActionBarLabel>
        <ActionBarItem>Zoom in</ActionBarItem>
        <ActionBarItem>Zoom out</ActionBarItem>
        <ActionBarItem>Actual size</ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

const meta = {
  title: "Patterns/Action Bar",
  component: ActionBar,
} satisfies Meta<typeof ActionBar>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ActionBar>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
}

export const Overflow: Story = {
  render: () => (
    <ActionBar defaultOpen>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
}

export const WithIcons: Story = {
  render: () => (
    <ActionBar>
      <FileMenu />
      <EditMenu withIcons />
      <ViewMenu />
    </ActionBar>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <ActionBar defaultOpen>
      <FileMenu defaultOpen />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
}

export const NotDismissible: Story = {
  render: () => (
    <ActionBar dismissible={false}>
      <FileMenu />
      <EditMenu />
    </ActionBar>
  ),
}

export const CustomLabels: Story = {
  render: () => (
    <ActionBar moreLabel="Document actions" cancelLabel="Close">
      <FileMenu />
      <EditMenu />
    </ActionBar>
  ),
}

export const Floating: Story = {
  render: () => (
    <ActionBar floating defaultOpen>
      <FileMenu />
      <EditMenu />
      <ViewMenu />
    </ActionBar>
  ),
}
