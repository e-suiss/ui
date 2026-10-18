import * as React from "react"
import { View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  type HapticsAdapter,
  HapticsProvider,
  useHaptics,
} from "@/components/ui/haptics"
import { Text } from "@/components/ui/text"

function useLoggingAdapter() {
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
  return { adapter, log }
}

function HapticLog({ last, count }: { last: string; count: number }) {
  return (
    <View className="flex-row items-center justify-between rounded-xl bg-muted px-4 py-3">
      <Text className="text-sm text-muted-foreground">Last haptic</Text>
      <Text
        role="status"
        accessibilityLiveRegion="polite"
        className="text-sm font-medium"
      >
        {count > 0 ? `${last} (${count})` : last}
      </Text>
    </View>
  )
}

function FeedbackButtons() {
  const haptics = useHaptics()
  return (
    <View className="w-full gap-3">
      <Text variant="muted">Impact</Text>
      <View className="flex-row flex-wrap gap-2">
        {(["light", "medium", "heavy", "soft", "rigid"] as const).map(
          (style) => (
            <Button
              key={style}
              size="sm"
              variant="secondary"
              onPress={() => haptics.impact(style)}
            >
              {style}
            </Button>
          )
        )}
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
        {(["success", "warning", "error"] as const).map((type) => (
          <Button
            key={type}
            size="sm"
            variant="secondary"
            onPress={() => haptics.notification(type)}
          >
            {type}
          </Button>
        ))}
      </View>
    </View>
  )
}

function FeedbackDemo() {
  const { adapter, log } = useLoggingAdapter()
  return (
    <HapticsProvider adapter={adapter}>
      <View className="w-full gap-4">
        <HapticLog {...log} />
        <FeedbackButtons />
      </View>
    </HapticsProvider>
  )
}

export default function HapticsFeedback() {
  return <FeedbackDemo />
}
