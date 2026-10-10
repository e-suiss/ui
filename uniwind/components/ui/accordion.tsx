import * as AccordionPrimitive from "@rn-primitives/accordion"
import { cn } from "cn"
import { CaretDownIcon } from "phosphor-react-native"
import { Pressable } from "react-native"
import Animated, {
  FadeOutUp,
  LayoutAnimationConfig,
  LinearTransition,
  ReduceMotion,
  useAnimatedStyle,
  useDerivedValue,
  withTiming,
} from "react-native-reanimated"
import { Icon } from "@/components/ui/icon"
import { TextClassContext } from "@/components/ui/text"

function Accordion({
  children,
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof AccordionPrimitive.Root>, "asChild">) {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        {...(props as AccordionPrimitive.RootProps)}
        className={cn(
          "w-full flex-col overflow-hidden rounded-2xl border border-border",
          className
        )}
        asChild
      >
        <Animated.View layout={LinearTransition.duration(200)}>
          {children}
        </Animated.View>
      </AccordionPrimitive.Root>
    </LayoutAnimationConfig>
  )
}

function AccordionItem({
  children,
  className,
  value,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Item>) {
  const { value: rootValue } = AccordionPrimitive.useRootContext()
  const isOpen = Array.isArray(rootValue)
    ? rootValue.includes(value)
    : rootValue === value
  return (
    <AccordionPrimitive.Item
      className={cn(
        "border-b border-border",
        isOpen && "bg-muted/50",
        className
      )}
      value={value}
      asChild
      {...props}
    >
      <Animated.View
        className="native:overflow-hidden"
        layout={LinearTransition.duration(200)}
      >
        {children}
      </Animated.View>
    </AccordionPrimitive.Item>
  )
}

function AccordionTrigger({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
  children?: React.ReactNode
}) {
  const { isExpanded } = AccordionPrimitive.useItemContext()

  const progress = useDerivedValue(() =>
    isExpanded
      ? withTiming(1, { duration: 250 })
      : withTiming(0, { duration: 200 })
  )
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <TextClassContext.Provider value="text-left text-sm font-medium text-foreground">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger {...props} asChild>
          <Pressable
            className={cn(
              "flex-row items-start justify-between gap-6 border border-transparent p-4 disabled:opacity-50",
              className
            )}
          >
            {children}
            <Animated.View style={chevronStyle}>
              <Icon
                as={CaretDownIcon}
                size={16}
                className="shrink-0 text-muted-foreground"
              />
            </Animated.View>
          </Pressable>
        </AccordionPrimitive.Trigger>
      </AccordionPrimitive.Header>
    </TextClassContext.Provider>
  )
}

function AccordionContent({
  className,
  children,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Content>) {
  return (
    <TextClassContext.Provider value="text-sm text-foreground">
      <AccordionPrimitive.Content className="overflow-hidden px-4" {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          className={cn("pt-0 pb-4", className)}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Content>
    </TextClassContext.Provider>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
