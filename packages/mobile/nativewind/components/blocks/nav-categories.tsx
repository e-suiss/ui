import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Chip, ChipGroup } from "@/components/ui/chip"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

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

function NavCategories({
  onSelectCategory,
  onAskSpecialist,
  onFindStore,
}: {
  onSelectCategory?: (label: string) => void
  onAskSpecialist?: () => void
  onFindStore?: () => void
}) {
  const [selected, setSelected] = React.useState("Phone")

  return (
    <Screen>
      <ScrollView contentContainerClassName="gap-7 pt-11 pb-10">
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          className="gap-6 px-5"
        >
          <View className="gap-1">
            <Text role="heading" className="text-3xl font-bold">
              Store.
            </Text>
            <Text className="text-xl text-muted-foreground">
              The best way to buy the suiss products you love.
            </Text>
          </View>
          <View className="items-start gap-1.5">
            <Text className="text-xs font-semibold text-muted-foreground">
              Need shopping help?
            </Text>
            <Pressable
              role="link"
              hitSlop={6}
              onPress={onAskSpecialist}
              className="active:opacity-60"
            >
              <Text className="text-xs text-primary">Ask a Specialist ›</Text>
            </Pressable>
            <Pressable
              role="link"
              hitSlop={6}
              onPress={onFindStore}
              className="active:opacity-60"
            >
              <Text className="text-xs text-primary">
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
          className="px-5"
        >
          {CATEGORIES.map((category) => (
            <Chip
              key={category.label}
              value={category.label}
              accessibilityLabel={category.label}
              className="h-10 gap-2 ps-1 pe-3.5"
            >
              <Image
                source={{ uri: category.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                className="size-8 rounded-full bg-muted"
              />
              <Text numberOfLines={1}>{category.label}</Text>
            </Chip>
          ))}
        </ChipGroup>
        <View className="mx-5 border-t border-border pt-[1.375rem]">
          <AnimatedView
            key={selected}
            entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}
            accessibilityLiveRegion="polite"
          >
            <Text className="text-2xl font-semibold">
              The latest.{" "}
              <Text className="text-2xl font-semibold text-muted-foreground">
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
