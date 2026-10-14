import { cn } from "cn"
import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=600&q=80&auto=format&fit=crop`

type Finish = { label: string; swatch: string }

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
      { label: "Cosmic Orange", swatch: "bg-orange" },
      { label: "Deep Blue", swatch: "bg-indigo" },
      { label: "Silver", swatch: "bg-gray" },
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
      { label: "Sky Blue", swatch: "bg-cyan" },
      { label: "Light Gold", swatch: "bg-yellow" },
      { label: "Space Black", swatch: "bg-media" },
    ],
  },
  {
    name: "Phone",
    tagline: "Better in every way.",
    price: "$799",
    image: photo("1714578187196-29775454aa39"),
    alt: "A phone floating among blue spheres",
    finishes: [
      { label: "Lavender", swatch: "bg-purple" },
      { label: "Sage", swatch: "bg-mint" },
      { label: "Mist Blue", swatch: "bg-teal" },
      { label: "Black", swatch: "bg-media" },
    ],
  },
  {
    name: "Phone e",
    tagline: "Speed. Battery. Value.",
    price: "$599",
    image: photo("1703676311066-34caf2cbee33"),
    alt: "A phone on a pink and purple backdrop",
    finishes: [
      { label: "Black", swatch: "bg-media" },
      { label: "White", swatch: "bg-on-media" },
    ],
  },
]

function LineupModel({
  model,
  onBuy,
  onLearnMore,
}: {
  model: Model
  onBuy?: (name: string, finish: string) => void
  onLearnMore?: (name: string) => void
}) {
  const [finish, setFinish] = React.useState(model.finishes[0].label)

  return (
    <View className="flex-1 items-center">
      <Image
        source={{ uri: model.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        accessibilityLabel={model.alt}
        className="aspect-[0.85] w-full rounded-2xl bg-control"
      />
      <ToggleGroup
        value={[finish]}
        onValueChange={(value) => {
          if (value[0]) setFinish(value[0])
        }}
        accessibilityLabel={`${model.name} finish`}
        spacing={1}
        className="mt-5 self-center"
      >
        {model.finishes.map((item) => (
          <ToggleGroupItem
            key={item.label}
            value={item.label}
            accessibilityLabel={item.label}
            hitSlop={8}
            className={(state) =>
              cn(
                "size-5 h-5 min-w-0 rounded-full border-[1.5px] p-0 bg-transparent active:bg-transparent",
                state.pressed ? "border-label-secondary" : "border-transparent"
              )
            }
          >
            <View
              className={cn(
                "size-3 rounded-full border border-separator",
                item.swatch
              )}
            />
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
      <Text className="mt-4 min-h-4.5 text-xs font-semibold text-orange">
        {model.kicker ?? ""}
      </Text>
      <Text role="heading" className="mt-1 text-2xl font-semibold">
        {model.name}
      </Text>
      <Text className="mt-2 min-h-12.5 text-center text-lg">
        {model.tagline}
      </Text>
      <Text className="mt-2 text-sm text-label-secondary">
        From {model.price}
      </Text>
      <View className="mt-4.5 flex-row flex-wrap items-center justify-center gap-x-4.5 gap-y-3">
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
          className="active:opacity-60"
        >
          <Text className="text-sm text-link">Learn more ›</Text>
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
      <ScrollView contentContainerClassName="px-5 py-10">
        <Text
          role="heading"
          className="mb-9 text-center text-3xl font-semibold"
        >
          Which phone is right for you?
        </Text>
        <AnimatedView
          entering={FadeInDown.duration(700).reduceMotion(ReduceMotion.System)}
          className="gap-10"
        >
          {rows.map((row) => (
            <View
              key={row.map((model) => model.name).join("|")}
              className="flex-row gap-4"
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
