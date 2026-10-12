import { CheckIcon, HandbagIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import {
  Easing,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&q=80&auto=format&fit=crop`

const FILTERS = ["All", "Audio", "Cases", "Bands", "Pad"]

const ACCESSORIES = [
  {
    name: "Pods Studio Headphones",
    category: "Audio",
    price: "$549",
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Phone Pro Clear Case",
    category: "Cases",
    price: "$49",
    image: photo("1703676311066-34caf2cbee33"),
  },
  {
    name: "Sport Band",
    category: "Bands",
    price: "$49",
    image: photo("1624096104992-9b4fa3a279dd"),
  },
  {
    name: "Keyboard Folio for Pad",
    category: "Pad",
    price: "$299",
    image: photo("1740637977676-c8040b41dc7a"),
  },
  {
    name: "Pods Sage Headphones",
    category: "Audio",
    price: "$349",
    image: photo("1693621947585-7b7d94149af4"),
  },
  {
    name: "Phone Silicone Case",
    category: "Cases",
    price: "$49",
    image: photo("1714578187196-29775454aa39"),
  },
  {
    name: "Solo Loop",
    category: "Bands",
    price: "$49",
    image: photo("1660844817855-3ecc7ef21f12"),
  },
  {
    name: "Pencil Pro",
    category: "Pad",
    price: "$129",
    image: photo("1625864667534-aa5208d45a87"),
  },
]

type Accessory = (typeof ACCESSORIES)[number]

const EASING = Easing.bezier(0.3, 1.25, 0.5, 1)

const styles = StyleSheet.create({
  content: { gap: 24, paddingVertical: 36 },
  header: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 16,
    paddingHorizontal: 20,
  },
  headerText: { flex: 1, gap: 2 },
  title: { ...fontSize["3xl"], fontWeight: "600" },
  subtitle: { ...fontSize.base },
  bag: { marginTop: 8 },
  badge: {
    position: "absolute",
    end: -8,
    bottom: -4,
    height: 16,
    minWidth: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    paddingHorizontal: 4,
  },
  badgeText: {
    ...fontSize["2xs"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  filters: { paddingHorizontal: 20 },
  chip: { height: 34, paddingHorizontal: 16 },
  grid: { gap: 24, paddingHorizontal: 20 },
  row: { flexDirection: "row", gap: 16 },
  card: { flex: 1 },
  image: { aspectRatio: 1, width: "100%", borderRadius: radius["2xl"] },
  name: {
    ...fontSize.base,
    fontWeight: "600",
    marginTop: 12,
    minHeight: 44,
  },
  footer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  price: { ...fontSize.base, flex: 1 },
  bagButton: { height: 30, overflow: "hidden", borderRadius: radius.full },
  button: {
    height: 30,
    width: "100%",
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 0,
  },
  buttonText: { ...fontSize.xs },
})

function BagButton({
  name,
  inBag,
  onPress,
}: {
  name: string
  inBag: boolean
  onPress: () => void
}) {
  const { colors } = useTheme()
  const width = useSharedValue(inBag ? 84 : 30)

  React.useEffect(() => {
    width.value = withTiming(inBag ? 84 : 30, {
      duration: 300,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [inBag, width])

  const animatedStyle = useAnimatedStyle(() => ({ width: width.value }))

  return (
    <AnimatedView style={[styles.bagButton, animatedStyle]}>
      <Button
        size="icon-sm"
        hitSlop={7}
        accessibilityState={{ selected: inBag }}
        accessibilityLabel={
          inBag ? `Remove ${name} from bag` : `Add ${name} to bag`
        }
        onPress={onPress}
        style={[styles.button, inBag && { backgroundColor: colors.success }]}
      >
        <Icon as={inBag ? CheckIcon : PlusIcon} weight="bold" size={15} />
        {inBag ? (
          <Text numberOfLines={1} style={styles.buttonText}>
            In bag
          </Text>
        ) : null}
      </Button>
    </AnimatedView>
  )
}

function AccessoryCard({
  item,
  inBag,
  onToggle,
}: {
  item: Accessory
  inBag: boolean
  onToggle: () => void
}) {
  const { colors } = useTheme()
  return (
    <AnimatedView
      entering={FadeInDown.duration(700).reduceMotion(ReduceMotion.System)}
      style={styles.card}
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        style={[styles.image, { backgroundColor: colors.surfaceSecondary }]}
      />
      <Text numberOfLines={2} style={styles.name}>
        {item.name}
      </Text>
      <View style={styles.footer}>
        <Text style={styles.price}>{item.price}</Text>
        <BagButton name={item.name} inBag={inBag} onPress={onToggle} />
      </View>
    </AnimatedView>
  )
}

function GridAccessories({
  onAddToBag,
  onRemoveFromBag,
  onFilterChange,
}: {
  onAddToBag?: (name: string) => void
  onRemoveFromBag?: (name: string) => void
  onFilterChange?: (category: string) => void
}) {
  const { colors } = useTheme()
  const [filter, setFilter] = React.useState("All")
  const [bag, setBag] = React.useState<string[]>([])
  const items = ACCESSORIES.filter(
    (item) => filter === "All" || item.category === filter
  )
  const rows: Accessory[][] = []
  for (let index = 0; index < items.length; index += 2) {
    rows.push(items.slice(index, index + 2))
  }

  const toggle = (name: string) => {
    const inBag = bag.includes(name)
    if (inBag) onRemoveFromBag?.(name)
    else onAddToBag?.(name)
    setBag((current) =>
      inBag ? current.filter((item) => item !== name) : [...current, name]
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <View style={styles.headerText}>
            <Text role="heading" style={styles.title}>
              Accessories
            </Text>
            <Text style={[styles.subtitle, { color: colors.labelSecondary }]}>
              Designed for every suiss device.
            </Text>
          </View>
          <View
            accessible
            accessibilityLabel={`${bag.length} items in bag`}
            accessibilityLiveRegion="polite"
            style={styles.bag}
          >
            <Icon as={HandbagIcon} size={22} />
            {bag.length > 0 ? (
              <AnimatedView
                key={bag.length}
                entering={ZoomIn.duration(300).reduceMotion(
                  ReduceMotion.System
                )}
                style={[styles.badge, { backgroundColor: colors.label }]}
              >
                <Text style={[styles.badgeText, { color: colors.surface }]}>
                  {bag.length}
                </Text>
              </AnimatedView>
            ) : null}
          </View>
        </View>
        <ChipGroup
          scrollable
          value={[filter]}
          onValueChange={(value) => {
            if (!value[0]) return
            setFilter(value[0])
            onFilterChange?.(value[0])
          }}
          accessibilityLabel="Category"
          style={styles.filters}
        >
          {FILTERS.map((item) => (
            <Chip key={item} value={item} style={styles.chip}>
              {item}
            </Chip>
          ))}
        </ChipGroup>
        <View style={styles.grid}>
          {rows.map((row) => (
            <View
              key={row.map((item) => item.name).join("|")}
              style={styles.row}
            >
              {row.map((item) => (
                <AccessoryCard
                  key={`${filter}-${item.name}`}
                  item={item}
                  inBag={bag.includes(item.name)}
                  onToggle={() => toggle(item.name)}
                />
              ))}
              {row.length === 1 ? <View style={styles.card} /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

export { GridAccessories }
