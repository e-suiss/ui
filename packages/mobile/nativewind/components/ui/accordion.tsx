import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "cn"
import { CaretDownIcon } from "phosphor-react-native"
import * as React from "react"
import type { GestureResponderEvent } from "react-native"
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated"
import * as AccordionPrimitive from "@/components/primitives/accordion"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

const accordionVariants = cva("w-full flex-col", {
  variants: {
    variant: {
      default: "",
      filled: "overflow-hidden rounded-2xl bg-muted",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

function Accordion({
  className,
  variant,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root> &
  VariantProps<typeof accordionVariants>) {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        className={(state) =>
          cn(accordionVariants({ variant }), resolveClassName(className, state))
        }
        render={<Animated.View layout={LinearTransition.duration(200)} />}
        {...props}
      />
    </LayoutAnimationConfig>
  )
}

function AccordionItem({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  return (
    <AccordionPrimitive.Item
      className={(state) =>
        cn(
          "ms-4 overflow-hidden",
          state.index > 0 && "border-t border-border",
          resolveClassName(className, state)
        )
      }
      render={<Animated.View layout={LinearTransition.duration(200)} />}
      {...props}
    />
  )
}

function AccordionTrigger({
  className,
  children,
  onPressIn,
  onPressOut,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { open, disabled } = AccordionPrimitive.useItemContext()
  const [pressed, setPressed] = React.useState(false)

  const progress = useDerivedValue(() =>
    open ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })
  )
  const caretStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <TextClassContext.Provider
      value={cn(
        "shrink text-left text-base",
        disabled ? "text-foreground opacity-50" : "text-foreground",
        pressed && !disabled && "underline"
      )}
    >
      <AccordionPrimitive.Header className="flex-row">
        <AccordionPrimitive.Trigger
          className={(state) =>
            cn(
              "min-h-11 flex-1 flex-row items-center justify-between gap-6 py-[0.6875rem] pe-4",
              resolveClassName(className, state)
            )
          }
          onPressIn={(event: GestureResponderEvent) => {
            setPressed(true)
            onPressIn?.(event)
          }}
          onPressOut={(event: GestureResponderEvent) => {
            setPressed(false)
            onPressOut?.(event)
          }}
          {...props}
        >
          {children}
          <Animated.View style={caretStyle}>
            <Icon
              as={CaretDownIcon}
              className="size-4 shrink-0 text-muted-foreground"
            />
          </Animated.View>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Panel>, "className"> & {
  className?: string
}) {
  return (
    <TextClassContext.Provider value="text-sm text-muted-foreground">
      <AccordionPrimitive.Panel className="overflow-hidden" {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          className={cn("gap-4 pe-10 pb-3", className)}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Panel>
    </TextClassContext.Provider>
  )
}

export {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  accordionVariants,
}
