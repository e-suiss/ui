import * as React from "react"
import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import {
  resetTips,
  Tip,
  TipAnchor,
  TipCard,
  TipClose,
  TipContent,
  TipDescription,
  TipGroup,
  TipIcon,
  TipPopover,
  TipTitle,
} from "@/components/interactions/tip"
import { Button } from "@/components/ui/button"

const TIP_IDS = ["notes-pin", "notes-compose"]

function NotesPage() {
  const [log, setLog] = React.useState("")

  return (
    <TipGroup>
      <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-4">
        <div className="flex items-center justify-between">
          <h2 className="text-3xl font-bold tracking-tight">Notes</h2>
          <div className="flex items-center">
            <Button
              variant="plain"
              size="icon-lg"
              aria-label="Share folder"
              onClick={() => setLog("Shared the folder")}
            >
              <IconPlaceholder
                lucide="Share2Icon"
                tabler="IconShare"
                hugeicons="Share08Icon"
                phosphor="ShareNetworkIcon"
                remixicon="RiShareLine"
                className="size-5.5"
              />
            </Button>
            <Tip id="notes-compose" delay={600}>
              <TipAnchor>
                <Button
                  variant="plain"
                  size="icon-lg"
                  aria-label="New note"
                  onClick={() => setLog("Started a new note")}
                >
                  <IconPlaceholder
                    lucide="SquarePenIcon"
                    tabler="IconEdit"
                    hugeicons="PencilEdit02Icon"
                    phosphor="NotePencilIcon"
                    remixicon="RiEditBoxLine"
                    className="size-5.5"
                  />
                </Button>
              </TipAnchor>
              <TipPopover side="bottom" align="end">
                <TipIcon>
                  <IconPlaceholder
                    lucide="SquarePenIcon"
                    tabler="IconEdit"
                    hugeicons="PencilEdit02Icon"
                    phosphor="NotePencilIcon"
                    remixicon="RiEditBoxLine"
                  />
                </TipIcon>
                <TipContent>
                  <TipTitle>Start a note fast</TipTitle>
                  <TipDescription>
                    Tap here any time to begin a new note.
                  </TipDescription>
                </TipContent>
                <TipClose />
              </TipPopover>
            </Tip>
          </div>
        </div>
        <Tip id="notes-pin">
          <TipCard>
            <TipIcon>
              <IconPlaceholder
                lucide="PinIcon"
                tabler="IconPin"
                hugeicons="PinIcon"
                phosphor="PushPinIcon"
                remixicon="RiPushpinLine"
              />
            </TipIcon>
            <TipContent>
              <TipTitle>Pin your favorites</TipTitle>
              <TipDescription>
                Swipe right on a note to keep it at the top of the list.
              </TipDescription>
            </TipContent>
            <TipClose />
          </TipCard>
        </Tip>
        <ul className="overflow-hidden rounded-2xl border">
          <li className="not-first:border-t">
            <button
              type="button"
              onClick={() => setLog("Opened Groceries")}
              className="flex w-full flex-col px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span className="truncate font-semibold">Groceries</span>
              <span className="truncate text-sm text-muted-foreground">
                Milk, eggs, bread, coffee
              </span>
            </button>
          </li>
          <li className="not-first:border-t">
            <button
              type="button"
              onClick={() => setLog("Opened Trip ideas")}
              className="flex w-full flex-col px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span className="truncate font-semibold">Trip ideas</span>
              <span className="truncate text-sm text-muted-foreground">
                Lisbon, Porto, the coast road
              </span>
            </button>
          </li>
          <li className="not-first:border-t">
            <button
              type="button"
              onClick={() => setLog("Opened Book list")}
              className="flex w-full flex-col px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span className="truncate font-semibold">Book list</span>
              <span className="truncate text-sm text-muted-foreground">
                Three novels for the summer
              </span>
            </button>
          </li>
          <li className="not-first:border-t">
            <button
              type="button"
              onClick={() => setLog("Opened Meeting notes")}
              className="flex w-full flex-col px-4 py-3 text-start outline-none focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:ring-inset"
            >
              <span className="truncate font-semibold">Meeting notes</span>
              <span className="truncate text-sm text-muted-foreground">
                Ship the beta on Friday
              </span>
            </button>
          </li>
        </ul>
        <p role="status" className="min-h-5 text-sm text-muted-foreground">
          {log}
        </p>
      </div>
    </TipGroup>
  )
}

export default function TipDemo() {
  const [key, setKey] = React.useState(0)

  return (
    <div className="flex flex-col gap-6">
      <NotesPage key={key} />
      <Button
        variant="secondary"
        size="sm"
        className="self-center"
        onClick={() => {
          resetTips(TIP_IDS)
          setKey((value) => value + 1)
        }}
      >
        Show tips again
      </Button>
    </div>
  )
}
