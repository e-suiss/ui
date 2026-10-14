import { cn } from "cn"
import { EnvelopeSimpleIcon, UserIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, View } from "react-native"
import { Button } from "@/components/ui/button"
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerTitle,
} from "@/components/ui/drawer"
import { Icon } from "@/components/ui/icon"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Screen } from "@/components/ui/screen"
import { Spinner } from "@/components/ui/spinner"
import { Text } from "@/components/ui/text"

const EMAIL_OPTIONS: {
  value: "share" | "hide"
  label: string
  hint: string
}[] = [
  { value: "share", label: "Share My Email", hint: "jamie@suiss.com" },
  {
    value: "hide",
    label: "Hide My Email",
    hint: "A unique address that forwards to you",
  },
]

function LoginSheet({
  onContinueWithEmail,
  onContinue,
}: {
  onContinueWithEmail?: () => void
  onContinue?: (email: "share" | "hide") => void
}) {
  const [open, setOpen] = React.useState(false)
  const [email, setEmail] = React.useState<"share" | "hide">("hide")
  const [busy, setBusy] = React.useState(false)
  const [done, setDone] = React.useState(false)

  React.useEffect(() => {
    if (!busy) return
    const timer = setTimeout(() => {
      setBusy(false)
      setOpen(false)
      setDone(true)
    }, 1000)
    return () => clearTimeout(timer)
  }, [busy])

  return (
    <Screen>
      <View className="flex-1 items-center px-7 pt-[5.625rem] pb-[2.125rem]">
        <View className="mb-5 size-[5.25rem] rounded-[1.25rem] bg-green" />
        <Text role="heading" className="text-center text-3xl font-semibold">
          {done ? "Welcome, Jamie" : "Trail Routes"}
        </Text>
        <Text className="mt-2 text-center text-base text-label-secondary">
          {done
            ? "Your account was created with suiss."
            : "Save your routes and share them with friends."}
        </Text>
        <View className="flex-1" />
        {done ? (
          <Pressable
            role="link"
            hitSlop={8}
            onPress={() => setDone(false)}
            className="active:opacity-60"
          >
            <Text className="text-base text-link">Sign out ›</Text>
          </Pressable>
        ) : (
          <View className="w-full gap-2.5">
            <Button
              size="xl"
              block
              onPress={() => setOpen(true)}
              className="h-[3.125rem] bg-label active:bg-label-80"
            >
              <Text className="text-lg font-semibold text-surface">
                Sign in with suiss
              </Text>
            </Button>
            <Button
              size="xl"
              block
              variant="secondary"
              onPress={onContinueWithEmail}
              className="h-[3.125rem]"
            >
              <Text className="text-lg font-semibold">Continue with email</Text>
            </Button>
          </View>
        )}
      </View>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent className="gap-3.5 px-5 pt-3.5 pb-4">
          <View className="flex-row items-center">
            <View className="w-7" />
            <Text className="flex-1 text-center text-lg font-bold">suiss</Text>
            <DrawerClose
              render={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  className="size-7"
                  accessibilityLabel="Close"
                />
              }
            >
              <Icon
                as={XIcon}
                weight="bold"
                className="size-3.5 text-label-secondary"
              />
            </DrawerClose>
          </View>
          <DrawerTitle className="text-2xl font-semibold">
            Use your suiss Account with Trail Routes
          </DrawerTitle>
          <View className="rounded-xl bg-surface-secondary">
            <View className="flex-row items-center gap-3 px-3.5 py-2.5">
              <Icon as={UserIcon} className="size-5 text-label-secondary" />
              <View>
                <Text className="text-xs text-label-secondary">Name</Text>
                <Text className="text-base">Jamie Rivera</Text>
              </View>
            </View>
            <View className="ms-[2.875rem] h-px bg-separator" />
            <RadioGroup
              value={email}
              onValueChange={setEmail}
              accessibilityLabel="Email"
              className="gap-0"
            >
              {EMAIL_OPTIONS.map((option, index) => (
                <Pressable
                  key={option.value}
                  onPress={() => setEmail(option.value)}
                  className={cn(
                    "flex-row items-center gap-3 py-2.5 pe-3.5",
                    index === 0
                      ? "ps-3.5"
                      : "ms-[2.875rem] border-t border-separator"
                  )}
                >
                  {index === 0 ? (
                    <Icon
                      as={EnvelopeSimpleIcon}
                      className="size-5 text-label-secondary"
                    />
                  ) : null}
                  <View className="flex-1">
                    <Text className="text-base">{option.label}</Text>
                    <Text className="text-xs text-label-secondary">
                      {option.hint}
                    </Text>
                  </View>
                  <RadioGroupItem
                    value={option.value}
                    accessibilityLabel={option.label}
                    className="size-[1.375rem]"
                  />
                </Pressable>
              ))}
            </RadioGroup>
          </View>
          <Button
            size="xl"
            block
            onPress={() => {
              onContinue?.(email)
              setBusy(true)
            }}
            disabled={busy}
            className="h-[3.125rem]"
          >
            {busy ? (
              <Spinner size={20} colorClassName="text-on-accent" />
            ) : (
              <Text className="text-lg font-semibold">
                Continue with face scan
              </Text>
            )}
          </Button>
        </DrawerContent>
      </Drawer>
    </Screen>
  )
}

export { LoginSheet }
