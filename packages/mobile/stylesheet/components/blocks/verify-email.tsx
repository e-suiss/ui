import { CheckIcon, EnvelopeSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, shadow, useTheme } from "@/components/ui/theme"

const EMAIL = "jamie@suiss.com"

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
  envelope: { height: 72, width: 96 },
  tile: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 14,
  },
  badge: {
    position: "absolute",
    end: -8,
    top: -8,
    width: 26,
    height: 26,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 3,
  },
  footer: {
    marginTop: 26,
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    columnGap: 4,
  },
})

function VerifyEmail({
  onChangeAddress,
  onOpenMail,
}: {
  onChangeAddress?: () => void
  onOpenMail?: () => void
}) {
  const { colors } = useTheme()
  const [verified, setVerified] = React.useState(false)
  const [left, setLeft] = React.useState(0)

  React.useEffect(() => {
    if (left <= 0) return
    const timer = setTimeout(() => setLeft(left - 1), 1000)
    return () => clearTimeout(timer)
  }, [left])

  if (verified) {
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
              Your email is verified.
            </Text>
            <Text style={[styles.lead, { color: colors.labelSecondary }]}>
              {EMAIL} is now your suiss Account.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setVerified(false)}
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
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.envelope}>
          <View
            style={[styles.tile, shadow.lg, { backgroundColor: colors.accent }]}
          >
            <Icon as={EnvelopeSimpleIcon} size={40} color={colors.onAccent} />
          </View>
          <View
            accessible
            accessibilityLabel="1 new message"
            style={[
              styles.badge,
              { borderColor: colors.surface, backgroundColor: colors.red },
            ]}
          >
            <Text
              style={[
                fontSize.sm,
                { fontWeight: "600", color: colors.onAccent },
              ]}
            >
              1
            </Text>
          </View>
        </View>
        <Text role="heading" style={[styles.title, { marginTop: 26 }]}>
          Check your inbox.
        </Text>
        <Text
          style={[styles.lead, { marginTop: 12, color: colors.labelSecondary }]}
        >
          We sent a verification link to{" "}
          <Text
            style={[fontSize.lg, { fontWeight: "600", color: colors.label }]}
          >
            {EMAIL}
          </Text>
          . Tap the link to activate your account.
        </Text>
        <View style={styles.footer}>
          <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
            Didn't get it? Check your junk folder or
          </Text>
          <Pressable
            role="link"
            hitSlop={8}
            onPress={onChangeAddress}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={[fontSize.sm, { color: colors.link }]}>
              change the address ›
            </Text>
          </Pressable>
        </View>
      </ScrollView>
      <BottomBar>
        <BottomBarContent>
          <Button
            size="lg"
            block
            onPress={() => {
              onOpenMail?.()
              setVerified(true)
            }}
          >
            <Text>Open Mail</Text>
          </Button>
          <Button
            size="lg"
            variant="outline"
            block
            disabled={left > 0}
            onPress={() => setLeft(45)}
          >
            <Text style={{ fontVariant: ["tabular-nums"] }}>
              {left > 0 ? `Sent again · ${left}` : "Resend"}
            </Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { VerifyEmail }
