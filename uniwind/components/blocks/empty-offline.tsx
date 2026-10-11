import { WifiSlashIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const ALBUMS = [
  { title: "Orange Hour", image: photo("1633596683562-4a47eb4983c5") },
  { title: "Soft Shapes", image: photo("1645323927877-3de25b4f819c") },
  { title: "Low Light", image: photo("1760978631841-f3754859ca59") },
  { title: "Waves", image: photo("1707324148764-99647364afa3") },
]

function EmptyOffline() {
  const [state, setState] = React.useState<"offline" | "loading" | "online">(
    "offline"
  )

  React.useEffect(() => {
    if (state !== "loading") return
    const timer = setTimeout(() => setState("online"), 1400)
    return () => clearTimeout(timer)
  }, [state])

  if (state === "online") {
    return (
      <Screen>
        <ScrollView contentContainerClassName="px-5 py-7.5">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="gap-4"
          >
            <View className="flex-row items-center gap-2">
              <Text role="heading" className="flex-1 text-3xl font-semibold">
                suiss Music
              </Text>
              <Pressable
                role="button"
                hitSlop={8}
                onPress={() => setState("offline")}
                className="active:opacity-60"
              >
                <Text className="text-sm text-link">Disconnect ›</Text>
              </Pressable>
            </View>
            <View className="flex-row flex-wrap gap-3.5">
              {ALBUMS.map((album) => (
                <View key={album.title} className="grow basis-[40%] gap-1.5">
                  <Image
                    source={{ uri: album.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    className="aspect-square w-full rounded-xl bg-control"
                  />
                  <Text className="text-sm font-semibold">{album.title}</Text>
                </View>
              ))}
            </View>
          </AnimatedView>
        </ScrollView>
      </Screen>
    )
  }

  return (
    <Screen>
      <Empty className="gap-5 p-6">
        <EmptyHeader className="max-w-95 gap-3.5">
          <EmptyMedia className="mb-0">
            <Icon
              as={WifiSlashIcon}
              weight="light"
              className="size-13 text-label-tertiary"
            />
          </EmptyMedia>
          <EmptyTitle className="text-3xl font-semibold">
            You're not connected to the internet.
          </EmptyTitle>
          <EmptyDescription className="text-lg">
            Turn on Wi-Fi or cellular data. Songs you downloaded still play
            offline.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent className="flex-row justify-center gap-3.5">
          <Button
            size="lg"
            onPress={() => setState("loading")}
            disabled={state === "loading"}
            accessibilityLiveRegion="polite"
          >
            {state === "loading" ? <Spinner /> : null}
            <Text>{state === "loading" ? "Connecting" : "Try Again"}</Text>
          </Button>
          <Button size="lg" variant="outline">
            <Text>Downloads</Text>
          </Button>
        </EmptyContent>
      </Empty>
    </Screen>
  )
}

export { EmptyOffline }
