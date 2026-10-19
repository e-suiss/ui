import * as React from "react"
import { View } from "react-native"
import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { Checkbox } from "@/components/ui/checkbox"
import { Chip } from "@/components/ui/chip"
import { type HapticsAdapter, HapticsProvider } from "@/components/ui/haptics"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"

export default function HapticsDisabled() {
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
  const [wifi, setWifi] = React.useState(true)
  const [terms, setTerms] = React.useState(false)
  const [volume, setVolume] = React.useState(40)
  const [copies, setCopies] = React.useState(1)
  return (
    <HapticsProvider adapter={adapter} enabled={false}>
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
        <View className="w-full gap-2">
          <View className="min-h-11 flex-row items-center justify-between gap-4">
            <Text>Wi-Fi</Text>
            <Switch
              accessibilityLabel="Wi-Fi"
              checked={wifi}
              onCheckedChange={setWifi}
            />
          </View>
          <View className="min-h-11 flex-row items-center justify-between gap-4">
            <Text>Accept terms</Text>
            <Checkbox
              accessibilityLabel="Accept terms"
              checked={terms}
              onCheckedChange={setTerms}
            />
          </View>
          <View className="min-h-11 flex-row items-center justify-between gap-4">
            <Text>Copies</Text>
            <Stepper value={copies} onValueChange={setCopies} min={1} max={9}>
              <StepperInput accessibilityLabel="Copies" />
              <StepperGroup>
                <StepperDecrement />
                <StepperSeparator />
                <StepperIncrement />
              </StepperGroup>
            </Stepper>
          </View>
          <View className="flex-row gap-2 py-2">
            <Chip>Open now</Chip>
            <Chip>Top rated</Chip>
          </View>
          <Slider
            value={volume}
            step={10}
            onValueChange={(next) => setVolume(next)}
            accessibilityLabel="Volume"
          />
        </View>
      </View>
    </HapticsProvider>
  )
}
