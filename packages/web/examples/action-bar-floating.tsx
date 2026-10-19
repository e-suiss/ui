import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarShortcut,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"

export default function ActionBarFloating() {
  return (
    <div className="min-h-96">
      <ActionBar floating>
        <ActionBarMenu>
          <ActionBarTrigger>File</ActionBarTrigger>
          <ActionBarContent>
            <ActionBarItem>
              New tab
              <ActionBarShortcut mod>T</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem>
              New window
              <ActionBarShortcut mod>N</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem disabled>New incognito window</ActionBarItem>
            <ActionBarSeparator />
            <ActionBarItem>
              Print
              <ActionBarShortcut mod>P</ActionBarShortcut>
            </ActionBarItem>
          </ActionBarContent>
        </ActionBarMenu>
        <ActionBarMenu>
          <ActionBarTrigger>Edit</ActionBarTrigger>
          <ActionBarContent>
            <ActionBarItem>
              Cut
              <ActionBarShortcut mod>X</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem>
              Copy
              <ActionBarShortcut mod>C</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem>
              Paste
              <ActionBarShortcut mod>V</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarSeparator />
            <ActionBarItem variant="destructive">Delete</ActionBarItem>
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
    </div>
  )
}
