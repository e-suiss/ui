import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import {
  FadeIn,
  FadeInDown,
  ReduceMotion,
  ZoomIn,
} from "react-native-reanimated"
import { Picker, PickerItem } from "@/components/patterns/picker"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/
const SYMBOL = /[^A-Za-z0-9]/

const COUNTRIES = ["United States", "Germany", "Netherlands", "United Kingdom"]

const RULES = [
  {
    label: "At least 8 characters",
    test: (value: string) => value.length >= 8,
  },
  {
    label: "Upper and lowercase letters",
    test: (value: string) => UPPERCASE.test(value) && LOWERCASE.test(value),
  },
  { label: "At least one number", test: (value: string) => DIGIT.test(value) },
]

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  stack: {
    overflow: "hidden",
    borderRadius: radius.xl,
    borderWidth: 1,
  },
  input: {
    ...fontSize.lg,
    height: 52,
    borderRadius: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingHorizontal: 16,
  },
  picker: {
    height: 52,
    width: "100%",
    alignSelf: "stretch",
    borderRadius: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
    paddingStart: 16,
  },
  rules: { gap: 6 },
  rule: { flexDirection: "row", alignItems: "center", gap: 8 },
  ruleMark: {
    width: 16,
    height: 16,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  done: { alignItems: "center", gap: 14 },
  badge: {
    width: 76,
    height: 76,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  heading: { ...fontSize["3xl"], textAlign: "center", fontWeight: "600" },
  scroll: { paddingHorizontal: 24, paddingTop: 36, paddingBottom: 24 },
  section: { marginTop: 22 },
  row: { flexDirection: "row", gap: 12 },
  legend: { ...fontSize.sm, marginBottom: 8, fontWeight: "600" },
})

function PasswordRules({ password }: { password: string }) {
  const { colors } = useTheme()
  return (
    <View style={styles.rules}>
      {RULES.map((rule) => {
        const met = rule.test(password)
        return (
          <View
            key={rule.label}
            accessible
            accessibilityLabel={`${rule.label} ${met ? "(met)" : "(not met)"}`}
            style={styles.rule}
          >
            <View
              style={[
                styles.ruleMark,
                met
                  ? {
                      borderColor: "transparent",
                      backgroundColor: colors.success,
                    }
                  : { borderColor: colors.labelQuaternary },
              ]}
            >
              {met ? (
                <AnimatedView
                  entering={ZoomIn.duration(250).reduceMotion(
                    ReduceMotion.System
                  )}
                >
                  <Icon
                    as={CheckIcon}
                    weight="bold"
                    size={10}
                    color={colors.onAccent}
                  />
                </AnimatedView>
              ) : null}
            </View>
            <Text
              style={{
                ...fontSize.sm,
                color: met ? colors.label : colors.labelSecondary,
              }}
            >
              {rule.label}
            </Text>
          </View>
        )
      })}
    </View>
  )
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <Text role="heading" style={styles.legend}>
      {children}
    </Text>
  )
}

const strength = (value: string) =>
  RULES.filter((rule) => rule.test(value)).length + (SYMBOL.test(value) ? 1 : 0)

type SignupFormValues = {
  firstName: string
  lastName: string
  country: string
  birthday: string
  email: string
  password: string
}

