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
import * as React from "react"
import { expect, screen, userEvent, waitFor } from "storybook/test"

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

const PROFILE = /^Profile/

const meta = {
  title: "Components/Command",
  component: Command,
  decorators: [
    (Story) => (
      <div className="w-140">
        <Story />
      </div>
    ),
  ],
} satisfies Meta<typeof Command>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <Command {...args} className="ring-label/5 shadow-md ring-1">
      <CommandInput placeholder="Type a command or search..." />
      <CommandList>
        <CommandItems />
      </CommandList>
    </Command>
  ),
  play: async ({ canvas, step }) => {
    const input = canvas.getByRole("combobox")

    await step(
      "highlights the first item and skips disabled ones",
      async () => {
        await expect(
          canvas.getByRole("option", { name: "Calendar" })
        ).toHaveAttribute("aria-selected", "true")
        await expect(
          canvas.getByRole("option", { name: "Calculator" })
        ).toHaveAttribute("aria-disabled", "true")
        await userEvent.click(input)
        await userEvent.keyboard("{ArrowDown}{ArrowDown}")
        await expect(
          canvas.getByRole("option", { name: PROFILE })
        ).toHaveAttribute("aria-selected", "true")
      }
    )

    await step("filters items while typing", async () => {
      await userEvent.type(input, "bill")
      await waitFor(() => expect(canvas.getAllByRole("option")).toHaveLength(1))
      await expect(canvas.getByRole("option")).toHaveTextContent("Billing")
    })

    await step("shows the empty state for no matches", async () => {
      await userEvent.clear(input)
      await userEvent.type(input, "zzz")
      await expect(await canvas.findByText("No results found.")).toBeVisible()
    })
  },
}

export const Empty: Story = {
  render: (args) => (
    <Command {...args} className="ring-label/5 shadow-md ring-1">
      <CommandInput placeholder="Search projects..." />
      <CommandList>
        <CommandEmpty>No projects found.</CommandEmpty>
      </CommandList>
    </Command>
  ),
  play: async ({ canvas, step }) => {
    await step("shows the empty state with no items", async () => {
      await expect(canvas.getByText("No projects found.")).toBeVisible()
      await expect(canvas.queryAllByRole("option")).toHaveLength(0)
      await userEvent.type(canvas.getByRole("combobox"), "web")
      await expect(canvas.getByText("No projects found.")).toBeVisible()
    })
  },
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
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", {
      name: "Open command palette",
    })

    await step("opens a named palette with focus in the search", async () => {
      await userEvent.click(trigger)
      const dialog = await screen.findByRole("dialog", {
        name: "Command Palette",
      })
      await waitFor(() =>
        expect(dialog).toContainElement(document.activeElement as HTMLElement)
      )
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  },
}

export const DialogOpen: Story = {
  render: () => <CommandDialogExample defaultOpen />,
  play: async ({ step }) => {
    await step("renders the palette open on mount", async () => {
      const dialog = await screen.findByRole("dialog", {
        name: "Command Palette",
      })
      await waitFor(() => expect(dialog).toBeVisible())
    })

    await step("filters items while typing", async () => {
      await userEvent.type(screen.getByRole("combobox"), "cal")
      await waitFor(() => expect(screen.getAllByRole("option")).toHaveLength(2))
    })

    await step("closes with Escape", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })
  },
}
