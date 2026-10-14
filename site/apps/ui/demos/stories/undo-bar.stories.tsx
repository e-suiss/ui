// @ts-nocheck
import { TrashIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor, within } from "storybook/test"

import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { UndoBarProvider, useUndoBar } from "@/components/interactions/undo-bar"
import { Button } from "@/components/ui/button"
import { MOUSE_POINTER_ID } from "./pointer"

const initialNotes = [
  { id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee" },
  { id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road" },
  { id: 3, title: "Book list", preview: "Three novels for the summer" },
  { id: 4, title: "Meeting notes", preview: "Ship the beta on Friday" },
]

type Note = (typeof initialNotes)[number]

function useNotes() {
  const [notes, setNotes] = React.useState(initialNotes)
  const [log, setLog] = React.useState("Delete a note.")
  const { show } = useUndoBar()

  const remove = (note: Note) => {
    const index = notes.findIndex((item) => item.id === note.id)
    setNotes((current) => current.filter((item) => item.id !== note.id))
    setLog(`Removed “${note.title}”`)
    show({
      title: `“${note.title}” deleted`,
      onUndo: () => {
        setNotes((current) => {
          const next = [...current]
          next.splice(Math.min(index, next.length), 0, note)
          return next
        })
        setLog(`Restored “${note.title}”`)
      },
      onCommit: () => setLog(`Deleted “${note.title}” permanently`),
    })
  }

  return { notes, remove, log }
}

function NotesList() {
  const { notes, remove, log } = useNotes()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <ul className="overflow-hidden rounded-2xl border">
        {notes.map((note) => (
          <li
            key={note.id}
            className="flex items-center gap-3 py-1 ps-4 pe-1 not-first:border-t"
          >
            <span className="flex min-w-0 flex-1 flex-col py-2">
              <span className="truncate text-base font-semibold">
                {note.title}
              </span>
              <span className="truncate text-sm text-label-secondary">
                {note.preview}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label={`Delete ${note.title}`}
              onClick={() => remove(note)}
            >
              <TrashIcon className="size-5" />
            </Button>
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-label-secondary">
        {log}
      </p>
    </div>
  )
}

function SwipeNotesList() {
  const { notes, remove, log } = useNotes()

  return (
    <div className="mx-auto flex w-full max-w-md flex-col gap-3">
      <ul className="overflow-hidden rounded-2xl border">
        {notes.map((note) => (
          <li key={note.id} className="not-first:border-t">
            <SwipeActions>
              <SwipeActionsContent className="flex flex-col px-4 py-3">
                <span className="truncate text-base font-semibold">
                  {note.title}
                </span>
                <span className="truncate text-sm text-label-secondary">
                  {note.preview}
                </span>
              </SwipeActionsContent>
              <SwipeActionsActions side="trailing">
                <SwipeAction
                  variant="destructive"
                  fullSwipe
                  onClick={() => remove(note)}
                >
                  <TrashIcon weight="fill" />
                  Delete
                </SwipeAction>
              </SwipeActionsActions>
            </SwipeActions>
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-label-secondary">
        {log}
      </p>
    </div>
  )
}

const meta = {
  title: "Interactions/Undo Bar",
  component: UndoBarProvider,
} satisfies Meta<typeof UndoBarProvider>

export default meta

type Story = StoryObj<typeof meta>

const GROCERIES_FIRST = /^Groceries/
const DELETED = /deleted/

export const Default: Story = {
  render: () => (
    <UndoBarProvider>
      <NotesList />
    </UndoBarProvider>
  ),
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")

    await step("deleting a note offers to undo it", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Delete Groceries" })
      )
      await expect(canvas.queryByText("Groceries")).toBeNull()
      const bar = await canvas.findByRole("group", {
        name: "“Groceries” deleted",
      })
      await waitFor(() => expect(bar).toBeVisible())
    })

    await step("undo restores the note in its place", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
      await expect(status).toHaveTextContent("Restored “Groceries”")
      await expect(canvas.getByRole("list")).toHaveTextContent(GROCERIES_FIRST)
      await waitFor(() =>
        expect(canvas.queryByRole("group", { name: DELETED })).toBeNull()
      )
    })

    await step("Ctrl+Z undoes the latest deletion", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Delete Book list" })
      )
      await canvas.findByRole("group", { name: "“Book list” deleted" })
      await userEvent.keyboard("{Control>}z{/Control}")
      await expect(status).toHaveTextContent("Restored “Book list”")
      await expect(canvas.getByText("Book list")).toBeVisible()
    })

    await step("the deletion commits once the timer runs out", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Delete Trip ideas" })
      )
      await waitFor(
        () =>
          expect(status).toHaveTextContent("Deleted “Trip ideas” permanently"),
        { timeout: 8000 }
      )
      await waitFor(() =>
        expect(canvas.queryByRole("group", { name: DELETED })).toBeNull()
      )
      await expect(canvas.queryByText("Trip ideas")).toBeNull()
    })
  },
}

