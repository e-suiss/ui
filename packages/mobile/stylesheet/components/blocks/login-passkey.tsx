import { CheckIcon, KeyIcon, ScanSmileyIcon } from "phosphor-react-native"
import * as React from "react"
import {
  Pressable,
  ScrollView,
  StyleSheet,
  type TextStyle,
  View,
} from "react-native"
import {
  cancelAnimation,
  FadeInDown,
  ReduceMotion,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"

type Status = "idle" | "scan" | "ok" | "done"

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  done: { alignItems: "center", gap: 14 },
  heading: { ...fontSize["3xl"], textAlign: "center", fontWeight: "600" },
  glyph: { width: 72, height: 72 },
  glyphLayer: {
    position: "absolute",
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    alignItems: "center",
    justifyContent: "center",
  },
  check: {
    position: "absolute",
    top: 6,
    right: 6,
    bottom: 6,
    left: 6,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  scroll: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 24,
    paddingVertical: 32,
  },
  key: {
    width: 72,
    height: 72,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
  },
  account: {
    marginTop: 28,
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderRadius: radius.full,
    paddingVertical: 8,
    paddingStart: 8,
    paddingEnd: 16,
  },
  dialog: {
    width: 260,
    alignItems: "center",
    gap: 14,
    alignSelf: "center",
    borderRadius: radius["3xl"],
    paddingHorizontal: 24,
    paddingTop: 30,
    paddingBottom: 18,
  },
})

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

function ScanGlyph({ verified }: { verified: boolean }) {
  const { colors } = useTheme()
  const pulse = useSharedValue(1)
  const check = useSharedValue(0)

  React.useEffect(() => {
    if (verified) {
      cancelAnimation(pulse)
      pulse.value = withTiming(0, {
        duration: 300,
        reduceMotion: ReduceMotion.System,
      })
      check.value = withSpring(1, {
        damping: 12,
        reduceMotion: ReduceMotion.System,
      })
      return
    }
    check.value = 0
    pulse.value = withRepeat(
      withSequence(
        withTiming(0.4, { duration: 600 }),
        withTiming(1, { duration: 600 })
      ),
      -1,
      false,
      undefined,
      ReduceMotion.System
    )
    return () => cancelAnimation(pulse)
  }, [verified, pulse, check])

  const glyphStyle = useAnimatedStyle(() => ({
    opacity: pulse.value,
    transform: [{ scale: 0.6 + pulse.value * 0.4 }],
  }))

  const checkStyle = useAnimatedStyle(() => ({
    opacity: check.value,
    transform: [{ scale: 0.4 + check.value * 0.6 }],
  }))

  return (
    <View style={styles.glyph}>
      <AnimatedView style={[styles.glyphLayer, glyphStyle]}>
        <Icon as={ScanSmileyIcon} weight="light" size={72} />
      </AnimatedView>
      <AnimatedView
        style={[
          styles.check,
          { backgroundColor: palette.green500 },
          checkStyle,
        ]}
      >
        <Icon
          as={CheckIcon}
          weight="bold"
          size={32}
          color={colors.primaryForeground}
        />
      </AnimatedView>
    </View>
  )
}

function LoginPasskey({
  onChangeAccount,
  onUsePassword,
  onContinue,
}: {
  onChangeAccount?: () => void
  onUsePassword?: () => void
  onContinue?: () => void
}) {
  const { colors } = useTheme()
  const [status, setStatus] = React.useState<Status>("idle")

  React.useEffect(() => {
    if (status !== "scan" && status !== "ok") return
    const timer = setTimeout(
      () => setStatus(status === "scan" ? "ok" : "done"),
      status === "scan" ? 1500 : 900
    )
    return () => clearTimeout(timer)
  }, [status])

  if (status === "done") {
    return (
      <Screen>
        <View style={styles.center}>
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.done}
          >
            <Avatar size="xl" style={{ width: 84, height: 84 }}>
              <AvatarFallback style={{ backgroundColor: palette.indigo500 }}>
                <Text style={fontSize["3xl"]}>JR</Text>
              </AvatarFallback>
            </Avatar>
            <Text role="heading" style={styles.heading}>
              Welcome, Jamie.
            </Text>
            <Text
              style={{
                ...fontSize.lg,
                textAlign: "center",
                color: colors.mutedForeground,
              }}
            >
              You signed in with a passkey. No password needed.
            </Text>
            <LinkText style={fontSize.lg} onPress={() => setStatus("idle")}>
              Sign out ›
            </LinkText>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={[styles.key, { backgroundColor: colors.muted }]}>
          <Icon as={KeyIcon} weight="bold" size={34} color={colors.primary} />
        </View>
        <Text role="heading" style={[styles.heading, { marginTop: 22 }]}>
          Sign in without a password.
        </Text>
        <Text
          style={{
            ...fontSize.xl,
            marginTop: 12,
            textAlign: "center",
            color: colors.mutedForeground,
          }}
        >
          With a passkey, your face or fingerprint is all it takes. Nothing to
          remember, nothing to type.
        </Text>
        <View style={[styles.account, { backgroundColor: colors.muted }]}>
          <Avatar size="sm" style={{ width: 28, height: 28 }}>
            <AvatarFallback style={{ backgroundColor: palette.indigo500 }}>
              JR
            </AvatarFallback>
          </Avatar>
          <Text style={{ ...fontSize.base, flexShrink: 1 }} numberOfLines={1}>
            jamie@example.com
          </Text>
          <LinkText style={fontSize.sm} onPress={onChangeAccount}>
            Change ›
          </LinkText>
        </View>
        <Button
          size="lg"
          onPress={() => {
            onContinue?.()
            setStatus("scan")
          }}
          style={{ marginTop: 22 }}
        >
          <Icon
            as={ScanSmileyIcon}
            size={18}
            color={colors.primaryForeground}
          />
          <Text>Continue with passkey</Text>
        </Button>
        <View style={{ marginTop: 18 }}>
          <LinkText style={fontSize.sm} onPress={onUsePassword}>
            Sign in with password ›
          </LinkText>
        </View>
        <Text
          style={{
            ...fontSize.xs,
            marginTop: 40,
            textAlign: "center",
            color: colors.mutedForeground,
          }}
        >
          Passkeys are end-to-end encrypted and sync across all your devices
          with suiss Keychain.
        </Text>
      </ScrollView>
      <Dialog
        open={status === "scan" || status === "ok"}
        onOpenChange={(open) => {
          if (!open) setStatus("idle")
        }}
      >
        <DialogContent showCloseButton={false} style={styles.dialog}>
          <ScanGlyph verified={status === "ok"} />
          <View style={{ alignItems: "center", gap: 3 }}>
            <DialogTitle
              style={{ ...fontSize.lg, textAlign: "center", fontWeight: "600" }}
            >
              {status === "ok" ? "Verified" : "Face scan"}
            </DialogTitle>
            <DialogDescription
              style={{
                ...fontSize.sm,
                textAlign: "center",
                color: colors.mutedForeground,
              }}
            >
              Passkey for suiss.com
            </DialogDescription>
          </View>
          <DialogClose
            disabled={status === "ok"}
            render={
              <Button
                variant="plain"
                style={status === "ok" ? { opacity: 0 } : undefined}
              />
            }
          >
            <Text style={fontSize.base}>Cancel</Text>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Screen>
  )
}

export { LoginPasskey }
