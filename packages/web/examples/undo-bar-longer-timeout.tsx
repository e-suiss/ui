import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
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
              <span className="truncate text-sm text-muted-foreground">
                {note.preview}
              </span>
            </span>
            <Button
              variant="ghost"
              size="icon-lg"
              aria-label={`Delete ${note.title}`}
              onClick={() => remove(note)}
            >
              <IconPlaceholder
                lucide="TrashIcon"
                tabler="IconTrash"
                hugeicons="Delete02Icon"
                phosphor="TrashIcon"
                remixicon="RiDeleteBinLine"
                className="size-5"
              />
            </Button>
          </li>
        ))}
      </ul>
      <p role="status" className="text-sm text-muted-foreground">
        {log}
      </p>
    </div>
  )
}

export default function UndoBarLongerTimeout() {
  return (
    <UndoBarProvider timeout={10000}>
      <NotesList />
    </UndoBarProvider>
  )
}
