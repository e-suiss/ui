import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import {
  Easing,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`

type Model = { name: string; price: number }

type Finish = {
  name: string
  swatch: Tone
  image: string
  alt: string
}

type StorageOption = { size: string; extra: number }

const MODELS: [Model, ...Model[]] = [
  { name: "Phone Pro", price: 1099 },
  { name: "Phone Pro Max", price: 1199 },
]

const FINISHES: [Finish, ...Finish[]] = [
  {
    name: "Cosmic Orange",
    swatch: "orange500",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    name: "Deep Blue",
    swatch: "indigo500",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
  },
  {
    name: "Silver",
    swatch: "zinc500",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
  },
]

const STORAGE: [StorageOption, ...StorageOption[]] = [
  { size: "256 GB", extra: 0 },
  { size: "512 GB", extra: 200 },
  { size: "1 TB", extra: 400 },
]

const EASING = Easing.bezier(0.32, 0.72, 0, 1)

const THOUSANDS = /\B(?=(\d{3})+(?!\d))/g

function money(value: number, digits = 2) {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value)
  } catch {
    const [whole = "0", fraction] = value.toFixed(digits).split(".")
    return `$${whole.replace(THOUSANDS, ",")}${fraction ? `.${fraction}` : ""}`
  }
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  content: {
    gap: 16,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 32,
  },
  hero: { aspectRatio: 4 / 3, overflow: "hidden", borderRadius: 22 },
  layer: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  image: { width: "100%", height: "100%" },
  kicker: { ...fontSize.xs, marginTop: 4, fontWeight: "600" },
  title: { ...fontSize["3xl"], marginTop: -10, fontWeight: "600" },
  label: { ...fontSize.lg, fontWeight: "600" },
  models: { gap: 8 },
  choice: { borderRadius: 14 },
  idle: { borderWidth: 1 },
  checked: { borderWidth: 2 },
  model: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  modelIdle: { paddingHorizontal: 16, paddingVertical: 14 },
  modelChecked: { paddingHorizontal: 15, paddingVertical: 13 },
  modelName: { ...fontSize.base, flex: 1, fontWeight: "600" },
  swatchItem: {
    width: 40,
    height: 40,
    minWidth: 0,
    borderRadius: radius.full,
    borderWidth: 2,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  swatch: {
    width: 30,
    height: 30,
    borderRadius: radius.full,
    borderWidth: 1,
  },
  storage: { flexDirection: "row", gap: 8 },
  size: { flex: 1, alignItems: "center", gap: 2 },
  sizeIdle: { paddingHorizontal: 6, paddingVertical: 12 },
  sizeChecked: { paddingHorizontal: 5, paddingVertical: 11 },
  sizeName: { ...fontSize.base, fontWeight: "600" },
  bar: { flexDirection: "row", alignItems: "center", gap: 12 },
  grow: { flex: 1 },
  price: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
})

function FinishImage({ finish, active }: { finish: Finish; active: boolean }) {
  const progress = useSharedValue(active ? 1 : 0)

  React.useEffect(() => {
    progress.value = withTiming(active ? 1 : 0, {
      duration: 700,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [active, progress])

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
    transform: [{ scale: 1.04 - progress.value * 0.04 }],
  }))

  return (
    <AnimatedView
      pointerEvents="none"
      accessibilityElementsHidden={!active}
      importantForAccessibility={active ? "auto" : "no-hide-descendants"}
      style={[styles.layer, animatedStyle]}
    >
      <Image
        source={{ uri: finish.image }}
        resizeMode="cover"
        accessible
        accessibilityLabel={finish.alt}
        accessibilityIgnoresInvertColors
        style={styles.image}
      />
    </AnimatedView>
  )
}

function BagConfigure({
  onAddToBag,
}: {
  onAddToBag?: (configuration: {
    model: string
    finish: string
    storage: string
    price: number
  }) => void
}) {
  const { colors } = useTheme()
  const [model, setModel] = React.useState(MODELS[0].name)
  const [finish, setFinish] = React.useState(FINISHES[0].name)
  const [size, setSize] = React.useState(STORAGE[0].size)
  const [added, setAdded] = React.useState(false)
  const price =
    (MODELS.find((item) => item.name === model)?.price ?? 0) +
    (STORAGE.find((item) => item.size === size)?.extra ?? 0)

  const choice = (checked: boolean, pressed: boolean) => [
    styles.choice,
    checked ? styles.checked : styles.idle,
    { borderColor: checked ? colors.primary : colors.input },
    pressed && { opacity: 0.8 },
  ]

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: colors.muted }]}>
          {FINISHES.map((item) => (
            <FinishImage
              key={item.name}
              finish={item}
              active={item.name === finish}
            />
          ))}
        </View>
        <Text style={[styles.kicker, { color: palette.orange500 }]}>New</Text>
        <Text role="heading" style={styles.title}>
          Buy Phone Pro
        </Text>
        <Text style={styles.label}>
          Model.{" "}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            Which one is right for you?
          </Text>
        </Text>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Model"
          style={styles.models}
        >
          {MODELS.map((item) => {
            const checked = item.name === model
            return (
              <Pressable
                key={item.name}
                role="radio"
                accessibilityState={{ checked }}
                onPress={() => {
                  setModel(item.name)
                  setAdded(false)
                }}
                style={({ pressed }) => [
                  ...choice(checked, pressed),
                  styles.model,
                  checked ? styles.modelChecked : styles.modelIdle,
                ]}
              >
                <Text style={styles.modelName}>{item.name}</Text>
                <Text style={[fontSize.sm, { color: colors.mutedForeground }]}>
                  From {money(item.price, 0)}
                </Text>
              </Pressable>
            )
          })}
        </View>
        <Text style={styles.label}>
          Finish.{" "}
          <Text style={[styles.label, { color: colors.mutedForeground }]}>
            {finish}
          </Text>
        </Text>
        <ToggleGroup
          value={[finish]}
          onValueChange={(value) => {
            if (value[0]) setFinish(value[0])
          }}
          accessibilityLabel="Finish"
          spacing={2}
        >
          {FINISHES.map((item) => (
            <ToggleGroupItem
              key={item.name}
              value={item.name}
              accessibilityLabel={item.name}
              style={(state) => [
                styles.swatchItem,
                {
                  borderColor: state.pressed ? colors.primary : "transparent",
                },
              ]}
            >
              <View
                style={[
                  styles.swatch,
                  {
                    backgroundColor: tone(colors, item.swatch),
                    borderColor: withAlpha(colors.foreground, 0.15),
                  },
                ]}
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Text style={styles.label}>Storage.</Text>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Storage"
          style={styles.storage}
        >
          {STORAGE.map((item) => {
            const checked = item.size === size
            return (
              <Pressable
                key={item.size}
                role="radio"
                accessibilityState={{ checked }}
                onPress={() => {
                  setSize(item.size)
                  setAdded(false)
                }}
                style={({ pressed }) => [
                  ...choice(checked, pressed),
                  styles.size,
                  checked ? styles.sizeChecked : styles.sizeIdle,
                ]}
              >
                <Text numberOfLines={1} style={styles.sizeName}>
                  {item.size}
                </Text>
                <Text
                  numberOfLines={1}
                  style={[fontSize["2xs"], { color: colors.mutedForeground }]}
                >
                  {item.extra ? `+${money(item.extra, 0)}` : "Included"}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={styles.grow}>
            <Text style={styles.price}>{money(price)}</Text>
            <Text style={[fontSize.xs, { color: colors.mutedForeground }]}>
              or {money(price / 12)}/mo. for 12 mo.
            </Text>
          </View>
          <Button
            size="lg"
            onPress={() => {
              onAddToBag?.({ model, finish, storage: size, price })
              setAdded(true)
            }}
          >
            <Text>{added ? "Added to Bag" : "Add to Bag"}</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { BagConfigure }
