import {
  CheckIcon,
  DeviceMobileIcon,
  LockSimpleIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
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
import {
  fontSize,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

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

function slotBorder(active: boolean, colors: ThemeColors) {
  return active ? colors.accent : colors.separatorStrong
}

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

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
  title: { ...fontSize["3xl"], fontWeight: "600" },
  lead: { ...fontSize.lg },
  content: {
    flexGrow: 1,
    gap: 14,
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  badge: {
    width: 56,
    height: 56,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  status: { marginTop: 10, minHeight: 64 },
  slot: {
    height: 56,
    width: 44,
    borderRadius: radius.xl,
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  waiting: { flexDirection: "row", alignItems: "center", gap: 10 },
  panel: {
    marginTop: 8,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius["3xl"],
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  card: {
    width: 270,
    overflow: "hidden",
    borderRadius: 14,
  },
  cardBody: {
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 18,
  },
  cardTitle: { ...fontSize.lg, fontWeight: "600", textAlign: "center" },
  cardText: { ...fontSize.sm, textAlign: "center" },
  map: {
    marginTop: 14,
    height: 96,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  ring: {
    width: 48,
    height: 48,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  dot: { width: 10, height: 10, borderRadius: radius.full },
  action: {
    height: 44,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderTopWidth: 1,
  },
})

function AlertAction({
  children,
  primary,
  onPress,
}: {
  children: React.ReactNode
  primary?: boolean
  onPress?: () => void
}) {
  const { colors } = useTheme()
  return (
    <Pressable
      role="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.action,
        { borderColor: colors.separatorStrong },
        pressed && { backgroundColor: colors.itemPressed },
      ]}
    >
      <Text
        style={[
          fontSize.lg,
          { color: colors.link },
          primary && { fontWeight: "600" },
        ]}
      >
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
  const { colors } = useTheme()
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
            <Text
              role="heading"
              style={[styles.title, { textAlign: "center" }]}
            >
              Sign-in approved.
            </Text>
            <Text
              style={[
                styles.lead,
                { textAlign: "center", color: colors.labelSecondary },
              ]}
            >
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
          style={[styles.badge, { backgroundColor: colors.surfaceSecondary }]}
        >
          <Icon
            as={phase === "code" ? LockSimpleIcon : DeviceMobileIcon}
            weight="bold"
            size={26}
            color={colors.accent}
          />
        </View>
        <Text role="heading" style={styles.title}>
          {COPY[phase].title}
        </Text>
        <Text style={[styles.lead, { color: colors.labelSecondary }]}>
          {COPY[phase].body}
        </Text>
        <View accessibilityLiveRegion="polite" style={styles.status}>
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
                <InputOTPGroup style={{ gap: 8 }}>
                  {[0, 1, 2, 3, 4, 5].map((index) => (
                    <InputOTPSlot
                      key={index}
                      index={index}
                      style={(state) => [
                        styles.slot,
                        {
                          borderColor: error
                            ? colors.danger
                            : slotBorder(state.active, colors),
                        },
                      ]}
                    />
                  ))}
                </InputOTPGroup>
              </InputOTP>
              {error ? (
                <Text
                  style={[fontSize.sm, { marginTop: 10, color: colors.danger }]}
                >
                  Incorrect code.
                </Text>
              ) : null}
            </AnimatedView>
          ) : null}
          {phase === "ask" ? (
            <View style={styles.waiting}>
              <Spinner />
              <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
                Waiting for approval…
              </Text>
            </View>
          ) : null}
          {phase === "deny" ? (
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setPhase("ask")}
              style={({ pressed }) => [
                { alignSelf: "flex-start" },
                pressed && { opacity: 0.6 },
              ]}
            >
              <Text style={[fontSize.base, { color: colors.link }]}>
                Try again ›
              </Text>
            </Pressable>
          ) : null}
        </View>
        <View
          style={[styles.panel, { backgroundColor: colors.surfaceSecondary }]}
        >
          <AnimatedView
            key={phase}
            entering={ENTERING}
            accessibilityRole="alert"
            accessibilityLabel="Trusted device"
            style={[
              styles.card,
              shadow.lg,
              { backgroundColor: colors.surfaceRaised },
            ]}
          >
            {phase === "code" ? (
              <>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>
                    suiss Account Verification Code
                  </Text>
                  <Text
                    style={[
                      fontSize["3xl"],
                      {
                        marginTop: 10,
                        marginBottom: 4,
                        fontWeight: "600",
                        letterSpacing: 0.1 * fontSize["3xl"].fontSize,
                        fontVariant: ["tabular-nums"],
                      },
                    ]}
                  >
                    482 913
                  </Text>
                  <Text
                    style={[styles.cardText, { color: colors.labelSecondary }]}
                  >
                    Enter this code on the device you're signing in to.
                  </Text>
                </View>
                <AlertAction primary>OK</AlertAction>
              </>
            ) : null}
            {phase === "deny" ? (
              <>
                <View style={styles.cardBody}>
                  <Text style={styles.cardTitle}>Sign-in blocked</Text>
                  <Text
                    style={[
                      styles.cardText,
                      { marginTop: 4, color: colors.labelSecondary },
                    ]}
                  >
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
                <View
                  style={{
                    paddingHorizontal: 16,
                    paddingTop: 20,
                    paddingBottom: 16,
                  }}
                >
                  <Text style={styles.cardTitle}>
                    suiss Account Sign-in Requested
                  </Text>
                  <Text
                    style={[
                      styles.cardText,
                      { marginTop: 4, color: colors.labelSecondary },
                    ]}
                  >
                    Your suiss Account is being used to sign in to a device near
                    San Francisco.
                  </Text>
                  <View
                    style={[
                      styles.map,
                      { backgroundColor: colors.accentSurface },
                    ]}
                  >
                    <View
                      style={[
                        styles.ring,
                        { backgroundColor: withAlpha(colors.accent, 0.25) },
                      ]}
                    >
                      <View
                        style={[styles.dot, { backgroundColor: colors.accent }]}
                      />
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
