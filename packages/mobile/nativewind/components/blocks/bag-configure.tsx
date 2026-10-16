import { cn } from "cn"
import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=1000&q=80&auto=format&fit=crop`

type Model = { name: string; price: number }

type Finish = { name: string; swatch: string; image: string; alt: string }

type StorageOption = { size: string; extra: number }

const MODELS: [Model, ...Model[]] = [
  { name: "Phone Pro", price: 1099 },
  { name: "Phone Pro Max", price: 1199 },
]

const FINISHES: [Finish, ...Finish[]] = [
  {
    name: "Cosmic Orange",
    swatch: "bg-orange-500",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
  },
  {
    name: "Deep Blue",
    swatch: "bg-indigo-500",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
  },
  {
    name: "Silver",
    swatch: "bg-zinc-500",
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

const CHOICE_CLASS = "rounded-[0.875rem] active:opacity-80"

const choiceBorder = (checked: boolean) =>
  checked ? "border-2 border-primary" : "border border-input"

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
      className="absolute inset-0"
      style={animatedStyle}
    >
      <Image
        source={{ uri: finish.image }}
        resizeMode="cover"
        accessible
        accessibilityLabel={finish.alt}
        accessibilityIgnoresInvertColors
        className="size-full"
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
  const [model, setModel] = React.useState(MODELS[0].name)
  const [finish, setFinish] = React.useState(FINISHES[0].name)
  const [size, setSize] = React.useState(STORAGE[0].size)
  const [added, setAdded] = React.useState(false)
  const price =
    (MODELS.find((item) => item.name === model)?.price ?? 0) +
    (STORAGE.find((item) => item.size === size)?.extra ?? 0)

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerClassName="gap-4 px-5 pt-5 pb-8">
        <View className="aspect-[4/3] overflow-hidden rounded-[1.375rem] bg-muted">
          {FINISHES.map((item) => (
            <FinishImage
              key={item.name}
              finish={item}
              active={item.name === finish}
            />
          ))}
        </View>
        <Text className="mt-1 text-xs font-semibold text-orange-500">New</Text>
        <Text role="heading" className="-mt-2.5 text-3xl font-semibold">
          Buy Phone Pro
        </Text>
        <Text className="text-lg font-semibold">
          Model.{" "}
          <Text className="text-lg font-semibold text-muted-foreground">
            Which one is right for you?
          </Text>
        </Text>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Model"
          className="gap-2"
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
                className={cn(
                  CHOICE_CLASS,
                  choiceBorder(checked),
                  "flex-row items-center justify-between",
                  checked ? "px-[0.9375rem] py-[0.8125rem]" : "px-4 py-3.5"
                )}
              >
                <Text className="flex-1 text-base font-semibold">
                  {item.name}
                </Text>
                <Text className="text-sm text-muted-foreground">
                  From {money(item.price, 0)}
                </Text>
              </Pressable>
            )
          })}
        </View>
        <Text className="text-lg font-semibold">
          Finish.{" "}
          <Text className="text-lg font-semibold text-muted-foreground">
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
              className={(state) =>
                cn(
                  "size-10 min-w-0 rounded-full border-2 bg-transparent p-0 active:bg-transparent",
                  state.pressed ? "border-primary" : "border-transparent"
                )
              }
            >
              <View
                className={cn(
                  "size-[1.875rem] rounded-full border border-foreground-15",
                  item.swatch
                )}
              />
            </ToggleGroupItem>
          ))}
        </ToggleGroup>
        <Text className="text-lg font-semibold">Storage.</Text>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Storage"
          className="flex-row gap-2"
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
                className={cn(
                  CHOICE_CLASS,
                  choiceBorder(checked),
                  "flex-1 items-center gap-0.5",
                  checked ? "px-[0.3125rem] py-[0.6875rem]" : "px-1.5 py-3"
                )}
              >
                <Text numberOfLines={1} className="text-base font-semibold">
                  {item.size}
                </Text>
                <Text
                  numberOfLines={1}
                  className="text-xs text-muted-foreground"
                >
                  {item.extra ? `+${money(item.extra, 0)}` : "Included"}
                </Text>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent className="flex-row items-center gap-3">
          <View accessibilityLiveRegion="polite" className="flex-1">
            <Text className="text-2xl font-semibold tabular-nums">
              {money(price)}
            </Text>
            <Text className="text-xs text-muted-foreground">
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
