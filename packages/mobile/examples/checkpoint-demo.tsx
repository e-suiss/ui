import { ArrowCounterClockwiseIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Bubble, BubbleContent } from "@/components/ui/bubble"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Marker, MarkerContent } from "@/components/ui/marker"
import { Message, MessageContent } from "@/components/ui/message"
import { Text } from "@/components/ui/text"

const turns = [
  {
    ask: "Rename the button component to action.",
    reply: "Renamed Button to Action in components/ui/button.tsx.",
  },
  {
    ask: "Update the docs to match.",
    reply: "Updated the Button page to say Action.",
  },
]

function CheckpointExample() {
  const [restored, setRestored] = React.useState(false)
  const shown = restored ? turns.slice(0, 1) : turns
  return (
    <View className="w-full gap-4">
      {shown.map((turn, index) => (
        <View key={turn.ask} className="gap-3">
          <Message align="end">
            <MessageContent>
              <Bubble variant="muted">
                <BubbleContent>{turn.ask}</BubbleContent>
              </Bubble>
            </MessageContent>
          </Message>
          <Text>{turn.reply}</Text>
          {index === 0 ? (
            <Marker variant="separator">
              <MarkerContent>Checkpoint</MarkerContent>
            </Marker>
          ) : null}
        </View>
      ))}
      <View className="items-start">
        <Button
          variant="outline"
          size="sm"
          onPress={() => setRestored(!restored)}
        >
          <Icon as={ArrowCounterClockwiseIcon} />
          <Text>{restored ? "Reset" : "Restore checkpoint"}</Text>
        </Button>
      </View>
    </View>
  )
}

export default function CheckpointDemo() {
  return <CheckpointExample />
}
