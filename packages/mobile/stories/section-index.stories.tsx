import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import {
  SectionIndex,
  SectionIndexBar,
  SectionIndexHeader,
  SectionIndexScrollView,
  SectionIndexSection,
} from "@/components/interactions/section-index"
import { Text } from "@/components/ui/text"

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
    <View className="gap-3">
      <SectionIndex className={className}>
        <SectionIndexScrollView className="rounded-2xl border border-border">
          {groupByLetter().map(([letter, group]) => (
            <SectionIndexSection key={letter} value={letter}>
              <SectionIndexHeader>{letter}</SectionIndexHeader>
              {group.map((name, index) => (
                <Pressable
                  key={name}
                  onPress={() => setLog(`Opened ${name}`)}
                  className={`ms-4 me-10 py-3 active:opacity-60 ${index > 0 ? "border-t border-border" : ""}`}
                >
                  <Text>{name}</Text>
                </Pressable>
              ))}
            </SectionIndexSection>
          ))}
        </SectionIndexScrollView>
        <SectionIndexBar
          onValueChange={(letter) => setLog(`Jumped to ${letter}`)}
        />
      </SectionIndex>
      <Text variant="muted">{log}</Text>
    </View>
  )
}

const meta = {
  title: "Interactions/Section Index",
  component: SectionIndex,
} satisfies Meta<typeof SectionIndex>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ContactsExample className="h-[520px]" />,
}

export const Compact: Story = {
  render: () => <ContactsExample className="h-64" />,
}
