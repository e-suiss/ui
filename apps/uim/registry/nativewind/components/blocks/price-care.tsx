import { cn } from "cn"
import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
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
      className="absolute inset-0"
      style={animatedStyle}
    >
      <Image
        source={{ uri: device.image }}
        resizeMode="cover"
        accessibilityIgnoresInvertColors
        className="size-full"
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
      <ScrollView contentContainerClassName="pb-6">
        <View className="min-h-80 justify-end overflow-hidden bg-media">
          {DEVICES.map((item) => (
            <HeroImage
              key={item.name}
              device={item}
              active={item.name === device}
            />
          ))}
          <View className="gap-1.5 bg-scrim px-7 pt-5 pb-7">
            <Text className="text-base font-semibold text-on-media">
              suiss Care+
            </Text>
            <Text
              role="heading"
              className="text-3xl font-semibold text-on-media"
            >
              Protection against accidents.
            </Text>
          </View>
        </View>
        <AnimatedView
          entering={FadeInDown.duration(600).reduceMotion(ReduceMotion.System)}
          className="gap-[1.125rem] px-5 pt-[1.875rem]"
        >
          <Text role="heading" className="text-3xl font-semibold">
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
            className="flex-wrap"
          >
            {DEVICES.map((item) => {
              const selected = item.name === device
              return (
                <ToggleGroupItem
                  key={item.name}
                  value={item.name}
                  className={cn(
                    "px-3.5",
                    selected
                      ? "bg-label active:bg-label"
                      : "bg-control active:bg-control-pressed"
                  )}
                >
                  <Text className={selected ? "text-surface" : "text-label"}>
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
            className="gap-2.5"
          >
            {current.options.map((item) => {
              const checked = item.label === option
              return (
                <Pressable
                  key={item.label}
                  onPress={() => setOption(item.label)}
                  className={cn(
                    "flex-row items-center gap-3 rounded-xl border-2 px-4 py-3.5",
                    checked
                      ? "border-accent"
                      : "border-separator active:bg-item-pressed"
                  )}
                >
                  <RadioGroupItem
                    value={item.label}
                    accessibilityLabel={`${item.label} payment, ${money(item.price)}`}
                    className="size-5"
                  />
                  <View className="flex-1 gap-px">
                    <Text className="text-base font-semibold">
                      {item.label} payment
                    </Text>
                    <Text className="text-sm text-label-secondary">
                      Unlimited accidental damage repairs
                    </Text>
                  </View>
                  <Text className="text-base font-semibold tabular-nums">
                    {money(item.price)}
                  </Text>
                </Pressable>
              )
            })}
          </RadioGroup>
          {current.name === "Phone Pro" ? (
            <Pressable
              accessible={false}
              onPress={() => setTheft((value) => !value)}
              className="flex-row items-center gap-2.5"
            >
              <Switch
                checked={theft}
                onCheckedChange={setTheft}
                accessibilityLabelledBy="price-care-theft"
              />
              <Text nativeID="price-care-theft" className="flex-1 text-sm">
                Add theft and loss protection
              </Text>
            </Pressable>
          ) : null}
        </AnimatedView>
      </ScrollView>
      <BottomBar separator>
        <BottomBarContent className="flex-row items-center gap-3">
          <View accessibilityLiveRegion="polite" className="flex-1">
            <Text className="text-sm text-label-secondary">Total</Text>
            <Text className="text-2xl font-semibold tabular-nums">
              {money(total)}
            </Text>
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
