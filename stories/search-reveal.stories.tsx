import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  SearchReveal,
  SearchRevealContent,
  SearchRevealField,
} from "@/components/interactions/search-reveal"

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

function NotesExample({ count }: { count: number }) {
  const [query, setQuery] = React.useState("")
  const notes = allNotes
    .slice(0, count)
    .filter((note) =>
      `${note.title} ${note.preview}`
        .toLowerCase()
        .includes(query.trim().toLowerCase())
    )

  return (
    <div className="mx-auto flex h-[min(36rem,calc(100dvh-4rem))] w-[min(28rem,calc(100vw-2rem))] flex-col overflow-hidden rounded-2xl border">
      <h2 className="px-4 pt-4 pb-2 text-3xl font-bold tracking-tight">
        Notes
      </h2>
      <SearchReveal className="min-h-0 flex-1">
        <SearchRevealField value={query} onValueChange={setQuery} />
        <SearchRevealContent>
          {notes.length === 0 ? (
            <p className="px-4 py-16 text-center text-sm text-label-secondary">
              No results for “{query}”
            </p>
          ) : (
            <ul className="mx-4 overflow-hidden rounded-xl bg-surface-secondary">
              {notes.map((note) => (
                <li key={note.id} className="not-first:border-t">
                  <button
                    type="button"
                    className="flex w-full flex-col px-4 py-3 text-start outline-none focus-visible:focus-ring focus-visible:[--focus-ring-offset:-2px]"
                  >
                    <span className="truncate font-semibold">{note.title}</span>
                    <span className="truncate text-sm text-label-secondary">
                      {note.preview}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="px-4 py-3 text-center text-xs text-label-secondary">
            {notes.length} {notes.length === 1 ? "note" : "notes"}
          </p>
        </SearchRevealContent>
      </SearchReveal>
    </div>
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
