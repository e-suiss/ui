import { cn } from "cn"
import { CheckIcon, HandbagIcon, PlusIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, View } from "react-native"
import { ReduceMotion, ZoomIn } from "react-native-reanimated"
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
import { Text } from "@/components/ui/text"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=500&q=80&auto=format&fit=crop`

const RECOMMENDED = [
  {
    name: "Pods Studio",
    price: "$549",
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Sport Band",
    price: "$49",
    image: photo("1624096104992-9b4fa3a279dd"),
  },
  {
    name: "Phone Pro Clear Case",
    price: "$49",
    image: photo("1703676311066-34caf2cbee33"),
  },
]

function EmptyBag() {
  const [added, setAdded] = React.useState<string[]>([])
  const count = added.length

  return (
    <Screen>
      <ScrollView contentContainerClassName="gap-5.5 py-10">
        <Empty className="flex-none gap-5 px-5 py-0">
          <EmptyHeader className="max-w-md gap-2.5">
            <EmptyMedia className="mb-1">
              <Icon as={HandbagIcon} weight="light" className="size-11.5" />
              {count > 0 ? (
                <AnimatedView
                  key={count}
                  entering={ZoomIn.duration(300).reduceMotion(
                    ReduceMotion.System
                  )}
                  className="absolute -end-1.5 -bottom-0.5 size-5 items-center justify-center rounded-full bg-label"
                >
                  <Text className="text-2xs font-semibold text-surface tabular-nums">
                    {count}
                  </Text>
                </AnimatedView>
              ) : null}
            </EmptyMedia>
            <EmptyTitle
              accessibilityLiveRegion="polite"
              className="text-3xl font-semibold"
            >
              {count
                ? `There ${count === 1 ? "is 1 item" : `are ${count} items`} in your bag.`
                : "Your bag is empty."}
            </EmptyTitle>
            <EmptyDescription className="text-lg">
              {count
                ? "Check out now or keep browsing."
                : "Sign in to see items you saved."}
            </EmptyDescription>
          </EmptyHeader>
          <EmptyContent className="flex-row flex-wrap justify-center gap-3.5">
            <Button size="lg">
              <Text>{count ? "Check Out" : "Sign In"}</Text>
            </Button>
            <Button size="lg" variant="outline">
              <Text>Continue Shopping</Text>
            </Button>
          </EmptyContent>
        </Empty>
        <View className="mt-3.5 gap-4">
          <Text role="heading" className="px-5 text-lg font-semibold">
            You may also like
          </Text>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerClassName="gap-4 px-5"
          >
            {RECOMMENDED.map((item) => {
              const inBag = added.includes(item.name)
              return (
                <View key={item.name} className="w-60 gap-2.5">
                  <Image
                    source={{ uri: item.image }}
                    resizeMode="cover"
                    accessibilityIgnoresInvertColors
                    className="aspect-[1.2] w-full rounded-2xl bg-control"
                  />
                  <View className="flex-row items-center gap-2">
                    <View className="flex-1">
                      <Text className="text-base font-semibold">
                        {item.name}
                      </Text>
                      <Text className="text-sm text-label-secondary">
                        {item.price}
                      </Text>
                    </View>
                    <Button
                      size="icon-sm"
                      hitSlop={7}
                      accessibilityState={{ selected: inBag }}
                      accessibilityLabel={
                        inBag
                          ? `Remove ${item.name} from bag`
                          : `Add ${item.name} to bag`
                      }
                      onPress={() =>
                        setAdded((current) =>
                          inBag
                            ? current.filter((name) => name !== item.name)
                            : [...current, item.name]
                        )
                      }
                      className={cn(
                        "size-7.5",
                        inBag && "bg-success active:bg-success"
                      )}
                    >
                      <Icon
                        as={inBag ? CheckIcon : PlusIcon}
                        weight="bold"
                        className="size-3.75"
                      />
                    </Button>
                  </View>
                </View>
              )
            })}
          </ScrollView>
        </View>
      </ScrollView>
    </Screen>
  )
}

export { EmptyBag }
