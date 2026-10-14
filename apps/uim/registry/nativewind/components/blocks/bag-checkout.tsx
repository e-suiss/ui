import { cn } from "cn"
import {
  CheckIcon,
  CreditCardIcon,
  type Icon as PhosphorIcon,
  WalletIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, View } from "react-native"
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
  return (
    <Pressable
      accessible={false}
      onPress={() => onSelect(value)}
      className={cn(
        "flex-row items-center gap-3 rounded-[0.875rem] active:bg-item-pressed",
        checked
          ? "border-2 border-accent px-[0.9375rem] py-[0.8125rem]"
          : "border border-separator-strong px-4 py-3.5"
      )}
    >
      <RadioGroupItem
        value={value}
        accessibilityLabel={label}
        className="size-5"
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
  const open = current === index
  const done = current > index

  return (
    <View className="border-b border-separator py-[1.125rem]">
      <View className="flex-row items-center gap-2.5">
        <View
          className={cn(
            "size-[1.625rem] items-center justify-center rounded-full",
            done ? "bg-success" : open ? "bg-label" : "bg-control"
          )}
        >
          {done ? (
            <Icon
              as={CheckIcon}
              weight="bold"
              className="size-[0.8125rem] text-on-accent"
            />
          ) : (
            <Text
              className={cn(
                "text-sm font-semibold",
                open ? "text-surface" : "text-label-secondary"
              )}
            >
              {index + 1}
            </Text>
          )}
        </View>
        <Text
          role="heading"
          className={cn(
            "flex-1 text-2xl font-semibold",
            !open && !done && "text-label-secondary"
          )}
        >
          {title}
        </Text>
        {done ? (
          <Pressable
            role="button"
            hitSlop={8}
            onPress={onEdit}
            accessibilityLabel={`Edit ${title.toLowerCase()}`}
            className="active:opacity-60"
          >
            <Text className="text-sm text-link">Edit ›</Text>
          </Pressable>
        ) : null}
      </View>
      {done && summary ? (
        <Text className="ps-9 pt-1.5 text-sm text-label-secondary">
          {summary}
        </Text>
      ) : null}
      {open ? (
        <AnimatedView
          entering={FadeIn.duration(450).reduceMotion(ReduceMotion.System)}
          className="gap-2.5 ps-9 pt-4 pb-1"
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
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(1000).reduceMotion(
              ReduceMotion.System
            )}
            className="max-w-105 items-center gap-3.5"
          >
            <View className="size-[4.75rem] items-center justify-center rounded-full bg-success">
              <Icon
                as={CheckIcon}
                weight="bold"
                className="size-[2.375rem] text-on-accent"
              />
            </View>
            <Text role="heading" className="text-center text-3xl font-semibold">
              Thank you. Your order is in.
            </Text>
            <Text className="text-center text-lg text-label-secondary">
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
              className="active:opacity-60"
            >
              <Text className="text-lg text-link">Start over ›</Text>
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
        <View className="px-5">
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
              className="gap-2.5"
            >
              {SHIPPING.map((option) => (
                <Choice
                  key={option.value}
                  value={option.value}
                  checked={shipping === option.value}
                  label={option.label}
                  onSelect={setShipping}
                >
                  <Text className="flex-1 text-base">{option.label}</Text>
                  <Text className="text-base">{option.price}</Text>
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
              className="gap-2.5"
            >
              {PAYMENT.map((option) => (
                <Choice
                  key={option.value}
                  value={option.value}
                  checked={payment === option.value}
                  label={option.label}
                  onSelect={setPayment}
                >
                  <Icon as={option.icon} className="size-[1.125rem]" />
                  <Text className="flex-1 text-base">{option.label}</Text>
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
            <Text className="text-sm text-label-secondary">
              By placing your order, you agree to the Sales Policy.
            </Text>
          </Step>
        </View>
        <View className="mx-4 mt-6 mb-8 gap-3.5 rounded-2xl bg-surface-secondary px-5 py-5">
          <Text role="heading" className="text-lg font-semibold">
            Order summary
          </Text>
          {ITEMS.map((item) => (
            <View key={item.name} className="flex-row items-center gap-2.5">
              <Image
                source={{ uri: item.image }}
                resizeMode="cover"
                accessibilityIgnoresInvertColors
                className="size-12 shrink-0 rounded-[0.625rem] bg-control"
              />
              <View className="min-w-0 flex-1">
                <Text className="text-sm font-semibold">{item.name}</Text>
                <Text className="text-xs text-label-secondary">
                  {item.variant}
                </Text>
              </View>
              <Text className="text-sm tabular-nums">{money(item.price)}</Text>
            </View>
          ))}
          <View className="flex-row items-center border-t border-separator pt-3">
            <Text className="flex-1 text-base font-semibold">Total</Text>
            <Text className="text-lg font-semibold tabular-nums">
              {money(total)}
            </Text>
          </View>
        </View>
      </HeaderScrollView>
      <BottomBar separator>
        <BottomBarContent className="flex-row items-center gap-3">
          <View accessibilityLiveRegion="polite" className="flex-1">
            <Text className="text-xs text-label-secondary">Total</Text>
            <Text className="text-lg font-semibold tabular-nums">
              {money(total)}
            </Text>
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
