import { screen, waitFor, within } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import DropdownMenuCheckboxes from "@/examples/dropdown-menu-checkboxes"
import DropdownMenuDemo from "@/examples/dropdown-menu-demo"
import DropdownMenuInset from "@/examples/dropdown-menu-inset"
import DropdownMenuRadioGroupExample from "@/examples/dropdown-menu-radio-group"
import { byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const PROFILE = /^Profile/
const BILLING = /^Billing/
const COPY = /^Copy/

function DropdownMenuOpenByDefault() {
  return (
    <DropdownMenu defaultOpen>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline" })}>
        Open menu
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuGroup>
          <DropdownMenuLabel>My account</DropdownMenuLabel>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="UserIcon"
              tabler="IconUser"
              hugeicons="UserIcon"
              phosphor="UserIcon"
              remixicon="RiUserLine"
            />
            Profile
            <DropdownMenuShortcut mod>⇧P</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="CreditCardIcon"
              tabler="IconCreditCard"
              hugeicons="CreditCardIcon"
              phosphor="CreditCardIcon"
              remixicon="RiBankCardLine"
            />
            Billing
            <DropdownMenuShortcut mod>B</DropdownMenuShortcut>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <IconPlaceholder
              lucide="SettingsIcon"
              tabler="IconSettings"
              hugeicons="Settings01Icon"
              phosphor="GearIcon"
              remixicon="RiSettingsLine"
            />
            Settings
            <DropdownMenuShortcut mod>,</DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuSub>
          <DropdownMenuSubTrigger>
            <IconPlaceholder
              lucide="UserPlusIcon"
              tabler="IconUserPlus"
              hugeicons="UserAdd01Icon"
              phosphor="UserPlusIcon"
              remixicon="RiUserAddLine"
            />
            Invite users
          </DropdownMenuSubTrigger>
          <DropdownMenuSubContent>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="MailIcon"
                tabler="IconMail"
                hugeicons="Mail01Icon"
                phosphor="EnvelopeIcon"
                remixicon="RiMailLine"
              />
              Email
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconPlaceholder
                lucide="MessageCircleIcon"
                tabler="IconMessageCircle"
                hugeicons="BubbleChatIcon"
                phosphor="ChatCircleIcon"
                remixicon="RiChat1Line"
              />
              Message
            </DropdownMenuItem>
          </DropdownMenuSubContent>
        </DropdownMenuSub>
        <DropdownMenuItem
          {...byBase<object>({
            base: { disabled: true },
            radix: { disabled: true },
            aria: { isDisabled: true },
          })}
        >
          API access
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem variant="destructive">
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
          />
          Delete account
        </DropdownMenuItem>
        <DropdownMenuItem>
          <IconPlaceholder
            lucide="LogOutIcon"
            tabler="IconLogout"
            hugeicons="Logout01Icon"
            phosphor="SignOutIcon"
            remixicon="RiLogoutBoxLine"
          />
          Log out
          <DropdownMenuShortcut mod>⇧Q</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<DropdownMenuDemo />)

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
    await expect(screen.getByRole("menuitem", { name: BILLING })).toHaveFocus()
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
    await waitFor(() => expect(trigger).toHaveFocus())
  })

  await step("closes after choosing an item", async () => {
    await userEvent.click(trigger)
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Delete account" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { canvas, step } = await renderExample(<DropdownMenuOpenByDefault />)

  await step("renders the menu open on mount", async () => {
    const menu = await screen.findByRole("menu")
    await waitFor(() => expect(menu).toBeVisible())
    await expect(
      canvas.getByRole("button", { name: "Open menu", hidden: true })
    ).toHaveAttribute("aria-expanded", "true")
  })

  await step("closes after choosing an item", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: BILLING }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Checkboxes", async () => {
  const { canvas } = await renderExample(<DropdownMenuCheckboxes />)

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
})
test("Radio Group", async () => {
  const { canvas } = await renderExample(<DropdownMenuRadioGroupExample />)

  await userEvent.click(canvas.getByRole("button", { name: "Panel position" }))
  const top = await screen.findByRole("menuitemradio", { name: "Top" })
  await expect(
    screen.getByRole("menuitemradio", { name: "Bottom" })
  ).toHaveAttribute("aria-checked", "true")
  await userEvent.click(top)
  await expect(top).toHaveAttribute("aria-checked", "true")
  await expect(
    screen.getByRole("menuitemradio", { name: "Bottom" })
  ).toHaveAttribute("aria-checked", "false")
})
test("Inset", async () => {
  const { canvas, step } = await renderExample(<DropdownMenuInset />)

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
})
