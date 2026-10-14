import type * as React from "react"
import { afterEach, describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  ContextActions,
  ContextActionsContent,
  ContextActionsItem,
  ContextActionsLabel,
  ContextActionsSeparator,
  ContextActionsTrigger,
} from "@/components/patterns/context-actions"

afterEach(async () => {
  await page.viewport(1280, 800)
})

type ActionsProps = React.ComponentProps<typeof ContextActions> & {
  onEdit?: () => void
  cancelLabel?: string
}

function Actions({ onEdit, cancelLabel, ...props }: ActionsProps) {
  return (
    <div className="flex flex-col items-start gap-8 p-8">
      <button type="button">Outside</button>
      <ContextActions {...props}>
        <ContextActionsTrigger className="flex h-40 w-72 items-center justify-center">
          Photo
        </ContextActionsTrigger>
        <ContextActionsContent cancelLabel={cancelLabel}>
          <ContextActionsLabel>Photo.jpg</ContextActionsLabel>
          <ContextActionsItem onClick={onEdit}>Edit</ContextActionsItem>
          <ContextActionsItem disabled>Duplicate</ContextActionsItem>
          <ContextActionsSeparator />
          <ContextActionsItem variant="destructive">Delete</ContextActionsItem>
        </ContextActionsContent>
      </ContextActions>
    </div>
  )
}

function element(slot: string) {
  const node = document.querySelector<HTMLElement>(`[data-slot=${slot}]`)
  if (!node) throw new Error(`${slot} not rendered`)
  return node
}

const area = () => element("context-actions-trigger")
const menu = () => page.getByRole("menu")
const menuItem = (name: string) => page.getByRole("menuitem", { name })
const sheet = () => page.getByRole("dialog")
const alertSheet = () => page.getByRole("alertdialog")
const action = (name: string) => page.getByRole("button", { name })
const outside = () => page.getByRole("button", { name: "Outside" })

const wait = (ms: number) =>
  new Promise((resolve) => window.setTimeout(resolve, ms))

function pointer(
  type: string,
  pointerType: string,
  offset = 0,
  target: HTMLElement = area()
) {
  const rect = target.getBoundingClientRect()
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: 1,
      pointerType,
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: rect.left + rect.width / 2 + offset,
      clientY: rect.top + rect.height / 2,
      bubbles: true,
      cancelable: true,
    })
  )
}

