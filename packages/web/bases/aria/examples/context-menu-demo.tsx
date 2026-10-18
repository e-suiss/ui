import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

export default function ContextMenuDemo() {
  return (
    <ContextMenu>
      <ContextMenuTrigger
        tabIndex={0}
        className="text-muted-foreground flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm outline-none focus-visible:ring-3 focus-visible:ring-ring/50"
      >
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft02Icon"
              phosphor="ArrowLeftIcon"
              remixicon="RiArrowLeftLine"
            />
            Back
            <ContextMenuShortcut mod>[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem isDisabled>
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
            />
            Forward
            <ContextMenuShortcut mod>]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="RotateCwIcon"
              tabler="IconRotateClockwise"
              hugeicons="Rotate01Icon"
              phosphor="ArrowClockwiseIcon"
              remixicon="RiResetRightLine"
            />
            Reload
            <ContextMenuShortcut mod>R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save page as...</ContextMenuItem>
            <ContextMenuItem>Create shortcut...</ContextMenuItem>
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultSelected>
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup defaultValue="ada">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="ada">Ada Lovelace</ContextMenuRadioItem>
          <ContextMenuRadioItem value="alan">Alan Turing</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
          />
          Delete
          <ContextMenuShortcut mod>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
