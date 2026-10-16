import { cn } from "cn"
import { CheckIcon, KeyIcon, ScanSmileyIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, View } from "react-native"
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

type Status = "idle" | "scan" | "ok" | "done"

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

function ScanGlyph({ verified }: { verified: boolean }) {
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
    <View className="size-18">
      <AnimatedView
        style={glyphStyle}
        className="absolute inset-0 items-center justify-center"
      >
        <Icon as={ScanSmileyIcon} weight="light" className="size-18" />
      </AnimatedView>
      <AnimatedView
        style={checkStyle}
        className="absolute inset-1.5 items-center justify-center rounded-full bg-green-500"
      >
        <Icon
          as={CheckIcon}
          weight="bold"
          className="size-8 text-primary-foreground"
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
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="items-center gap-3.5"
          >
            <Avatar size="xl" className="size-21">
              <AvatarFallback className="bg-indigo-500">
                <Text className="text-3xl">JR</Text>
              </AvatarFallback>
            </Avatar>
            <Text role="heading" className="text-center text-3xl font-semibold">
              Welcome, Jamie.
            </Text>
            <Text className="text-center text-lg text-muted-foreground">
              You signed in with a passkey. No password needed.
            </Text>
            <LinkText className="text-lg" onPress={() => setStatus("idle")}>
              Sign out ›
            </LinkText>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerClassName="grow items-center justify-center px-6 py-8">
        <View className="size-18 items-center justify-center rounded-full bg-muted">
          <Icon as={KeyIcon} weight="bold" className="size-8.5 text-primary" />
        </View>
        <Text
          role="heading"
          className="mt-5.5 text-center text-3xl font-semibold"
        >
          Sign in without a password.
        </Text>
        <Text className="mt-3 text-center text-xl text-muted-foreground">
          With a passkey, your face or fingerprint is all it takes. Nothing to
          remember, nothing to type.
        </Text>
        <View className="mt-7 flex-row items-center gap-2.5 rounded-full bg-muted py-2 ps-2 pe-4">
          <Avatar size="sm" className="size-7">
            <AvatarFallback className="bg-indigo-500">JR</AvatarFallback>
          </Avatar>
          <Text className="shrink text-base" numberOfLines={1}>
            jamie@example.com
          </Text>
          <LinkText className="text-sm" onPress={onChangeAccount}>
            Change ›
          </LinkText>
        </View>
        <Button
          size="lg"
          onPress={() => {
            onContinue?.()
            setStatus("scan")
          }}
          className="mt-5.5"
        >
          <Icon
            as={ScanSmileyIcon}
            className="size-4.5 text-primary-foreground"
          />
          <Text>Continue with passkey</Text>
        </Button>
        <View className="mt-4.5">
          <LinkText className="text-sm" onPress={onUsePassword}>
            Sign in with password ›
          </LinkText>
        </View>
        <Text className="mt-10 text-center text-xs text-muted-foreground">
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
        <DialogContent
          showCloseButton={false}
          className="w-65 items-center gap-3.5 self-center rounded-3xl px-6 pt-7.5 pb-4.5"
        >
          <ScanGlyph verified={status === "ok"} />
          <View className="items-center gap-0.75">
            <DialogTitle className="text-center text-lg font-semibold">
              {status === "ok" ? "Verified" : "Face scan"}
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground">
              Passkey for suiss.com
            </DialogDescription>
          </View>
          <DialogClose
            disabled={status === "ok"}
            render={
              <Button
                variant="plain"
                className={cn(status === "ok" && "opacity-0")}
              />
            }
          >
            <Text className="text-base">Cancel</Text>
          </DialogClose>
        </DialogContent>
      </Dialog>
    </Screen>
  )
}

export { LoginPasskey }
