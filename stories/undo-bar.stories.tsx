import { TrashIcon } from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { UndoBarProvider, useUndoBar } from "@/components/interactions/undo-bar"
import { Button } from "@/components/ui/button"

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

export const Default: Story = {
  render: () => (
    <UndoBarProvider>
      <NotesList />
    </UndoBarProvider>
  ),
}

export const LongerTimeout: Story = {
  render: () => (
    <UndoBarProvider timeout={10000}>
      <NotesList />
    </UndoBarProvider>
  ),
}

export const WithSwipeActions: Story = {
  render: () => (
    <UndoBarProvider>
      <SwipeNotesList />
    </UndoBarProvider>
  ),
}
