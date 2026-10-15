import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup orientation="horizontal">
      <ButtonGroup>
        <Button variant="secondary" size="icon" aria-label="Go back">
          <IconPlaceholder
            lucide="ArrowLeftIcon"
            tabler="IconArrowLeft"
            hugeicons="ArrowLeft02Icon"
            phosphor="ArrowLeftIcon"
            remixicon="RiArrowLeftLine"
          />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">Archive</Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">Snooze</Button>
        <ButtonGroupSeparator />
        <DropdownMenu>
          <Button variant="secondary" size="icon" aria-label="More options">
            <IconPlaceholder
              lucide="EllipsisIcon"
              tabler="IconDots"
              hugeicons="MoreHorizontalIcon"
              phosphor="DotsThreeIcon"
              remixicon="RiMoreLine"
            />
          </Button>
          <DropdownMenuContent placement="bottom end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ListPlusIcon"
                  tabler="IconPlaylistAdd"
                  hugeicons="ListPlusIcon"
                  phosphor="ListPlusIcon"
                  remixicon="RiPlayListAddLine"
                />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ArchiveIcon"
                  tabler="IconArchive"
                  hugeicons="Archive02Icon"
                  phosphor="ArchiveIcon"
                  remixicon="RiArchiveLine"
                />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="ClockIcon"
                  tabler="IconClock"
                  hugeicons="Clock01Icon"
                  phosphor="ClockIcon"
                  remixicon="RiTimeLine"
                />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="CalendarPlusIcon"
                  tabler="IconCalendarPlus"
                  hugeicons="CalendarAdd01Icon"
                  phosphor="CalendarPlusIcon"
                  remixicon="RiCalendarEventLine"
                />
                Add to calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <IconPlaceholder
                  lucide="TagIcon"
                  tabler="IconTag"
                  hugeicons="Tag01Icon"
                  phosphor="TagIcon"
                  remixicon="RiPriceTag3Line"
                />
                Label as
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <IconPlaceholder
                  lucide="TrashIcon"
                  tabler="IconTrash"
                  hugeicons="Delete02Icon"
                  phosphor="TrashIcon"
                  remixicon="RiDeleteBinLine"
                />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}
