import * as React from "react"
import { describe, expect, it, vi } from "vitest"
import { page, userEvent } from "vitest/browser"
import { render } from "vitest-browser-react"

import {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
  useSelectionList,
} from "@/components/interactions/selection-list"

const initialNotes = [
  "Groceries",
  "Trip",
  "Books",
  "Meeting",
  "Gifts",
  "Recipes",
]

const TRIGGER_LABEL = /^(Select|Done)$/

function SelectAll() {
  const { selected, selectAll, clear } = useSelectionList()
  return (
    <button type="button" onClick={selected.length > 0 ? clear : selectAll}>
      {selected.length > 0 ? "Deselect All" : "Select All"}
    </button>
  )
}

function Notes({
  onOpen = () => undefined,
  notes = initialNotes,
  ...props
}: Omit<React.ComponentProps<typeof SelectionList>, "children"> & {
  onOpen?: (note: string) => void
  notes?: string[]
}) {
  return (
    <SelectionList {...props}>
      <SelectionListTrigger />
      {notes.map((note) => (
        <SelectionListItem key={note} value={note.toLowerCase()}>
          <button type="button" onClick={() => onOpen(note)}>
            <span>{note}</span> <span>preview</span>
          </button>
        </SelectionListItem>
      ))}
      <SelectionListBar aria-label="Selection actions">
        <SelectAll />
        <SelectionListCount />
      </SelectionListBar>
    </SelectionList>
  )
}

const trigger = () => page.getByRole("button", { name: TRIGGER_LABEL })
const checkbox = (name: string) =>
  page.getByRole("checkbox", { name: `${name} preview` })
const count = () =>
  document.querySelector("[data-slot=selection-list-count]")?.textContent
const bar = () =>
  document.querySelector<HTMLElement>("[data-slot=selection-list-bar]")
const checked = () =>
  Array.from(
    document.querySelectorAll<HTMLElement>(
      "[data-slot=selection-list-item][data-checked]"
    ),
    (item) => item.dataset.value
  )

function click(name: string, shiftKey = false) {
  const node = checkbox(name).element()
  node.dispatchEvent(new MouseEvent("click", { bubbles: true, shiftKey }))
}

