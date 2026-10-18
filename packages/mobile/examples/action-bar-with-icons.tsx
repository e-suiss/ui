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

export default function ActionBarWithIcons() {
  return (
    <ActionBar>
      <FileMenu />
      <EditMenu withIcons />
      <ViewMenu />
    </ActionBar>
  )
}
