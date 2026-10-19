import {
  ArchiveIcon,
  ArrowLeftIcon,
  CalendarPlusIcon,
  ClockIcon,
  DotsThreeIcon,
  ListPlusIcon,
  TagIcon,
  TrashIcon,
} from "phosphor-react-native"
import { Button } from "@/components/ui/button"
import { ButtonGroup, ButtonGroupSeparator } from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupDemo() {
  return (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary" size="icon" accessibilityLabel="Go back">
          <Icon as={ArrowLeftIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">
          <Text>Archive</Text>
        </Button>
        <ButtonGroupSeparator />
        <Button variant="secondary">
          <Text>Report</Text>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="secondary">
          <Text>Snooze</Text>
        </Button>
        <ButtonGroupSeparator />
        <DropdownMenu>
          <DropdownMenuTrigger
            accessibilityLabel="More options"
            render={<Button variant="secondary" size="icon" />}
          >
            <Icon as={DotsThreeIcon} />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon as={ListPlusIcon} className="size-4" />
                <Text>Mark as read</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon as={ArchiveIcon} className="size-4" />
                <Text>Archive</Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <Icon as={ClockIcon} className="size-4" />
                <Text>Snooze</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon as={CalendarPlusIcon} className="size-4" />
                <Text>Add to calendar</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon as={TagIcon} className="size-4" />
                <Text>Label as</Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <Icon as={TrashIcon} className="size-4" />
                <Text>Trash</Text>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  )
}
