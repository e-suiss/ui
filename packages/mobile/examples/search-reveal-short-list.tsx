import * as React from "react"
import { Pressable, View } from "react-native"
import {
  SearchReveal,
  SearchRevealContent,
  SearchRevealField,
} from "@/components/interactions/search-reveal"
import { Text } from "@/components/ui/text"

const allNotes = [
  { id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee" },
  { id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road" },
  { id: 3, title: "Book list", preview: "Three novels for the summer" },
]

export default function SearchRevealShortList() {
  const [query, setQuery] = React.useState("")
  const notes = allNotes.filter((note) =>
    `${note.title} ${note.preview}`
      .toLowerCase()
      .includes(query.trim().toLowerCase())
  )

  return (
    <View className="flex-1 overflow-hidden rounded-2xl border border-border">
      <Text variant="h1" className="px-4 pt-4 pb-2">
        Notes
      </Text>
      <SearchReveal>
        <SearchRevealField value={query} onValueChange={setQuery} />
        <SearchRevealContent>
          {notes.length === 0 ? (
            <Text className="px-4 py-16 text-center text-sm text-muted-foreground">
              No results for “{query}”
            </Text>
          ) : (
            <View className="mx-4 overflow-hidden rounded-xl bg-muted">
              {notes.map((note, index) => (
                <Pressable
                  key={note.id}
                  className={
                    index > 0
                      ? "border-t border-border px-4 py-3 active:opacity-80"
                      : "px-4 py-3 active:opacity-80"
                  }
                >
                  <Text numberOfLines={1} className="font-semibold">
                    {note.title}
                  </Text>
                  <Text
                    numberOfLines={1}
                    className="text-sm text-muted-foreground"
                  >
                    {note.preview}
                  </Text>
                </Pressable>
              ))}
            </View>
          )}
          <Text className="px-4 py-3 text-center text-xs text-muted-foreground">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </Text>
        </SearchRevealContent>
      </SearchReveal>
    </View>
  )
}
