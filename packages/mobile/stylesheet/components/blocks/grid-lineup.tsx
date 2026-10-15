import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
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
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`

type Finish = { label: string; swatch: Tone }

type Model = {
  name: string
  tagline: string
  price: string
  kicker?: string
  image: string
  alt: string
  finishes: [Finish, ...Finish[]]
}

const MODELS: Model[] = [
  {
    name: "Phone Pro",
    tagline: "Pro at its very core.",
    price: "$1,099",
    kicker: "New",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
    finishes: [
      { label: "Cosmic Orange", swatch: "orange500" },
      { label: "Deep Blue", swatch: "indigo500" },
      { label: "Silver", swatch: "zinc500" },
    ],
  },
  {
    name: "Phone Air",
    tagline: "The thinnest phone ever.",
    price: "$999",
    kicker: "New",
    image: photo("1664883410931-2edffc8be5e6"),
    alt: "A silver phone on a light grey background",
    finishes: [
      { label: "Sky Blue", swatch: "cyan500" },
      { label: "Light Gold", swatch: "yellow500" },
      { label: "Space Black", swatch: "black" },
    ],
  },
  {
    name: "Phone",
    tagline: "Better in every way.",
    price: "$799",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
    finishes: [
      { label: "Lavender", swatch: "purple500" },
      { label: "Sage", swatch: "teal400" },
      { label: "Mist Blue", swatch: "teal500" },
      { label: "Black", swatch: "black" },
    ],
  },
  {
    name: "Phone e",
    tagline: "Speed. Battery. Value.",
    price: "$599",
    image: photo("1703676311066-34caf2cbee33"),
    alt: "A phone on a pink and purple backdrop",
    finishes: [
      { label: "Black", swatch: "black" },
      { label: "White", swatch: "white" },
    ],
  },
]

const styles = StyleSheet.create({
  content: { paddingHorizontal: 20, paddingVertical: 40 },
  title: {
    ...fontSize["3xl"],
    fontWeight: "600",
    textAlign: "center",
    marginBottom: 36,
  },
  rows: { gap: 40 },
  row: { flexDirection: "row", gap: 16 },
  model: { flex: 1, alignItems: "center" },
  image: { aspectRatio: 0.85, width: "100%", borderRadius: radius["2xl"] },
  finishes: { marginTop: 20, alignSelf: "center" },
  finish: {
    width: 20,
    height: 20,
    minWidth: 0,
    borderRadius: radius.full,
    borderWidth: 1.5,
    paddingHorizontal: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  swatch: {
    width: 12,
    height: 12,
    borderRadius: radius.full,
    borderWidth: StyleSheet.hairlineWidth,
  },
  kicker: { ...fontSize.xs, fontWeight: "600", marginTop: 16, minHeight: 18 },
  name: { ...fontSize["2xl"], fontWeight: "600", marginTop: 4 },
  tagline: {
    ...fontSize.lg,
    marginTop: 8,
    minHeight: 50,
    textAlign: "center",
  },
  price: { ...fontSize.sm, marginTop: 8 },
  actions: {
    marginTop: 18,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 18,
    rowGap: 12,
  },
  link: { ...fontSize.sm },
})

function LineupModel({
  model,
  onBuy,
  onLearnMore,
}: {
  model: Model
  onBuy?: (name: string, finish: string) => void
  onLearnMore?: (name: string) => void
}) {
  const { colors } = useTheme()
  const [finish, setFinish] = React.useState(model.finishes[0].label)

  return (
    <View style={styles.model}>
      <Image
        source={{ uri: model.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessibilityLabel={model.alt}
        style={[styles.image, { backgroundColor: colors.secondary }]}
      />
      <ToggleGroup
        value={[finish]}
        onValueChange={(value) => {
          if (value[0]) setFinish(value[0])
        }}
        accessibilityLabel={`${model.name} finish`}
        spacing={1}
        style={styles.finishes}
      >
        {model.finishes.map((item) => (
          <ToggleGroupItem
            key={item.label}
            value={item.label}
            accessibilityLabel={item.label}
            hitSlop={8}
            style={(state) => [
              styles.finish,
              {
                backgroundColor: "transparent",
                borderColor: state.pressed
                  ? colors.mutedForeground
                  : "transparent",
              },
            ]}
          >
            <View
              style={[
                styles.swatch,
                {
                  backgroundColor: tone(colors, item.swatch),
                  borderColor: colors.border,
                },
              ]}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Text style={[styles.kicker, { color: palette.orange500 }]}>
        {model.kicker ?? ""}
      </Text>
      <Text role="heading" style={styles.name}>
        {model.name}
      </Text>
      <Text style={styles.tagline}>{model.tagline}</Text>
      <Text style={[styles.price, { color: colors.mutedForeground }]}>
        From {model.price}
      </Text>
      <View style={styles.actions}>
        <Button
          size="sm"
          accessibilityLabel={`Buy ${model.name}`}
          onPress={() => onBuy?.(model.name, finish)}
        >
          <Text>Buy</Text>
        </Button>
        <Pressable
          role="link"
          hitSlop={8}
          accessibilityLabel={`Learn more about ${model.name}`}
          onPress={() => onLearnMore?.(model.name)}
          style={({ pressed }) => pressed && { opacity: 0.6 }}
        >
          <Text style={[styles.link, { color: colors.primary }]}>
            Learn more ›
          </Text>
        </Pressable>
      </View>
    </View>
  )
}

function GridLineup({
  onBuy,
  onLearnMore,
}: {
  onBuy?: (name: string, finish: string) => void
  onLearnMore?: (name: string) => void
}) {
  const rows: Model[][] = []
  for (let index = 0; index < MODELS.length; index += 2) {
    rows.push(MODELS.slice(index, index + 2))
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <Text role="heading" style={styles.title}>
          Which phone is right for you?
        </Text>
        <AnimatedView
          entering={FadeInDown.duration(700).reduceMotion(ReduceMotion.System)}
          style={styles.rows}
        >
          {rows.map((row) => (
            <View
              key={row.map((model) => model.name).join("|")}
              style={styles.row}
            >
              {row.map((model) => (
                <LineupModel
                  key={model.name}
                  model={model}
                  onBuy={onBuy}
                  onLearnMore={onLearnMore}
                />
              ))}
            </View>
          ))}
        </AnimatedView>
      </ScrollView>
    </Screen>
  )
}

export { GridLineup }
