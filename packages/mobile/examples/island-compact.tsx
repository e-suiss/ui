import {
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
} from "@/components/interactions/island"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

export default function IslandCompact() {
  const [progress, setProgress] = React.useState<number | null>(0.42)
  const done = progress !== null && progress >= 1
  const percent = Math.round((progress ?? 0) * 100)
  return (
    <IslandProvider>
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
          Start a download, then tap the pill at the top to see the details.
          Swipe up on it to close.
        </Text>
      </View>
    </IslandProvider>
  )
}
