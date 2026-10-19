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

export default function TipDemo() {
  const [key, setKey] = React.useState(0)
  const [ready, setReady] = React.useState(false)
  const [log, setLog] = React.useState("")

  React.useEffect(() => {
    resetTips(["notes-pin", "notes-compose"]).then(() => setReady(true))
  }, [])

  return (
    <View className="gap-6">
      {ready ? (
        <TipGroup key={key}>
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
              <Pressable
                onPress={() => setLog("Opened Groceries")}
                className="px-4 py-3 active:opacity-80"
              >
                <Text numberOfLines={1} className="font-semibold">
                  Groceries
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm text-muted-foreground"
                >
                  Milk, eggs, bread, coffee
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLog("Opened Trip ideas")}
                className="border-t border-border px-4 py-3 active:opacity-80"
              >
                <Text numberOfLines={1} className="font-semibold">
                  Trip ideas
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm text-muted-foreground"
                >
                  Lisbon, Porto, the coast road
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLog("Opened Book list")}
                className="border-t border-border px-4 py-3 active:opacity-80"
              >
                <Text numberOfLines={1} className="font-semibold">
                  Book list
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm text-muted-foreground"
                >
                  Three novels for the summer
                </Text>
              </Pressable>
              <Pressable
                onPress={() => setLog("Opened Meeting notes")}
                className="border-t border-border px-4 py-3 active:opacity-80"
              >
                <Text numberOfLines={1} className="font-semibold">
                  Meeting notes
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-sm text-muted-foreground"
                >
                  Ship the beta on Friday
                </Text>
              </Pressable>
            </View>
            <Text
              role="status"
              className="min-h-5 text-sm text-muted-foreground"
            >
              {log}
            </Text>
          </View>
        </TipGroup>
      ) : null}
      <Button
        variant="secondary"
        size="sm"
        className="self-center"
        onPress={() => {
          resetTips(["notes-pin", "notes-compose"]).then(() => {
            setLog("")
            setKey((value) => value + 1)
          })
        }}
      >
        <Text>Show tips again</Text>
      </Button>
    </View>
  )
}
