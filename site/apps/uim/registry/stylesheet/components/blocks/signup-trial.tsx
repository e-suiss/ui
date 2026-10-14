import { CheckIcon, MusicNotesIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, Pressable, StyleSheet, View } from "react-native"
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
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const EMAIL = /.+@.+\..+/
const UPPERCASE = /[A-Z]/
const LOWERCASE = /[a-z]/
const DIGIT = /\d/
const SYMBOL = /[^A-Za-z0-9]/

const IMAGE =
  "https://images.unsplash.com/photo-1599669454699-248893623440?w=1200&q=80&auto=format&fit=crop"

const LEVELS: (keyof ThemeColors)[] = [
  "red",
  "red",
  "orange",
  "yellow",
  "green",
]

const STRENGTH_LABEL = ["Weak", "Weak", "Fair", "Good", "Strong"]

const strength = (value: string) =>
  [
    value.length >= 8,
    UPPERCASE.test(value) && LOWERCASE.test(value),
    DIGIT.test(value),
    SYMBOL.test(value),
  ].filter(Boolean).length

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
  heading: { ...fontSize["3xl"], fontWeight: "600" },
  hero: { height: 320, justifyContent: "flex-end", overflow: "hidden" },
  image: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
  },
  heroText: { padding: 24, paddingTop: 20 },
  brand: { flexDirection: "row", alignItems: "center", gap: 6 },
  form: { gap: 16, paddingHorizontal: 24, paddingTop: 32 },
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
  meter: { flexDirection: "row", gap: 4 },
  meterBar: { height: 4, flex: 1, borderRadius: radius.full },
  terms: { flexDirection: "row", alignItems: "flex-start", gap: 10 },
  signIn: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 4,
  },
})

function SignupTrial({
  onSignIn,
  onSubmit,
}: {
  onSignIn?: () => void
  onSubmit?: (email: string, password: string) => void
}) {
  const { colors } = useTheme()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = React.useState("")
  const [terms, setTerms] = React.useState(false)
  const [done, setDone] = React.useState(false)
  const score = strength(password)
  const valid = EMAIL.test(email) && score >= 3 && terms
  const onMedia = { color: colors.onMedia }

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
            <Text
              role="heading"
              style={[styles.heading, { textAlign: "center" }]}
            >
              Welcome to suiss Music.
            </Text>
            <Text
              style={{
                ...fontSize.lg,
                textAlign: "center",
                color: colors.labelSecondary,
              }}
            >
              Your one-month free trial has started.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setDone(false)}
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
        <KeyboardScrollView contentContainerStyle={{ paddingBottom: 24 }}>
          <View style={[styles.hero, { backgroundColor: colors.media }]}>
            <Image
              source={{ uri: IMAGE }}
              resizeMode="cover"
              accessibilityIgnoresInvertColors
              style={styles.image}
            />
            <View style={[styles.heroText, { backgroundColor: colors.scrim }]}>
              <View style={styles.brand}>
                <Icon
                  as={MusicNotesIcon}
                  weight="fill"
                  size={26}
                  color={colors.onMedia}
                />
                <Text style={[fontSize["2xl"], { fontWeight: "600" }, onMedia]}>
                  suiss Music
                </Text>
              </View>
              <Text style={[styles.heading, { marginTop: 10 }, onMedia]}>
                Over 100 million songs. Ad-free.
              </Text>
              <Text
                style={[fontSize.base, { marginTop: 8, opacity: 0.8 }, onMedia]}
              >
                1 month free, then $10.99/month.
              </Text>
            </View>
          </View>
          <View style={styles.form}>
            <Text role="heading" style={styles.heading}>
              Start your free trial.
            </Text>
            <View
              style={[
                styles.stack,
                {
                  borderColor: colors.separatorStrong,
                  backgroundColor: colors.surface,
                },
              ]}
            >
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
                style={styles.input}
              />
              <View
                style={{ height: 1, backgroundColor: colors.separatorStrong }}
              />
              <InputAccessoryBarInput
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                accessibilityLabel="Create a password"
                autoComplete="new-password"
                textContentType="newPassword"
                secureTextEntry
                style={styles.input}
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
                style={styles.meter}
              >
                {[0, 1, 2, 3].map((bar) => (
                  <View
                    key={bar}
                    style={[
                      styles.meterBar,
                      {
                        backgroundColor:
                          bar < Math.max(1, score)
                            ? colors[LEVELS[score] ?? "red"]
                            : colors.control,
                      },
                    ]}
                  />
                ))}
              </AnimatedView>
            ) : null}
            <View style={styles.terms}>
              <Checkbox
                checked={terms}
                onCheckedChange={setTerms}
                accessibilityLabelledBy="signup-trial-terms"
                style={{ marginTop: 2 }}
              />
              <View style={{ flex: 1 }}>
                <Label
                  nativeID="signup-trial-terms"
                  onPress={() => setTerms((current) => !current)}
                  style={{
                    ...fontSize.sm,
                    flexShrink: 1,
                    fontWeight: "400",
                    color: colors.labelSecondary,
                  }}
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
          <View style={styles.signIn}>
            <Text style={{ ...fontSize.sm, color: colors.labelSecondary }}>
              Already have an account?
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={onSignIn}
              style={({ pressed }) => pressed && { opacity: 0.6 }}
            >
              <Text style={{ ...fontSize.sm, color: colors.link }}>
                Sign in ›
              </Text>
            </Pressable>
          </View>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { SignupTrial }
