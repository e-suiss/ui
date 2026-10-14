// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

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

function revealRoot(field: HTMLElement) {
  const root = field.closest<HTMLElement>("[data-slot=search-reveal]")
  if (!root) throw new Error("search reveal root not found")
  return root
}

export const Default: Story = {
  render: () => <NotesExample count={12} />,
  play: async ({ canvas, step }) => {
    const field = canvas.getByRole("searchbox", { name: "Search" })
    const root = revealRoot(field)

    await step("starts with the field tucked above the list", async () => {
      await expect(root.scrollTop).toBeGreaterThan(0)
      await expect(canvas.getByText("12 notes")).toBeVisible()
    })

    await step("reveals the field when it is focused", async () => {
      await userEvent.click(field)
      await expect(field).toHaveFocus()
      await waitFor(() => expect(root.scrollTop).toBe(0))
    })

    await step("filters the notes as the user types", async () => {
      await userEvent.type(field, "porto")
      await expect(canvas.getByText("1 note")).toBeVisible()
      await expect(canvas.getByText("Trip ideas")).toBeVisible()
      await expect(canvas.queryByText("Groceries")).toBeNull()
    })

    await step(
      "shows the empty state for a query without matches",
      async () => {
        await userEvent.type(field, "xyz")
        await expect(
          canvas.getByText("No results for “portoxyz”")
        ).toBeVisible()
        await expect(canvas.getByText("0 notes")).toBeVisible()
      }
    )

    await step("clears the query and keeps focus in the field", async () => {
      await userEvent.click(
        canvas.getByRole("button", { name: "Clear search" })
      )
      await expect(field).toHaveValue("")
      await expect(field).toHaveFocus()
      await expect(canvas.getByText("12 notes")).toBeVisible()
    })
  },
}

export const ShortList: Story = {
  render: () => <NotesExample count={3} />,
  play: async ({ canvas, step }) => {
    const field = canvas.getByRole("searchbox", { name: "Search" })
    const root = revealRoot(field)

    await step("hides the field even when the list is short", async () => {
      await expect(root.scrollTop).toBeGreaterThan(0)
    })

    await step("reveals the field and filters the short list", async () => {
      await userEvent.click(field)
      await waitFor(() => expect(root.scrollTop).toBe(0))
      await userEvent.type(field, "book")
      await expect(canvas.getByText("1 note")).toBeVisible()
      await expect(canvas.getByText("Book list")).toBeVisible()
    })
  },
}
