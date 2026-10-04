import {
  CalculatorIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  GearIcon,
  SmileyIcon,
  UserIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"

import {
  CommandPalette,
  CommandPaletteContent,
  CommandPaletteTrigger,
} from "@/components/patterns/command-palette"
import { Button } from "@/components/ui/button"
import {
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { Kbd, KbdGroup } from "@/components/ui/kbd"

function PaletteItems() {
  return (
    <>
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
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
            <CommandShortcut mod>P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <CreditCardIcon />
            Billing
            <CommandShortcut mod>B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <GearIcon />
            Settings
            <CommandShortcut mod>S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </>
  )
}

function Trigger() {
  return (
    <CommandPaletteTrigger render={<Button variant="outline" />}>
      Search
      <KbdGroup>
        <Kbd mod />
        <Kbd>K</Kbd>
      </KbdGroup>
    </CommandPaletteTrigger>
  )
}

const meta = {
  title: "Patterns/Command Palette",
  component: CommandPalette,
  parameters: {
    layout: "fullscreen",
  },
  decorators: [
    (Story) => (
      <div className="flex min-h-svh items-center justify-center">
        <Story />
      </div>
    ),
  ],
  render: (args) => (
    <CommandPalette {...args}>
      <Trigger />
      <CommandPaletteContent>
        <PaletteItems />
      </CommandPaletteContent>
    </CommandPalette>
  ),
} satisfies Meta<typeof CommandPalette>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
}

export const WithCloseButton: Story = {
  render: (args) => (
    <CommandPalette {...args}>
      <Trigger />
      <CommandPaletteContent showCloseButton>
        <PaletteItems />
      </CommandPaletteContent>
    </CommandPalette>
  ),
}

export const WithCloseLabel: Story = {
  render: (args) => (
    <CommandPalette {...args}>
      <Trigger />
      <CommandPaletteContent showCloseButton closeLabel="Cancel">
        <PaletteItems />
      </CommandPaletteContent>
    </CommandPalette>
  ),
}

export const Floating: Story = {
  args: { floating: true },
}
