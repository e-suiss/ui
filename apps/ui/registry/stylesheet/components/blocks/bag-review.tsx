import * as React from "react"
import { Image, Pressable, ScrollView, StyleSheet, View } from "react-native"
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
import { fontSize, radius, useTheme } from "@/components/ui/theme"

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

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    paddingHorizontal: 20,
    paddingTop: 32,
    paddingBottom: 32,
  },
  title: { ...fontSize["3xl"], fontWeight: "600", textAlign: "center" },
  subtitle: {
    ...fontSize.base,
    marginTop: 8,
    marginBottom: 20,
    textAlign: "center",
  },
  center: { alignItems: "center" },
  row: {
    flexDirection: "row",
    gap: 12,
    borderTopWidth: 1,
    paddingVertical: 16,
  },
  image: { width: 64, height: 64, borderRadius: radius.lg },
  details: { minWidth: 0, flex: 1 },
  info: { gap: 2 },
  nameRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    justifyContent: "space-between",
    gap: 12,
  },
  nameLink: { minWidth: 0, flexShrink: 1 },
  name: { ...fontSize.base, fontWeight: "600" },
  linePrice: {
    ...fontSize.base,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  controls: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  stepper: { gap: 8 },
  quantity: { width: 32, textAlign: "center" },
  remove: { height: "auto", paddingHorizontal: 0 },
  summary: { gap: 10, borderTopWidth: 1, paddingTop: 20 },
  line: { flexDirection: "row", justifyContent: "space-between" },
  totalLine: {
    flexDirection: "row",
    justifyContent: "space-between",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  total: { ...fontSize["2xl"], fontWeight: "600" },
  tabular: { fontVariant: ["tabular-nums"] },
})

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
  const { colors } = useTheme()
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
      <ScrollView contentContainerStyle={styles.content}>
        <Text
          role="heading"
          accessibilityLiveRegion="polite"
          style={styles.title}
        >
          {bag.length
            ? `Your bag total is ${money(subtotal)}.`
            : "Your bag is empty."}
        </Text>
        <Text style={[styles.subtitle, { color: colors.labelSecondary }]}>
          Free delivery and free returns on every order.
        </Text>
        {bag.length === 0 ? (
          <AnimatedView
            entering={FadeIn.duration(400).reduceMotion(ReduceMotion.System)}
            style={styles.center}
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
            style={[styles.row, { borderColor: colors.separator }]}
          >
            <Pressable
              role="link"
              accessibilityLabel={`Show details for ${item.name}`}
              onPress={() => onShowDetails?.(item.name)}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                style={[styles.image, { backgroundColor: colors.control }]}
              />
            </Pressable>
            <View style={styles.details}>
              <View style={styles.info}>
                <View style={styles.nameRow}>
                  <Pressable
                    role="link"
                    accessibilityLabel={`Show details for ${item.name}`}
                    onPress={() => onShowDetails?.(item.name)}
                    style={({ pressed }) => [
                      styles.nameLink,
                      pressed && { opacity: 0.6 },
                    ]}
                  >
                    <Text numberOfLines={1} style={styles.name}>
                      {item.name}
                    </Text>
                  </Pressable>
                  <Text style={styles.linePrice}>
                    {money(item.price * item.quantity)}
                  </Text>
                </View>
                <Text
                  numberOfLines={1}
                  style={[fontSize.sm, { color: colors.labelSecondary }]}
                >
                  {item.variant}
                </Text>
              </View>
              <View style={styles.controls}>
                <Stepper
                  value={item.quantity}
                  onValueChange={(value) => {
                    onQuantityChange?.(item.name, value)
                    setQuantity(item.name, value)
                  }}
                  min={1}
                  max={10}
                  style={styles.stepper}
                >
                  <StepperInput
                    accessibilityLabel={`${item.name} quantity`}
                    style={styles.quantity}
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
                  style={styles.remove}
                >
                  <Text style={[fontSize.sm, { color: colors.link }]}>
                    Remove
                  </Text>
                </Button>
              </View>
            </View>
          </AnimatedView>
        ))}
        {bag.length > 0 ? (
          <View style={[styles.summary, { borderColor: colors.separator }]}>
            <View style={styles.line}>
              <Text style={fontSize.base}>Subtotal</Text>
              <Text style={[fontSize.base, styles.tabular]}>
                {money(subtotal)}
              </Text>
            </View>
            <View style={styles.line}>
              <Text style={fontSize.base}>Shipping</Text>
              <Text style={fontSize.base}>FREE</Text>
            </View>
            <View style={[styles.totalLine, { borderColor: colors.separator }]}>
              <Text style={styles.total}>Total</Text>
              <Text style={[styles.total, styles.tabular]}>
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
              style={({ pressed }) => ({
                backgroundColor: pressed
                  ? withAlpha(colors.label, 0.8)
                  : colors.label,
              })}
            >
              <Text style={{ color: colors.surface }}>
                Check Out with{" "}
                <Text style={{ color: colors.surface, fontWeight: "700" }}>
                  suiss
                </Text>{" "}
                Pay
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
