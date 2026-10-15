import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import MenubarDemo from "@/examples/menubar-demo"
import MenubarDisabled from "@/examples/menubar-disabled"
import MenubarOpenByDefault from "@/examples/menubar-open-by-default"
import { renderExample } from "@/tests/render-example"

const NEW_WINDOW = /^New window/
const PASTE = /^Paste/

test("Default", async () => {
  const { canvas, step } = await renderExample(<MenubarDemo />)

  const file = canvas.getByRole("menuitem", { name: "File" })
  const edit = canvas.getByRole("menuitem", { name: "Edit" })

  await step("opens a menu from its trigger", async () => {
    await expect(canvas.getByRole("menubar")).toBeVisible()
    await userEvent.click(file)
    await expect(
      await screen.findByRole("menuitem", { name: NEW_WINDOW })
    ).toBeInTheDocument()
    await expect(file).toHaveAttribute("aria-expanded", "true")
    await expect(
      screen.getByRole("menuitem", { name: "New private window" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("moves to the next menu with ArrowRight", async () => {
    await userEvent.keyboard("{ArrowRight}")
    await expect(
      await screen.findByRole("menuitem", { name: PASTE })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: NEW_WINDOW })).toBeNull()
    )
    await expect(edit).toHaveAttribute("aria-expanded", "true")
  })

  await step("closes with Escape and returns focus", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await expect(edit).toHaveFocus()
  })

  await step("toggles a checkbox item", async () => {
    await userEvent.click(canvas.getByRole("menuitem", { name: "View" }))
    const urls = await screen.findByRole("menuitemcheckbox", {
      name: "Show full URLs",
    })
    await expect(urls).toHaveAttribute("aria-checked", "false")
    await userEvent.click(urls)
    await expect(urls).toHaveAttribute("aria-checked", "true")
    await expect(
      screen.getByRole("menuitemcheckbox", { name: "Show bookmarks bar" })
    ).toHaveAttribute("aria-checked", "true")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("switches the radio item", async () => {
    await userEvent.click(canvas.getByRole("menuitem", { name: "Profiles" }))
    const sam = await screen.findByRole("menuitemradio", { name: "Sam" })
    await userEvent.click(sam)
    await expect(sam).toHaveAttribute("aria-checked", "true")
    await expect(
      screen.getByRole("menuitemradio", { name: "Alex" })
    ).toHaveAttribute("aria-checked", "false")
    await userEvent.keyboard("{Escape}")
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<MenubarOpenByDefault />)

  await step("opens the submenu with ArrowRight", async () => {
    const share = await screen.findByRole("menuitem", { name: "Share" })
    share.focus()
    await userEvent.keyboard("{ArrowRight}")
    await expect(
      await screen.findByRole("menuitem", { name: "Email link" })
    ).toBeInTheDocument()
  })
})
test("Disabled", async () => {
  const { canvas, step } = await renderExample(<MenubarDisabled />)

  await step("does not open menus while disabled", async () => {
    await userEvent.click(canvas.getByRole("menuitem", { name: "File" }), {
      pointerEventsCheck: 0,
    })
    await expect(screen.queryByRole("menu")).toBeNull()
  })
})
