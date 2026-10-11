// @ts-nocheck
import {
  CalculatorIcon,
  CalendarBlankIcon,
  CreditCardIcon,
  GearIcon,
  SmileyIcon,
  UserIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

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
import { isMacPlatform } from "@/hooks/use-platform"

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

export const Default: Story = {
  play: async ({ canvas, step }) => {
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
      await expect(
        screen.getByRole("option", { name: PROFILE })
      ).toHaveAttribute("aria-selected", "true")
    })

    await step("typing filters the commands", async () => {
      await userEvent.keyboard("bill")
      await waitFor(() =>
        expect(screen.queryByRole("option", { name: "Calendar" })).toBeNull()
      )
      await expect(
        screen.getByRole("option", { name: BILLING })
      ).toHaveAttribute("aria-selected", "true")
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
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  play: async ({ step }) => {
    await step("renders open and closes with Escape", async () => {
      await closeWith(() => userEvent.keyboard("{Escape}"))
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("closes from the close button", async () => {
      await userEvent.click(canvas.getByRole("button", { name: SEARCH }))
      await closeWith(async () =>
        userEvent.click(await screen.findByRole("button", { name: "Close" }))
      )
    })
  },
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
  play: async ({ canvas, step }) => {
    await step("closes from the labelled close button", async () => {
      await userEvent.click(canvas.getByRole("button", { name: SEARCH }))
      await closeWith(async () =>
        userEvent.click(await screen.findByRole("button", { name: "Cancel" }))
      )
    })
  },
}

export const Floating: Story = {
  args: { floating: true },
}
