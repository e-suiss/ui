// @ts-nocheck
import {
  ArchiveIcon,
  CaretRightIcon,
  FolderSimpleIcon,
  TrashIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
  useSelectionList,
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
            className="flex min-w-0 flex-1 items-center gap-3 px-4 py-3 text-start outline-none focus-visible:focus-ring focus-visible:[--focus-ring-offset:-2px]"
          >
            <span className="flex min-w-0 flex-1 flex-col">
              <span className="truncate text-base font-semibold">
                {note.title}
              </span>
              <span className="truncate text-sm text-label-secondary">
                {note.preview}
              </span>
            </span>
            <CaretRightIcon
              aria-hidden
              className="size-4 shrink-0 text-label-tertiary transition-opacity duration-200 rtl:rotate-180 group-data-editing/selection-list:opacity-0"
            />
          </button>
        </SelectionListItem>
      ))}
    </div>
  )
}

function SelectAllButton() {
  const { selected, selectAll, clear } = useSelectionList()
  const all = selected.length > 0

  return (
    <Button
      variant="plain"
      size="lg"
      className="px-4"
      onClick={all ? clear : selectAll}
    >
      {all ? "Deselect All" : "Select All"}
    </Button>
  )
}

function DeleteButton({ onDelete }: { onDelete: (ids: string[]) => void }) {
  const { selected, setEditing } = useSelectionList()

  return (
    <Button
      variant="plain"
      size="lg"
      className="px-4 text-danger disabled:text-label-quaternary"
      disabled={selected.length === 0}
      onClick={() => {
        onDelete(selected)
        setEditing(false)
      }}
    >
      Delete
    </Button>
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

function NotesExample() {
  const { notes, log, setLog, remove, reset } = useNotes()

  return (
    <SelectionList className="mx-auto flex w-full max-w-md flex-col gap-3 pb-24">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
        <SelectionListTrigger />
      </div>
      <NoteRows
        notes={notes}
        onOpen={(note) => setLog(`Opened ${note.title}`)}
      />
      <div className="flex items-center justify-between gap-3">
        <p role="status" className="text-sm text-label-secondary">
          {log}
        </p>
        <Button size="sm" variant="secondary" onClick={reset}>
          Reset
        </Button>
      </div>
      <SelectionListBar aria-label="Selection actions">
        <SelectAllButton />
        <SelectionListCount />
        <DeleteButton onDelete={remove} />
      </SelectionListBar>
    </SelectionList>
  )
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
        <p role="status" className="text-sm text-label-secondary">
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
          className="text-danger disabled:text-label-quaternary"
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

const meta = {
  title: "Interactions/Selection List",
  component: SelectionList,
} satisfies Meta<typeof SelectionList>

export default meta

type Story = StoryObj<typeof meta>

const GROCERIES = /^Groceries/
const TRIP = /^Trip ideas/
const MEETING = /^Meeting notes/

export const Default: Story = {
  render: () => <NotesExample />,
  play: async ({ canvas, step }) => {
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
      await userEvent.click(
        canvas.getByRole("button", { name: "Deselect All" })
      )
      await expect(toolbar).toHaveTextContent("Select items")
    })

    await step("Shift selects a range from the last pick", async () => {
      await userEvent.click(canvas.getByRole("checkbox", { name: TRIP }))
      canvas.getByRole("checkbox", { name: MEETING }).focus()
      await userEvent.keyboard("{Shift>}{Enter}{/Shift}")
      await expect(toolbar).toHaveTextContent("3 selected")
      await expect(
        canvas.getByRole("checkbox", { name: MEETING })
      ).toBeChecked()
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
  },
}

export const IconActions: Story = {
  render: () => <MailExample />,
  play: async ({ canvas, step }) => {
    const status = canvas.getByRole("status")
    const toolbar = canvas.getByRole("toolbar", { hidden: true })

    await step("actions stay disabled until something is picked", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "Select" }))
      await waitFor(() => expect(toolbar).toBeVisible())
      await expect(
        canvas.getByRole("button", { name: "Archive" })
      ).toBeDisabled()
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
  },
}
