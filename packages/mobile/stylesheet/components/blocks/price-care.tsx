import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
import {
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=900&q=80&auto=format&fit=crop`

type CareOption = { label: string; price: number; theft?: number }

type Device = {
  name: string
  image: string
  alt: string
  options: [CareOption, ...CareOption[]]
}

const DEVICES: [Device, ...Device[]] = [
  {
    name: "Phone Pro",
    image: photo("1714972384975-fbd4f19b1bb3"),
    alt: "An orange phone on a warm gradient",
    options: [
      { label: "Annual", price: 99.99, theft: 50 },
      { label: "Monthly", price: 9.99, theft: 5 },
    ],
  },
  {
    name: "Book Air",
    image: photo("1644792863360-40fa85ea52e7"),
    alt: "A laptop on a wooden sideboard",
    options: [
      { label: "3-year", price: 279 },
      { label: "Annual", price: 99.99 },
    ],
  },
  {
    name: "Watch",
    image: photo("1660844817855-3ecc7ef21f12"),
    alt: "A smartwatch with a white band",
    options: [
      { label: "2-year", price: 79 },
      { label: "Monthly", price: 3.99 },
    ],
  },
]

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
  content: { paddingBottom: 24 },
  hero: { minHeight: 320, justifyContent: "flex-end", overflow: "hidden" },
  layer: { position: "absolute", top: 0, right: 0, bottom: 0, left: 0 },
  image: { width: "100%", height: "100%" },
  band: {
    gap: 6,
    paddingHorizontal: 28,
    paddingTop: 20,
    paddingBottom: 28,
  },
  kicker: { ...fontSize.base, fontWeight: "600" },
  heading: { ...fontSize["3xl"], fontWeight: "600" },
  body: { gap: 18, paddingHorizontal: 20, paddingTop: 30 },
  devices: { flexWrap: "wrap" },
  device: { paddingHorizontal: 14 },
  options: { gap: 10 },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: radius.xl,
    borderWidth: 2,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  radio: { width: 20, height: 20 },
  optionText: { flex: 1, gap: 1 },
  strong: { ...fontSize.base, fontWeight: "600" },
  price: {
    ...fontSize.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  theft: { flexDirection: "row", alignItems: "center", gap: 10 },
  bar: { flexDirection: "row", alignItems: "center", gap: 12 },
  total: {
    ...fontSize["2xl"],
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
})

function HeroImage({ device, active }: { device: Device; active: boolean }) {
  const opacity = useSharedValue(active ? 1 : 0)

  React.useEffect(() => {
    opacity.value = withTiming(active ? 1 : 0, {
      duration: 600,
      reduceMotion: ReduceMotion.System,
    })
  }, [active, opacity])

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <AnimatedView
      accessible={active}
      accessibilityRole="image"
      accessibilityLabel={device.alt}
      importantForAccessibility={active ? "yes" : "no-hide-descendants"}
      accessibilityElementsHidden={!active}
      style={[styles.layer, animatedStyle]}
    >
      <Image
        source={{ uri: device.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        style={styles.image}
      />
    </AnimatedView>
  )
}

function PriceCare({
  onAddToBag,
}: {
  onAddToBag?: (selection: {
    device: string
    option: string
    theft: boolean
    total: number
  }) => void
}) {
  const { colors } = useTheme()
  const [device, setDevice] = React.useState(DEVICES[0].name)
  const [option, setOption] = React.useState(DEVICES[0].options[0].label)
  const [theft, setTheft] = React.useState(false)
  const current = DEVICES.find((item) => item.name === device) ?? DEVICES[0]
  const plan =
    current.options.find((item) => item.label === option) ?? current.options[0]
  const withTheft = theft && current.name === "Phone Pro"
  const total = plan.price + (withTheft ? (plan.theft ?? 0) : 0)

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={[styles.hero, { backgroundColor: palette.black }]}>
          {DEVICES.map((item) => (
            <HeroImage
              key={item.name}
              device={item}
              active={item.name === device}
            />
          ))}
          <View
            style={[styles.band, { backgroundColor: "rgba(0, 0, 0, 0.5)" }]}
          >
            <Text style={[styles.kicker, { color: palette.white }]}>
              suiss Care+
            </Text>
            <Text
              role="heading"
              style={[styles.heading, { color: palette.white }]}
            >
              Protection against accidents.
            </Text>
          </View>
        </View>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          style={styles.body}
        >
          <Text role="heading" style={styles.heading}>
            Choose your device.
          </Text>
          <ToggleGroup
            value={[device]}
            onValueChange={(value) => {
              const next = DEVICES.find((item) => item.name === value[0])
              if (!next) return
              setDevice(next.name)
              setOption(next.options[0].label)
            }}
            accessibilityLabel="Device"
            style={styles.devices}
          >
            {DEVICES.map((item) => {
              const selected = item.name === device
              return (
                <ToggleGroupItem
                  key={item.name}
                  value={item.name}
                  style={[
                    styles.device,
                    {
                      backgroundColor: selected
                        ? colors.foreground
                        : colors.secondary,
                    },
                  ]}
                >
                  <Text
                    style={[
                      fontSize.sm,
                      {
                        color: selected ? colors.background : colors.foreground,
                      },
                    ]}
                  >
                    {item.name}
                  </Text>
                </ToggleGroupItem>
              )
            })}
          </ToggleGroup>
          <RadioGroup
            key={device}
            value={option}
            onValueChange={setOption}
            accessibilityLabel="Payment"
            style={styles.options}
          >
            {current.options.map((item) => {
              const checked = item.label === option
              return (
                <Pressable
                  key={item.label}
                  onPress={() => setOption(item.label)}
                  style={({ pressed }) => [
                    styles.option,
                    { borderColor: checked ? colors.primary : colors.border },
                    pressed && !checked && { opacity: 0.8 },
                  ]}
                >
                  <RadioGroupItem
                    value={item.label}
                    accessibilityLabel={`${item.label} payment, ${money(item.price)}`}
                    style={styles.radio}
                  />
                  <View style={styles.optionText}>
                    <Text style={styles.strong}>{item.label} payment</Text>
                    <Text
                      style={[fontSize.sm, { color: colors.mutedForeground }]}
                    >
                      Unlimited accidental damage repairs
                    </Text>
                  </View>
                  <Text style={styles.price}>{money(item.price)}</Text>
                </Pressable>
              )
            })}
          </RadioGroup>
          {current.name === "Phone Pro" ? (
            <Pressable
              accessible={false}
              onPress={() => setTheft((value) => !value)}
              style={styles.theft}
            >
              <Switch
                checked={theft}
                onCheckedChange={setTheft}
                accessibilityLabelledBy="price-care-theft"
              />
              <Text
                nativeID="price-care-theft"
                style={[fontSize.sm, { flex: 1 }]}
              >
                Add theft and loss protection
              </Text>
            </Pressable>
          ) : null}
        </AnimatedView>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={{ flex: 1 }}>
            <Text style={[fontSize.sm, { color: colors.mutedForeground }]}>
              Total
            </Text>
            <Text style={styles.total}>{money(total)}</Text>
          </View>
          <Button
            size="lg"
            onPress={() =>
              onAddToBag?.({
                device: current.name,
                option: plan.label,
                theft: withTheft,
                total,
              })
            }
          >
            <Text>Add to Bag</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { PriceCare }
