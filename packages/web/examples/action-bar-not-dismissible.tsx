import {
  ClipboardTextIcon,
  CopyIcon,
  ScissorsIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarShortcut,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"

function FileMenu({ defaultOpen }: { defaultOpen?: boolean }) {
  return (
    <ActionBarMenu defaultOpen={defaultOpen}>
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
  )
}

function EditMenu({ withIcons = false }: { withIcons?: boolean }) {
  return (
    <ActionBarMenu>
      <ActionBarTrigger>Edit</ActionBarTrigger>
      <ActionBarContent>
        <ActionBarItem>
          {withIcons && <ScissorsIcon />}
          Cut
          <ActionBarShortcut mod>X</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && <CopyIcon />}
          Copy
          <ActionBarShortcut mod>C</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && <ClipboardTextIcon />}
          Paste
          <ActionBarShortcut mod>V</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem variant="destructive">
          {withIcons && <TrashIcon />}
          Delete
        </ActionBarItem>
      </ActionBarContent>
    </ActionBarMenu>
  )
}

export default function ActionBarNotDismissible() {
  return (
    <div className="min-h-96">
      <ActionBar dismissible={false}>
        <FileMenu />
        <EditMenu />
      </ActionBar>
    </div>
  )
}
