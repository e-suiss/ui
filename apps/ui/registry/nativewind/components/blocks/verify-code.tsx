import { cn } from "cn"
import { CheckIcon, LockSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import {
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const DEMO_CODE = "482913"

const SHAKE = [-10, 9, -6, 4, 0]

const STEP = { duration: 70, reduceMotion: ReduceMotion.System }

type Status = "idle" | "error" | "ok"

function LinkText({
  onPress,
  children,
}: {
  onPress?: () => void
  children: React.ReactNode
}) {
  return (
    <Pressable
      role="link"
      hitSlop={8}
      onPress={onPress}
      className="active:opacity-60"
    >
      <Text className="text-sm text-link">{children}</Text>
    </Pressable>
  )
}

function VerifyCode({
  onHelp,
  onVerify = (code) => code === DEMO_CODE,
}: {
  onHelp?: () => void
  onVerify?: (code: string) => boolean | Promise<boolean>
}) {
  const verifyRef = React.useRef(onVerify)
  verifyRef.current = onVerify
  const [code, setCode] = React.useState("")
  const [status, setStatus] = React.useState<Status>("idle")
  const [checking, setChecking] = React.useState<string | null>(null)
  const [left, setLeft] = React.useState(30)
  const offset = useSharedValue(0)

  const shakeStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))

  React.useEffect(() => {
    if (left <= 0) return
    const timer = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(timer)
  }, [left])

  React.useEffect(() => {
    if (checking === null) return
    let active = true
    const timer = setTimeout(async () => {
      const valid = await verifyRef.current(checking)
      if (!active) return
      setChecking(null)
      if (valid) return setStatus("ok")
      setStatus("error")
      offset.value = withSequence(...SHAKE.map((x) => withTiming(x, STEP)))
    }, 200)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [checking, offset])

  React.useEffect(() => {
    if (status !== "error") return
    const timer = setTimeout(() => {
      setCode("")
      setStatus("idle")
    }, 800)
    return () => clearTimeout(timer)
  }, [status])

  if (status === "ok") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="items-center gap-3.5"
          >
            <View className="size-[4.75rem] items-center justify-center rounded-full bg-success">
              <Icon
                as={CheckIcon}
                weight="bold"
                className="size-[2.375rem] text-on-accent"
              />
            </View>
            <Text role="heading" className="text-3xl font-semibold">
              Verified.
            </Text>
            <Text className="text-center text-lg text-label-secondary">
              This device is now trusted. You won't be asked for a code next
              time.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setCode("")
                setStatus("idle")
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

  return (
    <Screen>
      <KeyboardScrollView contentContainerClassName="grow items-center justify-center px-6 py-8">
        <View className="size-16 items-center justify-center rounded-full bg-surface-secondary">
          <Icon
            as={LockSimpleIcon}
            weight="bold"
            className="size-[1.875rem] text-accent"
          />
        </View>
        <Text
          role="heading"
          className="mt-5 text-center text-3xl font-semibold"
        >
          Two-factor authentication
        </Text>
        <Text className="mt-3 mb-[1.875rem] text-center text-lg text-label-secondary">
          Enter the 6-digit code sent to your trusted devices.
        </Text>
        <AnimatedView style={shakeStyle}>
          <InputOTP
            autoFocus
            length={6}
            value={code}
            onValueChange={(value) => {
              setCode(value)
              setStatus("idle")
            }}
            onValueComplete={setChecking}
            accessibilityLabel="Verification code"
            className="gap-4"
          >
            {[
              [0, 1, 2],
              [3, 4, 5],
            ].map((group) => (
              <InputOTPGroup key={group[0]} className="gap-2.5">
                {group.map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    className={(state) =>
                      cn(
                        "h-14 w-11 rounded-xl border bg-transparent",
                        status === "error"
                          ? "border-danger"
                          : state.active
                            ? "border-accent"
                            : "border-separator-strong"
                      )
                    }
                  />
                ))}
              </InputOTPGroup>
            ))}
          </InputOTP>
        </AnimatedView>
        <Text
          accessibilityLiveRegion="polite"
          className={cn(
            "mt-3.5 min-h-5 text-sm",
            status === "error" ? "text-danger" : "text-label-secondary"
          )}
        >
          {status === "error" ? "Incorrect code." : `Demo code: ${DEMO_CODE}`}
        </Text>
        <View className="mt-6 items-center gap-2.5">
          {left > 0 ? (
            <Text className="text-sm text-label-secondary tabular-nums">
              Resend code · 0:{String(left).padStart(2, "0")}
            </Text>
          ) : (
            <LinkText onPress={() => setLeft(30)}>Resend code ›</LinkText>
          )}
          <LinkText onPress={onHelp}>
            Didn't get a verification code? ›
          </LinkText>
        </View>
      </KeyboardScrollView>
    </Screen>
  )
}

export { VerifyCode }
