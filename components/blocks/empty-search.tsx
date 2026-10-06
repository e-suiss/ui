"use client"

import { MagnifyingGlassIcon, XIcon } from "@phosphor-icons/react"
import * as React from "react"

import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty"

const suggestions = ["Book Air", "Book Pro", "Book mini", "Compare Book models"]

export function EmptySearch() {
  const [query, setQuery] = React.useState("book neo")
  const inputRef = React.useRef<HTMLInputElement>(null)
  const trimmed = query.trim().toLowerCase()
  const matches =
    trimmed.length > 0 && trimmed.startsWith("book")
      ? suggestions.filter((item) => item.toLowerCase().startsWith(trimmed))
      : []

  return (
    <section className="px-5 py-10 md:px-12">
      <div className="mx-auto flex max-w-170 flex-col gap-6.5">
        <div className="flex h-13 items-center gap-2.5 border-b border-separator-strong text-label-secondary focus-within:border-accent">
          <MagnifyingGlassIcon className="size-5 shrink-0" />
          <input
            ref={inputRef}
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            aria-label="Search suiss"
            placeholder="Search suiss"
            className="min-w-0 flex-1 bg-transparent text-2xl font-semibold text-label outline-none placeholder:text-label-tertiary [&::-webkit-search-cancel-button]:hidden"
          />
          {query && (
            <Button
              size="icon-xs"
              aria-label="Clear search"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
              className="relative size-5.5 bg-label-tertiary text-surface after:absolute after:-inset-2.5 after:content-[''] hover:bg-label-secondary"
            >
              <XIcon weight="bold" className="size-2.75" />
            </Button>
          )}
        </div>
        {matches.length > 0 ? (
          <nav aria-label="Suggested" className="flex flex-col gap-1">
            <p className="mb-1.5 text-xs text-label-secondary">Suggested</p>
            {matches.map((item) => (
              <button
                key={item}
                type="button"
                onClick={() => setQuery(item)}
                className="flex items-center gap-2.5 rounded-md py-1.5 text-start text-lg outline-none hover:underline focus-visible:focus-ring"
              >
                <MagnifyingGlassIcon className="size-3.5 text-label-tertiary" />
                {item}
              </button>
            ))}
          </nav>
        ) : (
          <Empty
            key={query ? "none" : "idle"}
            className="items-start gap-3 rounded-none p-0 text-start transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:translate-y-2 starting:opacity-0 motion-reduce:transition-none"
          >
            <EmptyHeader
              className="max-w-none items-start gap-3"
              aria-live="polite"
            >
              <EmptyTitle className="text-3xl tracking-tight">
                {query
                  ? `No results for “${query}”.`
                  : "What are you looking for?"}
              </EmptyTitle>
              <EmptyDescription className="text-lg/normal">
                {query
                  ? "Check the spelling or try one of these:"
                  : "Search for products, support articles or stores."}
              </EmptyDescription>
            </EmptyHeader>
            <EmptyContent className="mt-1.5 max-w-none flex-row flex-wrap gap-2">
              {suggestions.map((item) => (
                <Button
                  key={item}
                  variant="secondary"
                  onClick={() => setQuery(item)}
                  className="h-8.5 px-3.5"
                >
                  {item}
                </Button>
              ))}
            </EmptyContent>
          </Empty>
        )}
      </div>
    </section>
  )
}
