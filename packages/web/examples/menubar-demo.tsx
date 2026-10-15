import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

function MenubarExample({ fileOpen = false }: { fileOpen?: boolean }) {
  return (
    <>
      <MenubarMenu defaultOpen={fileOpen}>
        <MenubarTrigger>File</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              New tab
              <MenubarShortcut mod>T</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              New window
              <MenubarShortcut mod>N</MenubarShortcut>
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
            <MenubarShortcut mod>P</MenubarShortcut>
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>Edit</MenubarTrigger>
        <MenubarContent>
          <MenubarGroup>
            <MenubarItem>
              <IconPlaceholder
                lucide="ScissorsIcon"
                tabler="IconCut"
                hugeicons="ScissorIcon"
                phosphor="ScissorsIcon"
                remixicon="RiScissorsLine"
              />
              Cut
              <MenubarShortcut mod>X</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="Copy01Icon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy
              <MenubarShortcut mod>C</MenubarShortcut>
            </MenubarItem>
            <MenubarItem>
              <IconPlaceholder
                lucide="ClipboardListIcon"
                tabler="IconClipboardText"
                hugeicons="Task01Icon"
                phosphor="ClipboardTextIcon"
                remixicon="RiClipboardLine"
              />
              Paste
              <MenubarShortcut mod>V</MenubarShortcut>
            </MenubarItem>
          </MenubarGroup>
          <MenubarSeparator />
          <MenubarItem variant="destructive">
            <IconPlaceholder
              lucide="TrashIcon"
              tabler="IconTrash"
              hugeicons="Delete02Icon"
              phosphor="TrashIcon"
              remixicon="RiDeleteBinLine"
            />
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

export default function MenubarDemo() {
  return (
    <div className="min-h-96">
      <Menubar>
        <MenubarExample />
      </Menubar>
    </div>
  )
}
