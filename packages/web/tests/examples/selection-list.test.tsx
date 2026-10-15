import { waitFor } from "@testing-library/dom"
import { userEvent } from "@testing-library/user-event"
import { expect, test } from "vitest"
import SelectionListDemo from "@/examples/selection-list-demo"
import SelectionListIconActions from "@/examples/selection-list-icon-actions"
import { renderExample } from "@/tests/render-example"

const GROCERIES = /^Groceries/
const TRIP = /^Trip ideas/
const MEETING = /^Meeting notes/

test("Default", async () => {
  const { canvas, step } = await renderExample(<SelectionListDemo />)

  const status = canvas.getByRole("status")
  const toolbar = canvas.getByRole("toolbar", { hidden: true })

  await step("Select turns the rows into checkboxes", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Select" }))
    await expect(
      canvas.getByRole("button", { name: "Done", pressed: true })
    ).toBeVisible()
    await expect(canvas.getAllByRole("checkbox")).toHaveLength(6)
    await waitFor(() => expect(toolbar).toBeVisible())
    await expect(toolbar).toHaveTextContent("Select items")
  })

  await step("Select All and Deselect All toggle every row", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Select All" }))
    await expect(toolbar).toHaveTextContent("6 selected")
    await userEvent.click(canvas.getByRole("button", { name: "Deselect All" }))
    await expect(toolbar).toHaveTextContent("Select items")
  })

  await step("Shift selects a range from the last pick", async () => {
    await userEvent.click(canvas.getByRole("checkbox", { name: TRIP }))
    canvas.getByRole("checkbox", { name: MEETING }).focus()
    await userEvent.keyboard("{Shift>}{Enter}{/Shift}")
    await expect(toolbar).toHaveTextContent("3 selected")
    await expect(canvas.getByRole("checkbox", { name: MEETING })).toBeChecked()
  })

  await step("Delete removes the picks and leaves editing", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }))
    await expect(status).toHaveTextContent("Deleted 3 notes")
    await expect(canvas.queryByText("Trip ideas")).toBeNull()
    await expect(canvas.queryAllByRole("checkbox")).toHaveLength(0)
    await waitFor(() => expect(toolbar).not.toBeVisible())
  })

  await step("Escape leaves editing without acting", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Select" }))
    await userEvent.click(canvas.getByRole("checkbox", { name: GROCERIES }))
    await userEvent.keyboard("{Escape}")
    await expect(canvas.getByRole("button", { name: "Select" })).toBeVisible()
    await userEvent.click(canvas.getByText("Groceries"))
    await expect(status).toHaveTextContent("Opened Groceries")
  })
})
test("Icon Actions", async () => {
  const { canvas, step } = await renderExample(<SelectionListIconActions />)

  const status = canvas.getByRole("status")
  const toolbar = canvas.getByRole("toolbar", { hidden: true })

  await step("actions stay disabled until something is picked", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Select" }))
    await waitFor(() => expect(toolbar).toBeVisible())
    await expect(canvas.getByRole("button", { name: "Archive" })).toBeDisabled()
  })

  await step("an icon action runs on the picked rows", async () => {
    await userEvent.click(canvas.getByRole("checkbox", { name: GROCERIES }))
    await userEvent.click(canvas.getByRole("checkbox", { name: TRIP }))
    await expect(toolbar).toHaveTextContent("2 selected")
    await userEvent.click(canvas.getByRole("button", { name: "Archive" }))
    await expect(status).toHaveTextContent("Archived groceries, trip")
  })

  await step("Delete removes the picks and clears the count", async () => {
    await userEvent.click(canvas.getByRole("button", { name: "Delete" }))
    await expect(status).toHaveTextContent("Deleted 2 notes")
    await expect(canvas.getAllByRole("checkbox")).toHaveLength(4)
    await expect(toolbar).toHaveTextContent("Select items")
  })
})