describe("SelectionList", () => {
  it("behaves as a plain list until editing starts", async () => {
    const onOpen = vi.fn()
    await render(<Notes onOpen={onOpen} />)
    await expect.element(trigger()).toHaveTextContent("Select")
    await expect.element(trigger()).toHaveAttribute("aria-pressed", "false")
    expect(document.querySelectorAll("[role=checkbox]")).toHaveLength(0)
    expect(bar()?.dataset.closed).toBe("")
    expect(bar()?.inert).toBe(true)
    await page.getByRole("button", { name: "Groceries preview" }).click()
    expect(onOpen).toHaveBeenCalledExactlyOnceWith("Groceries")
  })

  it("turns rows into labelled checkboxes and shows the bar while editing", async () => {
    const onEditingChange = vi.fn()
    const onOpen = vi.fn()
    await render(<Notes onEditingChange={onEditingChange} onOpen={onOpen} />)
    await trigger().click()
    expect(onEditingChange).toHaveBeenCalledExactlyOnceWith(true)
    await expect.element(trigger()).toHaveTextContent("Done")
    await expect.element(trigger()).toHaveAttribute("aria-pressed", "true")
    expect(document.querySelectorAll("[role=checkbox]")).toHaveLength(6)
    await expect
      .element(checkbox("Groceries"))
      .toHaveAttribute("aria-checked", "false")
    await expect
      .element(page.getByRole("toolbar", { name: "Selection actions" }))
      .toBeVisible()
    expect(bar()?.inert).toBe(false)
    expect(count()).toBe("Select items")
    await checkbox("Groceries").click()
    expect(onOpen).not.toHaveBeenCalled()
  })

  it("toggles rows on press and updates the count", async () => {
    const onValueChange = vi.fn()
    await render(<Notes defaultEditing onValueChange={onValueChange} />)
    await checkbox("Trip").click()
    await expect
      .element(checkbox("Trip"))
      .toHaveAttribute("aria-checked", "true")
    expect(count()).toBe("1 selected")
    await checkbox("Books").click()
    expect(count()).toBe("2 selected")
    await checkbox("Trip").click()
    expect(checked()).toEqual(["books"])
    expect(onValueChange.mock.calls).toEqual([
      [["trip"]],
      [["trip", "books"]],
      [["books"]],
    ])
  })

  it("toggles rows with Space and Enter", async () => {
    await render(<Notes defaultEditing />)
    ;(checkbox("Groceries").element() as HTMLElement).focus()
    await userEvent.keyboard(" ")
    expect(checked()).toEqual(["groceries"])
    await userEvent.keyboard("{Tab}")
    await expect.element(checkbox("Trip")).toHaveFocus()
    await userEvent.keyboard("{Enter}")
    expect(checked()).toEqual(["groceries", "trip"])
    await userEvent.keyboard("{Enter}")
    expect(checked()).toEqual(["groceries"])
  })

  it("selects a range with shift from the last pressed row, in either direction", async () => {
    await render(<Notes defaultEditing />)
    click("Trip")
    await expect.poll(checked).toEqual(["trip"])
    click("Gifts", true)
    await expect.poll(checked).toEqual(["trip", "books", "meeting", "gifts"])
    click("Groceries", true)
    await expect
      .poll(checked)
      .toEqual(["groceries", "trip", "books", "meeting", "gifts"])
    expect(count()).toBe("5 selected")
  })

  it("adds a range to an existing selection without removing rows", async () => {
    await render(<Notes defaultEditing defaultValue={["recipes"]} />)
    click("Books")
    await expect.poll(checked).toEqual(["books", "recipes"])
    click("Trip", true)
    await expect.poll(checked).toEqual(["trip", "books", "recipes"])
  })

  it("toggles a single row on shift press without an anchor", async () => {
    await render(<Notes defaultEditing />)
    click("Meeting", true)
    await expect.poll(checked).toEqual(["meeting"])
  })

  it("selects a range with shift and Space", async () => {
    await render(<Notes defaultEditing />)
    ;(checkbox("Groceries").element() as HTMLElement).focus()
    await userEvent.keyboard(" ")
    ;(checkbox("Books").element() as HTMLElement).focus()
    await userEvent.keyboard("{Shift>} {/Shift}")
    expect(checked()).toEqual(["groceries", "trip", "books"])
  })

  it("selects all rows and clears them through the hook", async () => {
    await render(<Notes defaultEditing />)
    await page.getByRole("button", { name: "Select All" }).click()
    expect(checked()).toEqual(initialNotes.map((note) => note.toLowerCase()))
    expect(count()).toBe("6 selected")
    await page.getByRole("button", { name: "Deselect All" }).click()
    expect(checked()).toEqual([])
    expect(count()).toBe("Select items")
  })

  it("clears the selection and the range anchor when editing ends", async () => {
    const onValueChange = vi.fn()
    await render(<Notes defaultEditing onValueChange={onValueChange} />)
    click("Trip")
    await expect.poll(checked).toEqual(["trip"])
    await trigger().click()
    expect(checked()).toEqual([])
    expect(onValueChange).toHaveBeenLastCalledWith([])
    await expect.poll(() => bar()?.dataset.closed).toBe("")
    await trigger().click()
    click("Gifts", true)
    await expect.poll(checked).toEqual(["gifts"])
  })

  it("ends editing on Escape unless it was already handled", async () => {
    const onEditingChange = vi.fn()
    await render(
      <>
        <input
          aria-label="Search"
          onKeyDown={(event) => {
            if (event.key === "Escape") event.preventDefault()
          }}
        />
        <Notes
          defaultEditing
          defaultValue={["trip"]}
          onEditingChange={onEditingChange}
        />
      </>
    )
    await page.getByRole("textbox", { name: "Search" }).click()
    await userEvent.keyboard("{Escape}")
    expect(trigger().element().getAttribute("aria-pressed")).toBe("true")
    ;(checkbox("Trip").element() as HTMLElement).focus()
    await userEvent.keyboard("{Escape}")
    await expect.element(trigger()).toHaveAttribute("aria-pressed", "false")
    expect(onEditingChange).toHaveBeenCalledExactlyOnceWith(false)
    expect(checked()).toEqual([])
  })

  it("ignores Escape when not editing", async () => {
    const onEditingChange = vi.fn()
    await render(<Notes onEditingChange={onEditingChange} />)
    await userEvent.keyboard("{Escape}")
    expect(onEditingChange).not.toHaveBeenCalled()
  })

  it("follows controlled value and editing", async () => {
    function Controlled() {
      const [editing, setEditing] = React.useState(false)
      const [value, setValue] = React.useState<string[]>(["books"])
      return (
        <>
          <button type="button" onClick={() => setEditing(true)}>
            Edit
          </button>
          <button type="button" onClick={() => setValue(["gifts", "recipes"])}>
            Pick two
          </button>
          <Notes
            editing={editing}
            onEditingChange={setEditing}
            value={value}
            onValueChange={setValue}
          />
        </>
      )
    }
    await render(<Controlled />)
    await page.getByRole("button", { name: "Edit" }).click()
    await expect
      .element(checkbox("Books"))
      .toHaveAttribute("aria-checked", "true")
    await page.getByRole("button", { name: "Pick two" }).click()
    expect(checked()).toEqual(["gifts", "recipes"])
    await checkbox("Groceries").click()
    expect(checked()).toEqual(["groceries", "gifts", "recipes"])
    await trigger().click()
    expect(checked()).toEqual([])
    expect(document.querySelectorAll("[role=checkbox]")).toHaveLength(0)
  })

  it("keeps a controlled selection when the parent ignores changes", async () => {
    await render(<Notes defaultEditing value={["trip"]} />)
    await checkbox("Books").click()
    expect(checked()).toEqual(["trip"])
  })

  it("prefers an explicit aria-label and custom trigger and count content", async () => {
    await render(
      <SelectionList defaultEditing defaultValue={["a"]}>
        <SelectionListTrigger>Edit list</SelectionListTrigger>
        <SelectionListItem value="a" aria-label="First row">
          <span>Alpha</span>
        </SelectionListItem>
        <SelectionListBar>
          <SelectionListCount>Custom count</SelectionListCount>
        </SelectionListBar>
      </SelectionList>
    )
    await expect
      .element(page.getByRole("checkbox", { name: "First row" }))
      .toBeInTheDocument()
    await expect
      .element(page.getByRole("button", { name: "Edit list" }))
      .toBeInTheDocument()
    expect(count()).toBe("Custom count")
  })

  it("keeps the row's own handlers while editing", async () => {
    const onClick = vi.fn()
    const onKeyDown = vi.fn()
    await render(
      <SelectionList defaultEditing>
        <SelectionListItem value="a" onClick={onClick} onKeyDown={onKeyDown}>
          Alpha
        </SelectionListItem>
      </SelectionList>
    )
    await page.getByRole("checkbox", { name: "Alpha" }).click()
    await userEvent.keyboard("{Enter}")
    expect(onClick).toHaveBeenCalledOnce()
    expect(onKeyDown).toHaveBeenCalledOnce()
    await expect
      .element(page.getByRole("checkbox", { name: "Alpha" }))
      .toHaveAttribute("aria-checked", "false")
  })

  it("falls back to a single toggle when the range anchor row is gone", async () => {
    function Shrinking() {
      const [notes, setNotes] = React.useState(initialNotes)
      return (
        <>
          <button
            type="button"
            onClick={() => setNotes(notes.filter((n) => n !== "Trip"))}
          >
            Remove trip
          </button>
          <Notes defaultEditing notes={notes} />
        </>
      )
    }
    await render(<Shrinking />)
    click("Trip")
    await expect.poll(checked).toEqual(["trip"])
    click("Trip")
    await expect.poll(checked).toEqual([])
    await page.getByRole("button", { name: "Remove trip" }).click()
    click("Gifts", true)
    await expect.poll(checked).toEqual(["gifts"])
  })

  it("throws when its parts are used outside the list", async () => {
    const error = vi.spyOn(console, "error").mockImplementation(() => undefined)
    await expect(render(<SelectionListCount />)).rejects.toThrow(
      "useSelectionList must be used within a <SelectionList />"
    )
    error.mockRestore()
  })
})
