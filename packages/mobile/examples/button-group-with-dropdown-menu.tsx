import {
  CaretDownIcon,
  CopyIcon,
  ShareIcon,
  UserCircleMinusIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
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
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function ButtonGroupWithDropdownMenu() {
  return (
    <ButtonGroup>
      <Button variant="outline">
        <Text>Follow</Text>
      </Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          accessibilityLabel="More options"
          render={<Button variant="outline" size="icon" />}
        >
          <Icon as={CaretDownIcon} />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon as={WarningCircleIcon} className="size-4" />
              <Text>Mute conversation</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={CopyIcon} className="size-4" />
              <Text>Copy link</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={ShareIcon} className="size-4" />
              <Text>Share conversation</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <Icon as={UserCircleMinusIcon} className="size-4" />
              <Text>Unfollow</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  )
}
