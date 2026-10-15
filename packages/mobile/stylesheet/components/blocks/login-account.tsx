import { ArrowRightIcon } from "phosphor-react-native"
import * as React from "react"
import {
  I18nManager,
  Pressable,
  StyleSheet,
  type TextInput,
  type TextStyle,
  View,
} from "react-native"
import {
  FadeIn,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Label } from "@/components/ui/label"
import { Screen } from "@/components/ui/screen"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const EMAIL = /.+@.+\..+/

const SHAKE = [-10, 9, -6, 4, 0]

const STEP = { duration: 70, reduceMotion: ReduceMotion.System }

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
  done: { alignItems: "center", gap: 14 },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  form: { width: "100%", alignItems: "center" },
  title: {
    ...fontSize["3xl"],
    marginBottom: 32,
    textAlign: "center",
    fontWeight: "600",
  },
  fields: {
    width: "100%",
    overflow: "hidden",
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  row: { flexDirection: "row", alignItems: "center" },
  input: {
    ...fontSize.lg,
    height: 56,
    flex: 1,
    borderRadius: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
  },
  arrow: {
    marginEnd: 10,
    width: 30,
    height: 30,
    borderWidth: 1.5,
    backgroundColor: "transparent",
  },
  error: {
    ...fontSize.sm,
    marginTop: 10,
    minHeight: 22,
    textAlign: "center",
  },
  remember: {
    marginTop: 6,
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  links: { marginTop: 40, alignItems: "center", gap: 10 },
  wrap: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 4,
  },
})

function useShake() {
  const offset = useSharedValue(0)
  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: offset.value }],
  }))
  const shake = React.useCallback(() => {
    offset.value = withSequence(...SHAKE.map((x) => withTiming(x, STEP)))
  }, [offset])
  return { style, shake }
}

function LinkText({
  onPress,
  style,
  children,
}: {
  onPress?: () => void
  style?: TextStyle
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
      <Text style={[{ color: colors.primary }, style]}>{children}</Text>
    </Pressable>
  )
}

function SubmitArrow({
  ready,
  busy,
  onPress,
}: {
  ready: boolean
  busy: boolean
  onPress: () => void
}) {
  const { colors } = useTheme()
  return (
    <Button
      variant="outline"
      size="icon-sm"
      accessibilityLabel="Continue"
      disabled={!ready || busy}
      onPress={onPress}
      style={[
        styles.arrow,
        {
          borderColor: colors.mutedForeground,
        },
      ]}
    >
      {busy ? (
        <Spinner />
      ) : (
        <Icon
          as={ArrowRightIcon}
          weight="bold"
          size={14}
          color={colors.mutedForeground}
          style={
            I18nManager.isRTL ? { transform: [{ rotate: "180deg" }] } : null
          }
        />
      )}
    </Button>
  )
}

