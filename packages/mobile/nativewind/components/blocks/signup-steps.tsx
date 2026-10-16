import { cn } from "cn"
import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, type TextInputProps, View } from "react-native"
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

type Values = Record<(typeof STEPS)[number]["key"], string>

function SignupSteps({
  onSubmit,
}: {
  onSubmit?: (values: { name: string; email: string; password: string }) => void
}) {
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

  if (done) {
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
              Welcome, {values.name.split(" ")[0]}.
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              Your account is ready. Verify {values.email} to finish.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setDone(false)
                setIndex(0)
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
      <View
        accessible
        accessibilityLabel="Progress"
        accessibilityValue={{ text: `Step ${index + 1} of ${STEPS.length}` }}
        className="flex-row justify-center gap-2 pt-6"
      >
        {STEPS.map((item, position) => (
          <View
            key={item.key}
            className={cn(
              "h-1.5 rounded-full",
              position === index ? "w-7" : "w-1.5",
              position <= index ? "bg-primary" : "bg-secondary"
            )}
          />
        ))}
      </View>
      <KeyboardScrollView contentContainerClassName="grow justify-center px-6 py-8">
        <AnimatedView
          key={step.key}
          entering={direction > 0 ? FROM_END : FROM_START}
          className="gap-3.5"
        >
          <Text className="text-center text-sm font-semibold text-muted-foreground">
            Step {index + 1} of {STEPS.length}
          </Text>
          <Text role="heading" className="text-center text-3xl font-semibold">
            {step.title}
          </Text>
          <Text className="text-center text-lg text-muted-foreground">
            {step.description}
          </Text>
          <View className="mt-4 overflow-hidden rounded-xl border border-input bg-background">
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
              className="h-[3.25rem] rounded-none border-transparent bg-transparent px-4 text-[18px]"
            />
          </View>
          {step.key === "password" && value ? (
            <View className="gap-1.5">
              {RULES.map((rule) => {
                const met = rule.test(value)
                return (
                  <View
                    key={rule.label}
                    accessible
                    accessibilityLabel={`${rule.label} ${met ? "(met)" : "(not met)"}`}
                    className="flex-row items-center gap-2"
                  >
                    <View
                      className={cn(
                        "size-4 items-center justify-center rounded-full border-[1.5px]",
                        met
                          ? "border-transparent bg-green-500"
                          : "border-border"
                      )}
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
                            className="size-2.5 text-primary-foreground"
                          />
                        </AnimatedView>
                      ) : null}
                    </View>
                    <Text
                      className={cn(
                        "text-sm",
                        met ? "text-foreground" : "text-muted-foreground"
                      )}
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
        <BottomBarContent className="flex-row justify-center gap-4">
          {index > 0 ? (
            <Button
              size="lg"
              variant="outline"
              className="flex-1"
              onPress={() => go(-1)}
            >
              <Text>Back</Text>
            </Button>
          ) : null}
          <Button
            size="lg"
            disabled={!ready}
            className="flex-1"
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
