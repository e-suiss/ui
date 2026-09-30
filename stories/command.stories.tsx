import {
  CalculatorIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  GearIcon,
  SmileyIcon,
  UserIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"

function CommandItems() {
  return (
    <>
      <CommandEmpty>No results found.</CommandEmpty>
      <CommandGroup heading="Suggestions">
        <CommandItem>
          <CalendarBlankIcon />
          Calendar
        </CommandItem>
        <CommandItem>
          <SmileyIcon />
          Search emoji
        </CommandItem>
        <CommandItem disabled>
          <CalculatorIcon />
          Calculator
        </CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Settings">
        <CommandItem>
          <UserIcon />
          Profile
          <CommandShortcut>⌘P</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <CreditCardIcon />
          Billing
          <CommandShortcut>⌘B</CommandShortcut>
        </CommandItem>
        <CommandItem>
          <GearIcon />
          Settings
          <CommandShortcut>⌘S</CommandShortcut>
        </CommandItem>
      </CommandGroup>
    </>
  )
}

const meta = {
  title: "Components/Command",
  component: Command,
  decorators: [
    (Story) => (
      <div className="w-96">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Command>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Command {...args} className="ring-foreground/5 shadow-md ring-1">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandItems />
      </CommandList>
    </Command>
  ),
}

export const Empty: Story = {
  render: (args) => (
    <Command {...args} className="ring-foreground/5 shadow-md ring-1">
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
}

function CommandDialogExample({
  defaultOpen = false,
}: {
  defaultOpen?: boolean
}) {
  const [open, setOpen] = React.useState(defaultOpen)

  return (
    <>
      <Button variant="outline" onClick={() => setOpen(true)}>
        Open command palette
      </Button>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command>
          <CommandInput placeholder="Type a command or search..." />
          <CommandList>
            <CommandItems />
          </CommandList>
        </Command>
      </CommandDialog>
    </>
  )
}

export const Dialog: Story = {
  render: () => <CommandDialogExample />,
}

export const DialogOpen: Story = {
  render: () => <CommandDialogExample defaultOpen />,
}
