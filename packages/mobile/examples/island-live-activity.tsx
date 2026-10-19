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

function Download() {
  const [progress, setProgress] = React.useState<number | null>(null)
  const { notify, minimize } = useIsland()

  React.useEffect(() => {
    if (progress === null || progress >= 1) return
    const timer = setTimeout(
      () => setProgress((value) => Math.min((value ?? 0) + 0.01, 1)),
      150
    )
    return () => clearTimeout(timer)
  }, [progress])

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

  const done = progress !== null && progress >= 1
  const percent = Math.round((progress ?? 0) * 100)
  return (
    <View className="flex-1 items-center justify-center gap-4">
      {progress === null ? (
        <Island />
      ) : (
        <Island
          accessibilityLabel={`Downloading Design-Kit.zip, ${percent}%`}
          compactLeading={
            <Icon
              as={DownloadSimpleIcon}
              weight="bold"
              className="text-primary"
            />
          }
          compactTrailing={
            done ? (
              <Icon
                as={CheckCircleIcon}
                weight="fill"
                className="text-green-500"
              />
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
              onPress={() => setProgress(null)}
              className="h-11 items-center justify-center rounded-full bg-white/15 active:opacity-80 disabled:opacity-50"
            >
              <Text className="text-sm font-semibold">Cancel download</Text>
            </Pressable>
          </IslandExpandedRegion>
        </Island>
      )}
      <Text className="max-w-xs text-center text-sm text-muted-foreground">
        Start a download, then tap the pill at the top to see the details. Swipe
        up on it to close.
      </Text>
      <Button onPress={() => setProgress(0)} disabled={progress !== null}>
        <Text>
          {progress === null ? "Download Design-Kit.zip" : "Downloading…"}
        </Text>
      </Button>
      <View className="flex-row flex-wrap justify-center gap-3">
        <Button
          variant="secondary"
          disabled={progress === null}
          onPress={minimize}
        >
          <Text>Minimize</Text>
        </Button>
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
    </View>
  )
}

export default function IslandLiveActivity() {
  return (
    <IslandProvider>
      <Download />
    </IslandProvider>
  )
}
