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
  IslandExpandedRegion,
  IslandProvider,
  IslandRing,
  useIsland,
} from "@/components/interactions/island"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

function NotifyButtons({ children }: { children?: React.ReactNode }) {
  const { notify } = useIsland()

  return (
    <View className="flex-row flex-wrap justify-center gap-3">
      {children}
      <Button
        variant="secondary"
        onPress={() =>
          notify({
            icon: (
              <Icon
                as={ChatCircleIcon}
                weight="fill"
                className="text-green-500"
              />
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
            icon: (
              <Icon as={BellIcon} weight="fill" className="text-orange-500" />
            ),
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
          <Icon as={CheckCircleIcon} weight="fill" className="text-green-500" />
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

function DownloadIsland({
  progress,
  onCancel,
}: {
  progress: number | null
  onCancel: () => void
}) {
  if (progress === null) return <Island />

  const done = progress >= 1
  const percent = Math.round(progress * 100)

  return (
    <Island
      accessibilityLabel={`Downloading Design-Kit.zip, ${percent}%`}
      compactLeading={
        <Icon as={DownloadSimpleIcon} weight="bold" className="text-primary" />
      }
      compactTrailing={
        done ? (
          <Icon as={CheckCircleIcon} weight="fill" className="text-green-500" />
        ) : (
          <IslandRing value={progress} />
        )
      }
      minimal={<IslandRing value={progress} />}
    >
      <IslandExpandedRegion region="leading">
        <View className="size-10 items-center justify-center rounded-xl bg-white/15">
          <Icon
            as={FileZipIcon}
            weight="fill"
            className="size-6 text-primary"
          />
        </View>
      </IslandExpandedRegion>
      <IslandExpandedRegion region="trailing">
        <Text className="text-2xl font-semibold">{percent}%</Text>
      </IslandExpandedRegion>
      <IslandExpandedRegion region="center">
        <Text numberOfLines={1} className="text-sm font-semibold">
          {done ? "Downloaded" : "Downloading"}
        </Text>
        <Text numberOfLines={1} className="text-sm text-white/70">
          Design-Kit.zip
        </Text>
      </IslandExpandedRegion>
      <IslandExpandedRegion region="bottom">
        <View
          role="progressbar"
          accessibilityLabel="Download progress"
          accessibilityValue={{ min: 0, max: 100, now: percent }}
          className="h-1.5 overflow-hidden rounded-full bg-white/20"
        >
          <View
            className="h-full rounded-full bg-primary"
            style={{ width: `${percent}%` }}
          />
        </View>
        <Pressable
          role="button"
          disabled={done}
          onPress={onCancel}
          className="h-11 items-center justify-center rounded-full bg-white/15 active:opacity-80 disabled:opacity-50"
        >
          <Text className="text-sm font-semibold">Cancel download</Text>
        </Pressable>
      </IslandExpandedRegion>
    </Island>
  )
}

function DownloadsExample({
  initial = null,
  view = "compact",
  withNotifications = false,
}: {
  initial?: number | null
  view?: "compact" | "expanded" | "minimal"
  withNotifications?: boolean
}) {
  const { progress, start, cancel } = useDownload(initial)
  const { expand, minimize } = useIsland()

  React.useEffect(() => {
    if (view === "expanded") expand()
    else if (view === "minimal") minimize()
  }, [view, expand, minimize])

  return (
    <View className="flex-1 items-center justify-center gap-4">
      <DownloadIsland progress={progress} onCancel={cancel} />
      <Text className="max-w-xs text-center text-sm text-muted-foreground">
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
      {withNotifications ? (
        <NotifyButtons>
          <Button
            variant="secondary"
            disabled={progress === null}
            onPress={minimize}
          >
            <Text>Minimize</Text>
          </Button>
        </NotifyButtons>
      ) : null}
    </View>
  )
}

export default function IslandMinimal() {
  return (
    <IslandProvider>
      <DownloadsExample initial={0.42} view="minimal" />
    </IslandProvider>
  )
}
