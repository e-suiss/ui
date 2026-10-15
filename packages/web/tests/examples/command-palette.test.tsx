import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
import CommandPaletteDemo from "@/examples/command-palette-demo"
import CommandPaletteWithCloseButton from "@/examples/command-palette-with-close-button"
import CommandPaletteWithCloseLabel from "@/examples/command-palette-with-close-label"
import { isMacPlatform } from "@/hooks/use-platform"
import { renderExample } from "@/tests/render-example"

function PaletteItems() {
  return (
    <>
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
const PROFILE = /Profile/
const BILLING = /Billing/
const SEARCH = /^Search/
function pressHotkey() {
  return userEvent.keyboard(
    isMacPlatform() ? "{Meta>}k{/Meta}" : "{Control>}k{/Control}"
  )
}
function findPalette() {
  return screen.findByRole("dialog", { name: "Command Palette" })
}
async function closeWith(action: () => Promise<unknown>) {
  await findPalette()
  await action()
  await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
}

function CommandPaletteOpenByDefault() {
  return (
    <div className="flex min-h-svh items-center justify-center">
      <CommandPalette defaultOpen>
        <Trigger />
        <CommandPaletteContent>
          <PaletteItems />
        </CommandPaletteContent>
      </CommandPalette>
    </div>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<CommandPaletteDemo />)

  await step(
    "the shortcut opens the palette with the search focused",
    async () => {
      await pressHotkey()
      const palette = await findPalette()
      await waitFor(() =>
        expect(
          within(palette).getByPlaceholderText("Type a command or search...")
        ).toHaveFocus()
      )
      await expect(
        within(palette).getByRole("option", { name: "Calendar" })
      ).toHaveAttribute("aria-selected", "true")
    }
  )

  await step("arrow keys skip the disabled item", async () => {
    await userEvent.keyboard("{ArrowDown}{ArrowDown}")
    await expect(screen.getByRole("option", { name: PROFILE })).toHaveAttribute(
      "aria-selected",
      "true"
    )
  })

  await step("typing filters the commands", async () => {
    await userEvent.keyboard("bill")
    await waitFor(() =>
      expect(screen.queryByRole("option", { name: "Calendar" })).toBeNull()
    )
    await expect(screen.getByRole("option", { name: BILLING })).toHaveAttribute(
      "aria-selected",
      "true"
    )
    await userEvent.keyboard("zzz")
    await waitFor(() =>
      expect(screen.getByText("No results found.")).toBeVisible()
    )
  })

  await step("the shortcut closes it again", async () => {
    await pressHotkey()
    await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
  })

  await step("the trigger opens it and Escape returns focus", async () => {
    const trigger = canvas.getByRole("button", { name: SEARCH })
    await userEvent.click(trigger)
    await closeWith(() => userEvent.keyboard("{Escape}"))
    await waitFor(() => expect(trigger).toHaveFocus())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<CommandPaletteOpenByDefault />)

  await step("renders open and closes with Escape", async () => {
    await closeWith(() => userEvent.keyboard("{Escape}"))
  })
})
test("With Close Button", async () => {
  const { canvas, step } = await renderExample(
    <CommandPaletteWithCloseButton />
  )

  await step("closes from the close button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: SEARCH }))
    await closeWith(async () =>
      userEvent.click(await screen.findByRole("button", { name: "Close" }))
    )
  })
})
test("With Close Label", async () => {
  const { canvas, step } = await renderExample(<CommandPaletteWithCloseLabel />)

  await step("closes from the labelled close button", async () => {
    await userEvent.click(canvas.getByRole("button", { name: SEARCH }))
    await closeWith(async () =>
      userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
    )
  })
})
