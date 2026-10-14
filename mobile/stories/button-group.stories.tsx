import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArchiveIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  CalendarPlusIcon,
  CaretDownIcon,
  CaretLeftIcon,
  CaretRightIcon,
  ClockIcon,
  CopyIcon,
  DotsThreeIcon,
  LinkIcon,
  ListPlusIcon,
  MagnifyingGlassIcon,
  MicrophoneIcon,
  MinusIcon,
  PlusIcon,
  ShareIcon,
  SparkleIcon,
  TagIcon,
  TrashIcon,
  UserCircleMinusIcon,
  WarningCircleIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from "@/components/ui/button-group"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
} from "@/components/ui/input-group"
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  type Option,
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Text } from "@/components/ui/text"
import { Textarea } from "@/components/ui/textarea"

function MailMenuContent() {
  return (
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
  )
}

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
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
          <MailMenuContent />
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Outline: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon" accessibilityLabel="Go back">
          <Icon as={ArrowLeftIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <Text>Archive</Text>
        </Button>
        <Button variant="outline">
          <Text>Report</Text>
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <Text>Snooze</Text>
        </Button>
        <DropdownMenu>
          <DropdownMenuTrigger
            accessibilityLabel="More options"
            render={<Button variant="outline" size="icon" />}
          >
            <Icon as={DotsThreeIcon} />
          </DropdownMenuTrigger>
          <MailMenuContent />
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Orientation: Story = {
  render: () => (
    <ButtonGroup orientation="vertical" accessibilityLabel="Media controls">
      <Button variant="secondary" size="icon" accessibilityLabel="Zoom in">
        <Icon as={PlusIcon} />
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="secondary" size="icon" accessibilityLabel="Zoom out">
        <Icon as={MinusIcon} />
      </Button>
    </ButtonGroup>
  ),
}

export const Sizes: Story = {
  render: () => (
    <View className="items-start gap-6">
      <ButtonGroup>
        <Button variant="outline" size="sm">
          <Text>Small</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>Button</Text>
        </Button>
        <Button variant="outline" size="sm">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline">
          <Text>Default</Text>
        </Button>
        <Button variant="outline">
          <Text>Button</Text>
        </Button>
        <Button variant="outline">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="lg">
          <Text>Large</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>Button</Text>
        </Button>
        <Button variant="outline" size="lg">
          <Text>Group</Text>
        </Button>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
    </View>
  ),
}

export const Nested: Story = {
  render: () => (
    <ButtonGroup>
      <ButtonGroup>
        {["1", "2", "3", "4", "5"].map((page) => (
          <Button key={page} variant="outline" size="sm">
            <Text>{page}</Text>
          </Button>
        ))}
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Previous">
          <Icon as={ArrowLeftIcon} />
        </Button>
        <Button variant="outline" size="icon-sm" accessibilityLabel="Next">
          <Icon as={ArrowRightIcon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="secondary">
        <Icon as={CopyIcon} />
        <Text>Copy</Text>
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
        <Icon as={ShareIcon} />
        <Text>Share</Text>
      </Button>
    </ButtonGroup>
  ),
}

export const Plain: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="plain">
        <Icon as={ArrowLeftIcon} />
        <Text>Back</Text>
      </Button>
      <Button variant="plain">
        <Text>Forward</Text>
        <Icon as={ArrowRightIcon} />
      </Button>
      <Button variant="plain">
        <Icon as={ShareIcon} />
        <Text>Share</Text>
      </Button>
    </ButtonGroup>
  ),
}

export const SplitButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button>
        <Text>Publish</Text>
      </Button>
      <ButtonGroupSeparator className="bg-on-accent/30" />
      <Button size="icon" accessibilityLabel="More options">
        <Icon as={CaretDownIcon} />
      </Button>
    </ButtonGroup>
  ),
}

export const WithInput: Story = {
  render: () => (
    <ButtonGroup className="self-stretch">
      <Input
        accessibilityLabel="Search"
        placeholder="Search..."
        className="w-auto flex-1"
      />
      <Button variant="secondary" size="icon-lg" accessibilityLabel="Search">
        <Icon as={MagnifyingGlassIcon} />
      </Button>
    </ButtonGroup>
  ),
}

export const WithInputGroup: Story = {
  render: () => (
    <ButtonGroup className="self-stretch">
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Add">
          <Icon as={PlusIcon} />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup className="flex-1">
          <InputGroupInput
            accessibilityLabel="Message"
            placeholder="Send a message..."
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" accessibilityLabel="Voice mode">
              <Icon as={MicrophoneIcon} />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const WithText: Story = {
  render: () => (
    <ButtonGroup className="self-stretch">
      <ButtonGroupText>
        <Icon as={LinkIcon} />
        <Text>https://</Text>
      </ButtonGroupText>
      <Input
        accessibilityLabel="Website"
        placeholder="example.com"
        className="w-auto flex-1"
      />
      <Button variant="secondary" size="lg">
        <Text>Save</Text>
      </Button>
    </ButtonGroup>
  ),
}

export const WithDropdownMenu: Story = {
  render: () => (
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
  ),
}

const currencies: Option[] = [
  { value: "usd", label: "$" },
  { value: "eur", label: "€" },
  { value: "gbp", label: "£" },
  { value: "try", label: "₺" },
]

function CurrencyExample() {
  const [value, setValue] = React.useState<string | null>("usd")
  return (
    <ButtonGroup className="self-stretch">
      <ButtonGroup className="flex-1">
        <Select items={currencies} value={value} onValueChange={setValue}>
          <SelectTrigger accessibilityLabel="Currency">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((currency) => (
                <SelectItem
                  key={currency.value}
                  value={currency.value}
                  label={currency.label}
                />
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input
          accessibilityLabel="Amount"
          placeholder="10.00"
          inputMode="decimal"
          className="w-auto flex-1"
        />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" accessibilityLabel="Send">
          <Icon as={ArrowRightIcon} />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  )
}

export const WithSelect: Story = {
  render: () => <CurrencyExample />,
}

export const WithPopover: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="outline">
        <Icon as={SparkleIcon} />
        <Text>Assistant</Text>
      </Button>
      <Popover>
        <PopoverTrigger
          accessibilityLabel="Open popover"
          render={<Button variant="outline" size="icon" />}
        >
          <Icon as={CaretDownIcon} />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Start a new task</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Textarea
            accessibilityLabel="Task description"
            placeholder="I need to..."
          />
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
}

export const Pagination: Story = {
  render: () => (
    <ButtonGroup accessibilityLabel="Pagination">
      <Button variant="outline" size="icon" accessibilityLabel="Previous page">
        <Icon as={CaretLeftIcon} />
      </Button>
      <Button variant="outline">
        <Text>1</Text>
      </Button>
      <Button variant="outline" accessibilityState={{ selected: true }}>
        <Text>2</Text>
      </Button>
      <Button variant="outline">
        <Text>3</Text>
      </Button>
      <Button variant="outline" size="icon" accessibilityLabel="Next page">
        <Icon as={CaretRightIcon} />
      </Button>
    </ButtonGroup>
  ),
}
