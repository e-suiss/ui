import {
  ChatCircleIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GearIcon,
  SignOutIcon,
  UserIcon,
  UserPlusIcon,
} from "phosphor-react-native"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function OpenButton({ label = "Open menu" }: { label?: string }) {
  return (
    <DropdownMenuTrigger render={<Button variant="outline" />}>
      <Text>{label}</Text>
    </DropdownMenuTrigger>
  )
}

export default function DropdownMenuDemo() {
  return (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon as={UserIcon} className="size-4" />
              <Text>Profile</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={CreditCardIcon} className="size-4" />
              <Text>Billing</Text>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={GearIcon} className="size-4" />
              <Text>Settings</Text>
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuSub>
            <DropdownMenuSubTrigger>
              <View className="flex-row items-center gap-2">
                <Icon as={UserPlusIcon} className="size-4" />
                <Text>Invite users</Text>
              </View>
            </DropdownMenuSubTrigger>
            <DropdownMenuSubContent>
              <DropdownMenuItem>
                <Icon as={EnvelopeIcon} className="size-4" />
                <Text>Email</Text>
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Icon as={ChatCircleIcon} className="size-4" />
                <Text>Message</Text>
              </DropdownMenuItem>
            </DropdownMenuSubContent>
          </DropdownMenuSub>
          <DropdownMenuSeparator />
          <DropdownMenuItem variant="destructive">
            <Icon as={SignOutIcon} className="size-4" />
            <Text>Log out</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}
