import * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  ActionBar,
  ActionBarContent,
  ActionBarItem,
  ActionBarLabel,
  ActionBarMenu,
  ActionBarSeparator,
  ActionBarShortcut,
  ActionBarTrigger,
} from "@/components/patterns/action-bar"

afterEach(async () => {
  await page.viewport(1280, 800)
})

type BarProps = React.ComponentProps<typeof ActionBar> & {
  onCopy?: () => void
  onMenuOpenChange?: (open: boolean) => void
  fileOpen?: boolean
}

function Bar({ onCopy, onMenuOpenChange, fileOpen, ...props }: BarProps) {
  return (
    <ActionBar aria-label="Document" {...props}>
      <ActionBarMenu defaultOpen={fileOpen} onOpenChange={onMenuOpenChange}>
        <ActionBarTrigger>File</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarItem>
            New tab
            <ActionBarShortcut>T</ActionBarShortcut>
          </ActionBarItem>
          <ActionBarItem disabled>New incognito window</ActionBarItem>
          <ActionBarSeparator />
          <ActionBarItem>Print</ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
      <ActionBarMenu>
        <ActionBarTrigger>Edit</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarItem onClick={onCopy}>Copy</ActionBarItem>
          <ActionBarItem variant="destructive">Delete</ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
      <ActionBarMenu>
        <ActionBarTrigger>View</ActionBarTrigger>
        <ActionBarContent>
          <ActionBarLabel>Appearance</ActionBarLabel>
          <ActionBarItem>Zoom in</ActionBarItem>
        </ActionBarContent>
      </ActionBarMenu>
    </ActionBar>
  )
}

const NEW_TAB = /^New tab/

const trigger = (name: string) => page.getByRole("menuitem", { name })
const menu = () => page.getByRole("menu")
const item = (name: string | RegExp) => page.getByRole("menuitem", { name })
const more = (name = "More actions") => page.getByRole("button", { name })
const sheet = () => page.getByRole("alertdialog")
const dialog = () => page.getByRole("dialog")
const row = (name: string) => page.getByRole("button", { name })
const action = (name: string) => page.getByRole("button", { name })

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

