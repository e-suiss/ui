import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"
import { Text } from "@/components/ui/text"

export default function ActionBarCustomLabels() {
  return (
    <ActionBar moreLabel="Document actions" cancelLabel="Close">
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
    </ActionBar>
  )
}
