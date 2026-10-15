import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const CATEGORIES = [
  { label: "Laptop", image: photo("1785245560368-f6d715956e5d") },
  { label: "Phone", image: photo("1714578187196-29775454aa39") },
  { label: "Pad", image: photo("1607452263110-39a87c399c50") },
  { label: "Watch", image: photo("1660844817855-3ecc7ef21f12") },
  { label: "Pods", image: photo("1599669454699-248893623440") },
  { label: "Cases", image: photo("1703676311066-34caf2cbee33") },
  { label: "Camera", image: photo("1604677209244-6569d050557a") },
  { label: "Colors", image: photo("1633596683562-4a47eb4983c5") },
  { label: "Pro", image: photo("1760978631841-f3754859ca59") },
  { label: "Accessories", image: photo("1645323927877-3de25b4f819c") },
]

const styles = StyleSheet.create({
  content: { gap: 28, paddingTop: 44, paddingBottom: 40 },
  intro: { gap: 24, paddingHorizontal: 20 },
  titles: { gap: 4 },
  title: { ...fontSize["3xl"], fontWeight: "700" },
  subtitle: { ...fontSize.xl },
  help: { alignItems: "flex-start", gap: 6 },
  helpTitle: { ...fontSize.xs, fontWeight: "600" },
  link: { ...fontSize.xs },
  chips: { paddingHorizontal: 20 },
  chip: { height: 40, gap: 8, paddingStart: 4, paddingEnd: 14 },
  image: { width: 32, height: 32, borderRadius: radius.full },
  latest: {
    marginHorizontal: 20,
    borderTopWidth: StyleSheet.hairlineWidth,
    paddingTop: 22,
  },
  latestText: { ...fontSize["2xl"], fontWeight: "600" },
})

function NavCategories({
  onSelectCategory,
  onAskSpecialist,
  onFindStore,
}: {
  onSelectCategory?: (label: string) => void
  onAskSpecialist?: () => void
  onFindStore?: () => void
}) {
  const { colors } = useTheme()
  const [selected, setSelected] = React.useState("Phone")

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          style={styles.intro}
        >
          <View style={styles.titles}>
            <Text role="heading" style={styles.title}>
              Store.
            </Text>
            <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
              The best way to buy the suiss products you love.
            </Text>
          </View>
          <View style={styles.help}>
            <Text style={[styles.helpTitle, { color: colors.mutedForeground }]}>
              Need shopping help?
            </Text>
            <Pressable
              role="link"
              hitSlop={6}
              onPress={onAskSpecialist}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={[styles.link, { color: colors.primary }]}>
                Ask a Specialist ›
              </Text>
            </Pressable>
            <Pressable
              role="link"
              hitSlop={6}
              onPress={onFindStore}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={[styles.link, { color: colors.primary }]}>
                Visit a suiss Store near you ›
              </Text>
            </Pressable>
          </View>
        </AnimatedView>
        <ChipGroup
          scrollable
          value={[selected]}
          onValueChange={(value) => {
            if (!value[0]) return
            setSelected(value[0])
            onSelectCategory?.(value[0])
          }}
          accessibilityLabel="Categories"
          style={styles.chips}
        >
          {CATEGORIES.map((category) => (
            <Chip
              key={category.label}
              value={category.label}
              accessibilityLabel={category.label}
              style={styles.chip}
            >
              <Image
                source={{ uri: category.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                style={[styles.image, { backgroundColor: colors.muted }]}
              />
              <Text numberOfLines={1}>{category.label}</Text>
            </Chip>
          ))}
        </ChipGroup>
        <View style={[styles.latest, { borderTopColor: colors.border }]}>
          <AnimatedView
            key={selected}
            entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}
            accessibilityLiveRegion="polite"
          >
            <Text style={styles.latestText}>
              The latest.{" "}
              <Text
                style={[styles.latestText, { color: colors.mutedForeground }]}
              >
                Take a look at what's new in {selected}.
              </Text>
            </Text>
          </AnimatedView>
        </View>
      </ScrollView>
    </Screen>
  )
}

export { NavCategories }
