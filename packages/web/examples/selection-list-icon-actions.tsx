import {
  ArchiveIcon,
  CaretRightIcon,
  FolderSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import * as React from "react"
import {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
} from "@/components/interactions/selection-list"
import { Button } from "@/components/ui/button"

const initialNotes = [
  { id: "groceries", title: "Groceries", preview: "Milk, eggs, bread, coffee" },
  { id: "trip", title: "Trip ideas", preview: "Lisbon, Porto, the coast road" },
  { id: "books", title: "Book list", preview: "Three novels for the summer" },
  { id: "meeting", title: "Meeting notes", preview: "Ship the beta on Friday" },
  { id: "gifts", title: "Gift ideas", preview: "Headphones, a plant, a scarf" },
  { id: "recipes", title: "Recipes", preview: "Lemon pasta and a quick curry" },
]

type Note = (typeof initialNotes)[number]

function NoteRows({
  notes,
  onOpen,
}: {
  notes: Note[]
  onOpen: (note: Note) => void
}) {
  return (
    <div className="overflow-hidden rounded-2xl border">
      {notes.map((note) => (
        <SelectionListItem
          key={note.id}
          value={note.id}
          className="not-first:border-t"
        >
          <button
            type="button"
            onClick={() => onOpen(note)}
            className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-base font-semibold">
                {note.title}
              </span>
              <span className="truncate text-sm text-muted-foreground">
                {note.preview}
              </span>
            </span>
            <CaretRightIcon
              aria-hidden
              className="size-4 shrink-0 text-muted-foreground transition-opacity duration-200 rtl:rotate-180 group-data-editing/selection-list:opacity-0"
            />
          </button>
        </SelectionListItem>
      ))}
    </div>
  )
}

function useNotes() {
  const [notes, setNotes] = React.useState(initialNotes)
  const [log, setLog] = React.useState("Tap Select to choose notes.")

  return {
    notes,
    log,
    setLog,
    remove: (ids: string[]) => {
      setNotes((current) => current.filter((note) => !ids.includes(note.id)))
      setLog(`Deleted ${ids.length} ${ids.length === 1 ? "note" : "notes"}`)
    },
    reset: () => {
      setNotes(initialNotes)
      setLog("Tap Select to choose notes.")
    },
  }
}

function MailExample() {
  const { notes, log, setLog, remove, reset } = useNotes()
  const [selected, setSelected] = React.useState<string[]>([])

  const act = (verb: string) => {
    setLog(`${verb} ${selected.join(", ")}`)
  }

  return (
    <SelectionList
      value={selected}
      onValueChange={setSelected}
      className="mx-auto flex w-full max-w-md flex-col gap-3 pb-24"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Inbox</h2>
        <SelectionListTrigger />
      </div>
      <NoteRows
        notes={notes}
        onOpen={(note) => setLog(`Opened ${note.title}`)}
      />
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-muted-foreground">
          {log}
        </p>
        <Button size="sm" variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
      <SelectionListBar aria-label="Selection actions">
        <Button
          variant="plain"
          size="icon-lg"
          aria-label="Archive"
          disabled={selected.length === 0}
          onClick={() => act("Archived")}
        >
          <ArchiveIcon className="size-5.5" />
        </Button>
        <Button
          variant="plain"
          size="icon-lg"
          aria-label="Move"
          disabled={selected.length === 0}
          onClick={() => act("Moved")}
        >
          <FolderSimpleIcon className="size-5.5" />
        </Button>
        <SelectionListCount />
        <Button
          variant="plain"
          size="icon-lg"
          aria-label="Delete"
          className="text-destructive disabled:opacity-50"
          disabled={selected.length === 0}
          onClick={() => {
            remove(selected)
            setSelected([])
          }}
        >
          <TrashIcon className="size-5.5" />
        </Button>
      </SelectionListBar>
    </SelectionList>
  )
}

export default function SelectionListIconActions() {
  return <MailExample />
}
