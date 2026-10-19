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

export default function SelectionListIconActions() {
  const [notes, setNotes] = React.useState(initialNotes)
  const [log, setLog] = React.useState("Tap Select to choose notes.")
  const [editing, setEditing] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])
  const disabled = selected.length === 0

  const act = (verb: string) => setLog(`${verb} ${selected.join(", ")}`)

  const remove = () => {
    setNotes((current) => current.filter((note) => !selected.includes(note.id)))
    setLog(
      `Deleted ${selected.length} ${selected.length === 1 ? "note" : "notes"}`
    )
    setSelected([])
  }

  const reset = () => {
    setNotes(initialNotes)
    setLog("Tap Select to choose notes.")
  }

  return (
    <SelectionList
      editing={editing}
      onEditingChange={setEditing}
      value={selected}
      onValueChange={setSelected}
      className="w-full gap-3"
    >
      <View className="flex-row items-center justify-between">
        <Text variant="h1">Inbox</Text>
        <SelectionListTrigger />
      </View>
      <View className="overflow-hidden rounded-2xl border border-border">
        {notes.map((note, index) => (
          <SelectionListItem
            key={note.id}
            value={note.id}
            className={index > 0 ? "border-t border-border" : undefined}
          >
            <Pressable
              onPress={() => setLog(`Opened ${note.title}`)}
              className="min-w-0 flex-1 flex-row items-center gap-3 px-4 py-3 active:opacity-80"
            >
              <View className="min-w-0 flex-1">
                <Text numberOfLines={1} className="font-semibold">
                  {note.title}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm text-muted-foreground"
                >
                  {note.preview}
                </Text>
              </View>
              <Icon
                as={CaretRightIcon}
                className={
                  editing
                    ? "size-4 shrink-0 text-muted-foreground opacity-0"
                    : "size-4 shrink-0 text-muted-foreground"
                }
              />
            </Pressable>
          </SelectionListItem>
        ))}
      </View>
      <View className="flex-row items-center justify-between gap-3">
        <Text
          role="status"
          className="min-w-0 flex-1 text-sm text-muted-foreground"
        >
          {log}
        </Text>
        <Button size="sm" variant="secondary" onPress={reset}>
          <Text>Reset</Text>
        </Button>
      </View>
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
          onPress={remove}
        >
          <Icon
            as={TrashIcon}
            className={
              disabled
                ? "size-5.5 text-destructive opacity-50"
                : "size-5.5 text-destructive"
            }
          />
        </Button>
      </SelectionListBar>
    </SelectionList>
  )
}
