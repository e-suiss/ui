import type { Meta, StoryObj } from "@storybook/react-native"
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
  { id: 4, title: "Meeting notes", preview: "Ship the beta on Friday" },
  { id: 5, title: "Gift ideas", preview: "Headphones, a plant, a scarf" },
  { id: 6, title: "Recipes", preview: "Lemon pasta and a quick curry" },
  { id: 7, title: "Workout plan", preview: "Run on Monday, swim on Thursday" },
  {
    id: 8,
    title: "Movies to watch",
    preview: "Two documentaries and a classic",
  },
  { id: 9, title: "Garden", preview: "Plant tomatoes after the frost" },
  { id: 10, title: "Packing list", preview: "Charger, passport, rain jacket" },
  { id: 11, title: "Podcast notes", preview: "Episode about city design" },
  { id: 12, title: "Budget", preview: "Rent, groceries, savings" },
]

function NotesExample({
  count,
  defaultQuery = "",
}: {
  count: number
  defaultQuery?: string
}) {
  const [query, setQuery] = React.useState(defaultQuery)
  const notes = allNotes
    .slice(0, count)
    .filter((note) =>
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

const meta = {
  title: "Interactions/Search Reveal",
  component: SearchReveal,
} satisfies Meta<typeof SearchReveal>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <NotesExample count={12} />,
}

export const ShortList: Story = {
  render: () => <NotesExample count={3} />,
}

export const WithQuery: Story = {
  render: () => <NotesExample count={12} defaultQuery="porto" />,
}
