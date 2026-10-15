import { WifiSlashIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
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
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const ALBUMS = [
  { title: "Orange Hour", image: photo("1633596683562-4a47eb4983c5") },
  { title: "Soft Shapes", image: photo("1645323927877-3de25b4f819c") },
  { title: "Low Light", image: photo("1760978631841-f3754859ca59") },
  { title: "Waves", image: photo("1707324148764-99647364afa3") },
]

const styles = StyleSheet.create({
  onlineContent: { paddingHorizontal: 20, paddingVertical: 30 },
  online: { gap: 16 },
  headerRow: { flexDirection: "row", alignItems: "center", gap: 8 },
  heading: { ...fontSize["3xl"], flex: 1, fontWeight: "600" },
  link: { ...fontSize.sm },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 14 },
  album: { flexGrow: 1, flexBasis: "40%", gap: 6 },
  cover: { aspectRatio: 1, width: "100%", borderRadius: radius.xl },
  albumTitle: { ...fontSize.sm, fontWeight: "600" },
  empty: { gap: 20, padding: 24 },
  header: { maxWidth: 380, gap: 14 },
  media: { marginBottom: 0 },
  title: { ...fontSize["3xl"], fontWeight: "600" },
  description: { ...fontSize.lg },
  actions: { flexDirection: "row", justifyContent: "center", gap: 14 },
})

function EmptyOffline() {
  const { colors } = useTheme()
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
        <ScrollView contentContainerStyle={styles.onlineContent}>
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.online}
          >
            <View style={styles.headerRow}>
              <Text role="heading" style={styles.heading}>
                suiss Music
              </Text>
              <Pressable
                role="button"
                hitSlop={8}
                onPress={() => setState("offline")}
                style={({ pressed }) => pressed && { opacity: 0.6 }}
              >
                <Text style={[styles.link, { color: colors.primary }]}>
                  Disconnect ›
                </Text>
              </Pressable>
            </View>
            <View style={styles.grid}>
              {ALBUMS.map((album) => (
                <View key={album.title} style={styles.album}>
                  <Image
                    source={{ uri: album.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    style={[
                      styles.cover,
                      { backgroundColor: colors.secondary },
                    ]}
                  />
                  <Text style={styles.albumTitle}>{album.title}</Text>
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
      <Empty style={styles.empty}>
        <EmptyHeader style={styles.header}>
          <EmptyMedia style={styles.media}>
            <Icon
              as={WifiSlashIcon}
              weight="light"
              size={52}
              color={colors.mutedForeground}
            />
          </EmptyMedia>
          <EmptyTitle style={styles.title}>
            You're not connected to the internet.
          </EmptyTitle>
          <EmptyDescription style={styles.description}>
            Turn on Wi-Fi or cellular data. Songs you downloaded still play
            offline.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent style={styles.actions}>
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
