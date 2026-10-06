import type { Meta, StoryObj } from "@storybook/react-vite"
import * as React from "react"

import {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexSection,
} from "@/components/interactions/section-index"

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
    const first = name[0].toUpperCase()
    const letter = /[A-Z]/.test(first) ? first : "#"
    groups.set(letter, [...(groups.get(letter) ?? []), name])
  }
  return [...groups.entries()].sort(([a], [b]) =>
    a === "#" ? 1 : b === "#" ? -1 : a.localeCompare(b)
  )
}

function ContactsExample({ className }: { className: string }) {
  const [log, setLog] = React.useState("Tap or drag the letters.")

  return (
    <div className="mx-auto flex w-[min(28rem,calc(100vw-2rem))] flex-col gap-3">
      <SectionIndex className={className}>
        <div className="h-full overflow-y-auto rounded-2xl border">
          {groupByLetter().map(([letter, group]) => (
            <SectionIndexSection key={letter} value={letter}>
              <SectionIndexHeader>{letter}</SectionIndexHeader>
              <ul>
                {group.map((name) => (
                  <li
                    key={name}
                    className="ms-4 me-8 border-separator not-first:border-t"
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
        </div>
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

export const Default: Story = {
  render: () => (
    <ContactsExample className="h-[min(36rem,calc(100dvh-6rem))]" />
  ),
}

export const Compact: Story = {
  render: () => <ContactsExample className="h-64" />,
}
