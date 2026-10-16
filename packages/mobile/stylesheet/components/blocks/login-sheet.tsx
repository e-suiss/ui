import { EnvelopeSimpleIcon, UserIcon, XIcon } from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
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
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"

const EMAIL_OPTIONS: {
  value: "share" | "hide"
  label: string
  hint: string
}[] = [
  { value: "share", label: "Share My Email", hint: "jamie@example.com" },
  {
    value: "hide",
    label: "Hide My Email",
    hint: "A unique address that forwards to you",
  },
]

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

const styles = StyleSheet.create({
  body: {
    flex: 1,
    alignItems: "center",
    paddingHorizontal: 28,
    paddingTop: 90,
    paddingBottom: 34,
  },
  appIcon: {
    marginBottom: 20,
    width: 84,
    height: 84,
    borderRadius: 20,
  },
  title: { ...fontSize["3xl"], textAlign: "center", fontWeight: "600" },
  actions: { width: "100%", gap: 10 },
  button: { height: 50 },
  buttonText: { ...fontSize.lg, fontWeight: "600" },
  sheet: {
    gap: 14,
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
  },
  sheetHeader: { flexDirection: "row", alignItems: "center" },
  brand: {
    ...fontSize.lg,
    flex: 1,
    textAlign: "center",
    fontWeight: "700",
  },
  close: { width: 28, height: 28 },
  card: { borderRadius: radius.xl },
  nameRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  option: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingVertical: 10,
    paddingEnd: 14,
  },
  radio: { width: 22, height: 22 },
})

function LoginSheet({
  onContinueWithEmail,
  onContinue,
}: {
  onContinueWithEmail?: () => void
  onContinue?: (email: "share" | "hide") => void
}) {
  const { colors } = useTheme()
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

  const secondary = { color: colors.mutedForeground }

  return (
    <Screen>
      <View style={styles.body}>
        <View style={[styles.appIcon, { backgroundColor: palette.green500 }]} />
        <Text role="heading" style={styles.title}>
          {done ? "Welcome, Jamie" : "Trail Routes"}
        </Text>
        <Text
          style={[
            fontSize.base,
            { marginTop: 8, textAlign: "center" },
            secondary,
          ]}
        >
          {done
            ? "Your account was created with suiss."
            : "Save your routes and share them with friends."}
        </Text>
        <View style={{ flex: 1 }} />
        {done ? (
          <Pressable
            role="link"
            hitSlop={8}
            onPress={() => setDone(false)}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={[fontSize.base, { color: colors.primary }]}>
              Sign out ›
            </Text>
          </Pressable>
        ) : (
          <View style={styles.actions}>
            <Button
              size="xl"
              block
              onPress={() => setOpen(true)}
              style={({ pressed }) => [
                styles.button,
                {
                  backgroundColor: pressed
                    ? withAlpha(colors.foreground, 0.8)
                    : colors.foreground,
                },
              ]}
            >
              <Text style={[styles.buttonText, { color: colors.background }]}>
                Sign in with suiss
              </Text>
            </Button>
            <Button
              size="xl"
              block
              variant="secondary"
              onPress={onContinueWithEmail}
              style={styles.button}
            >
              <Text style={styles.buttonText}>Continue with email</Text>
            </Button>
          </View>
        )}
      </View>
      <Drawer open={open} onOpenChange={setOpen}>
        <DrawerContent style={styles.sheet}>
          <View style={styles.sheetHeader}>
            <View style={{ width: 28 }} />
            <Text style={styles.brand}>suiss</Text>
            <DrawerClose
              render={
                <Button
                  variant="secondary"
                  size="icon-sm"
                  style={styles.close}
                  accessibilityLabel="Close"
                />
              }
            >
              <Icon
                as={XIcon}
                weight="bold"
                size={14}
                color={colors.mutedForeground}
              />
            </DrawerClose>
          </View>
          <DrawerTitle style={{ ...fontSize["2xl"], fontWeight: "600" }}>
            Use your suiss Account with Trail Routes
          </DrawerTitle>
          <View style={[styles.card, { backgroundColor: colors.muted }]}>
            <View style={styles.nameRow}>
              <Icon as={UserIcon} size={20} color={colors.mutedForeground} />
              <View>
                <Text style={[fontSize.xs, secondary]}>Name</Text>
                <Text style={fontSize.base}>Jamie Rivera</Text>
              </View>
            </View>
            <View
              style={{
                marginStart: 46,
                height: 1,
                backgroundColor: colors.border,
              }}
            />
            <RadioGroup
              value={email}
              onValueChange={setEmail}
              accessibilityLabel="Email"
              style={{ gap: 0 }}
            >
              {EMAIL_OPTIONS.map((option, index) => (
                <Pressable
                  key={option.value}
                  onPress={() => setEmail(option.value)}
                  style={[
                    styles.option,
                    index === 0
                      ? { paddingStart: 14 }
                      : {
                          marginStart: 46,
                          borderTopWidth: 1,
                          borderTopColor: colors.border,
                        },
                  ]}
                >
                  {index === 0 ? (
                    <Icon
                      as={EnvelopeSimpleIcon}
                      size={20}
                      color={colors.mutedForeground}
                    />
                  ) : null}
                  <View style={{ flex: 1 }}>
                    <Text style={fontSize.base}>{option.label}</Text>
                    <Text style={[fontSize.xs, secondary]}>{option.hint}</Text>
                  </View>
                  <RadioGroupItem
                    value={option.value}
                    accessibilityLabel={option.label}
                    style={styles.radio}
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
            style={styles.button}
          >
            {busy ? (
              <Spinner size={20} color={colors.primaryForeground} />
            ) : (
              <Text style={styles.buttonText}>Continue with face scan</Text>
            )}
          </Button>
        </DrawerContent>
      </Drawer>
    </Screen>
  )
}

export { LoginSheet }