describe("ContextActions on desktop", () => {
  it("opens a context menu on right click", async () => {
    const onOpenChange = vi.fn()
    await render(<Actions onOpenChange={onOpenChange} />)
    await page.getByText("Photo", { exact: true }).click()
    await expect.element(menu()).not.toBeInTheDocument()
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(menu()).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await expect
      .element(menu().getByText("Photo.jpg", { exact: true }))
      .toBeVisible()
    await expect.element(menuItem("Edit")).toBeVisible()
    await expect
      .element(menuItem("Duplicate"))
      .toHaveAttribute("aria-disabled", "true")
    await expect.element(menu().getByRole("separator")).toBeInTheDocument()
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("runs the item action and closes", async () => {
    const onEdit = vi.fn()
    const onOpenChange = vi.fn()
    await render(<Actions onEdit={onEdit} onOpenChange={onOpenChange} />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await menuItem("Edit").click()
    expect(onEdit).toHaveBeenCalledTimes(1)
    await expect.element(menu()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("navigates with the keyboard and closes with Escape", async () => {
    const onEdit = vi.fn()
    await render(<Actions onEdit={onEdit} />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(menu()).toBeVisible()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(menuItem("Edit")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(menuItem("Duplicate")).toHaveFocus()
    await userEvent.keyboard("{ArrowDown}")
    await expect.element(menuItem("Delete")).toHaveFocus()
    await userEvent.keyboard("{ArrowUp}{ArrowUp}")
    await expect.element(menuItem("Edit")).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(onEdit).toHaveBeenCalledTimes(1)
    await expect.element(menu()).not.toBeInTheDocument()
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(menu()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(menu()).not.toBeInTheDocument()
  })

  it("closes on an outside click", async () => {
    await render(<Actions />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(menu()).toBeVisible()
    await userEvent.click(document.body, { position: { x: 600, y: 700 } })
    await expect.element(menu()).not.toBeInTheDocument()
  })
})

describe("ContextActions on mobile", () => {
  it("renders a focusable trigger that opens a dialog", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    const trigger = page.getByRole("button", { name: "Photo" })
    await expect.element(trigger).toHaveAttribute("aria-haspopup", "dialog")
    await expect.element(trigger).toHaveAttribute("tabindex", "0")
  })

  it("opens an action sheet on right click", async () => {
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Actions onOpenChange={onOpenChange} />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(sheet()).toBeVisible()
    expect(onOpenChange).toHaveBeenLastCalledWith(true)
    await expect.element(sheet()).toHaveAccessibleName("Photo.jpg")
    await expect.element(action("Edit")).toBeVisible()
    await expect.element(action("Duplicate")).toBeDisabled()
    await expect.element(action("Delete")).toBeVisible()
    await expect.element(action("Cancel")).toHaveFocus()
    await expect.element(menu()).not.toBeInTheDocument()
    expect(
      document.querySelector("[data-slot=context-actions-separator]")
    ).toBeNull()
  })

  it("opens on a long press", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    pointer("pointerdown", "touch")
    await wait(200)
    await expect.element(sheet()).not.toBeInTheDocument()
    await expect.element(sheet()).toBeVisible()
    pointer("pointerup", "touch")
    await expect.element(action("Cancel")).toBeVisible()
  })

  it("does not open on a short tap", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    pointer("pointerdown", "touch")
    await wait(100)
    pointer("pointerup", "touch")
    await wait(700)
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("cancels the long press when the finger moves away", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    pointer("pointerdown", "touch")
    pointer("pointermove", "touch", 5)
    await wait(100)
    pointer("pointermove", "touch", 30)
    await wait(700)
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("ignores a held mouse button", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    pointer("pointerdown", "mouse")
    await wait(700)
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it.each([
    ["the context menu key", "{ContextMenu}"],
    ["Shift+F10", "{Shift>}{F10}{/Shift}"],
  ])("opens with %s and returns focus on close", async (_, keys) => {
    await page.viewport(390, 844)
    await render(<Actions />)
    area().focus()
    await userEvent.keyboard(keys)
    await expect.element(sheet()).toBeVisible()
    await userEvent.keyboard("{Escape}")
    await expect.element(sheet()).not.toBeInTheDocument()
    await expect
      .element(page.getByRole("button", { name: "Photo" }))
      .toHaveFocus()
  })

  it("runs the item action and closes the sheet", async () => {
    const onEdit = vi.fn()
    const onOpenChange = vi.fn()
    await page.viewport(390, 844)
    await render(<Actions onEdit={onEdit} onOpenChange={onOpenChange} />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await action("Edit").click()
    expect(onEdit).toHaveBeenCalledTimes(1)
    await expect.element(sheet()).not.toBeInTheDocument()
    expect(onOpenChange).toHaveBeenLastCalledWith(false)
  })

  it("closes with a custom cancel label", async () => {
    await page.viewport(390, 844)
    await render(<Actions cancelLabel="Close" />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(action("Cancel")).not.toBeInTheDocument()
    await action("Close").click()
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("dismisses on an outside click", async () => {
    await page.viewport(390, 844)
    await render(<Actions />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(sheet()).toBeVisible()
    element("alert-sheet-overlay").click()
    await expect.element(sheet()).not.toBeInTheDocument()
  })

  it("stays open on an outside click when not dismissible", async () => {
    await page.viewport(390, 844)
    await render(<Actions dismissible={false} />)
    await page.getByText("Photo", { exact: true }).click({ button: "right" })
    await expect.element(alertSheet()).toBeVisible()
    await userEvent.click(document.body, { position: { x: 20, y: 20 } })
    await wait(300)
    await expect.element(alertSheet()).toBeVisible()
    await action("Cancel").click()
    await expect.element(alertSheet()).not.toBeInTheDocument()
    await expect.element(outside()).toBeVisible()
  })
})
