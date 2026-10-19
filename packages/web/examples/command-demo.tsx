import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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

export default function CommandDemo() {
  return (
    <Command className="w-140 ring-foreground/5 shadow-md ring-1">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem>
            <IconPlaceholder
              lucide="CalendarIcon"
              tabler="IconCalendar"
              hugeicons="Calendar01Icon"
              phosphor="CalendarBlankIcon"
              remixicon="RiCalendarLine"
            />
            Calendar
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="SmileIcon"
              tabler="IconMoodSmile"
              hugeicons="SmileIcon"
              phosphor="SmileyIcon"
              remixicon="RiEmotionLine"
            />
            Search emoji
          </CommandItem>
          <CommandItem disabled>
            <IconPlaceholder
              lucide="CalculatorIcon"
              tabler="IconCalculator"
              hugeicons="CalculatorIcon"
              phosphor="CalculatorIcon"
              remixicon="RiCalculatorLine"
            />
            Calculator
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
            />
            Profile
            <CommandShortcut mod>P</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="CreditCardIcon"
              tabler="IconCreditCard"
              hugeicons="CreditCardIcon"
              phosphor="CreditCardIcon"
              remixicon="RiBankCardLine"
            />
            Billing
            <CommandShortcut mod>B</CommandShortcut>
          </CommandItem>
          <CommandItem>
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="Settings01Icon"
              phosphor="GearIcon"
              remixicon="RiSettingsLine"
            />
            Settings
            <CommandShortcut mod>S</CommandShortcut>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </Command>
  )
}
