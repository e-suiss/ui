import { CheckIcon, EnvelopeSimpleIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, ScrollView, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"

const EMAIL = "jamie@suiss.com"

function VerifyEmail({
  onChangeAddress,
  onOpenMail,
}: {
  onChangeAddress?: () => void
  onOpenMail?: () => void
}) {
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
        <View className="flex-1 items-center justify-center p-6">
          <AnimatedView
            entering={FadeInDown.duration(600).reduceMotion(
              ReduceMotion.System
            )}
            className="items-center gap-3.5"
          >
            <View className="size-[4.75rem] items-center justify-center rounded-full bg-success">
              <Icon
                as={CheckIcon}
                weight="bold"
                className="size-[2.375rem] text-on-accent"
              />
            </View>
            <Text role="heading" className="text-center text-3xl font-semibold">
              Your email is verified.
            </Text>
            <Text className="text-center text-lg text-label-secondary">
              {EMAIL} is now your suiss Account.
            </Text>
            <Pressable
              role="link"
              hitSlop={8}
              onPress={() => setVerified(false)}
              className="active:opacity-60"
            >
              <Text className="text-lg text-link">Start over ›</Text>
            </Pressable>
          </AnimatedView>
        </View>
      </Screen>
    )
  }

  return (
    <Screen>
      <ScrollView contentContainerClassName="grow items-center justify-center px-6 py-8">
        <View className="h-[4.5rem] w-24">
          <View className="absolute inset-0 items-center justify-center rounded-[0.875rem] bg-accent shadow-lg">
            <Icon as={EnvelopeSimpleIcon} className="size-10 text-on-accent" />
          </View>
          <View
            accessible
            accessibilityLabel="1 new message"
            className="absolute -end-2 -top-2 size-[1.625rem] items-center justify-center rounded-full border-[3px] border-surface bg-red"
          >
            <Text className="text-sm font-semibold text-on-accent">1</Text>
          </View>
        </View>
        <Text
          role="heading"
          className="mt-[1.625rem] text-center text-3xl font-semibold"
        >
          Check your inbox.
        </Text>
        <Text className="mt-3 text-center text-lg text-label-secondary">
          We sent a verification link to{" "}
          <Text className="text-lg font-semibold text-label">{EMAIL}</Text>. Tap
          the link to activate your account.
        </Text>
        <View className="mt-[1.625rem] flex-row flex-wrap justify-center gap-x-1">
          <Text className="text-sm text-label-secondary">
            Didn't get it? Check your junk folder or
          </Text>
          <Pressable
            role="link"
            hitSlop={8}
            onPress={onChangeAddress}
            className="active:opacity-60"
          >
            <Text className="text-sm text-link">change the address ›</Text>
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
            <Text className="tabular-nums">
              {left > 0 ? `Sent again · ${left}` : "Resend"}
            </Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export { VerifyEmail }
