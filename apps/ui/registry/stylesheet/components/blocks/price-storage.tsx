import { CheckIcon, CloudIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"
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

const styles = StyleSheet.create({
  content: {
    gap: 24,
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 24,
  },
  intro: { alignItems: "center", gap: 8 },
  title: { ...fontSize["3xl"], fontWeight: "600", textAlign: "center" },
  period: { marginTop: 8, alignSelf: "center" },
  monthly: { paddingHorizontal: 32 },
  plans: { gap: 12, paddingTop: 4 },
  card: { gap: 12, borderRadius: 18, borderWidth: 2, padding: 18 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  size: { ...fontSize["2xl"], flex: 1, fontWeight: "600" },
  radio: { width: 20, height: 20 },
  price: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  features: { gap: 6 },
  feature: { flexDirection: "row", alignItems: "flex-start", gap: 6 },
  check: { marginTop: 3, flexShrink: 0 },
  badge: {
    position: "absolute",
    top: -9,
    start: 18,
    borderRadius: 9999,
    paddingHorizontal: 9,
    paddingVertical: 2,
  },
  badgeText: { ...fontSize["2xs"], fontWeight: "600" },
})

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
  const { colors } = useTheme()
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
        style={({ pressed }) => [
          styles.card,
          {
            backgroundColor: colors.surfaceSecondary,
            borderColor: checked ? colors.accent : "transparent",
            opacity: pressed && !checked ? 0.8 : 1,
          },
        ]}
      >
        <View style={styles.cardHead}>
          <Text style={styles.size}>{plan.size}</Text>
          <RadioGroupItem
            value={plan.size}
            accessibilityLabel={`${plan.size}${plan.popular ? ", most popular" : ""}`}
            style={styles.radio}
          />
        </View>
        <Text>
          <Text style={styles.price}>
            {money(yearly ? plan.price * 10 : plan.price)}
          </Text>
          <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
            {yearly ? " /yr" : " /mo"}
          </Text>
        </Text>
        <View style={styles.features}>
          {plan.features.map((feature) => (
            <View key={feature} style={styles.feature}>
              <Icon
                as={CheckIcon}
                weight="bold"
                size={13}
                color={colors.success}
                style={styles.check}
              />
              <Text style={[fontSize.sm, { flex: 1 }]}>{feature}</Text>
            </View>
          ))}
        </View>
      </Pressable>
      {plan.popular ? (
        <View
          pointerEvents="none"
          style={[styles.badge, { backgroundColor: colors.accent }]}
        >
          <Text style={[styles.badgeText, { color: colors.onAccent }]}>
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
  const { colors } = useTheme()
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
      <ScrollView contentContainerStyle={styles.content}>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          style={styles.intro}
        >
          <Icon as={CloudIcon} size={40} color={colors.blue} />
          <Text role="heading" style={styles.title}>
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
            style={styles.period}
          >
            <ToggleGroupItem value="monthly" style={styles.monthly}>
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
          style={styles.plans}
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
