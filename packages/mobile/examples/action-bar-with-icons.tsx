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

export default function ActionBarWithIcons() {
  return (
    <ActionBar>
      <ActionBarMenu>
        <ActionBarTrigger>File</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarItem>New tab</ActionBarItem>
          <ActionBarItem>New window</ActionBarItem>
          <ActionBarItem disabled>New incognito window</ActionBarItem>
          <ActionBarSeparator />
          <ActionBarItem>Print</ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
      <ActionBarMenu>
        <ActionBarTrigger>Edit</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarItem>
            <Icon as={ScissorsIcon} />
            <Text>Cut</Text>
          </ActionBarItem>
          <ActionBarItem>
            <Icon as={CopyIcon} />
            <Text>Copy</Text>
          </ActionBarItem>
          <ActionBarItem>
            <Icon as={ClipboardTextIcon} />
            <Text>Paste</Text>
          </ActionBarItem>
          <ActionBarSeparator />
          <ActionBarItem variant="destructive">
            <Icon as={TrashIcon} />
            <Text>Delete</Text>
          </ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
      <ActionBarMenu>
        <ActionBarTrigger>View</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarLabel>Appearance</ActionBarLabel>
          <ActionBarItem>Zoom in</ActionBarItem>
          <ActionBarItem>Zoom out</ActionBarItem>
          <ActionBarItem>Actual size</ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
    </ActionBar>
  )
}
