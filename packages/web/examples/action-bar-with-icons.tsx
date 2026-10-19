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

export default function ActionBarWithIcons() {
  return (
    <div className="min-h-96">
      <ActionBar>
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
              <IconPlaceholder
                lucide="ScissorsIcon"
                tabler="IconCut"
                hugeicons="ScissorIcon"
                phosphor="ScissorsIcon"
                remixicon="RiScissorsLine"
              />
              Cut
              <ActionBarShortcut mod>X</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="Copy01Icon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy
              <ActionBarShortcut mod>C</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarItem>
              <IconPlaceholder
                lucide="ClipboardListIcon"
                tabler="IconClipboardText"
                hugeicons="Task01Icon"
                phosphor="ClipboardTextIcon"
                remixicon="RiClipboardLine"
              />
              Paste
              <ActionBarShortcut mod>V</ActionBarShortcut>
            </ActionBarItem>
            <ActionBarSeparator />
            <ActionBarItem variant="destructive">
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="Delete02Icon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
              />
              Delete
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
    </div>
  )
}
