// @ts-nocheck
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
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

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
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const meta = {
  title: "Components/Button Group",
  component: ButtonGroup,
  args: {
    orientation: "horizontal",
  },
  argTypes: {
    orientation: {
      control: "select",
      options: ["horizontal", "vertical"],
    },
  },
} satisfies Meta<typeof ButtonGroup>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="secondary" size="icon" aria-label="Go back">
          <ArrowLeftIcon />
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
          <DropdownMenuTrigger
            render={
              <Button
                variant="secondary"
                size="icon"
                aria-label="More options"
              />
            }
          >
            <DotsThreeIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ListPlusIcon />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TagIcon />
                Label as
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    await step("groups the buttons", async () => {
      await expect(canvas.getAllByRole("group")).toHaveLength(4)
      await expect(
        canvas.getByRole("button", { name: "Go back" })
      ).toBeVisible()
    })

    await step(
      "opens the overflow menu and closes it with Escape",
      async () => {
        const trigger = canvas.getByRole("button", { name: "More options" })
        await userEvent.click(trigger)
        const item = await screen.findByRole("menuitem", {
          name: "Mark as read",
        })
        await waitFor(() => expect(item).toBeVisible())
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await userEvent.keyboard("{Escape}")
        await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
        await expect(trigger).toHaveFocus()
      }
    )
  },
}

export const Outline: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline" size="icon" aria-label="Go back">
          <ArrowLeftIcon />
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
            <DotsThreeIcon />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ListPlusIcon />
                Mark as read
              </DropdownMenuItem>
              <DropdownMenuItem>
                <ArchiveIcon />
                Archive
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem>
                <ClockIcon />
                Snooze
              </DropdownMenuItem>
              <DropdownMenuItem>
                <CalendarPlusIcon />
                Add to calendar
              </DropdownMenuItem>
              <DropdownMenuItem>
                <TagIcon />
                Label as
              </DropdownMenuItem>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuGroup>
              <DropdownMenuItem variant="destructive">
                <TrashIcon />
                Trash
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const Orientation: Story = {
  args: { orientation: "vertical" },
  render: (args) => (
    <ButtonGroup {...args} aria-label="Media controls">
      <Button variant="secondary" size="icon" aria-label="Zoom in">
        <PlusIcon />
      </Button>
      <ButtonGroupSeparator orientation="horizontal" />
      <Button variant="secondary" size="icon" aria-label="Zoom out">
        <MinusIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const group = canvas.getByRole("group", { name: "Media controls" })
    await expect(group).toHaveAttribute("data-orientation", "vertical")
    const zoomIn = canvas.getByRole("button", { name: "Zoom in" })
    const zoomOut = canvas.getByRole("button", { name: "Zoom out" })
    await expect(zoomIn.getBoundingClientRect().bottom).toBeLessThanOrEqual(
      zoomOut.getBoundingClientRect().top + 1
    )
  },
}

export const Sizes: Story = {
  render: (args) => (
    <div className="flex flex-col items-start gap-6">
      <ButtonGroup {...args}>
        <Button variant="outline" size="sm">
          Small
        </Button>
        <Button variant="outline" size="sm">
          Button
        </Button>
        <Button variant="outline" size="sm">
          Group
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline">Default</Button>
        <Button variant="outline">Button</Button>
        <Button variant="outline">Group</Button>
        <Button variant="outline" size="icon" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup {...args}>
        <Button variant="outline" size="lg">
          Large
        </Button>
        <Button variant="outline" size="lg">
          Button
        </Button>
        <Button variant="outline" size="lg">
          Group
        </Button>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
    </div>
  ),
}

export const Nested: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Button variant="outline" size="sm">
          1
        </Button>
        <Button variant="outline" size="sm">
          2
        </Button>
        <Button variant="outline" size="sm">
          3
        </Button>
        <Button variant="outline" size="sm">
          4
        </Button>
        <Button variant="outline" size="sm">
          5
        </Button>
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-sm" aria-label="Previous">
          <ArrowLeftIcon />
        </Button>
        <Button variant="outline" size="icon-sm" aria-label="Next">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
}

