"use client"

import {
  BookOpenTextIcon,
  ChartBarIcon,
  CubeIcon,
  HandTapIcon,
  type Icon,
  LayoutIcon,
  MagnifyingGlassIcon,
  SquaresFourIcon,
} from "@phosphor-icons/react"
import { cn } from "cn"
import { useRouter } from "next/navigation"
import * as React from "react"

import {
  CommandPalette,
  CommandPaletteContent,
} from "@/components/patterns/command-palette"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { useIsMobile } from "@/hooks/use-mobile"
import { isMacPlatform } from "@/hooks/use-platform"
import { strings } from "@/lib/strings"

type Entry = { title: string; description?: string; url: string }
type Group = { name: string; pages: Entry[] }

const icons: Record<string, Icon> = {
  components: CubeIcon,
  patterns: SquaresFourIcon,
  interactions: HandTapIcon,
  charts: ChartBarIcon,
  blocks: LayoutIcon,
}

let index: Promise<Group[]> | undefined

function loadIndex() {
  index ??= fetch("/api/search")
    .then((response) => {
      if (!response.ok) throw new Error(response.statusText)
      return response.json() as Promise<Group[]>
    })
    .catch((error) => {
      index = undefined
      throw error
    })
  return index
}

function useIndex(open: boolean) {
  const [groups, setGroups] = React.useState<Group[]>()
  React.useEffect(() => {
    if (!open || groups) return
    let active = true
    loadIndex()
      .then((result) => active && setGroups(result))
      .catch(() => undefined)
    return () => {
      active = false
    }
  }, [open, groups])
  return groups
}

const MAX_RESULTS = 40
const WORD_BREAK = /[\s-]+/
const WHITESPACE = /\s+/

function score(page: Entry, group: string, search: string) {
  const query = search.trim().toLowerCase()
  if (!query) return 0
  const title = page.title.toLowerCase()
  if (title === query) return 1
  if (title.startsWith(query)) return 0.9
  if (title.split(WORD_BREAK).some((word) => word.startsWith(query))) return 0.8
  if (title.includes(query)) return 0.7
  const words = query.split(WHITESPACE)
  const named = `${title} ${group.toLowerCase()}`
  if (words.every((word) => named.includes(word))) return 0.6
  const described = `${named} ${(page.description ?? "").toLowerCase()}`
  if (words.every((word) => described.includes(word))) return 0.3
  return 0
}

function Highlight({ text, query }: { text: string; query: string }) {
  const at = query ? text.toLowerCase().indexOf(query.trim().toLowerCase()) : -1
  if (at < 0) return text
  const end = at + query.trim().length
  return (
    <>
      {text.slice(0, at)}
      <mark className="bg-transparent font-semibold text-current">
        {text.slice(at, end)}
      </mark>
      {text.slice(end)}
    </>
  )
}

function Result({
  page,
  group,
  query,
  showGroup,
  onSelect,
}: {
  page: Entry
  group: string
  query: string
  showGroup?: boolean
  onSelect: (url: string) => void
}) {
  const GroupIcon = icons[group.toLowerCase()] ?? BookOpenTextIcon
  return (
    <CommandItem
      value={page.url}
      onSelect={() => onSelect(page.url)}
      className="h-auto min-h-10 py-2"
    >
      <GroupIcon />
      <span className="flex min-w-0 flex-1 flex-col">
        <span className="truncate">
          <Highlight text={page.title} query={query} />
        </span>
        {page.description && (
          <span className="truncate text-sm text-label-secondary group-data-selected/command-item:text-on-accent/75">
            {page.description}
          </span>
        )}
      </span>
      {showGroup && (
        <span
          data-slot="command-shortcut"
          className="shrink-0 text-xs text-label-secondary max-sm:hidden group-data-selected/command-item:text-on-accent/75"
        >
          {group}
        </span>
      )}
    </CommandItem>
  )
}

