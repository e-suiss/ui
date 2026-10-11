// @ts-nocheck
import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"
import { expect, userEvent, waitFor } from "storybook/test"

import {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexSection,
} from "@/components/interactions/section-index"
import { ScrollArea } from "@/components/ui/scroll-area"
import { MOUSE_POINTER_ID } from "./pointer"

const UPPERCASE = /[A-Z]/

const names = [
  "Aaron Price",
  "Abby Chen",
  "Alex Morgan",
  "Amira Haddad",
  "Ben Carter",
  "Bianca Rossi",
  "Carla Diaz",
  "Chris Evans",
  "Cody Brooks",
  "Dana Scott",
  "Derek Hale",
  "Elena Petrova",
  "Ethan Wright",
  "Fatima Khan",
  "Felix Wagner",
  "Grace Kim",
  "Hana Sato",
  "Henry Ford",
  "Ivy Turner",
  "Jack Miller",
  "Jade Wilson",
  "Jonas Berg",
  "Kai Nakamura",
  "Laura Bell",
  "Leo Martin",
  "Lina Costa",
  "Maya Patel",
  "Mia Novak",
  "Noah Fischer",
  "Nora Lind",
  "Omar Aziz",
  "Paula Silva",
  "Quinn Avery",
  "Rosa Lopez",
  "Ryan Cole",
  "Sara Ahmed",
  "Sofia Greco",
  "Tom Baker",
  "Uma Rao",
  "Victor Hugo",
  "Will Jensen",
  "Yara Nasser",
  "Zoe Adams",
  "8 Ball Club",
]

function groupByLetter() {
  const groups = new Map<string, string[]>()
  for (const name of names) {
    const first = name.charAt(0).toUpperCase()
    const letter = UPPERCASE.test(first) ? first : "#"
    groups.set(letter, [...(groups.get(letter) ?? []), name])
  }
  return [...groups.entries()].sort(([a], [b]) => {
    if (a === "#") return 1
    if (b === "#") return -1
    return a.localeCompare(b)
  })
}

function ContactsExample({ className }: { className: string }) {
  const [log, setLog] = React.useState("Tap or drag the letters.")

  return (
    <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      <SectionIndex className={className}>
        <ScrollArea className="h-full rounded-2xl border">
          {groupByLetter().map(([letter, group]) => (
            <SectionIndexSection key={letter} value={letter}>
              <SectionIndexHeader>{letter}</SectionIndexHeader>
              <ul>
                {group.map((name) => (
                  <li
                    key={name}
                    className="ms-4 me-10 border-separator not-first:border-t"
                  >
                    <button
                      type="button"
                      onClick={() => setLog(`Opened ${name}`)}
                      className="w-full py-3 text-start text-base outline-none focus-visible:focus-ring"
                    >
                      {name}
                    </button>
                  </li>
                ))}
              </ul>
            </SectionIndexSection>
          ))}
        </ScrollArea>
        <SectionIndexBar
          onValueChange={(letter) => setLog(`Jumped to ${letter}`)}
        />
      </SectionIndex>
      <p role="status" className="text-sm text-label-secondary">
        {log}
      </p>
    </div>
  )
}

const meta = {
  title: "Interactions/Section Index",
  component: SectionIndex,
} satisfies Meta<typeof SectionIndex>

export default meta

type Story = StoryObj<typeof meta>

function sectionTop(canvasElement: HTMLElement, letter: string) {
  const section = canvasElement.querySelector<HTMLElement>(
    `[data-slot=section-index-section][data-value="${letter}"]`
  )
  const viewport = section?.closest<HTMLElement>(
    "[data-slot=scroll-area-viewport]"
  )
  if (!section || !viewport) throw new Error(`section ${letter} not found`)
  return Math.round(
    section.getBoundingClientRect().top - viewport.getBoundingClientRect().top
  )
}

function tapLetter(bar: HTMLElement, fraction: number) {
  const rect = bar.getBoundingClientRect()
  const init = {
    pointerId: MOUSE_POINTER_ID,
    pointerType: "mouse",
    isPrimary: true,
    button: 0,
    clientX: rect.left + rect.width / 2,
    clientY: rect.top + rect.height * fraction,
    bubbles: true,
    cancelable: true,
  }
  bar.dispatchEvent(new PointerEvent("pointerdown", { ...init, buttons: 1 }))
  bar.dispatchEvent(new PointerEvent("pointerup", { ...init, buttons: 0 }))
}

export const Default: Story = {
  render: () => (
    <ContactsExample className="h-[min(36rem,calc(100dvh-6rem))]" />
  ),
  play: async ({ canvas, canvasElement, step }) => {
    const bar = canvas.getByRole("slider", { name: "Section index" })
    const status = canvas.getByRole("status")

    await step("jumps to a section when a letter is typed", async () => {
      bar.focus()
      await userEvent.keyboard("m")
      await expect(bar).toHaveAttribute("aria-valuetext", "M")
      await expect(status).toHaveTextContent("Jumped to M")
      await waitFor(() => expect(sectionTop(canvasElement, "M")).toBe(0))
    })

    await step("moves letter by letter with the arrow keys", async () => {
      await userEvent.keyboard("{ArrowDown}")
      await expect(bar).toHaveAttribute("aria-valuetext", "N")
      await waitFor(() => expect(sectionTop(canvasElement, "N")).toBe(0))
    })

    await step("Home and End reach the first and last sections", async () => {
      await userEvent.keyboard("{End}")
      await expect(status).toHaveTextContent("Jumped to #")
      await userEvent.keyboard("{Home}")
      await expect(status).toHaveTextContent("Jumped to A")
      await waitFor(() => expect(sectionTop(canvasElement, "A")).toBe(0))
    })

    await step("tapping a letter on the bar jumps there", async () => {
      tapLetter(bar, 4.5 / 27)
      await waitFor(() => expect(status).toHaveTextContent("Jumped to E"))
      await expect(bar).toHaveAttribute("aria-valuetext", "E")
      await waitFor(() => expect(sectionTop(canvasElement, "E")).toBe(0))
    })
  },
}

export const Compact: Story = {
  render: () => <ContactsExample className="h-64" />,
  play: async ({ canvas, canvasElement, step }) => {
    const bar = canvas.getByRole("slider", { name: "Section index" })
    const status = canvas.getByRole("status")

    await step("collapses the letters to fit the short list", async () => {
      await waitFor(() => expect(bar).toHaveTextContent("•"))
    })

    await step("still jumps to any letter from the bar", async () => {
      tapLetter(bar, 6.5 / 27)
      await waitFor(() => expect(status).toHaveTextContent("Jumped to G"))
      await waitFor(() => expect(sectionTop(canvasElement, "G")).toBe(0))
      bar.focus()
      await userEvent.keyboard("{PageDown}")
      await expect(bar).toHaveAttribute("aria-valuetext", "L")
    })
  },
}
