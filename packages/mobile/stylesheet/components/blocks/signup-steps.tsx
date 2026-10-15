import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, type TextInputProps, View } from "react-native"
import {
  FadeInDown,
  Keyframe,
  ReduceMotion,
  ZoomIn,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/

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

const STEPS: {
  key: "name" | "email" | "password"
  title: string
  description: string
  placeholder: string
  input: TextInputProps
  valid: (value: string) => boolean
}[] = [
  {
    key: "name",
    title: "What should we call you?",
    description: "Your name appears across suiss products and services.",
    placeholder: "Full name",
    input: {
      autoComplete: "name",
      textContentType: "name",
      autoCapitalize: "words",
    },
    valid: (value) => value.trim().length > 1,
  },
  {
    key: "email",
    title: "What's your email address?",
    description: "This will be your suiss Account.",
    placeholder: "name@example.com",
    input: {
      autoComplete: "email",
      textContentType: "emailAddress",
      keyboardType: "email-address",
      autoCapitalize: "none",
      autoCorrect: false,
    },
    valid: (value) => EMAIL.test(value),
  },
  {
    key: "password",
    title: "Create a password.",
    description: "A strong password keeps your account safe.",
    placeholder: "Password",
    input: {
      autoComplete: "new-password",
      textContentType: "newPassword",
      secureTextEntry: true,
    },
    valid: (value) => RULES.filter((rule) => rule.test(value)).length >= 3,
  },
]

const EASING_DURATION = 550

function slideFrom(offset: number) {
  return new Keyframe({
    0: { opacity: 0, transform: [{ translateX: offset }] },
    100: { opacity: 1, transform: [{ translateX: 0 }] },
  })
    .duration(EASING_DURATION)
    .reduceMotion(ReduceMotion.System)
}

const FROM_END = slideFrom(40)

const FROM_START = slideFrom(-40)

const styles = StyleSheet.create({
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
  progress: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    paddingTop: 24,
  },
  dot: { height: 6, borderRadius: radius.full },
  scroll: {
    flexGrow: 1,
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  step: { gap: 14 },
  field: {
    marginTop: 16,
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
  bar: { flexDirection: "row", justifyContent: "center", gap: 16 },
})

type Values = Record<(typeof STEPS)[number]["key"], string>

function SignupSteps({
  onSubmit,
}: {
  onSubmit?: (values: { name: string; email: string; password: string }) => void
}) {
  const { colors } = useTheme()
  const [index, setIndex] = React.useState(0)
  const [direction, setDirection] = React.useState(1)
  const [values, setValues] = React.useState<Values>({
    name: "",
    email: "",
    password: "",
  })
  const [done, setDone] = React.useState(false)
  const step = STEPS[index] ?? STEPS[0]
  const value = values[step.key]
  const ready = step.valid(value)

  const go = (delta: number) => {
    setDirection(delta)
    if (index + delta > STEPS.length - 1) {
      onSubmit?.(values)
      return setDone(true)
    }
    setIndex(Math.max(0, index + delta))
  }

  const secondary = { ...fontSize.lg, textAlign: "center" as const }

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
            <View style={[styles.badge, { backgroundColor: palette.green500 }]}>
              <Icon
                as={CheckIcon}
                weight="bold"
                size={38}
                color={colors.primaryForeground}
              />
            </View>
            <Text role="heading" style={styles.heading}>
              Welcome, {values.name.split(" ")[0]}.
            </Text>
            <Text style={[secondary, { color: colors.mutedForeground }]}>
              Your account is ready. Verify {values.email} to finish.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setDone(false)
                setIndex(0)
              }}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={{ ...fontSize.lg, color: colors.primary }}>
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
      <View
        accessible
        accessibilityLabel="Progress"
        accessibilityValue={{ text: `Step ${index + 1} of ${STEPS.length}` }}
        style={styles.progress}
      >
        {STEPS.map((item, position) => (
          <View
            key={item.key}
            style={[
              styles.dot,
              {
                width: position === index ? 28 : 6,
                backgroundColor:
                  position <= index ? colors.primary : colors.secondary,
              },
            ]}
          />
        ))}
      </View>
      <KeyboardScrollView contentContainerStyle={styles.scroll}>
        <AnimatedView
          key={step.key}
          entering={direction > 0 ? FROM_END : FROM_START}
          style={styles.step}
        >
          <Text
            style={{
              ...fontSize.sm,
              textAlign: "center",
              fontWeight: "600",
              color: colors.mutedForeground,
            }}
          >
            Step {index + 1} of {STEPS.length}
          </Text>
          <Text role="heading" style={styles.heading}>
            {step.title}
          </Text>
          <Text style={[secondary, { color: colors.mutedForeground }]}>
            {step.description}
          </Text>
          <View
            style={[
              styles.field,
              {
                borderColor: colors.input,
                backgroundColor: colors.background,
              },
            ]}
          >
            <Input
              {...step.input}
              autoFocus={index > 0}
              value={value}
              onChangeText={(next) =>
                setValues((current) => ({ ...current, [step.key]: next }))
              }
              placeholder={step.placeholder}
              accessibilityLabel={step.placeholder}
              returnKeyType={index === STEPS.length - 1 ? "done" : "next"}
              submitBehavior="submit"
              onSubmitEditing={() => {
                if (ready) go(1)
              }}
              style={styles.input}
            />
          </View>
          {step.key === "password" && value ? (
            <View style={styles.rules}>
              {RULES.map((rule) => {
                const met = rule.test(value)
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
                              backgroundColor: palette.green500,
                            }
                          : { borderColor: colors.border },
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
                            color={colors.primaryForeground}
                          />
                        </AnimatedView>
                      ) : null}
                    </View>
                    <Text
                      style={{
                        ...fontSize.sm,
                        color: met ? colors.foreground : colors.mutedForeground,
                      }}
                    >
                      {rule.label}
                    </Text>
                  </View>
                )
              })}
            </View>
          ) : null}
        </AnimatedView>
      </KeyboardScrollView>
      <BottomBar>
        <BottomBarContent style={styles.bar}>
          {index > 0 ? (
            <Button
              size="lg"
              variant="outline"
              style={{ flex: 1 }}
              onPress={() => go(-1)}
            >
              <Text>Back</Text>
            </Button>
          ) : null}
          <Button
            size="lg"
            disabled={!ready}
            style={{ flex: 1 }}
            onPress={() => go(1)}
          >
            <Text>
              {index === STEPS.length - 1 ? "Create account" : "Continue"}
            </Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { SignupSteps }
