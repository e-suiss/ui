import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Button } from "@/components/ui/button"
import { ButtonGroup } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function ButtonGroupWithDropdownMenu() {
  return (
    <ButtonGroup orientation="horizontal">
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <Button variant="outline" size="icon" aria-label="More options">
          <IconPlaceholder
            lucide="ChevronDownIcon"
            tabler="IconChevronDown"
            hugeicons="ArrowDown01Icon"
            phosphor="CaretDownIcon"
            remixicon="RiArrowDownSLine"
          />
        </Button>
        <DropdownMenuContent placement="bottom end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CircleAlertIcon"
                tabler="IconAlertCircle"
                hugeicons="AlertCircleIcon"
                phosphor="WarningCircleIcon"
                remixicon="RiErrorWarningLine"
              />
              Mute conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="CopyIcon"
                tabler="IconCopy"
                hugeicons="Copy01Icon"
                phosphor="CopyIcon"
                remixicon="RiFileCopyLine"
              />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="ShareIcon"
                tabler="IconShare2"
                hugeicons="Share01Icon"
                phosphor="ShareIcon"
                remixicon="RiShareForwardBoxLine"
              />
              Share conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <IconPlaceholder
                lucide="UserRoundMinusIcon"
                tabler="IconUserMinus"
                hugeicons="UserMinus01Icon"
                phosphor="UserCircleMinusIcon"
                remixicon="RiUserMinusLine"
              />
              Unfollow
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
