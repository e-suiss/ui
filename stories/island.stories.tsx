import type { Meta, StoryObj } from "@storybook/react-native"
import {
  BellIcon,
  ChatCircleIcon,
  CheckCircleIcon,
  DownloadSimpleIcon,
  FileZipIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import {
  Island,
  IslandCompact,
  IslandExpanded,
  IslandProvider,
  IslandRing,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

const SIZE = 120

function NotifyButtons() {
  const { notify } = useIsland()

  return (
    <View className="flex-row flex-wrap justify-center gap-3">
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            icon: (
              <Icon as={ChatCircleIcon} weight="fill" className="text-green" />
            ),
            title: "Jordan Lee",
            description: "Are we still on for Saturday?",
          })
        }
      >
        <Text>New message</Text>
      </Button>
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            icon: <Icon as={BellIcon} weight="fill" className="text-orange" />,
            title: "Design review",
            description: "Starts in 10 minutes",
          })
        }
      >
        <Text>Reminder</Text>
      </Button>
    </View>
  )
}

function useDownload(initial: number | null = null) {
  const [progress, setProgress] = React.useState<number | null>(initial)
  const { notify } = useIsland()

  React.useEffect(() => {
    if (initial !== null || progress === null || progress >= 1) return
    const timer = setTimeout(
      () => setProgress((value) => Math.min((value ?? 0) + 0.01, 1)),
      150
    )
    return () => clearTimeout(timer)
  }, [initial, progress])

  React.useEffect(() => {
    if (progress !== 1) return
    const timer = setTimeout(() => {
      setProgress(null)
      notify({
        icon: (
          <Icon as={CheckCircleIcon} weight="fill" className="text-green" />
        ),
        title: "Download complete",
        description: "Design-Kit.zip",
      })
    }, 1200)
    return () => clearTimeout(timer)
  }, [progress, notify])

  return {
    progress,
    start: () => setProgress(0),
    cancel: () => setProgress(null),
  }
}

function DownloadActivity({
  progress,
  onCancel,
}: {
  progress: number
  onCancel: () => void
}) {
  const done = progress >= 1
  const percent = Math.round(progress * 100)

  return (
    <>
      <IslandCompact
        accessibilityLabel={`Downloading Design-Kit.zip, ${percent}%`}
      >
        <Icon as={DownloadSimpleIcon} weight="bold" className="text-accent" />
        {done ? (
          <Icon as={CheckCircleIcon} weight="fill" className="text-green" />
        ) : (
          <IslandRing value={progress} />
        )}
      </IslandCompact>
      <IslandExpanded accessibilityLabel="Download">
        <View className="flex-row items-center gap-3">
          <View className="size-10 shrink-0 items-center justify-center rounded-xl bg-surface/15 dark:bg-label/15">
            <Icon
              as={FileZipIcon}
              weight="fill"
              className="size-6 text-accent"
            />
          </View>
          <View className="min-w-0 flex-1">
            <Text numberOfLines={1} className="text-sm font-semibold">
              Design-Kit.zip
            </Text>
            <Text className="text-sm text-surface/70 dark:text-label-secondary">
              {done
                ? "Downloaded"
                : `${Math.round(progress * SIZE)} MB of ${SIZE} MB`}
            </Text>
          </View>
          <Text className="text-2xl font-semibold">{percent}%</Text>
        </View>
        <View
          role="progressbar"
          accessibilityLabel="Download progress"
          accessibilityValue={{ min: 0, max: 100, now: percent }}
          className="h-1.5 overflow-hidden rounded-full bg-surface/20 dark:bg-label/20"
        >
          <View
            className="h-full rounded-full bg-accent"
            style={{ width: `${percent}%` }}
          />
        </View>
        <Pressable
          role="button"
          disabled={done}
          onPress={onCancel}
          className="h-11 items-center justify-center rounded-full bg-surface/15 active:bg-surface/25 disabled:opacity-50 dark:bg-label/15 dark:active:bg-label/25"
        >
          <Text className="text-sm font-semibold">Cancel download</Text>
        </Pressable>
      </IslandExpanded>
    </>
  )
}

function DownloadsExample({
  initial = null,
  expanded = false,
  withNotifications = false,
}: {
  initial?: number | null
  expanded?: boolean
  withNotifications?: boolean
}) {
  const { progress, start, cancel } = useDownload(initial)
  const { setExpanded } = useIsland()

  React.useEffect(() => {
    if (expanded) setExpanded(true)
  }, [expanded, setExpanded])

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Island>
        {progress !== null ? (
          <DownloadActivity progress={progress} onCancel={cancel} />
        ) : null}
      </Island>
      <Text className="max-w-xs text-center text-sm text-label-secondary">
        Start a download, then tap the pill at the top to see the details. Swipe
        up on it to close.
      </Text>
      {initial === null ? (
        <Button onPress={start} disabled={progress !== null}>
          <Text>
            {progress === null ? "Download Design-Kit.zip" : "Downloading…"}
          </Text>
        </Button>
      ) : null}
      {withNotifications ? <NotifyButtons /> : null}
    </View>
  )
}

function NoticeOnMount() {
  const { notify } = useIsland()
  const shownRef = React.useRef(false)

  React.useEffect(() => {
    if (shownRef.current) return
    shownRef.current = true
    notify({
      icon: <Icon as={ChatCircleIcon} weight="fill" className="text-green" />,
      title: "Jordan Lee",
      description: "Are we still on for Saturday?",
      duration: 600000,
    })
  }, [notify])

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <Island />
      <Text className="max-w-xs text-center text-sm text-label-secondary">
        The pill grows to show the notification and shrinks back on its own.
      </Text>
      <NotifyButtons />
    </View>
  )
}

const meta = {
  title: "Interactions/Island",
  component: Island,
  decorators: [
    (Story) => (
      <IslandProvider>
        <Story />
      </IslandProvider>
    ),
  ],
} satisfies Meta<typeof Island>

export default meta

type Story = StoryObj<typeof meta>

export const Compact: Story = {
  render: () => <DownloadsExample initial={0.42} />,
}

export const Expanded: Story = {
  render: () => <DownloadsExample initial={0.42} expanded />,
}

export const Notice: Story = {
  render: () => <NoticeOnMount />,
}

export const LiveActivity: Story = {
  render: () => <DownloadsExample withNotifications />,
}
