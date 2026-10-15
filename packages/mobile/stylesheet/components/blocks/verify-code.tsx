import { CheckIcon, LockSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
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
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const DEMO_CODE = "482913"

const SHAKE = [-10, 9, -6, 4, 0]

const STEP = { duration: 70, reduceMotion: ReduceMotion.System }

type Status = "idle" | "error" | "ok"

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  stack: { alignItems: "center", gap: 14 },
  check: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  title: { ...fontSize["3xl"], fontWeight: "600", textAlign: "center" },
  lead: { ...fontSize.lg, textAlign: "center" },
  content: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  lock: {
    width: 64,
    height: 64,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  slot: {
    height: 56,
    width: 44,
    borderRadius: radius.xl,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  hint: { ...fontSize.sm, marginTop: 14, minHeight: 20 },
  links: { marginTop: 24, alignItems: "center", gap: 10 },
})

function slotBorder(active: boolean, colors: ThemeColors) {
  return active ? colors.accent : colors.separatorStrong
}

function LinkText({
  onPress,
  children,
}: {
  onPress?: () => void
  children: React.ReactNode
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      role="link"
      hitSlop={8}
      onPress={onPress}
      style={({ pressed }) => pressed && { opacity: 0.6 }}
    >
      <Text style={[fontSize.sm, { color: colors.link }]}>{children}</Text>
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
  const { colors } = useTheme()
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
        <View style={styles.center}>
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.stack}
          >
            <View style={[styles.check, { backgroundColor: colors.success }]}>
              <Icon
                as={CheckIcon}
                weight="bold"
                size={38}
                color={colors.onAccent}
              />
            </View>
            <Text role="heading" style={styles.title}>
              Verified.
            </Text>
            <Text style={[styles.lead, { color: colors.labelSecondary }]}>
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

  return (
    <Screen>
      <KeyboardScrollView contentContainerStyle={styles.content}>
        <View
          style={[styles.lock, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Icon
            as={LockSimpleIcon}
            weight="bold"
            size={30}
            color={colors.accent}
          />
        </View>
        <Text role="heading" style={[styles.title, { marginTop: 20 }]}>
          Two-factor authentication
        </Text>
        <Text
          style={[
            styles.lead,
            { marginTop: 12, marginBottom: 30, color: colors.labelSecondary },
          ]}
        >
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
            style={{ gap: 16 }}
          >
            {[
              [0, 1, 2],
              [3, 4, 5],
            ].map((group) => (
              <InputOTPGroup key={group[0]} style={{ gap: 10 }}>
                {group.map((index) => (
                  <InputOTPSlot
                    key={index}
                    index={index}
                    style={(state) => [
                      styles.slot,
                      {
                        borderColor:
                          status === "error"
                            ? colors.danger
                            : slotBorder(state.active, colors),
                      },
                    ]}
                  />
                ))}
              </InputOTPGroup>
            ))}
          </InputOTP>
        </AnimatedView>
        <Text
          accessibilityLiveRegion="polite"
          style={[
            styles.hint,
            {
              color: status === "error" ? colors.danger : colors.labelSecondary,
            },
          ]}
        >
          {status === "error" ? "Incorrect code." : `Demo code: ${DEMO_CODE}`}
        </Text>
        <View style={styles.links}>
          {left > 0 ? (
            <Text
              style={[
                fontSize.sm,
                {
                  color: colors.labelSecondary,
                  fontVariant: ["tabular-nums"],
                },
              ]}
            >
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
