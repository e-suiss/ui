import {
  CheckIcon,
  CreditCardIcon,
  type Icon as PhosphorIcon,
  WalletIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, StyleSheet, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

type Shipping = "standard" | "express"

type Payment = "card" | "pay"

const photo = (id: string) =>
  `https://images.unsplash.com/photo-${id}?w=200&q=80&auto=format&fit=crop`

const ITEMS = [
  {
    name: "Phone Pro",
    variant: "256 GB · Cosmic Orange",
    price: 1099,
    image: photo("1714972384975-fbd4f19b1bb3"),
  },
  {
    name: "Pods Studio",
    variant: "Midnight",
    price: 549,
    image: photo("1599669454699-248893623440"),
  },
  {
    name: "Phone Pro Clear Case",
    variant: "With MagCharge",
    price: 49,
    image: photo("1703676311066-34caf2cbee33"),
  },
]

const SHIPPING: { value: Shipping; label: string; price: string }[] = [
  { value: "standard", label: "Standard · 3–5 business days", price: "Free" },
  { value: "express", label: "Express · Tomorrow", price: "$19" },
]

const PAYMENT: { value: Payment; label: string; icon: PhosphorIcon }[] = [
  { value: "card", label: "Credit card · •••• 4242", icon: CreditCardIcon },
  { value: "pay", label: "suiss Pay", icon: WalletIcon },
]

const ACTIONS = ["Continue to Payment", "Continue to Review", "Place Order"]

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

const styles = StyleSheet.create({
  choice: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 14,
  },
  choiceIdle: { borderWidth: 1, paddingHorizontal: 16, paddingVertical: 14 },
  choiceChecked: {
    borderWidth: 2,
    paddingHorizontal: 15,
    paddingVertical: 13,
  },
  radio: { width: 20, height: 20 },
  grow: { flex: 1 },
  step: { borderBottomWidth: 1, paddingVertical: 18 },
  stepRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  badge: {
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  badgeText: { ...fontSize.sm, fontWeight: "600" },
  stepTitle: { ...fontSize["2xl"], flex: 1, fontWeight: "600" },
  summary: { ...fontSize.sm, paddingStart: 36, paddingTop: 6 },
  stepBody: { gap: 10, paddingStart: 36, paddingTop: 16, paddingBottom: 4 },
  radios: { gap: 10 },
  done: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  doneContent: { maxWidth: 420, alignItems: "center", gap: 14 },
  doneBadge: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  doneTitle: { ...fontSize["3xl"], fontWeight: "600", textAlign: "center" },
  doneText: { ...fontSize.lg, textAlign: "center" },
  steps: { paddingHorizontal: 20 },
  order: {
    marginHorizontal: 16,
    marginTop: 24,
    marginBottom: 32,
    gap: 14,
    borderRadius: radius["2xl"],
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  orderTitle: { ...fontSize.lg, fontWeight: "600" },
  orderRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  orderImage: { width: 48, height: 48, flexShrink: 0, borderRadius: 10 },
  orderText: { minWidth: 0, flex: 1 },
  orderName: { ...fontSize.sm, fontWeight: "600" },
  orderTotal: {
    flexDirection: "row",
    alignItems: "center",
    borderTopWidth: 1,
    paddingTop: 12,
  },
  totalLabel: { ...fontSize.base, flex: 1, fontWeight: "600" },
  totalValue: {
    ...fontSize.lg,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  bar: { flexDirection: "row", alignItems: "center", gap: 12 },
})

function Choice<Value extends string>({
  value,
  checked,
  label,
  onSelect,
  children,
}: {
  value: Value
  checked: boolean
  label: string
  onSelect: (value: Value) => void
  children: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      accessible={false}
      onPress={() => onSelect(value)}
      style={({ pressed }) => [
        styles.choice,
        checked ? styles.choiceChecked : styles.choiceIdle,
        { borderColor: checked ? colors.accent : colors.separatorStrong },
        pressed && { backgroundColor: colors.itemPressed },
      ]}
    >
      <RadioGroupItem
        value={value}
        accessibilityLabel={label}
        style={styles.radio}
      />
      {children}
    </Pressable>
  )
}

function Step({
  index,
  current,
  title,
  summary,
  onEdit,
  children,
}: {
  index: number
  current: number
  title: string
  summary?: string
  onEdit: () => void
  children: React.ReactNode
}) {
  const { colors } = useTheme()
  const open = current === index
  const done = current > index

  return (
    <View style={[styles.step, { borderColor: colors.separator }]}>
      <View style={styles.stepRow}>
        <View
          style={[
            styles.badge,
            {
              backgroundColor: done
                ? colors.success
                : open
                  ? colors.label
                  : colors.control,
            },
          ]}
        >
          {done ? (
            <Icon
              as={CheckIcon}
              weight="bold"
              size={13}
              color={colors.onAccent}
            />
          ) : (
            <Text
              style={[
                styles.badgeText,
                { color: open ? colors.surface : colors.labelSecondary },
              ]}
            >
              {index + 1}
            </Text>
          )}
        </View>
        <Text
          role="heading"
          style={[
            styles.stepTitle,
            !open && !done && { color: colors.labelSecondary },
          ]}
        >
          {title}
        </Text>
        {done ? (
          <Pressable
            role="button"
            hitSlop={8}
            onPress={onEdit}
            accessibilityLabel={`Edit ${title.toLowerCase()}`}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={[fontSize.sm, { color: colors.link }]}>Edit ›</Text>
          </Pressable>
        ) : null}
      </View>
      {done && summary ? (
        <Text style={[styles.summary, { color: colors.labelSecondary }]}>
          {summary}
        </Text>
      ) : null}
      {open ? (
        <AnimatedView
          entering={FadeIn.duration(450).reduceMotion(ReduceMotion.System)}
          style={styles.stepBody}
        >
          {children}
        </AnimatedView>
      ) : null}
    </View>
  )
}

function BagCheckout({
  onPlaceOrder,
  onStartOver,
}: {
  onPlaceOrder?: (order: {
    shipping: Shipping
    payment: Payment
    total: number
  }) => void
  onStartOver?: () => void
}) {
  const { colors } = useTheme()
  const scroll = useHeaderScroll()
  const [step, setStep] = React.useState(0)
  const [shipping, setShipping] = React.useState<Shipping>("standard")
  const [payment, setPayment] = React.useState<Payment>("card")
  const [placed, setPlaced] = React.useState(false)
  const total =
    ITEMS.reduce((sum, item) => sum + item.price, 0) +
    (shipping === "express" ? 19 : 0)

  if (placed) {
    return (
      <Screen>
        <View style={styles.done}>
          <AnimatedView
            entering={FadeInDown.duration(1000).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.doneContent}
          >
            <View
              style={[styles.doneBadge, { backgroundColor: colors.success }]}
            >
              <Icon
                as={CheckIcon}
                weight="bold"
                size={38}
                color={colors.onAccent}
              />
            </View>
            <Text role="heading" style={styles.doneTitle}>
              Thank you. Your order is in.
            </Text>
            <Text style={[styles.doneText, { color: colors.labelSecondary }]}>
              Your order number is W1049. We sent a confirmation email.
            </Text>
            <Pressable
              role="button"
              hitSlop={8}
              onPress={() => {
                onStartOver?.()
                setPlaced(false)
                setStep(0)
              }}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={[fontSize.lg, { color: colors.link }]}>
                Start over ›
              </Text>
            </Pressable>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  const next = () => {
    if (step < 2) {
      setStep(step + 1)
      return
    }
    onPlaceOrder?.({ shipping, payment, total })
    setPlaced(true)
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      <Header scroll={scroll}>
        <HeaderTitle>Checkout</HeaderTitle>
      </Header>
      <HeaderScrollView scroll={scroll}>
        <HeaderLargeTitle>Checkout</HeaderLargeTitle>
        <View style={styles.steps}>
          <Step
            index={0}
            current={step}
            title="Delivery"
            summary={
              shipping === "express"
                ? "Express · Tomorrow"
                : "Standard · 3–5 business days"
            }
            onEdit={() => setStep(0)}
          >
            <RadioGroup
              value={shipping}
              onValueChange={setShipping}
              accessibilityLabel="Delivery"
              style={styles.radios}
            >
              {SHIPPING.map((option) => (
                <Choice
                  key={option.value}
                  value={option.value}
                  checked={shipping === option.value}
                  label={option.label}
                  onSelect={setShipping}
                >
                  <Text style={[fontSize.base, styles.grow]}>
                    {option.label}
                  </Text>
                  <Text style={fontSize.base}>{option.price}</Text>
                </Choice>
              ))}
            </RadioGroup>
          </Step>
          <Step
            index={1}
            current={step}
            title="Payment"
            summary={payment === "card" ? "Card •••• 4242" : "suiss Pay"}
            onEdit={() => setStep(1)}
          >
            <RadioGroup
              value={payment}
              onValueChange={setPayment}
              accessibilityLabel="Payment"
              style={styles.radios}
            >
              {PAYMENT.map((option) => (
                <Choice
                  key={option.value}
                  value={option.value}
                  checked={payment === option.value}
                  label={option.label}
                  onSelect={setPayment}
                >
                  <Icon as={option.icon} size={18} />
                  <Text style={[fontSize.base, styles.grow]}>
                    {option.label}
                  </Text>
                </Choice>
              ))}
            </RadioGroup>
          </Step>
          <Step
            index={2}
            current={step}
            title="Review"
            onEdit={() => setStep(2)}
          >
            <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
              By placing your order, you agree to the Sales Policy.
            </Text>
          </Step>
        </View>
        <View
          style={[styles.order, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Text role="heading" style={styles.orderTitle}>
            Order summary
          </Text>
          {ITEMS.map((item) => (
            <View key={item.name} style={styles.orderRow}>
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                style={[styles.orderImage, { backgroundColor: colors.control }]}
              />
              <View style={styles.orderText}>
                <Text style={styles.orderName}>{item.name}</Text>
                <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
                  {item.variant}
                </Text>
              </View>
              <Text style={[fontSize.sm, { fontVariant: ["tabular-nums"] }]}>
                {money(item.price)}
              </Text>
            </View>
          ))}
          <View style={[styles.orderTotal, { borderColor: colors.separator }]}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>{money(total)}</Text>
          </View>
        </View>
      </HeaderScrollView>
      <BottomBar separator>
        <BottomBarContent style={styles.bar}>
          <View accessibilityLiveRegion="polite" style={styles.grow}>
            <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
              Total
            </Text>
            <Text style={styles.totalValue}>{money(total)}</Text>
          </View>
          <Button size="lg" onPress={next}>
            <Text>{ACTIONS[step]}</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { BagCheckout }
