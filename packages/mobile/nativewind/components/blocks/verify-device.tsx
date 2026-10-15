import { cn } from "cn"
import {
  CheckIcon,
  DeviceMobileIcon,
  LockSimpleIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Screen } from "@/components/ui/screen"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

const DEMO_CODE = "482913"

type Phase = "ask" | "code" | "deny" | "ok"

const COPY = {
  ask: {
    title: "Approve from your other device.",
    body: "We sent a sign-in request to your trusted devices. Tap Allow on the alert below.",
  },
  code: {
    title: "Enter the verification code.",
    body: "Type the 6-digit code shown on your trusted device.",
  },
  deny: {
    title: "Sign-in denied.",
    body: "If this wasn't you, your account is safe. There's nothing else you need to do.",
  },
}

const ENTERING = FadeIn.duration(500).reduceMotion(ReduceMotion.System)

function AlertAction({
  children,
  primary,
  onPress,
}: {
  children: React.ReactNode
  primary?: boolean
  onPress?: () => void
}) {
  return (
    <Pressable
      role="button"
      onPress={onPress}
      className="h-11 w-full items-center justify-center border-t border-input active:opacity-80"
    >
      <Text className={cn("text-lg text-primary", primary && "font-semibold")}>
        {children}
      </Text>
    </Pressable>
  )
}

function VerifyDevice({
  onVerify = (code) => code === DEMO_CODE,
}: {
  onVerify?: (code: string) => boolean | Promise<boolean>
}) {
  const [phase, setPhase] = React.useState<Phase>("ask")
  const [code, setCode] = React.useState("")
  const [error, setError] = React.useState(false)

  React.useEffect(() => {
    if (!error) return
    const timer = setTimeout(() => setCode(""), 800)
    return () => clearTimeout(timer)
  }, [error])

  if (phase === "ok") {
    return (
      <Screen>
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="items-center gap-3.5"
          >
            <View className="size-[4.75rem] items-center justify-center rounded-full bg-green-500">
              <Icon
                as={CheckIcon}
                weight="bold"
                className="size-[2.375rem] text-primary-foreground"
              />
            </View>
            <Text role="heading" className="text-center text-3xl font-semibold">
              Sign-in approved.
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              This device was added to your suiss Account.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setCode("")
                setError(false)
                setPhase("ask")
              }}
              className="active:opacity-60"
            >
              <Text className="text-lg text-primary">Start over ›</Text>
            </Pressable>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <KeyboardScrollView contentContainerClassName="grow gap-3.5 px-6 py-8">
        <View className="size-14 items-center justify-center rounded-full bg-muted">
          <Icon
            as={phase === "code" ? LockSimpleIcon : DeviceMobileIcon}
            weight="bold"
            className="size-[1.625rem] text-primary"
          />
        </View>
        <Text role="heading" className="text-3xl font-semibold">
          {COPY[phase].title}
        </Text>
        <Text className="text-lg text-muted-foreground">
          {COPY[phase].body}
        </Text>
        <View accessibilityLiveRegion="polite" className="mt-2.5 min-h-16">
          {phase === "code" ? (
            <AnimatedView entering={ENTERING}>
              <InputOTP
                autoFocus
                length={6}
                value={code}
                onValueChange={(value) => {
                  setCode(value)
                  setError(false)
                }}
                onValueComplete={async (value) => {
                  if (await onVerify(value)) return setPhase("ok")
                  setError(true)
                }}
                accessibilityLabel="Verification code"
              >
                <InputOTPGroup className="gap-2">
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      className={(state) =>
                        cn(
                          "h-14 w-11 rounded-xl border bg-transparent",
                          error && "border-destructive",
                          !error && state.active && "border-primary",
                          !(error || state.active) && "border-input"
                        )
                      }
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error ? (
                <Text className="mt-2.5 text-sm text-destructive">
                  Incorrect code.
                </Text>
              ) : null}
            </AnimatedView>
          ) : null}
          {phase === "ask" ? (
            <View className="flex-row items-center gap-2.5">
              <Spinner />
              <Text className="text-sm text-muted-foreground">
                Waiting for approval…
              </Text>
            </View>
          ) : null}
          {phase === "deny" ? (
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setPhase("ask")}
              className="self-start active:opacity-60"
            >
              <Text className="text-base text-primary">Try again ›</Text>
            </Pressable>
          ) : null}
        </View>
        <View className="mt-2 items-center justify-center rounded-3xl bg-muted px-6 py-10">
          <AnimatedView
            key={phase}
            entering={ENTERING}
            accessibilityRole="alert"
            accessibilityLabel="Trusted device"
            className="w-[16.875rem] overflow-hidden rounded-[0.875rem] bg-popover shadow-lg"
          >
            {phase === "code" ? (
              <>
                <View className="items-center px-4 pt-5 pb-[1.125rem]">
                  <Text className="text-center text-lg font-semibold">
                    suiss Account Verification Code
                  </Text>
                  <Text className="mt-2.5 mb-1 text-3xl font-semibold tracking-widest tabular-nums">
                    482 913
                  </Text>
                  <Text className="text-center text-sm text-muted-foreground">
                    Enter this code on the device you're signing in to.
                  </Text>
                </View>
                <AlertAction primary>OK</AlertAction>
              </>
            ) : null}
            {phase === "deny" ? (
              <>
                <View className="items-center px-4 pt-5 pb-[1.125rem]">
                  <Text className="text-center text-lg font-semibold">
                    Sign-in blocked
                  </Text>
                  <Text className="mt-1 text-center text-sm text-muted-foreground">
                    If this wasn't you, change your password.
                  </Text>
                </View>
                <AlertAction onPress={() => setPhase("ask")}>
                  Show request again
                </AlertAction>
              </>
            ) : null}
            {phase === "ask" ? (
              <>
                <View className="px-4 pt-5 pb-4">
                  <Text className="text-center text-lg font-semibold">
                    suiss Account Sign-in Requested
                  </Text>
                  <Text className="mt-1 text-center text-sm text-muted-foreground">
                    Your suiss Account is being used to sign in to a device near
                    San Francisco.
                  </Text>
                  <View className="mt-3.5 h-24 items-center justify-center rounded-[0.625rem] bg-primary-10 dark:bg-primary-20">
                    <View className="size-12 items-center justify-center rounded-full bg-primary-25">
                      <View className="size-2.5 rounded-full bg-primary" />
                    </View>
                  </View>
                </View>
                <AlertAction primary onPress={() => setPhase("code")}>
                  Allow
                </AlertAction>
                <AlertAction onPress={() => setPhase("deny")}>
                  Don't Allow
                </AlertAction>
              </>
            ) : null}
          </AnimatedView>
        </View>
      </KeyboardScrollView>
    </Screen>
  )
}

export { VerifyDevice }
