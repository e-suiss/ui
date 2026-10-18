import { TrashIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { UndoBarProvider, useUndoBar } from "@/components/interactions/undo-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

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

function NoteText({ note }: { note: Note }) {
  return (
    <View className="min-w-0 flex-1 py-2">
      <Text numberOfLines={1} className="font-semibold">
        {note.title}
      </Text>
      <Text numberOfLines={1} className="text-sm text-muted-foreground">
        {note.preview}
      </Text>
    </View>
  )
}

function NotesList({ deleteFirst = false }: { deleteFirst?: boolean }) {
  const { notes, remove, log } = useNotes()
  const removeRef = React.useRef(remove)
  const deletedRef = React.useRef(false)
  removeRef.current = remove

  React.useEffect(() => {
    if (!deleteFirst || deletedRef.current) return
    deletedRef.current = true
    removeRef.current(initialNotes[0])
  }, [deleteFirst])

  return (
    <View className="w-full gap-3">
      <View className="overflow-hidden rounded-2xl border border-border">
        {notes.map((note, index) => (
          <View
            key={note.id}
            className={
              index > 0
                ? "flex-row items-center gap-3 border-t border-border py-1 ps-4 pe-1"
                : "flex-row items-center gap-3 py-1 ps-4 pe-1"
            }
          >
            <NoteText note={note} />
            <Button
              variant="ghost"
              size="icon-lg"
              accessibilityLabel={`Delete ${note.title}`}
              onPress={() => remove(note)}
            >
              <Icon as={TrashIcon} className="size-5" />
            </Button>
          </View>
        ))}
      </View>
      <Text role="status" className="text-sm text-muted-foreground">
        {log}
      </Text>
    </View>
  )
}

export default function UndoBarShowing() {
  return (
    <UndoBarProvider timeout={60000}>
      <NotesList deleteFirst />
    </UndoBarProvider>
  )
}
