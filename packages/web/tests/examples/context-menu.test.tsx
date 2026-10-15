import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
import ContextMenuDemo from "@/examples/context-menu-demo"
import ContextMenuInset from "@/examples/context-menu-inset"
import { base, byBase } from "@/tests/base"
import { renderExample } from "@/tests/render-example"

const FORWARD = /^Forward/
const RELOAD = /^Reload/

function ContextMenuOpenByDefault() {
  return (
    <ContextMenu
      {...byBase<object>({
        base: { defaultOpen: true },
        radix: {},
        aria: { defaultOpen: true },
      })}
    >
      <ContextMenuTrigger className="text-muted-foreground flex h-40 w-72 items-center justify-center rounded-2xl border border-dashed text-sm">
        Right click here
      </ContextMenuTrigger>
      <ContextMenuContent>
        <ContextMenuGroup>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="ArrowLeftIcon"
              tabler="IconArrowLeft"
              hugeicons="ArrowLeft02Icon"
              phosphor="ArrowLeftIcon"
              remixicon="RiArrowLeftLine"
            />
            Back
            <ContextMenuShortcut mod>[</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem
            {...byBase<object>({
              base: { disabled: true },
              radix: { disabled: true },
              aria: { isDisabled: true },
            })}
          >
            <IconPlaceholder
              lucide="ArrowRightIcon"
              tabler="IconArrowRight"
              hugeicons="ArrowRight02Icon"
              phosphor="ArrowRightIcon"
              remixicon="RiArrowRightLine"
            />
            Forward
            <ContextMenuShortcut mod>]</ContextMenuShortcut>
          </ContextMenuItem>
          <ContextMenuItem>
            <IconPlaceholder
              lucide="RotateCwIcon"
              tabler="IconRotateClockwise"
              hugeicons="Rotate01Icon"
              phosphor="ArrowClockwiseIcon"
              remixicon="RiResetRightLine"
            />
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
          <ContextMenuCheckboxItem
            {...byBase<object>({
              base: { defaultChecked: true },
              radix: { defaultChecked: true },
              aria: { defaultSelected: true },
            })}
          >
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
          <IconPlaceholder
            lucide="TrashIcon"
            tabler="IconTrash"
            hugeicons="Delete02Icon"
            phosphor="TrashIcon"
            remixicon="RiDeleteBinLine"
          />
          Delete
          <ContextMenuShortcut mod>⌫</ContextMenuShortcut>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}

test("Default", async () => {
  const { canvas, step } = await renderExample(<ContextMenuDemo />)

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
})
test("Open By Default", async () => {
  const { step } = await renderExample(<ContextMenuOpenByDefault />)

  await step("renders the menu open on mount", async () => {
    if (base === "radix")
      await userEvent.pointer({
        keys: "[MouseRight]",
        target: screen.getByText("Right click here"),
      })
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
})
test("Inset", async () => {
  const { canvas } = await renderExample(<ContextMenuInset />)

  await userEvent.pointer({
    keys: "[MouseRight]",
    target: canvas.getByText("Right click a file"),
  })
  await userEvent.click(await screen.findByRole("menuitem", { name: "Rename" }))
  await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
})
