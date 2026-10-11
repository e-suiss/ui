// @ts-nocheck
import {
  NotePencilIcon,
  PushPinIcon,
  ShareNetworkIcon,
} from "@phosphor-icons/react"
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, screen, userEvent, waitFor } from "storybook/test"

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

const notes = [
  { id: 1, title: "Groceries", preview: "Milk, eggs, bread, coffee" },
  { id: 2, title: "Trip ideas", preview: "Lisbon, Porto, the coast road" },
  { id: 3, title: "Book list", preview: "Three novels for the summer" },
  { id: 4, title: "Meeting notes", preview: "Ship the beta on Friday" },
]

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
              <ShareNetworkIcon className="size-5.5" />
            </Button>
            <Tip id="notes-compose" delay={600}>
              <TipAnchor>
                <Button
                  variant="plain"
                  size="icon-lg"
                  aria-label="New note"
                  onClick={() => setLog("Started a new note")}
                >
                  <NotePencilIcon className="size-5.5" />
                </Button>
              </TipAnchor>
              <TipPopover side="bottom" align="end">
                <TipIcon>
                  <NotePencilIcon weight="duotone" />
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
              <PushPinIcon weight="duotone" />
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
          {notes.map((note) => (
            <li key={note.id} className="not-first:border-t">
              <button
                type="button"
                onClick={() => setLog(`Opened ${note.title}`)}
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
        <p role="status" className="min-h-5 text-sm text-label-secondary">
          {log}
        </p>
      </div>
    </TipGroup>
  )
}

function TipsExample() {
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

const meta = {
  title: "Interactions/Tip",
  component: Tip,
} satisfies Meta<typeof Tip>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: { id: "notes-pin" },
  render: () => <TipsExample />,
  play: async ({ canvas, step }) => {
    const showAgain = canvas.getByRole("button", { name: "Show tips again" })

    await step("starts the tour with the compose tip", async () => {
      await userEvent.click(showAgain)
      const popover = await screen.findByRole("dialog", {
        name: "Start a note fast",
      })
      await expect(popover).toHaveAccessibleDescription(
        "Tap here any time to begin a new note."
      )
      await expect(canvas.queryByRole("note")).toBeNull()
    })

    await step("using the anchored control dismisses its tip", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "New note" }))
      await expect(canvas.getByRole("status")).toHaveTextContent(
        "Started a new note"
      )
      await waitFor(() => expect(screen.queryByRole("dialog")).toBeNull())
    })

    await step("the next tip in the group follows", async () => {
      const card = await canvas.findByRole("note")
      await expect(card).toHaveTextContent("Pin your favorites")
      await userEvent.click(canvas.getByRole("button", { name: "Dismiss tip" }))
      await waitFor(() => expect(canvas.queryByRole("note")).toBeNull())
    })

    await step("dismissed tips stay away until they are reset", async () => {
      await userEvent.click(canvas.getByRole("button", { name: "New note" }))
      await expect(screen.queryByRole("dialog")).toBeNull()
      await userEvent.click(showAgain)
      await screen.findByRole("dialog", { name: "Start a note fast" })
    })
  },
}