export const WithSeparator: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="secondary">
        <CopyIcon data-icon="inline-start" />
        Copy
      </Button>
      <ButtonGroupSeparator />
      <Button variant="secondary">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
    </ButtonGroup>
  ),
}

export const Plain: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="plain">
        <ArrowLeftIcon data-icon="inline-start" />
        Back
      </Button>
      <Button variant="plain">
        Forward
        <ArrowRightIcon data-icon="inline-end" />
      </Button>
      <Button variant="plain">
        <ShareIcon data-icon="inline-start" />
        Share
      </Button>
    </ButtonGroup>
  ),
}

export const SplitButton: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button>Publish</Button>
      <ButtonGroupSeparator className="bg-on-accent/30" />
      <Button size="icon" aria-label="More options">
        <CaretDownIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    const publish = canvas.getByRole("button", { name: "Publish" })
    const more = canvas.getByRole("button", { name: "More options" })

    await step("joins both halves in one group", async () => {
      const group = canvas.getByRole("group")
      await expect(group).toContainElement(publish)
      await expect(group).toContainElement(more)
      await expect(
        Math.abs(
          more.getBoundingClientRect().left -
            publish.getBoundingClientRect().right
        )
      ).toBeLessThanOrEqual(2)
    })

    await step("moves between the halves with Tab", async () => {
      await userEvent.tab()
      await expect(publish).toHaveFocus()
      await userEvent.tab()
      await expect(more).toHaveFocus()
    })
  },
}

export const WithInput: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Input aria-label="Search" placeholder="Search..." />
      <Button variant="secondary" size="icon-lg" aria-label="Search">
        <MagnifyingGlassIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Search" })
    const button = canvas.getByRole("button", { name: "Search" })

    await step("types into the input inside the group", async () => {
      await userEvent.type(input, "grill")
      await expect(input).toHaveValue("grill")
    })

    await step("moves from the input to its button with Tab", async () => {
      await userEvent.tab()
      await expect(button).toHaveFocus()
      await expect(
        Math.abs(
          button.getBoundingClientRect().left -
            input.getBoundingClientRect().right
        )
      ).toBeLessThanOrEqual(2)
    })
  },
}

export const WithInputGroup: Story = {
  render: (args) => (
    <ButtonGroup {...args} className="w-96">
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" aria-label="Add">
          <PlusIcon />
        </Button>
      </ButtonGroup>
      <ButtonGroup className="flex-1">
        <InputGroup>
          <InputGroupInput
            aria-label="Message"
            placeholder="Send a message..."
          />
          <InputGroupAddon align="inline-end">
            <Tooltip>
              <TooltipTrigger
                render={
                  <InputGroupButton size="icon-xs" aria-label="Voice mode" />
                }
              >
                <MicrophoneIcon />
              </TooltipTrigger>
              <TooltipContent>Voice mode</TooltipContent>
            </Tooltip>
          </InputGroupAddon>
        </InputGroup>
      </ButtonGroup>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("textbox", { name: "Message" })
    const voice = canvas.getByRole("button", { name: "Voice mode" })

    await step("types into the input group", async () => {
      await userEvent.type(input, "Table 4 is ready")
      await expect(input).toHaveValue("Table 4 is ready")
    })

    await step("reaches the voice button and shows its tooltip", async () => {
      await userEvent.tab()
      await expect(voice).toHaveFocus()
      await waitFor(
        () => expect(screen.getByText("Voice mode")).toBeVisible(),
        { timeout: 3000 }
      )
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByText("Voice mode")).toBeNull())
    })
  },
}

export const WithText: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroupText>
        <LinkIcon />
        https://
      </ButtonGroupText>
      <Input aria-label="Website" placeholder="example.com" />
      <Button variant="secondary" size="lg">
        Save
      </Button>
    </ButtonGroup>
  ),
}

