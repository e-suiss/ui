import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  type HapticsAdapter,
  HapticsProvider,
  useHaptics,
} from "@/components/ui/haptics"
import { Text } from "@/components/ui/text"

function FeedbackButtons() {
  const haptics = useHaptics()
  return (
    <View className="w-full gap-3">
      <Text variant="muted">Impact</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.impact("light")}
        >
          light
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.impact("medium")}
        >
          medium
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.impact("heavy")}
        >
          heavy
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.impact("soft")}
        >
          soft
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.impact("rigid")}
        >
          rigid
        </Button>
      </View>
      <Text variant="muted">Selection</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.selection()}
        >
          selection
        </Button>
      </View>
      <Text variant="muted">Notification</Text>
      <View className="flex-row flex-wrap gap-2">
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.notification("success")}
        >
          success
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.notification("warning")}
        >
          warning
        </Button>
        <Button
          size="sm"
          variant="secondary"
          onPress={() => haptics.notification("error")}
        >
          error
        </Button>
      </View>
    </View>
  )
}

export default function HapticsFeedback() {
  const [log, setLog] = React.useState({ last: "None", count: 0 })
  const adapter = React.useMemo<HapticsAdapter>(() => {
    const record = (event: string) =>
      setLog((current) => ({ last: event, count: current.count + 1 }))
    return {
      impact: (style) => record(`impact ${style}`),
      selection: () => record("selection"),
      notification: (type) => record(`notification ${type}`),
    }
  }, [])
  return (
    <HapticsProvider adapter={adapter}>
      <View className="w-full gap-4">
        <View className="flex-row items-center justify-between rounded-xl bg-muted px-4 py-3">
          <Text className="text-sm text-muted-foreground">Last haptic</Text>
          <Text
            role="status"
            accessibilityLiveRegion="polite"
            className="text-sm font-medium"
          >
            {log.count > 0 ? `${log.last} (${log.count})` : log.last}
          </Text>
        </View>
        <FeedbackButtons />
      </View>
    </HapticsProvider>
  )
}
