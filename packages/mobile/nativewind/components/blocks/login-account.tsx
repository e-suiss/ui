import { cn } from "cn"
import { ArrowRightIcon } from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, type TextInput, View } from "react-native"
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

const EMAIL = /.+@.+\..+/

const SHAKE = [-10, 9, -6, 4, 0]

const STEP = { duration: 70, reduceMotion: ReduceMotion.System }

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
  className,
  children,
}: {
  onPress?: () => void
  className?: string
  children: React.ReactNode
}) {
  return (
    <Pressable
      role="link"
      hitSlop={8}
      onPress={onPress}
      className="active:opacity-60"
    >
      <Text className={cn("text-primary", className)}>{children}</Text>
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
  return (
    <Button
      variant="outline"
      size="icon-sm"
      accessibilityLabel="Continue"
      disabled={!ready || busy}
      onPress={onPress}
      className={cn(
        "me-2.5 size-[1.875rem] border-[1.5px] bg-transparent dark:bg-transparent",
        ready && !busy ? "border-muted-foreground" : "border-border"
      )}
    >
      {busy ? (
        <Spinner />
      ) : (
        <Icon
          as={ArrowRightIcon}
          weight="bold"
          className={cn(
            "size-3.5",
            ready ? "text-muted-foreground" : "text-muted-foreground-50",
            I18nManager.isRTL && "rotate-180"
          )}
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
  const [step, setStep] = React.useState<"email" | "password">("email")
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [remember, setRemember] = React.useState(true)
  const [error, setError] = React.useState("")
  const [busy, setBusy] = React.useState(false)
  const [signedIn, setSignedIn] = React.useState(false)
  const passwordRef = React.useRef<React.ComponentRef<typeof TextInput>>(null)
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
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="items-center gap-3.5"
          >
            <Avatar size="xl" className="size-20">
              <AvatarFallback className="bg-muted dark:bg-muted">
                <Text className="text-3xl text-foreground">{email[0]}</Text>
              </AvatarFallback>
            </Avatar>
            <Text role="heading" className="text-3xl font-semibold">
              Hello.
            </Text>
            <Text className="text-lg text-muted-foreground">{email}</Text>
            <LinkText
              className="text-lg"
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
      <KeyboardScrollView contentContainerClassName="grow justify-center px-6 py-8">
        <View className="w-full items-center">
          <Text
            role="heading"
            className="mb-8 text-center text-3xl font-semibold"
          >
            Sign in with your suiss Account
          </Text>
          <AnimatedView
            style={shakeStyle}
            className={cn(
              "w-full overflow-hidden rounded-xl border bg-background",
              error
                ? "border-destructive bg-destructive-5 dark:bg-destructive-10"
                : "border-input"
            )}
          >
            <View className="flex-row items-center">
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
                className="h-14 flex-1 rounded-none border-transparent bg-transparent px-4 text-lg"
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
                className="flex-row items-center border-t border-input"
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
                  className="h-14 flex-1 rounded-none border-transparent bg-transparent px-4 text-lg"
                />
                <SubmitArrow ready={!!password} busy={busy} onPress={submit} />
              </AnimatedView>
            ) : null}
          </AnimatedView>
          <Text
            accessibilityLiveRegion="polite"
            className="mt-2.5 min-h-[1.375rem] text-center text-sm text-destructive"
          >
            {error}
          </Text>
          <View className="mt-1.5 flex-row items-center gap-2">
            <Checkbox
              checked={remember}
              onCheckedChange={setRemember}
              accessibilityLabelledBy="login-account-remember"
            />
            <Label
              nativeID="login-account-remember"
              onPress={() => setRemember((current) => !current)}
              className="text-sm font-normal"
            >
              Remember me
            </Label>
          </View>
          <View className="mt-10 items-center gap-2.5">
            <LinkText className="text-sm" onPress={onForgotPassword}>
              Forgot password? ›
            </LinkText>
            <View className="flex-row flex-wrap justify-center gap-x-1">
              <Text className="text-sm text-muted-foreground">
                Don't have a suiss Account?
              </Text>
              <LinkText className="text-sm" onPress={onCreateAccount}>
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
