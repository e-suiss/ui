"use client"

import { CaretRightIcon } from "@phosphor-icons/react"
import * as React from "react"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { ScrollArea } from "@/components/ui/scroll-area"
import { BOARDS } from "@/lib/create/boards"
import type { CreateGroup } from "@/lib/create/items"
import { strings } from "@/lib/strings"
import { cn } from "@/lib/utils"

export function ItemExplorer({
  groups,
  value,
  onChange,
}: {
  groups: CreateGroup[]
  value: string
  onChange: (value: string) => void
}) {
  const current = groups.find((group) =>
    group.items.some((item) => item.name === value)
  )?.title
  const [open, setOpen] = React.useState<string[]>([])
  React.useEffect(() => {
    if (current)
      setOpen((titles) =>
        titles.includes(current) ? titles : [...titles, current]
      )
  }, [current])
  return (
    <nav
      aria-label={strings.createItems}
      className="hidden w-52 shrink-0 xl:flex xl:flex-col"
    >
      <ScrollArea className="min-h-0 flex-1 [&>[data-slot=scroll-area-viewport]]:pe-3">
        <div className="flex flex-col gap-1 pb-6">
          {BOARDS.map((board) => (
            <button
              key={board.name}
              type="button"
              aria-current={board.name === value ? "page" : undefined}
              onClick={() => onChange(board.name)}
              className={cn(
                "rounded-lg px-2 py-1.5 text-start text-[13px] font-medium outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50",
                board.name === value && "bg-foreground/8"
              )}
            >
              {strings.createBoard} {board.title}
            </button>
          ))}
          {groups.map((group) => (
            <Collapsible
              key={group.title}
              open={open.includes(group.title)}
              onOpenChange={(next) =>
                setOpen((titles) =>
                  next
                    ? [...titles, group.title]
                    : titles.filter((title) => title !== group.title)
                )
              }
              className="flex flex-col"
            >
              <CollapsibleTrigger className="group/trigger flex items-center gap-1.5 rounded-lg px-2 py-1.5 text-start text-[13px] font-medium outline-none transition-colors hover:bg-foreground/5 focus-visible:ring-3 focus-visible:ring-ring/50">
                <CaretRightIcon
                  aria-hidden
                  className="size-3.5 text-muted-foreground transition-transform group-data-panel-open/trigger:rotate-90"
                />
                <span className="flex-1">{group.title}</span>
                <span className="text-xs text-muted-foreground tabular-nums">
                  {group.items.length}
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent className="ms-3.5 flex flex-col border-s border-border ps-2">
                {group.items.map((item) => (
                  <button
                    key={item.name}
                    type="button"
                    aria-current={item.name === value ? "page" : undefined}
                    onClick={() => onChange(item.name)}
                    className={cn(
                      "truncate rounded-lg px-2 py-1 text-start text-[13px] text-muted-foreground outline-none transition-colors hover:bg-foreground/5 hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50",
                      item.name === value && "bg-foreground/8 text-foreground"
                    )}
                  >
                    {item.title}
                  </button>
                ))}
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>
      </ScrollArea>
    </nav>
  )
}
