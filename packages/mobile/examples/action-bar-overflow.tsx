import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"
import { Text } from "@/components/ui/text"

export default function ActionBarOverflow() {
  return (
    <ActionBar defaultOpen>
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
            <Text>Cut</Text>
          </ActionBarItem>
          <ActionBarItem>
            <Text>Copy</Text>
          </ActionBarItem>
          <ActionBarItem>
            <Text>Paste</Text>
          </ActionBarItem>
          <ActionBarSeparator />
          <ActionBarItem variant="destructive">
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
