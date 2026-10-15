import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
        <ActionBarItem isDisabled>New incognito window</ActionBarItem>
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
          {withIcons && (
            <IconPlaceholder
              lucide="ScissorsIcon"
              tabler="IconCut"
              hugeicons="ScissorIcon"
              phosphor="ScissorsIcon"
              remixicon="RiScissorsLine"
            />
          )}
          Cut
          <ActionBarShortcut mod>X</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && (
            <IconPlaceholder
              lucide="CopyIcon"
              tabler="IconCopy"
              hugeicons="Copy01Icon"
              phosphor="CopyIcon"
              remixicon="RiFileCopyLine"
            />
          )}
          Copy
          <ActionBarShortcut mod>C</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarItem>
          {withIcons && (
            <IconPlaceholder
              lucide="ClipboardListIcon"
              tabler="IconClipboardText"
              hugeicons="Task01Icon"
              phosphor="ClipboardTextIcon"
              remixicon="RiClipboardLine"
            />
          )}
          Paste
          <ActionBarShortcut mod>V</ActionBarShortcut>
        </ActionBarItem>
        <ActionBarSeparator />
        <ActionBarItem variant="destructive">
          {withIcons && (
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
          )}
          Delete
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

export default function ActionBarDemo() {
  return (
    <div className="min-h-96">
      <ActionBar>
        <FileMenu />
        <EditMenu />
        <ViewMenu />
      </ActionBar>
    </div>
  )
}
