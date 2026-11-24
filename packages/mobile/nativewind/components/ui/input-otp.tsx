import { cn } from "cn"
import { MinusIcon } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import Animated, {
  cancelAnimation,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { useFieldRootContext } from "@/components/primitives/field"
import * as OTPFieldPrimitive from "@/components/primitives/otp-field"
import { resolveClassName } from "@/components/primitives/use-render"
import { Icon } from "@/components/ui/icon"
import { Text } from "@/components/ui/text"

type InputOTPSlotClassNames = {
  className?: string
  textClassName?: string
}

const InputOTPSlotClassContext = React.createContext<
  InputOTPSlotClassNames | undefined
>(undefined)

const InputOTPInvalidContext = React.createContext(false)

function InputOTP({
  className,
  invalid,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Root> & {
  invalid?: boolean
}) {
  const field = useFieldRootContext()
  const isInvalid = invalid ?? field.state.invalid
  return (
    <InputOTPInvalidContext.Provider value={isInvalid}>
      <OTPFieldPrimitive.Root
        className={(state) =>
          cn("flex-row items-center gap-2", resolveClassName(className, state))
        }
        {...props}
      />
    </InputOTPInvalidContext.Provider>
  )
}

function InputOTPGroup({
  className,
  ...props
}: React.ComponentProps<typeof View>) {
  return (
    <View className={cn("flex-row items-center gap-2", className)} {...props} />
  )
}

function InputOTPCaret() {
  const opacity = useSharedValue(1)

  React.useEffect(() => {
    opacity.value = withRepeat(
      withSequence(
        withTiming(0, { duration: 200 }),
        withDelay(300, withTiming(1, { duration: 200 })),
        withDelay(300, withTiming(1, { duration: 0 }))
      ),
      -1,
      false,
      undefined,
      ReduceMotion.System
    )
    return () => cancelAnimation(opacity)
  }, [opacity])

  const caretStyle = useAnimatedStyle(() => ({ opacity: opacity.value }))

  return (
    <View
      pointerEvents="none"
      className="absolute inset-0 items-center justify-center"
    >
      <Animated.View
        style={caretStyle}
        className="h-6 w-0.5 rounded-full bg-primary"
      />
    </View>
  )
}

function InputOTPSlot({
  index,
  className,
  ...props
}: Omit<React.ComponentProps<typeof OTPFieldPrimitive.Input>, "children">) {
  const slotClassNames = React.useContext(InputOTPSlotClassContext)
  const invalid = React.useContext(InputOTPInvalidContext)
  return (
    <OTPFieldPrimitive.Input
      index={index}
      className={(state) =>
        cn(
          "relative h-[3.25rem] w-11 items-center justify-center rounded-input border border-border bg-background dark:bg-foreground-6",
          state.disabled && "opacity-50",
          state.active && "z-10 border-ring",
          invalid &&
            "border-[1.5px] border-destructive bg-destructive-5 ring-0 dark:bg-destructive-10",
          slotClassNames?.className,
          resolveClassName(className, state)
        )
      }
      {...props}
    >
      {(slot) => (
        <>
          <Text
            className={cn(
              "text-xl font-semibold tabular-nums text-foreground",
              slotClassNames?.textClassName
            )}
          >
            {slot.char}
          </Text>
          {slot.hasFakeCaret ? <InputOTPCaret /> : null}
        </>
      )}
    </OTPFieldPrimitive.Input>
  )
}

function InputOTPSeparator({
  className,
  ...props
}: React.ComponentProps<typeof OTPFieldPrimitive.Separator>) {
  return (
    <OTPFieldPrimitive.Separator
      className={(state) =>
        cn("items-center", resolveClassName(className, state))
      }
      {...props}
    >
      <OTPSeparatorIcon />
    </OTPFieldPrimitive.Separator>
  )
}

function OTPSeparatorIcon() {
  const { disabled } = OTPFieldPrimitive.useRootContext().state
  return (
    <Icon
      as={MinusIcon}
      className={cn("size-4 text-foreground", disabled && "opacity-50")}
    />
  )
}

export type { InputOTPSlotClassNames }
export {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
  InputOTPSlotClassContext,
}
