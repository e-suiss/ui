import {
  CalculatorIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  GearIcon,
  SmileyIcon,
  UserIcon,
} from "@phosphor-icons/react"
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

export default function CommandPaletteFloating() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <CommandPalette floating>
        <Trigger />
        <CommandPaletteContent>
          <PaletteItems />
        </CommandPaletteContent>
      </CommandPalette>
    </div>
  )
}
