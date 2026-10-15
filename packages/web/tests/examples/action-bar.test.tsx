import { screen, waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import ActionBarDemo from "@/examples/action-bar-demo"
import ActionBarNotDismissible from "@/examples/action-bar-not-dismissible"
import ActionBarOpenByDefault from "@/examples/action-bar-open-by-default"
import ActionBarWithIcons from "@/examples/action-bar-with-icons"
import { renderExample } from "@/tests/render-example"

const NEW_TAB = /New tab/
const COPY = /Copy/
const PRINT = /Print/
const CUT = /Cut/
const DELETE = /Delete/

test("Default", async () => {
  const { canvas, step } = await renderExample(<ActionBarDemo />)

  const file = canvas.getByRole("menuitem", { name: "File" })
  const edit = canvas.getByRole("menuitem", { name: "Edit" })

  await step("lays the menus out in a menubar", async () => {
    await expect(canvas.getByRole("menubar")).toBeVisible()
    await expect(canvas.getByRole("menuitem", { name: "View" })).toBeVisible()
  })

  await step("opens a menu with its disabled entry", async () => {
    await userEvent.click(file)
    await screen.findByRole("menu")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: NEW_TAB })).toBeVisible()
    )
    await expect(
      screen.getByRole("menuitem", { name: "New incognito window" })
    ).toHaveAttribute("aria-disabled", "true")
  })

  await step("hovering another trigger switches menus", async () => {
    await userEvent.hover(edit)
    await expect(
      await screen.findByRole("menuitem", { name: COPY })
    ).toBeInTheDocument()
    await waitFor(() =>
      expect(screen.queryByRole("menuitem", { name: NEW_TAB })).toBeNull()
    )
  })

  await step("running an action closes the menu", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: COPY }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })

  await step("Escape closes and returns focus to the trigger", async () => {
    await userEvent.click(file)
    await screen.findByRole("menu")
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(file).toHaveFocus())
  })
})
test("With Icons", async () => {
  const { canvas, step } = await renderExample(<ActionBarWithIcons />)

  const edit = canvas.getByRole("menuitem", { name: "Edit" })

  await step("shows an icon beside each edit action", async () => {
    await userEvent.click(edit)
    await screen.findByRole("menu")
    const cut = await screen.findByRole("menuitem", { name: CUT })
    await waitFor(() => expect(cut).toBeVisible())
    for (const name of [CUT, COPY, DELETE]) {
      await expect(
        screen.getByRole("menuitem", { name }).querySelector("svg")
      ).not.toBeNull()
    }
  })

  await step("running an action closes the menu", async () => {
    await userEvent.click(screen.getByRole("menuitem", { name: DELETE }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Open By Default", async () => {
  const { step } = await renderExample(<ActionBarOpenByDefault />)

  await step("renders the first menu open and runs an action", async () => {
    await userEvent.click(await screen.findByRole("menuitem", { name: PRINT }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
test("Not Dismissible", async () => {
  const { canvas, step } = await renderExample(<ActionBarNotDismissible />)

  const file = canvas.getByRole("menuitem", { name: "File" })

  await step("opens a menu from the menubar", async () => {
    await expect(canvas.getByRole("menubar")).toBeVisible()
    await userEvent.click(file)
    await screen.findByRole("menu")
    await waitFor(() =>
      expect(screen.getByRole("menuitem", { name: NEW_TAB })).toBeVisible()
    )
  })

  await step("Escape closes and returns focus to the trigger", async () => {
    await userEvent.keyboard("{Escape}")
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
    await waitFor(() => expect(file).toHaveFocus())
  })

  await step("running an action closes the menu", async () => {
    await userEvent.click(canvas.getByRole("menuitem", { name: "Edit" }))
    await userEvent.click(await screen.findByRole("menuitem", { name: COPY }))
    await waitFor(() => expect(screen.queryByRole("menu")).toBeNull())
  })
})