export const WithDropdownMenu: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">Follow</Button>
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <Button variant="outline" size="icon" aria-label="More options" />
          }
        >
          <CaretDownIcon />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuGroup>
            <DropdownMenuItem>
              <WarningCircleIcon />
              Mute conversation
            </DropdownMenuItem>
            <DropdownMenuItem>
              <CopyIcon />
              Copy link
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ShareIcon />
              Share conversation
            </DropdownMenuItem>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuGroup>
            <DropdownMenuItem variant="destructive">
              <UserCircleMinusIcon />
              Unfollow
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuContent>
      </DropdownMenu>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "More options" })

    await step("opens the menu from the group", async () => {
      await userEvent.click(trigger)
      const item = await screen.findByRole("menuitem", { name: "Copy link" })
      await waitFor(() => expect(item).toBeVisible())
      await expect(trigger).toHaveAttribute("aria-expanded", "true")
      await expect(screen.getAllByRole("menuitem")).toHaveLength(4)
    })

    await step("closes after choosing an item", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: "Copy link" }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await expect(trigger).toHaveAttribute("aria-expanded", "false")
    })
  },
}

const currencies = [
  { value: "usd", label: "$" },
  { value: "eur", label: "€" },
  { value: "gbp", label: "£" },
  { value: "try", label: "₺" },
]

export const WithSelect: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <ButtonGroup>
        <Select defaultValue="usd" items={currencies}>
          <SelectTrigger aria-label="Currency" className="font-mono">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {currencies.map((currency) => (
                <SelectItem key={currency.value} value={currency.value}>
                  {currency.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Input aria-label="Amount" placeholder="10.00" inputMode="decimal" />
      </ButtonGroup>
      <ButtonGroup>
        <Button variant="outline" size="icon-lg" aria-label="Send">
          <ArrowRightIcon />
        </Button>
      </ButtonGroup>
    </ButtonGroup>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("combobox", { name: "Currency" })
    const amount = canvas.getByRole("textbox", { name: "Amount" })

    await step("picks a currency from the select", async () => {
      await expect(trigger).toHaveTextContent("$")
      await userEvent.click(trigger)
      await userEvent.click(await screen.findByRole("option", { name: "€" }))
      await waitFor(() => expect(screen.queryByRole("listbox")).toBeNull())
      await expect(trigger).toHaveTextContent("€")
    })

    await step("types an amount next to it", async () => {
      await userEvent.type(amount, "12.50")
      await expect(amount).toHaveValue("12.50")
      await userEvent.tab()
      await expect(canvas.getByRole("button", { name: "Send" })).toHaveFocus()
    })
  },
}

export const WithPopover: Story = {
  render: (args) => (
    <ButtonGroup {...args}>
      <Button variant="outline">
        <SparkleIcon data-icon="inline-start" />
        Assistant
      </Button>
      <Popover>
        <PopoverTrigger
          render={
            <Button variant="outline" size="icon" aria-label="Open popover" />
          }
        >
          <CaretDownIcon />
        </PopoverTrigger>
        <PopoverContent align="end" className="w-80">
          <PopoverHeader>
            <PopoverTitle>Start a new task</PopoverTitle>
            <PopoverDescription>
              Describe your task in natural language.
            </PopoverDescription>
          </PopoverHeader>
          <Textarea
            aria-label="Task description"
            placeholder="I need to..."
            className="resize-none"
          />
        </PopoverContent>
      </Popover>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    const trigger = canvas.getByRole("button", { name: "Open popover" })
    await userEvent.click(trigger)
    const popover = await screen.findByRole("dialog", {
      name: "Start a new task",
    })
    await waitFor(() => expect(popover).toBeVisible())
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    await expect(trigger).toHaveFocus()
  },
}

export const Pagination: Story = {
  render: (args) => (
    <ButtonGroup {...args} aria-label="Pagination">
      <Button variant="outline" size="icon" aria-label="Previous page">
        <CaretLeftIcon />
      </Button>
      <Button variant="outline">1</Button>
      <Button variant="outline" aria-current="page">
        2
      </Button>
      <Button variant="outline">3</Button>
      <Button variant="outline" size="icon" aria-label="Next page">
        <CaretRightIcon />
      </Button>
    </ButtonGroup>
  ),
  play: async ({ canvas }) => {
    await expect(
      canvas.getByRole("group", { name: "Pagination" })
    ).toBeVisible()
    await expect(canvas.getByRole("button", { name: "2" })).toHaveAttribute(
      "aria-current",
      "page"
    )
  },
}
