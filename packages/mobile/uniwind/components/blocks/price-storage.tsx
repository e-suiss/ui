import { cn } from "cn"
import { CheckIcon, CloudIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, View } from "react-native"
import {
  Easing,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Period = "monthly" | "yearly"

type Plan = {
  size: string
  price: number
  features: string[]
  popular?: boolean
}

const PLANS: Plan[] = [
  {
    size: "50 GB",
    price: 0.99,
    features: ["Space for photos and files", "Private Relay", "Hide My Email"],
  },
  {
    size: "200 GB",
    price: 2.99,
    features: [
      "Share with your family",
      "Custom email domain",
      "Secure Video for 1 camera",
    ],
    popular: true,
  },
  {
    size: "2 TB",
    price: 9.99,
    features: ["Everything in 200 GB", "Unlimited Secure Video cameras"],
  },
  {
    size: "6 TB",
    price: 29.99,
    features: ["Everything in 2 TB", "Room for large archives"],
  },
]

const EASING = Easing.bezier(0.3, 1.25, 0.5, 1)

const money = (value: number) => {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(value)
  } catch {
    const [whole, fraction] = value.toFixed(2).split(".")
    const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    return `$${grouped}.${fraction}`
  }
}

function PlanCard({
  plan,
  checked,
  yearly,
  onPress,
}: {
  plan: Plan
  checked: boolean
  yearly: boolean
  onPress: () => void
}) {
  const lift = useSharedValue(checked ? -3 : 0)

  React.useEffect(() => {
    lift.value = withTiming(checked ? -3 : 0, {
      duration: 350,
      easing: EASING,
      reduceMotion: ReduceMotion.System,
    })
  }, [checked, lift])

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: lift.value }],
  }))

  return (
    <AnimatedView style={animatedStyle}>
      <Pressable
        onPress={onPress}
        className={cn(
          "gap-3 rounded-[1.125rem] border-2 bg-muted p-4.5",
          checked ? "border-primary" : "border-transparent active:opacity-80"
        )}
      >
        <View className="flex-row items-center gap-2">
          <Text className="flex-1 text-2xl font-semibold">{plan.size}</Text>
          <RadioGroupItem
            value={plan.size}
            accessibilityLabel={`${plan.size}${plan.popular ? ", most popular" : ""}`}
            className="size-5"
          />
        </View>
        <Text>
          <Text className="text-2xl font-semibold tabular-nums">
            {money(yearly ? plan.price * 10 : plan.price)}
          </Text>
          <Text className="text-sm text-muted-foreground">
            {yearly ? " /yr" : " /mo"}
          </Text>
        </Text>
        <View className="gap-1.5">
          {plan.features.map((feature) => (
            <View key={feature} className="flex-row items-start gap-1.5">
              <Icon
                as={CheckIcon}
                weight="bold"
                className="mt-0.75 size-3.25 shrink-0 text-green-600 dark:text-green-400"
              />
              <Text className="flex-1 text-sm">{feature}</Text>
            </View>
          ))}
        </View>
      </Pressable>
      {plan.popular ? (
        <View
          pointerEvents="none"
          className="absolute -top-2.25 start-4.5 rounded-full bg-primary px-2.25 py-0.5"
        >
          <Text className="text-xs font-semibold text-primary-foreground">
            Most popular
          </Text>
        </View>
      ) : null}
    </AnimatedView>
  )
}

function PriceStorage({
  onSelectPlan,
  onPeriodChange,
}: {
  onSelectPlan?: (size: string, period: Period) => void
  onPeriodChange?: (period: Period) => void
}) {
  const [period, setPeriod] = React.useState<Period>("monthly")
  const [selected, setSelected] = React.useState("200 GB")
  const [updated, setUpdated] = React.useState(false)
  const yearly = period === "yearly"

  const select = (size: string) => {
    setSelected(size)
    setUpdated(false)
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerClassName="gap-6 px-5 pt-9 pb-6">
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          className="items-center gap-2"
        >
          <Icon as={CloudIcon} className="size-10 text-blue-500" />
          <Text role="heading" className="text-center text-3xl font-semibold">
            More space with suiss Cloud+.
          </Text>
          <ToggleGroup
            spacing={0}
            size="sm"
            value={[period]}
            onValueChange={(value) => {
              const next = value[0]
              if (next !== "monthly" && next !== "yearly") return
              setPeriod(next)
              onPeriodChange?.(next)
            }}
            accessibilityLabel="Billing period"
            className="mt-2 self-center"
          >
            <ToggleGroupItem value="monthly" className="px-8">
              <Text>Monthly</Text>
            </ToggleGroupItem>
            <ToggleGroupItem value="yearly">
              <Text>Yearly · 2 months free</Text>
            </ToggleGroupItem>
          </ToggleGroup>
        </AnimatedView>
        <RadioGroup
          value={selected}
          onValueChange={select}
          accessibilityLabel="Storage plan"
          className="gap-3 pt-1"
        >
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.size}
              plan={plan}
              checked={plan.size === selected}
              yearly={yearly}
              onPress={() => select(plan.size)}
            />
          ))}
        </RadioGroup>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent>
          <Button
            size="lg"
            block
            accessibilityLiveRegion="polite"
            onPress={() => {
              onSelectPlan?.(selected, period)
              setUpdated(true)
            }}
          >
            <Text>
              {updated ? "Your plan is updated" : `Switch to ${selected}`}
            </Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { PriceStorage }
