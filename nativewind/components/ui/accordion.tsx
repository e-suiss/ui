import { cn } from "cn"
import { CaretDownIcon } from "phosphor-react-native"
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

function Accordion({
  className,
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Root>) {
  return (
    <LayoutAnimationConfig skipEntering>
      <AccordionPrimitive.Root
        className={(state) =>
          cn(
            "w-full flex-col overflow-hidden rounded-2xl border border-border",
            resolveClassName(className, state)
          )
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
          "native:overflow-hidden border-b border-border",
          state.open && "bg-muted-50",
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
  ...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger>) {
  const { open } = AccordionPrimitive.useItemContext()

  const progress = useDerivedValue(() =>
    open ? withTiming(1, { duration: 250 }) : withTiming(0, { duration: 200 })
  )
  const chevronStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${progress.value * 180}deg` }],
  }))

  return (
    <TextClassContext.Provider value="text-left text-sm font-medium text-foreground">
      <AccordionPrimitive.Header>
        <AccordionPrimitive.Trigger
          className={(state) =>
            cn(
              "flex-row items-start justify-between gap-6 border border-transparent p-4",
              state.disabled && "opacity-50",
              resolveClassName(className, state)
            )
          }
          {...props}
        >
          {children}
          <Animated.View style={chevronStyle}>
            <Icon
              as={CaretDownIcon}
              size={16}
              className="shrink-0 text-muted-foreground"
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
    <TextClassContext.Provider value="text-sm text-foreground">
      <AccordionPrimitive.Panel className="overflow-hidden px-4" {...props}>
        <Animated.View
          exiting={FadeOutUp.duration(200).reduceMotion(ReduceMotion.System)}
          className={cn("pt-0 pb-4", className)}
        >
          {children}
        </Animated.View>
      </AccordionPrimitive.Panel>
    </TextClassContext.Provider>
  )
}

export { Accordion, AccordionContent, AccordionItem, AccordionTrigger }
