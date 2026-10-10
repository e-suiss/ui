import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ChatCircleIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GearIcon,
  SignOutIcon,
  UserIcon,
  UserPlusIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function OpenButton({ label = "Open menu" }: { label?: string }) {
  return (
    <DropdownMenuTrigger asChild>
      <Button variant="outline">
        <Text>{label}</Text>
      </Button>
    </DropdownMenuTrigger>
  )
}

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon as={UserIcon} className="size-4" />
              <Text>Profile</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={CreditCardIcon} className="size-4" />
              <Text>Billing</Text>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={GearIcon} className="size-4" />
              <Text>Settings</Text>
              <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
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
            <Icon as={SignOutIcon} className="text-destructive size-4" />
            <Text>Log out</Text>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  ),
}

function CheckboxesDemo() {
  const [statusBar, setStatusBar] = React.useState(true)
  const [activityBar, setActivityBar] = React.useState(false)
  const [panel, setPanel] = React.useState(false)
  return (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton label="View" />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuCheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
            closeOnPress={false}
          >
            <Text>Status bar</Text>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activityBar}
            onCheckedChange={setActivityBar}
            closeOnPress={false}
            disabled
          >
            <Text>Activity bar</Text>
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={panel}
            onCheckedChange={setPanel}
            closeOnPress={false}
          >
            <Text>Panel</Text>
          </DropdownMenuCheckboxItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}

export const Checkboxes: Story = {
  render: () => <CheckboxesDemo />,
}

function RadioGroupDemo() {
  const [position, setPosition] = React.useState("bottom")
  return (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton label="Panel position" />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>Panel position</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top" closeOnPress={false}>
              <Text>Top</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom" closeOnPress={false}>
              <Text>Bottom</Text>
            </DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right" closeOnPress={false}>
              <Text>Right</Text>
            </DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  )
}

export const RadioGroup: Story = {
  render: () => <RadioGroupDemo />,
}

export const Inset: Story = {
  render: () => (
    <View className="items-start">
      <DropdownMenu>
        <OpenButton />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel inset>Actions</DropdownMenuLabel>
          <DropdownMenuItem inset>
            <Text>Copy</Text>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            <Text>Paste</Text>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem inset variant="destructive">
            <Text>Delete</Text>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  ),
}

export const OpenByDefault: Story = {
  render: () => (
    <View className="items-start">
      <DropdownMenu defaultOpen>
        <OpenButton />
        <DropdownMenuContent className="w-56" align="start">
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <Icon as={UserIcon} className="size-4" />
              <Text>Profile</Text>
              <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={CreditCardIcon} className="size-4" />
              <Text>Billing</Text>
              <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Icon as={GearIcon} className="size-4" />
              <Text>Settings</Text>
              <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
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
            <Icon as={SignOutIcon} className="text-destructive size-4" />
            <Text>Log out</Text>
            <DropdownMenuShortcut>⇧⌘Q</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </View>
  ),
}
