// @ts-nocheck
import {
  ChatCircleIcon,
  CreditCardIcon,
  EnvelopeIcon,
  GearIcon,
  SignOutIcon,
  TrashIcon,
  UserIcon,
  UserPlusIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor, within } from "storybook/test"

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const PROFILE = /^Profile/
const BILLING = /^Billing/
const COPY = /^Copy/

const meta = {
  title: "Components/Dropdown Menu",
  component: DropdownMenu,
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            <UserIcon />
            Profile
            <DropdownMenuShortcut mod>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <CreditCardIcon />
            Billing
            <DropdownMenuShortcut mod>B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <GearIcon />
            Settings
            <DropdownMenuShortcut mod>,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <UserPlusIcon />
            Invite users
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <EnvelopeIcon />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <ChatCircleIcon />
              Message
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem disabled>API access</DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <TrashIcon />
          Delete account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <SignOutIcon />
          Log out
          <DropdownMenuShortcut mod>⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
} satisfies Meta<typeof DropdownMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Open menu" })

    await step(
      "opens from the keyboard with the first item focused",
      async () => {
        trigger.focus()
        await userEvent.keyboard("{Enter}")
        const menu = await screen.findByRole("menu")
        await expect(trigger).toHaveAttribute("aria-expanded", "true")
        await waitFor(() =>
          expect(screen.getByRole("menuitem", { name: PROFILE })).toHaveFocus()
        )
        await expect(menu).toBeInTheDocument()
      }
    )

    await step("moves through items with the arrow keys", async () => {
      await userEvent.keyboard("{ArrowDown}")
      await expect(
        screen.getByRole("menuitem", { name: BILLING })
      ).toHaveFocus()
      await expect(
        screen.getByRole("menuitem", { name: "API access" })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("opens the submenu with ArrowRight", async () => {
      const invite = screen.getByRole("menuitem", { name: "Invite users" })
      invite.focus()
      await userEvent.keyboard("{ArrowRight}")
      await waitFor(() =>
        expect(screen.getByRole("menuitem", { name: "Email" })).toHaveFocus()
      )
      await userEvent.keyboard("{ArrowLeft}")
      await waitFor(() => expect(invite).toHaveFocus())
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await expect(trigger).toHaveFocus()
    })

    await step("closes after choosing an item", async () => {
      await userEvent.click(trigger)
      await userEvent.click(
        await screen.findByRole("menuitem", { name: "Delete account" })
      )
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  play: async ({ canvas, step }) => {
    await step("renders the menu open on mount", async () => {
      const menu = await screen.findByRole("menu")
      await waitFor(() => expect(menu).toBeVisible())
      await expect(
        canvas.getByRole("button", { name: "Open menu" })
      ).toHaveAttribute("aria-expanded", "true")
    })

    await step("closes after choosing an item", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: BILLING }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

function CheckboxesExample(props: React.ComponentProps<typeof DropdownMenu>) {
  const [statusBar, setStatusBar] = React.useState(true)
  const [activityBar, setActivityBar] = React.useState(false)
  const [panel, setPanel] = React.useState(false)

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        View
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Appearance</DropdownMenuLabel>
          <DropdownMenuCheckboxItem
            checked={statusBar}
            onCheckedChange={setStatusBar}
          >
            Status bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={activityBar}
            onCheckedChange={setActivityBar}
          >
            Activity bar
          </DropdownMenuCheckboxItem>
          <DropdownMenuCheckboxItem
            checked={panel}
            onCheckedChange={setPanel}
            disabled
          >
            Panel
          </DropdownMenuCheckboxItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const Checkboxes: Story = {
  render: (args) => <CheckboxesExample {...args} />,
  play: async ({ canvas }) => {
    await userEvent.click(canvas.getByRole("button", { name: "View" }))
    const activity = await screen.findByRole("menuitemcheckbox", {
      name: "Activity bar",
    })
    await expect(
      screen.getByRole("menuitemcheckbox", { name: "Status bar" })
    ).toHaveAttribute("aria-checked", "true")
    await expect(activity).toHaveAttribute("aria-checked", "false")
    await userEvent.click(activity)
    await expect(activity).toHaveAttribute("aria-checked", "true")
    const panel = screen.getByRole("menuitemcheckbox", { name: "Panel" })
    await expect(panel).toHaveAttribute("aria-disabled", "true")
  },
}

function RadioGroupExample(props: React.ComponentProps<typeof DropdownMenu>) {
  const [position, setPosition] = React.useState("bottom")

  return (
    <DropdownMenu {...props}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Panel position
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>Position</DropdownMenuLabel>
          <DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
            <DropdownMenuRadioItem value="top">Top</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="bottom">Bottom</DropdownMenuRadioItem>
            <DropdownMenuRadioItem value="right">Right</DropdownMenuRadioItem>
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export const RadioGroup: Story = {
  render: (args) => <RadioGroupExample {...args} />,
  play: async ({ canvas }) => {
    await userEvent.click(
      canvas.getByRole("button", { name: "Panel position" })
    )
    const top = await screen.findByRole("menuitemradio", { name: "Top" })
    await expect(
      screen.getByRole("menuitemradio", { name: "Bottom" })
    ).toHaveAttribute("aria-checked", "true")
    await userEvent.click(top)
    await expect(top).toHaveAttribute("aria-checked", "true")
    await expect(
      screen.getByRole("menuitemradio", { name: "Bottom" })
    ).toHaveAttribute("aria-checked", "false")
  },
}

export const Inset: Story = {
  render: (args) => (
    <DropdownMenu {...args}>
      <DropdownMenuTrigger render={<Button variant="outline" />}>
        Edit
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel inset>Clipboard</DropdownMenuLabel>
          <DropdownMenuItem inset>
            Cut
            <DropdownMenuShortcut mod>X</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            Copy
            <DropdownMenuShortcut mod>C</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem inset>
            Paste
            <DropdownMenuShortcut mod>V</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  ),
  play: async ({ canvas, step }) => {
    const trigger = canvas.getByRole("button", { name: "Edit" })

    await step("opens with a labelled group of inset items", async () => {
      await userEvent.click(trigger)
      const group = await screen.findByRole("group", { name: "Clipboard" })
      await expect(within(group).getAllByRole("menuitem")).toHaveLength(3)
    })

    await step("closes after choosing an item", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: COPY }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })

    await step("closes with Escape and returns focus", async () => {
      await userEvent.click(trigger)
      await screen.findByRole("menu")
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
      await waitFor(() => expect(trigger).toHaveFocus())
    })
  },
}
