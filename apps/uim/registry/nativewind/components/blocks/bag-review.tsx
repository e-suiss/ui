import * as React from "react"
import { Image, Pressable, ScrollView, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import {
  Stepper,
  StepperDecrement,
  StepperGroup,
  StepperIncrement,
  StepperInput,
  StepperSeparator,
} from "@/components/interactions/stepper"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=400&q=80&auto=format&fit=crop`

const INITIAL_ITEMS = [
  {
    name: "Phone Pro",
    variant: "256 GB · Cosmic Orange",
    price: 1099,
    image: photo("1714972384975-fbd4f19b1bb3"),
    quantity: 1,
  },
  {
    name: "Pods Studio",
    variant: "Midnight",
    price: 549,
    image: photo("1599669454699-248893623440"),
    quantity: 1,
  },
  {
    name: "Phone Pro Clear Case",
    variant: "With MagCharge",
    price: 49,
    image: photo("1703676311066-34caf2cbee33"),
    quantity: 2,
  },
]

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

function BagReview({
  onCheckout,
  onShowDetails,
  onContinueShopping,
  onQuantityChange,
  onRemove,
}: {
  onCheckout?: (method: "suiss-pay" | "default") => void
  onShowDetails?: (name: string) => void
  onContinueShopping?: () => void
  onQuantityChange?: (name: string, quantity: number) => void
  onRemove?: (name: string) => void
}) {
  const [items, setItems] = React.useState(INITIAL_ITEMS)
  const bag = items.filter((item) => item.quantity > 0)
  const subtotal = bag.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const setQuantity = (name: string, quantity: number) =>
    setItems((current) =>
      current.map((item) => (item.name === name ? { ...item, quantity } : item))
    )

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerClassName="grow px-5 pt-8 pb-8">
        <Text
          role="heading"
          accessibilityLiveRegion="polite"
          className="text-center text-3xl font-semibold"
        >
          {bag.length
            ? `Your bag total is ${money(subtotal)}.`
            : "Your bag is empty."}
        </Text>
        <Text className="mt-2 mb-5 text-center text-base text-label-secondary">
          Free delivery and free returns on every order.
        </Text>
        {bag.length === 0 ? (
          <AnimatedView
            entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}
            className="items-center"
          >
            <Button
              size="lg"
              onPress={() => {
                onContinueShopping?.()
                setItems(INITIAL_ITEMS)
              }}
            >
              <Text>Continue Shopping</Text>
            </Button>
          </AnimatedView>
        ) : null}
        {bag.map((item) => (
          <AnimatedView
            key={item.name}
            entering={FadeInDown.duration(700).reduceMotion(
              ReduceMotion.System
            )}
            className="flex-row gap-3 border-t border-separator py-4"
          >
            <Pressable
              role="link"
              accessibilityLabel={`Show details for ${item.name}`}
              onPress={() => onShowDetails?.(item.name)}
              className="active:opacity-60"
            >
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                className="size-16 rounded-lg bg-control"
              />
            </Pressable>
            <View className="min-w-0 flex-1">
              <View className="gap-0.5">
                <View className="flex-row items-start justify-between gap-3">
                  <Pressable
                    role="link"
                    accessibilityLabel={`Show details for ${item.name}`}
                    onPress={() => onShowDetails?.(item.name)}
                    className="min-w-0 shrink active:opacity-60"
                  >
                    <Text numberOfLines={1} className="text-base font-semibold">
                      {item.name}
                    </Text>
                  </Pressable>
                  <Text className="text-base font-semibold tabular-nums">
                    {money(item.price * item.quantity)}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  className="text-sm text-label-secondary"
                >
                  {item.variant}
                </Text>
              </View>
              <View className="mt-2.5 flex-row items-center justify-between">
                <Stepper
                  value={item.quantity}
                  onValueChange={(value) => {
                    onQuantityChange?.(item.name, value)
                    setQuantity(item.name, value)
                  }}
                  min={1}
                  max={10}
                  className="gap-2"
                >
                  <StepperInput
                    accessibilityLabel={`${item.name} quantity`}
                    className="w-8 text-center"
                  />
                  <StepperGroup>
                    <StepperDecrement />
                    <StepperSeparator />
                    <StepperIncrement />
                  </StepperGroup>
                </Stepper>
                <Button
                  variant="link"
                  size="sm"
                  accessibilityLabel={`Remove ${item.name}`}
                  onPress={() => {
                    onRemove?.(item.name)
                    setQuantity(item.name, 0)
                  }}
                  className="h-auto px-0"
                >
                  <Text className="text-sm text-link">Remove</Text>
                </Button>
              </View>
            </View>
          </AnimatedView>
        ))}
        {bag.length > 0 ? (
          <View className="gap-2.5 border-t border-separator pt-5">
            <View className="flex-row justify-between">
              <Text className="text-base">Subtotal</Text>
              <Text className="text-base tabular-nums">{money(subtotal)}</Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="text-base">Shipping</Text>
              <Text className="text-base">FREE</Text>
            </View>
            <View className="flex-row justify-between border-t border-separator pt-3">
              <Text className="text-2xl font-semibold">Total</Text>
              <Text className="text-2xl font-semibold tabular-nums">
                {money(subtotal)}
              </Text>
            </View>
          </View>
        ) : null}
      </ScrollView>
      {bag.length > 0 ? (
        <BottomBar separator>
          <BottomBarContent>
            <Button
              size="lg"
              block
              onPress={() => onCheckout?.("suiss-pay")}
              className="bg-label active:bg-label-80"
            >
              <Text className="text-surface">
                Check Out with{" "}
                <Text className="font-bold text-surface">suiss</Text> Pay
              </Text>
            </Button>
            <Button size="lg" block onPress={() => onCheckout?.("default")}>
              <Text>Check Out</Text>
            </Button>
          </BottomBarContent>
        </BottomBar>
      ) : null}
    </Screen>
  )
}

export { BagReview }