function backdrop(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

describe("ActionBar on desktop", () => {
  it("renders a menubar with a trigger per menu and no more button", async () => {
    await render(<Bar />)
    await expect.element(page.getByRole("menubar")).toBeVisible()
    await expect.element(trigger("File")).toBeVisible()
    await expect.element(trigger("Edit")).toBeVisible()
    await expect.element(trigger("View")).toBeVisible()
    await expect.element(more()).not.toBeInTheDocument()
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("opens a menu on click with its items, shortcut and disabled state", async () => {
    await render(<Bar />)
    await trigger("File").click()
    await expect.element(menu()).toBeVisible()
    await expect
      .element(trigger("File"))
      .toHaveAttribute("aria-expanded", "true")
    await expect
      .element(item(NEW_TAB).getByText("T", { exact: true }))
      .toBeVisible()
    await expect
      .element(item("New incognito window"))
      .toHaveAttribute("aria-disabled", "true")
    await expect.element(menu().getByRole("separator")).toBeInTheDocument()
    await expect.element(item("Print")).toBeVisible()
  })

  it("runs the item action and closes the menu", async () => {
    const onCopy = vi.fn()
    await render(<Bar onCopy={onCopy} />)
    await trigger("Edit").click()
    await item("Copy").click()
    expect(onCopy).toHaveBeenCalledTimes(1)
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("shows the group label inside the menu", async () => {
    await render(<Bar />)
    await trigger("View").click()
    await expect
      .element(menu().getByText("Appearance", { exact: true }))
      .toBeVisible()
  })

  it("moves between menus with the arrow keys and closes with Escape", async () => {
    await render(<Bar />)
    await trigger("File").click()
    await expect.element(item(NEW_TAB)).toBeVisible()
    await userEvent.keyboard("{ArrowRight}")
    await expect.element(item("Copy")).toBeVisible()
    await expect.element(item(NEW_TAB)).not.toBeInTheDocument()
    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()
    await expect.element(trigger("Edit")).toHaveFocus()
  })

  it("opens the hovered menu while another one is open", async () => {
    await render(<Bar />)
    await trigger("File").click()
    await expect.element(item(NEW_TAB)).toBeVisible()
    await trigger("View").hover()
    await expect.element(item("Zoom in")).toBeVisible()
    await expect.element(item(NEW_TAB)).not.toBeInTheDocument()
  })

  it("opens a menu by default and reports menu open changes", async () => {
    const onMenuOpenChange = vi.fn()
    await render(<Bar fileOpen onMenuOpenChange={onMenuOpenChange} />)
    await expect.element(item(NEW_TAB)).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(false)
    await trigger("File").click()
    await expect.element(menu()).toBeVisible()
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(true)
  })
})

describe("ActionBar on mobile", () => {
  it("collapses the menus behind a more button", async () => {
    await page.viewport(390, 844)
    await render(<Bar />)
    await expect.element(more()).toBeVisible()
    await expect.element(more()).toHaveAttribute("aria-expanded", "false")
    await expect.element(page.getByRole("menubar")).not.toBeInTheDocument()
    await expect.element(row("File")).not.toBeInTheDocument()
  })

  it("opens a menu sheet that starts open with defaultOpen", async () => {
    await page.viewport(390, 844)
    await render(<Bar fileOpen />)
    await expect.element(dialog()).toBeVisible()
    await expect.element(action("Print")).toBeVisible()
  })

  it("reports a menu sheet opening and closing", async () => {
    const onMenuOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Bar onMenuOpenChange={onMenuOpenChange} />)
    await more().click()
    await row("File").click()
    await expect.element(dialog()).toBeVisible()
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(true)
    await action("Cancel").click()
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("lists every menu as a row in the drawer", async () => {
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Bar onOpenChange={onOpenChange} />)
    await more().click()
    await expect.element(dialog()).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await expect
      .element(dialog().getByText("More actions", { exact: true }))
      .toBeInTheDocument()
    await expect.element(row("File")).toHaveAttribute("aria-haspopup", "dialog")
    await expect.element(row("Edit")).toBeVisible()
    await expect.element(row("View")).toBeVisible()
    await expect.element(dialog().getByText("New tab")).not.toBeInTheDocument()
  })

  it("swaps the drawer for an action sheet with the menu items", async () => {
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Bar onOpenChange={onOpenChange} />)
    await more().click()
    await row("File").click()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
    await expect.element(dialog()).toBeVisible()
    await expect.element(action("New tab")).toBeVisible()
    await expect.element(action("New incognito window")).toBeDisabled()
    await expect.element(action("Print")).toBeVisible()
    await expect.element(action("Cancel")).toHaveFocus()
    await expect.element(row("Edit")).not.toBeInTheDocument()
    expect(
      document.querySelector("[data-slot=action-bar-separator]")
    ).toBeNull()
    expect(document.querySelector("[data-slot=action-bar-shortcut]")).toBeNull()
  })

  it("shows the menu label as the sheet title", async () => {
    await page.viewport(390, 844)
    await render(<Bar />)
    await more().click()
    await row("View").click()
    await expect.element(dialog()).toHaveAccessibleName("Appearance")
    await expect.element(action("Zoom in")).toBeVisible()
  })

  it("runs the item action and closes the sheet", async () => {
    const onCopy = vi.fn()
    await page.viewport(390, 844)
    await render(<Bar onCopy={onCopy} />)
    await more().click()
    await row("Edit").click()
    await action("Copy").click()
    expect(onCopy).toHaveBeenCalledTimes(1)
    await expect.element(dialog()).not.toBeInTheDocument()
    await expect.element(more()).toBeVisible()
  })

  it("closes the sheet with cancel and reports it to the menu", async () => {
    const onMenuOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Bar onMenuOpenChange={onMenuOpenChange} />)
    await more().click()
    await row("File").click()
    await action("Cancel").click()
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onMenuOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("dismisses the sheet on an outside click", async () => {
    await page.viewport(390, 844)
    await render(<Bar />)
    await more().click()
    await row("Edit").click()
    await expect.element(action("Copy")).toBeVisible()
    backdrop("alert-sheet-overlay").click()
    await expect.element(dialog()).not.toBeInTheDocument()
  })

  it("keeps the sheet open on an outside click when not dismissible", async () => {
    await page.viewport(390, 844)
    await render(<Bar dismissible={false} />)
    await more().click()
    await row("Edit").click()
    await expect.element(sheet()).toBeVisible()
    await userEvent.click(document.body, { position: { x: 20, y: 20 } })
    await wait(300)
    await expect.element(sheet()).toBeVisible()
    await action("Cancel").click()
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("uses custom more and cancel labels", async () => {
    await page.viewport(390, 844)
    await render(<Bar moreLabel="Document actions" cancelLabel="Close" />)
    await more("Document actions").click()
    await row("Edit").click()
    await expect.element(action("Close")).toBeVisible()
    await expect.element(action("Cancel")).not.toBeInTheDocument()
  })

  it("opens the drawer by default", async () => {
    await page.viewport(390, 844)
    await render(<Bar defaultOpen />)
    await expect.element(dialog()).toBeVisible()
    await expect.element(row("File")).toBeVisible()
  })

  it("follows a controlled open state", async () => {
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    function Controlled() {
      const [open, setOpen] = React.useState(false)
      return (
        <>
          <button type="button" onClick={() => setOpen(true)}>
            Show actions
          </button>
          <Bar
            open={open}
            onOpenChange={(next) => {
              onOpenChange(next)
              setOpen(next)
            }}
          />
        </>
      )
    }
    await render(<Controlled />)
    await page.getByRole("button", { name: "Show actions" }).click()
    await expect.element(row("File")).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(dialog()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("stays closed when the controlled state does not change", async () => {
    await page.viewport(390, 844)
    await render(<Bar open={false} />)
    await more().click()
    await wait(300)
    await expect.element(dialog()).not.toBeInTheDocument()
  })
})
