import {
  CalculatorIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  GearIcon,
  SmileyIcon,
  UserIcon,
} from "@phosphor-icons/react"
import {
  Command,
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
    </>
  )
}

export default function CommandDemo() {
  return (
    <div className="w-140">
      <Command className="ring-label/5 shadow-md ring-1">
        <CommandInput placeholder="Type a command or search..." />
        <CommandList>
          <CommandItems />
        </CommandList>
      </Command>
    </div>
  )
}
