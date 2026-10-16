import { cn } from "cn"
import { CheckIcon, HandbagIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, View } from "react-native"
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

function BagButton({
  name,
  inBag,
  onPress,
}: {
  name: string
  inBag: boolean
  onPress: () => void
}) {
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
    <AnimatedView
      className="h-7.5 overflow-hidden rounded-full"
      style={animatedStyle}
    >
      <Button
        size="icon-sm"
        hitSlop={7}
        accessibilityState={{ selected: inBag }}
        accessibilityLabel={
          inBag ? `Remove ${name} from bag` : `Add ${name} to bag`
        }
        onPress={onPress}
        className={cn(
          "h-7.5 w-full flex-row gap-1 px-0",
          inBag && "bg-green-500 active:opacity-80"
        )}
      >
        <Icon
          as={inBag ? CheckIcon : PlusIcon}
          weight="bold"
          className="size-3.75"
        />
        {inBag ? (
          <Text numberOfLines={1} className="text-xs">
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
  return (
    <AnimatedView
      entering={FadeInDown.duration(700).reduceMotion(ReduceMotion.System)}
      className="flex-1"
    >
      <Image
        source={{ uri: item.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        className="aspect-square w-full rounded-2xl bg-muted"
      />
      <Text numberOfLines={2} className="mt-3 min-h-11 text-base font-semibold">
        {item.name}
      </Text>
      <View className="mt-1 flex-row items-center gap-2">
        <Text className="flex-1 text-base">{item.price}</Text>
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
      <ScrollView contentContainerClassName="gap-6 py-9">
        <View className="flex-row items-start gap-4 px-5">
          <View className="flex-1 gap-0.5">
            <Text role="heading" className="text-3xl font-semibold">
              Accessories
            </Text>
            <Text className="text-base text-muted-foreground">
              Designed for every suiss device.
            </Text>
          </View>
          <View
            accessible
            accessibilityLabel={`${bag.length} items in bag`}
            accessibilityLiveRegion="polite"
            className="mt-2"
          >
            <Icon as={HandbagIcon} className="size-5.5" />
            {bag.length > 0 ? (
              <AnimatedView
                key={bag.length}
                entering={ZoomIn.duration(300).reduceMotion(
                  ReduceMotion.System
                )}
                className="absolute -end-2 -bottom-1 h-4 min-w-4 items-center justify-center rounded-full bg-foreground px-1"
              >
                <Text className="text-xs font-semibold text-background tabular-nums">
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
          className="px-5"
        >
          {FILTERS.map((item) => (
            <Chip key={item} value={item} className="h-8.5 px-4">
              {item}
            </Chip>
          ))}
        </ChipGroup>
        <View className="gap-6 px-5">
          {rows.map((row) => (
            <View
              key={row.map((item) => item.name).join("|")}
              className="flex-row gap-4"
            >
              {row.map((item) => (
                <AccessoryCard
                  key={`${filter}-${item.name}`}
                  item={item}
                  inBag={bag.includes(item.name)}
                  onToggle={() => toggle(item.name)}
                />
              ))}
              {row.length === 1 ? <View className="flex-1" /> : null}
            </View>
          ))}
        </View>
      </ScrollView>
    </Screen>
  )
}

export { GridAccessories }
