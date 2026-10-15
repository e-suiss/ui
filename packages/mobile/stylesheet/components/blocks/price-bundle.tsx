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
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

const SERVICES: {
  name: string
  icon: PhosphorIcon
  tint: Tone
  iconColor: Tone
}[] = [
  {
    name: "suiss Music",
    icon: MusicNoteIcon,
    tint: "red500",
    iconColor: "primaryForeground",
  },
  {
    name: "suiss TV",
    icon: TelevisionIcon,
    tint: "foreground",
    iconColor: "background",
  },
  {
    name: "suiss Arcade",
    icon: GameControllerIcon,
    tint: "red500",
    iconColor: "primaryForeground",
  },
  {
    name: "suiss Cloud+",
    icon: CloudIcon,
    tint: "blue500",
    iconColor: "primaryForeground",
  },
  {
    name: "Fitness+",
    icon: FlameIcon,
    tint: "green500",
    iconColor: "primaryForeground",
  },
  {
    name: "News+",
    icon: NewspaperIcon,
    tint: "pink500",
    iconColor: "primaryForeground",
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

const styles = StyleSheet.create({
  content: {
    gap: 22,
    paddingHorizontal: 20,
    paddingTop: 34,
    paddingBottom: 24,
  },
  intro: { alignItems: "center", gap: 8 },
  title: { ...fontSize["3xl"], fontWeight: "600", textAlign: "center" },
  brand: { ...fontSize["3xl"], fontWeight: "700" },
  subtitle: { ...fontSize["2xl"], textAlign: "center" },
  plans: { gap: 12 },
  card: { gap: 14, borderRadius: 20, borderWidth: 2, padding: 20 },
  cardHead: { flexDirection: "row", alignItems: "center", gap: 8 },
  name: { ...fontSize["2xl"], flex: 1, fontWeight: "600" },
  price: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  services: { gap: 8 },
  service: { flexDirection: "row", alignItems: "center", gap: 8 },
  serviceIcon: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 6,
  },
  bar: { alignItems: "center", gap: 12 },
})

function PriceBundle({
  onSelectPlan,
  onCompare,
}: {
  onSelectPlan?: (plan: string) => void
  onCompare?: (plan: string) => void
}) {
  const { colors } = useTheme()
  const [selected, setSelected] = React.useState("Family")
  const plan = PLANS.find((item) => item.name === selected) ?? PLANS[1]

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          style={styles.intro}
        >
          <Text role="heading" style={styles.title}>
            <Text style={styles.brand}>suiss</Text> One
          </Text>
          <Text style={[styles.subtitle, { color: colors.mutedForeground }]}>
            Bundle it all in one subscription.
          </Text>
        </AnimatedView>
        <View
          accessibilityRole="radiogroup"
          accessibilityLabel="Plan"
          style={styles.plans}
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
                style={({ pressed }) => [
                  styles.card,
                  {
                    borderColor: checked ? colors.primary : colors.border,
                    backgroundColor: checked
                      ? colors.muted
                      : `${colors.muted}99`,
                  },
                  pressed && { opacity: 0.8 },
                ]}
              >
                <View style={styles.cardHead}>
                  <Text style={styles.name}>{item.name}</Text>
                  <Text
                    style={[fontSize.xs, { color: colors.mutedForeground }]}
                  >
                    {item.people}
                  </Text>
                </View>
                <Text>
                  <Text style={styles.price}>{money(item.price)}</Text>
                  <Text
                    style={[fontSize.sm, { color: colors.mutedForeground }]}
                  >
                    {" "}
                    /mo
                  </Text>
                </Text>
                <View style={styles.services}>
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
                        style={styles.service}
                      >
                        <View
                          style={[
                            styles.serviceIcon,
                            {
                              backgroundColor: included
                                ? tone(colors, service.tint)
                                : colors.secondary,
                            },
                          ]}
                        >
                          <Icon
                            as={service.icon}
                            weight="fill"
                            size={13}
                            color={
                              included
                                ? tone(colors, service.iconColor)
                                : colors.mutedForeground
                            }
                          />
                        </View>
                        <Text
                          style={[
                            fontSize.sm,
                            included
                              ? { color: colors.foreground }
                              : {
                                  color: colors.mutedForeground,
                                  textDecorationLine: "line-through",
                                },
                          ]}
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
        <BottomBarContent style={styles.bar}>
          <Button size="lg" block onPress={() => onSelectPlan?.(plan.name)}>
            <Text>Try it free</Text>
          </Button>
          <Pressable
            role="link"
            hitSlop={8}
            onPress={() => onCompare?.(plan.name)}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text
              accessibilityLiveRegion="polite"
              style={[
                fontSize.base,
                { color: colors.primary, textAlign: "center" },
              ]}
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
