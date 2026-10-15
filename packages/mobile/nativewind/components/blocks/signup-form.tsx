import { cn } from "cn"
import { CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
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

const STACK_CLASS =
  "overflow-hidden rounded-xl border border-input bg-background"

const INPUT_CLASS =
  "h-[3.25rem] rounded-none border-transparent bg-transparent px-4 text-lg"

const strength = (value: string) =>
  RULES.filter((rule) => rule.test(value)).length + (SYMBOL.test(value) ? 1 : 0)

function PasswordRules({ password }: { password: string }) {
  return (
    <View className="gap-1.5">
      {RULES.map((rule) => {
        const met = rule.test(password)
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
                met ? "border-transparent bg-green-500" : "border-border"
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
  )
}

function Legend({ children }: { children: React.ReactNode }) {
  return (
    <Text role="heading" className="mb-2 text-sm font-semibold">
      {children}
    </Text>
  )
}

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
              Your suiss Account is ready.
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              We sent a verification code to {form.email}.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => {
                setDone(false)
                setTried(false)
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
      <InputAccessoryBar>
        <KeyboardScrollView contentContainerClassName="px-6 pt-9 pb-6">
          <Text role="heading" className="text-center text-3xl font-semibold">
            Create your suiss Account
          </Text>
          <Text className="mt-2.5 text-center text-lg text-muted-foreground">
            One suiss Account is all you need to access every suiss service.{" "}
            <Text
              role="link"
              className="text-lg text-primary"
              onPress={onLearnMore}
            >
              Learn more ›
            </Text>
          </Text>
          <View className="mt-[1.375rem]">
            <Legend>Your name</Legend>
            <View className="flex-row gap-3">
              <View className={cn(STACK_CLASS, "flex-1")}>
                <InputAccessoryBarInput
                  value={form.first}
                  onChangeText={update("first")}
                  placeholder="First name"
                  accessibilityLabel="First name"
                  autoComplete="given-name"
                  textContentType="givenName"
                  className={INPUT_CLASS}
                />
              </View>
              <View className={cn(STACK_CLASS, "flex-1")}>
                <InputAccessoryBarInput
                  value={form.last}
                  onChangeText={update("last")}
                  placeholder="Last name"
                  accessibilityLabel="Last name"
                  autoComplete="family-name"
                  textContentType="familyName"
                  className={INPUT_CLASS}
                />
              </View>
            </View>
          </View>
          <View className="mt-[1.375rem]">
            <Legend>Country or region and birthday</Legend>
            <View className={STACK_CLASS}>
              <Picker
                value={form.country}
                onValueChange={update("country")}
                accessibilityLabel="Country or region"
                className="h-[3.25rem] w-full self-stretch rounded-none border-transparent bg-transparent ps-4"
              >
                {COUNTRIES.map((country) => (
                  <PickerItem key={country} value={country}>
                    {country}
                  </PickerItem>
                ))}
              </Picker>
              <View className="h-px bg-input" />
              <InputAccessoryBarInput
                value={form.birthday}
                onChangeText={update("birthday")}
                placeholder="Birthday (MM/DD/YYYY)"
                accessibilityLabel="Birthday"
                autoComplete="birthdate-full"
                keyboardType="numbers-and-punctuation"
                className={INPUT_CLASS}
              />
            </View>
          </View>
          <View className="mt-[1.375rem]">
            <Legend>suiss Account</Legend>
            <View className={STACK_CLASS}>
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
                className={INPUT_CLASS}
              />
            </View>
            <Text className="mt-1.5 text-xs text-muted-foreground">
              This will be your new suiss Account.
            </Text>
          </View>
          <View className="mt-[1.375rem]">
            <Legend>Password</Legend>
            <View
              className={cn(
                STACK_CLASS,
                mismatch &&
                  "border-destructive bg-destructive-5 dark:bg-destructive-10"
              )}
            >
              <InputAccessoryBarInput
                value={form.password}
                onChangeText={update("password")}
                placeholder="Password"
                accessibilityLabel="Password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                className={INPUT_CLASS}
              />
              <View
                className={cn("h-px", mismatch ? "bg-destructive" : "bg-input")}
              />
              <InputAccessoryBarInput
                value={form.confirm}
                onChangeText={update("confirm")}
                placeholder="Confirm password"
                accessibilityLabel="Confirm password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                className={INPUT_CLASS}
              />
            </View>
            {form.password ? (
              <AnimatedView
                entering={FadeIn.duration(300).reduceMotion(
                  ReduceMotion.System
                )}
                className="px-1 pt-3.5"
              >
                <PasswordRules password={form.password} />
              </AnimatedView>
            ) : null}
          </View>
          <Text
            accessibilityLiveRegion="polite"
            className="mt-3.5 min-h-5 text-center text-sm text-destructive"
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