export const LongerTimeout: Story = {
  render: () => (
    <UndoBarProvider timeout={10000}>
      <NotesList />
    </UndoBarProvider>
  ),
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")

    await step("keeps the bar past the default five seconds", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Delete Meeting notes" })
      )
      await new Promise((resolve) => setTimeout(resolve, 6000))
      await expect(
        canvas.getByRole("group", { name: "“Meeting notes” deleted" })
      ).toBeVisible()
      await expect(status).toHaveTextContent("Removed “Meeting notes”")
    })

    await step("still restores the note late in the window", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
      await expect(status).toHaveTextContent("Restored “Meeting notes”")
      await expect(canvas.getByText("Meeting notes")).toBeVisible()
    })
  },
}

function pointer(target: EventTarget, type: string, x: number, y: number) {
  target.dispatchEvent(
    new PointerEvent(type, {
      pointerId: MOUSE_POINTER_ID,
      pointerType: "touch",
      isPrimary: true,
      button: 0,
      buttons: type === "pointerup" ? 0 : 1,
      clientX: x,
      clientY: y,
      bubbles: true,
      cancelable: true,
    })
  )
}

function swipeLeft(content: HTMLElement, distance: number) {
  const rect = content.getBoundingClientRect()
  const x = rect.left + rect.width / 2
  const y = rect.top + rect.height / 2
  pointer(content, "pointerdown", x, y)
  for (let step = 1; step <= 4; step++) {
    pointer(content, "pointermove", x - (distance * step) / 4, y)
  }
  pointer(content, "pointerup", x - distance, y)
}

function contentOf(element: HTMLElement) {
  const content = element.closest<HTMLElement>(
    "[data-slot=swipe-actions-content]"
  )
  if (!content) throw new Error("swipe content not found")
  return content
}

export const WithSwipeActions: Story = {
  render: () => (
    <UndoBarProvider>
      <SwipeNotesList />
    </UndoBarProvider>
  ),
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")

    await step("swiping and tapping Delete removes the note", async () => {
      const content = contentOf(canvas.getByText("Groceries"))
      swipeLeft(content, 100)
      const row = content.parentElement
      if (!row) throw new Error("swipe row not found")
      await userEvent.click(within(row).getByRole("button", { name: "Delete" }))
      await expect(canvas.queryByText("Groceries")).toBeNull()
      await canvas.findByRole("group", { name: "“Groceries” deleted" })
    })

    await step("undo brings the swiped note back", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
      await expect(status).toHaveTextContent("Restored “Groceries”")
      await expect(canvas.getByText("Groceries")).toBeVisible()
    })

    await step("a full swipe deletes and can be undone too", async () => {
      const content = contentOf(canvas.getByText("Trip ideas"))
      swipeLeft(content, content.offsetWidth * 0.8)
      await canvas.findByRole("group", { name: "“Trip ideas” deleted" })
      await userEvent.click(canvas.getByRole("button", { name: "Undo" }))
      await expect(canvas.getByText("Trip ideas")).toBeVisible()
    })
  },
}
