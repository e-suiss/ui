import { cn } from "cn"
import {
  CloudIcon,
  FlameIcon,
  GameControllerIcon,
  MusicNoteIcon,
  NewspaperIcon,
  type Icon as PhosphorIcon,
  TelevisionIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const SERVICES: {
  name: string
  icon: PhosphorIcon
  tint: string
  iconClass: string
}[] = [
  {
    name: "suiss Music",
    icon: MusicNoteIcon,
    tint: "bg-red",
    iconClass: "text-on-accent",
  },
  {
    name: "suiss TV",
    icon: TelevisionIcon,
    tint: "bg-label",
    iconClass: "text-surface",
  },
  {
    name: "suiss Arcade",
    icon: GameControllerIcon,
    tint: "bg-red",
    iconClass: "text-on-accent",
  },
  {
    name: "suiss Cloud+",
    icon: CloudIcon,
    tint: "bg-blue",
    iconClass: "text-on-accent",
  },
  {
    name: "Fitness+",
    icon: FlameIcon,
    tint: "bg-green",
    iconClass: "text-on-accent",
  },
  {
    name: "News+",
    icon: NewspaperIcon,
    tint: "bg-pink",
    iconClass: "text-on-accent",
  },
]

const PLANS = [
  {
    name: "Individual",
    price: 19.95,
    people: "1 person",
    storage: "50 GB",
    included: 4,
    saving: 6,
  },
  {
    name: "Family",
    price: 25.95,
    people: "Up to 6 people",
    storage: "200 GB",
    included: 4,
    saving: 8,
  },
  {
    name: "Premier",
    price: 37.95,
    people: "Up to 6 people",
    storage: "2 TB",
    included: 6,
    saving: 29,
  },
]

const money = (value: number, digits = 2) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: digits,
      maximumFractionDigits: digits,
    }).format(value)
  } catch {
    const [whole, fraction] = value.toFixed(digits).split(".")
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${grouped}${fraction ? `.${fraction}` : ""}`
  }
}

function PriceBundle({
  onSelectPlan,
  onCompare,
}: {
  onSelectPlan?: (plan: string) => void
  onCompare?: (plan: string) => void
}) {
  const [selected, setSelected] = React.useState("Family")
  const plan = PLANS.find((item) => item.name === selected) ?? PLANS[1]

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerClassName="gap-[1.375rem] px-5 pt-[2.125rem] pb-6">
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          className="items-center gap-2"
        >
          <Text role="heading" className="text-center text-3xl font-semibold">
            <Text className="text-3xl font-bold">suiss</Text> One
          </Text>
          <Text className="text-center text-2xl text-label-secondary">
            Bundle it all in one subscription.
          </Text>
        </AnimatedView>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Plan"
          className="gap-3"
        >
          {PLANS.map((item) => {
            const checked = item.name === selected
            return (
              <Pressable
                key={item.name}
                role="radio"
                accessibilityState={{ checked }}
                accessibilityLabel={`${item.name}, ${money(item.price)} per month, ${item.people}`}
                onPress={() => setSelected(item.name)}
                className={cn(
                  "gap-3.5 rounded-[1.25rem] border-2 p-5",
                  checked
                    ? "border-accent bg-surface-secondary"
                    : "border-separator bg-surface-secondary-60 active:bg-surface-secondary"
                )}
              >
                <View className="flex-row items-center gap-2">
                  <Text className="flex-1 text-2xl font-semibold">
                    {item.name}
                  </Text>
                  <Text className="text-xs text-label-secondary">
                    {item.people}
                  </Text>
                </View>
                <Text>
                  <Text className="text-2xl font-semibold tabular-nums">
                    {money(item.price)}
                  </Text>
                  <Text className="text-sm text-label-secondary"> /mo</Text>
                </Text>
                <View className="gap-2">
                  {SERVICES.map((service, index) => {
                    const included = index < item.included
                    const label = `${service.name}${index === 3 ? ` ${item.storage}` : ""}`
                    return (
                      <View
                        key={service.name}
                        accessible
                        accessibilityLabel={
                          included ? label : `${label} (not included)`
                        }
                        className="flex-row items-center gap-2"
                      >
                        <View
                          className={cn(
                            "size-[1.375rem] items-center justify-center rounded-md",
                            included ? service.tint : "bg-surface-tertiary"
                          )}
                        >
                          <Icon
                            as={service.icon}
                            weight="fill"
                            className={cn(
                              "size-[0.8125rem]",
                              included
                                ? service.iconClass
                                : "text-label-tertiary"
                            )}
                          />
                        </View>
                        <Text
                          className={cn(
                            "text-sm",
                            included
                              ? "text-label"
                              : "text-label-tertiary line-through"
                          )}
                        >
                          {label}
                        </Text>
                      </View>
                    )
                  })}
                </View>
              </Pressable>
            )
          })}
        </View>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent className="items-center gap-3">
          <Button size="lg" block onPress={() => onSelectPlan?.(plan.name)}>
            <Text>Try it free</Text>
          </Button>
          <Pressable
            role="link"
            hitSlop={8}
            onPress={() => onCompare?.(plan.name)}
            className="active:opacity-60"
          >
            <Text
              accessibilityLiveRegion="polite"
              className="text-center text-base text-link"
            >
              Save {money(plan.saving, 0)} compared to buying separately ›
            </Text>
          </Pressable>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { PriceBundle }