function Results({
  groups,
  query,
  onSelect,
}: {
  groups?: Group[]
  query: string
  onSelect: (url: string) => void
}) {
  const matches = React.useMemo(() => {
    if (!groups || !query.trim()) return []
    return groups
      .flatMap((group) =>
        group.pages.map((page) => ({
          page,
          group: group.name,
          rank: score(page, group.name, query),
        }))
      )
      .filter((match) => match.rank > 0)
      .sort(
        (a, b) => b.rank - a.rank || a.page.title.length - b.page.title.length
      )
      .slice(0, MAX_RESULTS)
  }, [groups, query])

  return (
    <CommandList className="max-h-[min(26rem,60dvh)]">
      <CommandEmpty>
        {groups ? strings.searchEmpty : strings.searching}
      </CommandEmpty>
      {query.trim()
        ? matches.map(({ page, group }) => (
            <Result
              key={page.url}
              page={page}
              group={group}
              query={query}
              showGroup
              onSelect={onSelect}
            />
          ))
        : groups?.map((group) => (
            <CommandGroup key={group.name} heading={group.name}>
              {group.pages.map((page) => (
                <Result
                  key={page.url}
                  page={page}
                  group={group.name}
                  query=""
                  onSelect={onSelect}
                />
              ))}
            </CommandGroup>
          ))}
    </CommandList>
  )
}

function Keys() {
  return (
    <div className="flex h-11 items-center gap-5 border-t border-separator px-4 text-xs text-label-secondary">
      {[
        [["↑", "↓"], strings.searchNavigate],
        [["↵"], strings.searchOpen],
        [["esc"], strings.searchClose],
      ].map(([keys, label]) => (
        <span key={String(label)} className="flex items-center gap-1.5">
          {(keys as string[]).map((key) => (
            <kbd
              key={key}
              className="flex h-5 min-w-5 items-center justify-center rounded-md bg-label/8 px-1 font-sans text-[11px] font-medium text-label"
            >
              {key}
            </kbd>
          ))}
          {label}
        </span>
      ))}
    </div>
  )
}

export function Search({
  className,
  variant = "icon",
  hotkey = true,
}: {
  className?: string
  variant?: "icon" | "field"
  hotkey?: boolean
}) {
  const router = useRouter()
  const isMobile = useIsMobile()
  const [open, setOpen] = React.useState(false)
  const [query, setQuery] = React.useState("")
  const groups = useIndex(open)

  React.useEffect(() => {
    if (!hotkey) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (
        event.key.toLowerCase() === "k" &&
        (isMacPlatform() ? event.metaKey : event.ctrlKey)
      ) {
        event.preventDefault()
        setOpen((current) => !current)
      }
    }
    document.addEventListener("keydown", onKeyDown)
    return () => document.removeEventListener("keydown", onKeyDown)
  }, [hotkey])

  const onOpenChange = (next: boolean) => {
    setOpen(next)
    if (!next) setQuery("")
  }

  const select = (url: string) => {
    onOpenChange(false)
    router.push(url)
  }

  const prefetch = () => {
    loadIndex().catch(() => undefined)
  }

  const trigger =
    variant === "field" ? (
      <button
        type="button"
        onClick={() => setOpen(true)}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className={cn(
          "flex items-center gap-3 text-start outline-none focus-visible:focus-ring",
          className
        )}
      >
        <MagnifyingGlassIcon className="size-5 shrink-0" />
        <span className="flex-1 truncate">{strings.searchPlaceholder}</span>
        <kbd className="shrink-0 rounded-md bg-current/10 px-2 py-0.5 font-sans text-xs font-medium">
          ⌘K
        </kbd>
      </button>
    ) : (
      <Button
        variant="ghost"
        size="icon-sm"
        aria-label={strings.search}
        onClick={() => setOpen(true)}
        onPointerEnter={prefetch}
        onFocus={prefetch}
        className={className}
      >
        <MagnifyingGlassIcon className="size-4" />
      </Button>
    )

  const body = (
    <>
      <CommandInput
        value={query}
        onValueChange={setQuery}
        placeholder={strings.searchPlaceholder}
      />
      <Results groups={groups} query={query} onSelect={select} />
    </>
  )

  return (
    <>
      {trigger}
      {isMobile ? (
        <CommandPalette open={open} onOpenChange={onOpenChange} hotkey={false}>
          <CommandPaletteContent
            title={strings.search}
            description={strings.searchPlaceholder}
            shouldFilter={false}
          >
            {body}
          </CommandPaletteContent>
        </CommandPalette>
      ) : (
        <CommandDialog
          open={open}
          onOpenChange={onOpenChange}
          title={strings.search}
          description={strings.searchPlaceholder}
        >
          <Command shouldFilter={false} loop>
            {body}
            <Keys />
          </Command>
        </CommandDialog>
      )}
    </>
  )
}
