import { cn } from "cn"
import { CheckIcon, MusicNotesIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Icon } from "@/components/ui/icon"
import {
  InputAccessoryBar,
  InputAccessoryBarInput,
} from "@/components/ui/input-accessory-bar"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Label } from "@/components/ui/label"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/
const SYMBOL = /[^A-Za-z0-9]/

const IMAGE =
  "https://images.unsplash.com/photo-1599669454699-248893623440?w=1200&q=80&auto=format&fit=crop"

const LEVELS = [
  "bg-red-500",
  "bg-red-500",
  "bg-orange-500",
  "bg-yellow-500",
  "bg-green-500",
]

const STRENGTH_LABEL = ["Weak", "Weak", "Fair", "Good", "Strong"]

const INPUT_CLASS =
  "h-[3.25rem] rounded-none border-transparent bg-transparent px-4 text-lg"

const strength = (value: string) =>
  [
    value.length >= 8,
    UPPERCASE.test(value) && LOWERCASE.test(value),
    DIGIT.test(value),
    SYMBOL.test(value),
  ].filter(Boolean).length

function SignupTrial({
  onSignIn,
  onSubmit,
}: {
  onSignIn?: () => void
  onSubmit?: (email: string, password: string) => void
}) {
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const score = strength(password)
  const valid = EMAIL.test(email) && score >= 3 && terms

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
              Welcome to suiss Music.
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              Your one-month free trial has started.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setDone(false)}
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
        <KeyboardScrollView contentContainerClassName="pb-6">
          <View className="h-80 justify-end overflow-hidden bg-black">
            <Image
              source={{ uri: IMAGE }}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              className="absolute inset-0 size-full"
            />
            <View className="bg-black/50 p-6 pt-5">
              <View className="flex-row items-center gap-1.5">
                <Icon
                  as={MusicNotesIcon}
                  weight="fill"
                  className="size-[1.625rem] text-white"
                />
                <Text className="text-2xl font-semibold text-white">
                  suiss Music
                </Text>
              </View>
              <Text className="mt-2.5 text-3xl font-semibold text-white">
                Over 100 million songs. Ad-free.
              </Text>
              <Text className="mt-2 text-base text-white opacity-80">
                1 month free, then $10.99/month.
              </Text>
            </View>
          </View>
          <View className="gap-4 px-6 pt-8">
            <Text role="heading" className="text-3xl font-semibold">
              Start your free trial.
            </Text>
            <View className="overflow-hidden rounded-xl border border-input bg-background">
              <InputAccessoryBarInput
                value={email}
                onChangeText={setEmail}
                placeholder="suiss Account email"
                accessibilityLabel="suiss Account email"
                autoComplete="email"
                textContentType="emailAddress"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className={INPUT_CLASS}
              />
              <View className="h-px bg-input" />
              <InputAccessoryBarInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                accessibilityLabel="Create a password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                className={INPUT_CLASS}
              />
            </View>
            {password ? (
              <AnimatedView
                entering={FadeIn.duration(400).reduceMotion(
                  ReduceMotion.System
                )}
                accessible
                accessibilityRole="progressbar"
                accessibilityLabel="Password strength"
                accessibilityValue={{
                  min: 0,
                  max: 4,
                  now: score,
                  text: STRENGTH_LABEL[score],
                }}
                className="flex-row gap-1"
              >
                {[0, 1, 2, 3].map((bar) => (
                  <View
                    key={bar}
                    className={cn(
                      "h-1 flex-1 rounded-full",
                      bar < Math.max(1, score) ? LEVELS[score] : "bg-secondary"
                    )}
                  />
                ))}
              </AnimatedView>
            ) : null}
            <View className="flex-row items-start gap-2.5">
              <Checkbox
                checked={terms}
                onCheckedChange={setTerms}
                accessibilityLabelledBy="signup-trial-terms"
                className="mt-0.5"
              />
              <View className="flex-1">
                <Label
                  nativeID="signup-trial-terms"
                  onPress={() => setTerms((current) => !current)}
                  className="shrink text-sm font-normal text-muted-foreground"
                >
                  I have read and agree to the suiss Media Services Terms and
                  Conditions.
                </Label>
              </View>
            </View>
          </View>
        </KeyboardScrollView>
      </InputAccessoryBar>
      <BottomBar separator>
        <BottomBarContent>
          <Button
            size="lg"
            block
            disabled={!valid}
            onPress={() => {
              if (!valid) return
              onSubmit?.(email, password)
              setDone(true)
            }}
          >
            <Text>Start free trial</Text>
          </Button>
          <View className="flex-row flex-wrap justify-center gap-x-1">
            <Text className="text-sm text-muted-foreground">
              Already have an account?
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={onSignIn}
              className="active:opacity-60"
            >
              <Text className="text-sm text-primary">Sign in ›</Text>
            </Pressable>
          </View>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { SignupTrial }
