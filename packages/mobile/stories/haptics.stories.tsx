import type { Meta, StoryObj } from "@storybook/react-native"
import * as React from "react"
import { View } from "react-native"
import {
  ReorderList,
  ReorderListHandle,
  ReorderListItem,
} from "@/components/interactions/reorder-list"
import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Chip } from "@/components/ui/chip"
import {
  type HapticsAdapter,
  HapticsProvider,
  useHaptics,
} from "@/components/ui/haptics"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
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

function Row({
  label,
  children,
}: {
  label: string
  children: React.ReactNode
}) {
  return (
    <View className="min-h-11 flex-row items-center justify-between gap-4">
      <Text>{label}</Text>
      {children}
    </View>
  )
}

function Controls() {
  const [wifi, setWifi] = React.useState(true)
  const [terms, setTerms] = React.useState(false)
  const [volume, setVolume] = React.useState(40)
  const [copies, setCopies] = React.useState(1)

  return (
    <View className="w-full gap-2">
      <Row label="Wi-Fi">
        <Switch
          accessibilityLabel="Wi-Fi"
          checked={wifi}
          onCheckedChange={setWifi}
        />
      </Row>
      <Row label="Accept terms">
        <Checkbox
          accessibilityLabel="Accept terms"
          checked={terms}
          onCheckedChange={setTerms}
        />
      </Row>
      <Row label="Copies">
        <Stepper value={copies} onValueChange={setCopies} min={1} max={9}>
          <StepperInput accessibilityLabel="Copies" />
          <StepperGroup>
            <StepperDecrement />
            <StepperSeparator />
            <StepperIncrement />
          </StepperGroup>
        </Stepper>
      </Row>
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
  )
}

function ControlsDemo({ enabled = true }: { enabled?: boolean }) {
  const { adapter, log } = useLoggingAdapter()
  return (
    <HapticsProvider adapter={adapter} enabled={enabled}>
      <View className="w-full gap-4">
        <HapticLog {...log} />
        <Controls />
      </View>
    </HapticsProvider>
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

const tasks = ["Inbox", "Today", "Upcoming", "Someday"]

function ReorderDemo() {
  const { adapter, log } = useLoggingAdapter()
  const [value, setValue] = React.useState(tasks)
  return (
    <HapticsProvider adapter={adapter}>
      <View className="w-full gap-4">
        <HapticLog {...log} />
        <ReorderList
          value={value}
          onValueChange={setValue}
          className="overflow-hidden rounded-2xl border border-border"
        >
          {value.map((task) => (
            <ReorderListItem key={task} value={task} className="ps-4">
              <View className="min-w-0 grow py-3">
                <Text numberOfLines={1}>{task}</Text>
              </View>
              <ReorderListHandle accessibilityLabel={`Reorder ${task}`} />
            </ReorderListItem>
          ))}
        </ReorderList>
      </View>
    </HapticsProvider>
  )
}

const meta = {
  title: "Components/Haptics",
  component: HapticsProvider,
} satisfies Meta<typeof HapticsProvider>

export default meta

type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => <ControlsDemo />,
}

export const Feedback: Story = {
  render: () => <FeedbackDemo />,
}

export const Reorder: Story = {
  render: () => <ReorderDemo />,
}

export const Disabled: Story = {
  render: () => <ControlsDemo enabled={false} />,
}