function LoginAccount({
  onForgotPassword,
  onCreateAccount,
  onSubmit,
}: {
  onForgotPassword?: () => void
  onCreateAccount?: () => void
  onSubmit?: (email: string, password: string) => void
}) {
  const { colors, isDark } = useTheme()
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [signedIn, setSignedIn] = React.useState(false)
  const passwordRef = React.useRef<TextInput>(null)
  const { style: shakeStyle, shake } = useShake()

  React.useEffect(() => {
    if (!busy) return
    const timer = setTimeout(() => {
      setBusy(false)
      setSignedIn(true)
    }, 1200)
    return () => clearTimeout(timer)
  }, [busy])

  React.useEffect(() => {
    if (step !== "password") return
    const timer = setTimeout(() => passwordRef.current?.focus(), 380)
    return () => clearTimeout(timer)
  }, [step])

  const fail = (message: string) => {
    setError(message)
    shake()
  }

  const submit = () => {
    if (step === "email") {
      if (!EMAIL.test(email)) return fail("Enter a valid suiss Account.")
      setError("")
      setStep("password")
      return
    }
    if (password.length < 4)
      return fail("Your suiss Account or password was incorrect.")
    setError("")
    onSubmit?.(email, password)
    setBusy(true)
  }

  if (signedIn) {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.done}
          >
            <Avatar size="xl" style={{ width: 80, height: 80 }}>
              <AvatarFallback style={{ backgroundColor: colors.muted }}>
                <Text style={{ ...fontSize["3xl"], color: colors.foreground }}>
                  {email[0]}
                </Text>
              </AvatarFallback>
            </Avatar>
            <Text
              role="heading"
              style={{ ...fontSize["3xl"], fontWeight: "600" }}
            >
              Hello.
            </Text>
            <Text style={{ ...fontSize.lg, color: colors.mutedForeground }}>
              {email}
            </Text>
            <LinkText
              style={fontSize.lg}
              onPress={() => {
                setSignedIn(false)
                setStep("email")
                setPassword("")
              }}
            >
              Sign out ›
            </LinkText>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.form}>
          <Text role="heading" style={styles.title}>
            Sign in with your suiss Account
          </Text>
          <AnimatedView
            style={[
              styles.fields,
              error
                ? {
                    borderColor: colors.destructive,
                    backgroundColor: withAlpha(
                      colors.destructive,
                      isDark ? 0.1 : 0.05
                    ),
                  }
                : {
                    borderColor: colors.input,
                    backgroundColor: colors.background,
                  },
              shakeStyle,
            ]}
          >
            <View style={styles.row}>
              <Input
                value={email}
                onChangeText={(value) => {
                  setEmail(value)
                  setError("")
                  if (step === "password") setStep("email")
                }}
                placeholder="Email or phone number"
                accessibilityLabel="Email or phone number"
                autoComplete="username"
                textContentType="username"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                returnKeyType="next"
                submitBehavior="submit"
                onSubmitEditing={submit}
                style={styles.input}
              />
              {step === "email" ? (
                <SubmitArrow ready={!!email} busy={busy} onPress={submit} />
              ) : null}
            </View>
            {step === "password" ? (
              <AnimatedView
                entering={FadeIn.duration(300).reduceMotion(
                  ReduceMotion.System
                )}
                style={[
                  styles.row,
                  {
                    borderTopWidth: 1,
                    borderTopColor: colors.input,
                  },
                ]}
              >
                <Input
                  ref={passwordRef}
                  value={password}
                  onChangeText={(value) => {
                    setPassword(value)
                    setError("")
                  }}
                  placeholder="Password"
                  accessibilityLabel="Password"
                  autoComplete="current-password"
                  textContentType="password"
                  secureTextEntry
                  returnKeyType="go"
                  submitBehavior="submit"
                  onSubmitEditing={submit}
                  style={styles.input}
                />
                <SubmitArrow ready={!!password} busy={busy} onPress={submit} />
              </AnimatedView>
            ) : null}
          </AnimatedView>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.error, { color: colors.destructive }]}
          >
            {error}
          </Text>
          <View style={styles.remember}>
            <Checkbox
              checked={remember}
              onCheckedChange={setRemember}
              accessibilityLabelledBy="login-account-remember"
            />
            <Label
              nativeID="login-account-remember"
              onPress={() => setRemember((current) => !current)}
              style={{ ...fontSize.sm, fontWeight: "400" }}
            >
              Remember me
            </Label>
          </View>
          <View style={styles.links}>
            <LinkText style={fontSize.sm} onPress={onForgotPassword}>
              Forgot password? ›
            </LinkText>
            <View style={styles.wrap}>
              <Text style={{ ...fontSize.sm, color: colors.mutedForeground }}>
                Don't have a suiss Account?
              </Text>
              <LinkText style={fontSize.sm} onPress={onCreateAccount}>
                Create yours now ›
              </LinkText>
            </View>
          </View>
        </View>
      </KeyboardScrollView>
    </Screen>
  )
}

export { LoginAccount }