function SignupForm({
  onLearnMore,
  onSubmit,
}: {
  onLearnMore?: () => void
  onSubmit?: (values: SignupFormValues) => void
}) {
  const { colors, isDark } = useTheme()
  const [form, setForm] = React.useState({
    first: "",
    last: "",
    country: "United States",
    birthday: "",
    email: "",
    password: "",
    confirm: "",
  })
  const [tried, setTried] = React.useState(false)
  const [done, setDone] = React.useState(false)

  const update = (key: keyof typeof form) => (value: string) =>
    setForm((current) => ({ ...current, [key]: value }))

  const mismatch = tried && !!form.confirm && form.password !== form.confirm
  const valid =
    !!form.first &&
    !!form.last &&
    !!form.birthday &&
    EMAIL.test(form.email) &&
    strength(form.password) >= 3 &&
    form.password === form.confirm

  const submit = () => {
    setTried(true)
    if (!valid) return
    onSubmit?.({
      firstName: form.first,
      lastName: form.last,
      country: form.country,
      birthday: form.birthday,
      email: form.email,
      password: form.password,
    })
    setDone(true)
  }

  const stack = [
    styles.stack,
    { borderColor: colors.separatorStrong, backgroundColor: colors.surface },
  ]
  const divider = { height: 1, backgroundColor: colors.separatorStrong }

  if (done) {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.done}
          >
            <View style={[styles.badge, { backgroundColor: colors.success }]}>
              <Icon
                as={CheckIcon}
                weight="bold"
                size={38}
                color={colors.onAccent}
              />
            </View>
            <Text role="heading" style={styles.heading}>
              Your suiss Account is ready.
            </Text>
            <Text
              style={{
                ...fontSize.lg,
                textAlign: "center",
                color: colors.labelSecondary,
              }}
            >
              We sent a verification code to {form.email}.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setDone(false)
                setTried(false)
              }}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={{ ...fontSize.lg, color: colors.link }}>
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
      <InputAccessoryBar>
        <KeyboardScrollView contentContainerStyle={styles.scroll}>
          <Text role="heading" style={styles.heading}>
            Create your suiss Account
          </Text>
          <Text
            style={{
              ...fontSize.lg,
              marginTop: 10,
              textAlign: "center",
              color: colors.labelSecondary,
            }}
          >
            One suiss Account is all you need to access every suiss service.{" "}
            <Text
              role="link"
              style={{ ...fontSize.lg, color: colors.link }}
              onPress={onLearnMore}
            >
              Learn more ›
            </Text>
          </Text>
          <View style={styles.section}>
            <Legend>Your name</Legend>
            <View style={styles.row}>
              <View style={[stack, { flex: 1 }]}>
                <InputAccessoryBarInput
                  value={form.first}
                  onChangeText={update("first")}
                  placeholder="First name"
                  accessibilityLabel="First name"
                  autoComplete="given-name"
                  textContentType="givenName"
                  style={styles.input}
                />
              </View>
              <View style={[stack, { flex: 1 }]}>
                <InputAccessoryBarInput
                  value={form.last}
                  onChangeText={update("last")}
                  placeholder="Last name"
                  accessibilityLabel="Last name"
                  autoComplete="family-name"
                  textContentType="familyName"
                  style={styles.input}
                />
              </View>
            </View>
          </View>
          <View style={styles.section}>
            <Legend>Country or region and birthday</Legend>
            <View style={stack}>
              <Picker
                value={form.country}
                onValueChange={update("country")}
                accessibilityLabel="Country or region"
                style={styles.picker}
              >
                {COUNTRIES.map((country) => (
                  <PickerItem key={country} value={country}>
                    {country}
                  </PickerItem>
                ))}
              </Picker>
              <View style={divider} />
              <InputAccessoryBarInput
                value={form.birthday}
                onChangeText={update("birthday")}
                placeholder="Birthday (MM/DD/YYYY)"
                accessibilityLabel="Birthday"
                autoComplete="birthdate-full"
                keyboardType="numbers-and-punctuation"
                style={styles.input}
              />
            </View>
          </View>
          <View style={styles.section}>
            <Legend>suiss Account</Legend>
            <View style={stack}>
              <InputAccessoryBarInput
                value={form.email}
                onChangeText={update("email")}
                placeholder="name@example.com"
                accessibilityLabel="Email"
                accessibilityHint="This will be your new suiss Account."
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                style={styles.input}
              />
            </View>
            <Text
              style={{
                ...fontSize.xs,
                marginTop: 6,
                color: colors.labelSecondary,
              }}
            >
              This will be your new suiss Account.
            </Text>
          </View>
          <View style={styles.section}>
            <Legend>Password</Legend>
            <View
              style={[
                stack,
                mismatch && {
                  borderColor: colors.danger,
                  backgroundColor: withAlpha(
                    colors.danger,
                    isDark ? 0.1 : 0.05
                  ),
                },
              ]}
            >
              <InputAccessoryBarInput
                value={form.password}
                onChangeText={update("password")}
                placeholder="Password"
                accessibilityLabel="Password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                style={styles.input}
              />
              <View
                style={[
                  divider,
                  mismatch && { backgroundColor: colors.danger },
                ]}
              />
              <InputAccessoryBarInput
                value={form.confirm}
                onChangeText={update("confirm")}
                placeholder="Confirm password"
                accessibilityLabel="Confirm password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                style={styles.input}
              />
            </View>
            {form.password ? (
              <AnimatedView
                entering={FadeIn.duration(300).reduceMotion(
                  ReduceMotion.System
                )}
                style={{ paddingHorizontal: 4, paddingTop: 14 }}
              >
                <PasswordRules password={form.password} />
              </AnimatedView>
            ) : null}
          </View>
          <Text
            accessibilityLiveRegion="polite"
            style={{
              ...fontSize.sm,
              marginTop: 14,
              minHeight: 20,
              textAlign: "center",
              color: colors.danger,
            }}
          >
            {tried && !valid ? "Please fill in every field correctly." : ""}
          </Text>
        </KeyboardScrollView>
      </InputAccessoryBar>
      <BottomBar separator>
        <BottomBarContent>
          <Button size="lg" block onPress={submit}>
            <Text>Continue</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export type { SignupFormValues }
export { SignupForm }
