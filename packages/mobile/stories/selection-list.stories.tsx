import type { Meta, StoryObj } from "@storybook/react-native"
import {
  ArchiveIcon,
  CaretRightIcon,
  FolderSimpleIcon,
  TrashIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import {
  SelectionList,
  SelectionListBar,
  SelectionListCount,
  SelectionListItem,
  SelectionListTrigger,
  useSelectionList,
} from "@/components/interactions/selection-list"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

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
  const { editing } = useSelectionList()
  return (
    <View className="overflow-hidden rounded-2xl border border-separator">
      {notes.map((note, index) => (
        <SelectionListItem
          key={note.id}
          value={note.id}
          className={index > 0 ? "border-t border-separator" : undefined}
        >
          <Pressable
            onPress={() => onOpen(note)}
            className="min-w-0 flex-1 flex-row items-center gap-3 px-4 py-3 active:bg-item-pressed"
          >
            <View className="min-w-0 flex-1">
              <Text numberOfLines={1} className="font-semibold">
                {note.title}
              </Text>
              <Text numberOfLines={1} className="text-sm text-label-secondary">
                {note.preview}
              </Text>
            </View>
            <Icon
              as={CaretRightIcon}
              className={
                editing
                  ? "size-4 shrink-0 text-label-tertiary opacity-0"
                  : "size-4 shrink-0 text-label-tertiary"
              }
            />
          </Pressable>
        </SelectionListItem>
      ))}
    </View>
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
      onPress={all ? clear : selectAll}
    >
      <Text>{all ? "Deselect All" : "Select All"}</Text>
    </Button>
  )
}

function DeleteButton({ onDelete }: { onDelete: (ids: string[]) => void }) {
  const { selected, setEditing } = useSelectionList()
  const disabled = selected.length === 0
  return (
    <Button
      variant="plain"
      size="lg"
      className="px-4"
      disabled={disabled}
      onPress={() => {
        onDelete(selected)
        setEditing(false)
      }}
    >
      <Text className={disabled ? "text-label-quaternary" : "text-danger"}>
        Delete
      </Text>
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

function Footer({ log, onReset }: { log: string; onReset: () => void }) {
  return (
    <View className="flex-row items-center justify-between gap-3">
      <Text
        role="status"
        className="min-w-0 flex-1 text-sm text-label-secondary"
      >
        {log}
      </Text>
      <Button size="sm" variant="secondary" onPress={onReset}>
        <Text>Reset</Text>
      </Button>
    </View>
  )
}

function NotesExample({
  defaultEditing,
  defaultValue,
}: {
  defaultEditing?: boolean
  defaultValue?: string[]
}) {
  const { notes, log, setLog, remove, reset } = useNotes()
  return (
    <SelectionList
      defaultEditing={defaultEditing}
      defaultValue={defaultValue}
      className="w-full gap-3"
    >
      <View className="flex-row items-center justify-between">
        <Text variant="h1">Notes</Text>
        <SelectionListTrigger />
      </View>
      <NoteRows
        notes={notes}
        onOpen={(note) => setLog(`Opened ${note.title}`)}
      />
      <Footer log={log} onReset={reset} />
      <SelectionListBar accessibilityLabel="Selection actions">
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
  const disabled = selected.length === 0

  const act = (verb: string) => setLog(`${verb} ${selected.join(", ")}`)

  return (
    <SelectionList
      value={selected}
      onValueChange={setSelected}
      className="w-full gap-3"
    >
      <View className="flex-row items-center justify-between">
        <Text variant="h1">Inbox</Text>
        <SelectionListTrigger />
      </View>
      <NoteRows
        notes={notes}
        onOpen={(note) => setLog(`Opened ${note.title}`)}
      />
      <Footer log={log} onReset={reset} />
      <SelectionListBar accessibilityLabel="Selection actions">
        <Button
          variant="plain"
          size="icon-lg"
          accessibilityLabel="Archive"
          disabled={disabled}
          onPress={() => act("Archived")}
        >
          <Icon as={ArchiveIcon} className="size-5.5" />
        </Button>
        <Button
          variant="plain"
          size="icon-lg"
          accessibilityLabel="Move"
          disabled={disabled}
          onPress={() => act("Moved")}
        >
          <Icon as={FolderSimpleIcon} className="size-5.5" />
        </Button>
        <SelectionListCount />
        <Button
          variant="plain"
          size="icon-lg"
          accessibilityLabel="Delete"
          disabled={disabled}
          onPress={() => {
            remove(selected)
            setSelected([])
          }}
        >
          <Icon
            as={TrashIcon}
            className={
              disabled
                ? "size-5.5 text-label-quaternary"
                : "size-5.5 text-danger"
            }
          />
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

export const Default: Story = {
  render: () => <NotesExample />,
}

export const Editing: Story = {
  render: () => (
    <NotesExample defaultEditing defaultValue={["trip", "meeting"]} />
  ),
}

export const IconActions: Story = {
  render: () => <MailExample />,
}
