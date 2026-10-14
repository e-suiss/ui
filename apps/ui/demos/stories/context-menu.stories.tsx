// @ts-nocheck
import {
  ArrowClockwiseIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import { expect, screen, userEvent, waitFor } from "storybook/test"

import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu"

const FORWARD = /^Forward/
const RELOAD = /^Reload/

const meta = {
  title: "Components/Context Menu",
  component: ContextMenu,
} satisfies Meta<typeof ContextMenu>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-label-secondary flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <ArrowLeftIcon />
            Back
            <ContextMenuShortcut mod>[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem disabled>
            <ArrowRightIcon />
            Forward
            <ContextMenuShortcut mod>]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <ArrowClockwiseIcon />
            Reload
            <ContextMenuShortcut mod>R</ContextMenuShortcut>
          </ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuSub>
          <ContextMenuSubTrigger>More tools</ContextMenuSubTrigger>
          <ContextMenuSubContent>
            <ContextMenuItem>Save page as...</ContextMenuItem>
            <ContextMenuItem>Create shortcut...</ContextMenuItem>
            <ContextMenuItem>Developer tools</ContextMenuItem>
          </ContextMenuSubContent>
        </ContextMenuSub>
        <ContextMenuSeparator />
        <ContextMenuGroup>
          <ContextMenuCheckboxItem defaultChecked>
            Show bookmarks bar
          </ContextMenuCheckboxItem>
          <ContextMenuCheckboxItem>Show full URLs</ContextMenuCheckboxItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuRadioGroup defaultValue="ada">
          <ContextMenuLabel inset>People</ContextMenuLabel>
          <ContextMenuRadioItem value="ada">Ada Lovelace</ContextMenuRadioItem>
          <ContextMenuRadioItem value="alan">Alan Turing</ContextMenuRadioItem>
        </ContextMenuRadioGroup>
        <ContextMenuSeparator />
        <ContextMenuItem variant="destructive">
          <TrashIcon />
          Delete
          <ContextMenuShortcut mod>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvas, step }) => {
    const area = canvas.getByText("Right click here")

    await step("opens on right click", async () => {
      await userEvent.pointer({ keys: "[MouseRight]", target: area })
      const menu = await screen.findByRole("menu")
      await waitFor(() => expect(menu).toBeVisible())
      await expect(
        screen.getByRole("menuitem", { name: FORWARD })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("reflects checkbox and radio state", async () => {
      await expect(
        screen.getByRole("menuitemcheckbox", { name: "Show bookmarks bar" })
      ).toHaveAttribute("aria-checked", "true")
      await expect(
        screen.getByRole("menuitemradio", { name: "Ada Lovelace" })
      ).toHaveAttribute("aria-checked", "true")
      await userEvent.click(
        screen.getByRole("menuitemcheckbox", { name: "Show full URLs" })
      )
      await expect(
        screen.getByRole("menuitemcheckbox", { name: "Show full URLs" })
      ).toHaveAttribute("aria-checked", "true")
    })

    await step("opens the submenu from the keyboard", async () => {
      const more = screen.getByRole("menuitem", { name: "More tools" })
      more.focus()
      await userEvent.keyboard("{ArrowRight}")
      await waitFor(() =>
        expect(
          screen.getByRole("menuitem", { name: "Save page as..." })
        ).toHaveFocus()
      )
      await userEvent.keyboard("{ArrowLeft}")
      await waitFor(() => expect(more).toHaveFocus())
    })

    await step("closes with Escape", async () => {
      await userEvent.keyboard("{Escape}")
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const OpenByDefault: Story = {
  args: { defaultOpen: true },
  render: Default.render,
  play: async ({ step }) => {
    await step("renders the menu open on mount", async () => {
      const menu = await screen.findByRole("menu")
      await waitFor(() => expect(menu).toBeVisible())
      await expect(
        screen.getByRole("menuitem", { name: FORWARD })
      ).toHaveAttribute("aria-disabled", "true")
    })

    await step("closes after choosing an item", async () => {
      await userEvent.click(screen.getByRole("menuitem", { name: RELOAD }))
      await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    })
  },
}

export const Inset: Story = {
  render: (args) => (
    <ContextMenu {...args}>
      <ContextMenuTrigger className="text-label-secondary flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm">
        Right click a file
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuLabel inset>report.pdf</ContextMenuLabel>
          <ContextMenuItem inset>Open</ContextMenuItem>
          <ContextMenuItem inset>Rename</ContextMenuItem>
          <ContextMenuItem inset>Duplicate</ContextMenuItem>
        </ContextMenuGroup>
        <ContextMenuSeparator />
        <ContextMenuItem inset variant="destructive">
          Move to trash
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  ),
  play: async ({ canvas }) => {
    await userEvent.pointer({
      keys: "[MouseRight]",
      target: canvas.getByText("Right click a file"),
    })
    await userEvent.click(
      await screen.findByRole("menuitem", { name: "Rename" })
    )
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  },
}
