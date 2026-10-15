import type { Meta, StoryObj } from "@storybook/react-native"
import {
  NotePencilIcon,
  PushPinIcon,
  ShareNetworkIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
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
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

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
      <View className="w-full gap-4">
        <View className="flex-row items-center justify-between">
          <Text variant="h1">Notes</Text>
          <View className="flex-row items-center">
            <Button
              variant="plain"
              size="icon-lg"
              accessibilityLabel="Share folder"
              onPress={() => setLog("Shared the folder")}
            >
              <Icon as={ShareNetworkIcon} className="size-5.5" />
            </Button>
            <Tip id="notes-compose" delay={600}>
              <TipAnchor>
                <Button
                  variant="plain"
                  size="icon-lg"
                  accessibilityLabel="New note"
                  onPress={() => setLog("Started a new note")}
                >
                  <Icon as={NotePencilIcon} className="size-5.5" />
                </Button>
              </TipAnchor>
              <TipPopover side="bottom" align="end">
                <TipIcon>
                  <Icon as={NotePencilIcon} weight="duotone" />
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
          </View>
        </View>
        <Tip id="notes-pin">
          <TipCard>
            <TipIcon>
              <Icon as={PushPinIcon} weight="duotone" />
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
        <View className="overflow-hidden rounded-2xl border border-border">
          {notes.map((note, index) => (
            <Pressable
              key={note.id}
              onPress={() => setLog(`Opened ${note.title}`)}
              className={
                index > 0
                  ? "border-t border-border px-4 py-3 active:opacity-80"
                  : "px-4 py-3 active:opacity-80"
              }
            >
              <Text numberOfLines={1} className="font-semibold">
                {note.title}
              </Text>
              <Text numberOfLines={1} className="text-sm text-muted-foreground">
                {note.preview}
              </Text>
            </Pressable>
          ))}
        </View>
        <Text role="status" className="min-h-5 text-sm text-muted-foreground">
          {log}
        </Text>
      </View>
    </TipGroup>
  )
}

function TipsExample({ fresh = false }: { fresh?: boolean }) {
  const [key, setKey] = React.useState(0)
  const [ready, setReady] = React.useState(!fresh)

  React.useEffect(() => {
    if (!fresh) return
    resetTips(TIP_IDS).then(() => setReady(true))
  }, [fresh])

  return (
    <View className="gap-6">
      {ready ? <NotesPage key={key} /> : null}
      <Button
        variant="secondary"
        size="sm"
        className="self-center"
        onPress={() => {
          resetTips(TIP_IDS).then(() => setKey((value) => value + 1))
        }}
      >
        <Text>Show tips again</Text>
      </Button>
    </View>
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
  render: () => <TipsExample fresh />,
}

function CardExample() {
  const [ready, setReady] = React.useState(false)

  React.useEffect(() => {
    resetTips(["story-card"]).then(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <Tip id="story-card">
      <TipCard>
        <TipIcon>
          <Icon as={PushPinIcon} weight="duotone" />
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
  )
}

export const Card: Story = {
  args: { id: "story-card" },
  render: () => <CardExample />,
}
