import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

export default function ButtonGroupOutline() {
  return (
    <ButtonGroup orientation="horizontal">
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Go back">
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
        <Button variant="outline">Archive</Button>
        <Button variant="outline">Report</Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">Snooze</Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="More options" />
            }
          >
            <IconPlaceholder
              lucide="EllipsisIcon"
              tabler="IconDots"
              hugeicons="MoreHorizontalIcon"
              phosphor="DotsThreeIcon"
              remixicon="RiMoreLine"
            />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
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
