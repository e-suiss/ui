import {
  CaretRightIcon,
  CheckIcon,
  CloudIcon,
  CreditCardIcon,
  DeviceMobileIcon,
  KeyIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UserIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, Pressable, StyleSheet, View } from "react-native"
import { FadeIn, FadeInDown, ReduceMotion } from "react-native-reanimated"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Header,
  HeaderBack,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { fontSize, palette, radius, useTheme } from "@/components/ui/theme"

const ITEMS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "personal", label: "Personal Information", icon: UserIcon },
  { value: "security", label: "Sign-In & Security", icon: KeyIcon },
  { value: "payment", label: "Payment & Shipping", icon: CreditCardIcon },
  { value: "subscriptions", label: "Subscriptions", icon: CloudIcon },
  { value: "family", label: "Family Sharing", icon: UsersIcon },
  { value: "devices", label: "Devices", icon: DeviceMobileIcon },
  { value: "privacy", label: "Privacy", icon: ShieldIcon },
]

const styles = StyleSheet.create({
  card: { borderRadius: 18, paddingHorizontal: 20, paddingVertical: 18 },
  cardRow: { flexDirection: "row", alignItems: "center", gap: 12 },
  cardText: { flex: 1, gap: 3 },
  cardTitle: { ...fontSize.lg, fontWeight: "600" },
  editor: { gap: 12, paddingTop: 14 },
  input: {
    fontSize: fontSize.lg.fontSize,
    height: 48,
    borderRadius: radius.xl,
  },
  buttons: { flexDirection: "row", gap: 10 },
  status: { minHeight: 24, flexDirection: "row", alignItems: "center" },
  saved: { flexDirection: "row", alignItems: "center", gap: 6 },
  row: { minHeight: 44, gap: 14, paddingVertical: 10 },
})

type Editable = "email" | "phone"

function EditableCard({
  title,
  value,
  editing,
  onEdit,
  onCancel,
  onSave,
}: {
  title: string
  value: string
  editing: boolean
  onEdit: () => void
  onCancel: () => void
  onSave: (value: string) => void
}) {
  const { colors } = useTheme()
  const [draft, setDraft] = React.useState(value)

  React.useEffect(() => {
    if (editing) setDraft(value)
  }, [editing, value])

  return (
    <View style={[styles.card, { backgroundColor: colors.muted }]}>
      <View style={styles.cardRow}>
        <View style={styles.cardText}>
          <Text role="heading" style={styles.cardTitle}>
            {title}
          </Text>
          {editing ? null : (
            <Text style={[fontSize.base, { color: colors.mutedForeground }]}>
              {value}
            </Text>
          )}
        </View>
        {editing ? null : (
          <Pressable
            role="button"
            hitSlop={8}
            onPress={onEdit}
            accessibilityLabel={`Edit ${title.toLowerCase()}`}
            style={({ pressed }) => pressed && { opacity: 0.6 }}
          >
            <Text style={[fontSize.base, { color: colors.primary }]}>
              Edit ›
            </Text>
          </Pressable>
        )}
      </View>
      {editing ? (
        <AnimatedView
          entering={FadeIn.duration(300).reduceMotion(ReduceMotion.System)}
          style={styles.editor}
        >
          <Input
            autoFocus
            value={draft}
            onChangeText={setDraft}
            accessibilityLabel={title}
            returnKeyType="done"
            onSubmitEditing={() => onSave(draft)}
            style={(state) => [
              styles.input,
              {
                backgroundColor: colors.background,
                borderColor: state.focused ? colors.ring : colors.input,
              },
            ]}
          />
          <View style={styles.buttons}>
            <Button size="sm" onPress={() => onSave(draft)}>
              <Text>Save</Text>
            </Button>
            <Button size="sm" variant="outline" onPress={onCancel}>
              <Text>Cancel</Text>
            </Button>
          </View>
        </AnimatedView>
      ) : null}
    </View>
  )
}

function Security({
  onSave,
}: {
  onSave?: (field: Editable, value: string) => void
}) {
  const { colors, isDark } = useTheme()
  const [values, setValues] = React.useState<Record<Editable, string>>({
    email: "jamie@example.com",
    phone: "+1 (415) 555-0142",
  })
  const [editing, setEditing] = React.useState<Editable | null>(null)
  const [passkeys, setPasskeys] = React.useState(true)
  const [saved, setSaved] = React.useState<string | null>(null)

  React.useEffect(() => {
    if (!saved) return
    const timer = setTimeout(() => setSaved(null), 2200)
    return () => clearTimeout(timer)
  }, [saved])

  const cards: { field: Editable; title: string }[] = [
    { field: "email", title: "Email & phone" },
    { field: "phone", title: "Trusted phone number" },
  ]

  const card = [styles.card, styles.cardRow, { backgroundColor: colors.muted }]

  return (
    <View style={{ gap: 14 }}>
      {cards.map((item) => (
        <EditableCard
          key={item.field}
          title={item.title}
          value={values[item.field]}
          editing={editing === item.field}
          onEdit={() => setEditing(item.field)}
          onCancel={() => setEditing(null)}
          onSave={(value) => {
            onSave?.(item.field, value)
            setValues((current) => ({ ...current, [item.field]: value }))
            setEditing(null)
            setSaved(item.title)
          }}
        />
      ))}
      <View style={card}>
        <View style={styles.cardText}>
          <Text nativeID="settings-account-passkeys" style={styles.cardTitle}>
            Passkeys
          </Text>
          <Text style={[fontSize.base, { color: colors.mutedForeground }]}>
            {passkeys ? "On for 3 devices" : "Off"}
          </Text>
        </View>
        <Switch
          checked={passkeys}
          onCheckedChange={setPasskeys}
          accessibilityLabelledBy="settings-account-passkeys"
        />
      </View>
      <View style={card}>
        <View style={styles.cardText}>
          <Text role="heading" style={styles.cardTitle}>
            Two-factor authentication
          </Text>
          <Text style={[fontSize.base, { color: colors.mutedForeground }]}>
            Codes are sent to your trusted devices.
          </Text>
        </View>
        <Text
          style={[
            fontSize.sm,
            {
              fontWeight: "600",
              color: isDark ? palette.green400 : palette.green600,
            },
          ]}
        >
          On
        </Text>
      </View>
      <View accessibilityLiveRegion="polite" style={styles.status}>
        {saved ? (
          <AnimatedView
            entering={FadeInDown.duration(400).reduceMotion(
              ReduceMotion.System
            )}
            style={styles.saved}
          >
            <Icon
              as={CheckIcon}
              weight="bold"
              size={16}
              color={isDark ? palette.green400 : palette.green600}
            />
            <Text style={fontSize.sm}>{saved} saved.</Text>
          </AnimatedView>
        ) : null}
      </View>
    </View>
  )
}

function SettingsAccount({
  onSave,
}: {
  onSave?: (field: "email" | "phone", value: string) => void
}) {
  const { colors } = useTheme()
  const [section, setSection] = React.useState<string | null>("security")
  const scroll = useHeaderScroll()
  const current = ITEMS.find((item) => item.value === section)

  return (
    <Screen edges={["top", "right", "left"]}>
      <Header scroll={scroll}>
        {current ? (
          <HeaderBack onPress={() => setSection(null)}>Account</HeaderBack>
        ) : null}
        <HeaderTitle>{current ? current.label : "Account"}</HeaderTitle>
      </Header>
      <HeaderScrollView key={section ?? "account"} scroll={scroll}>
        {current ? (
          <>
            <HeaderLargeTitle>{current.label}</HeaderLargeTitle>
            <AnimatedView
              entering={FadeInDown.duration(600).reduceMotion(
                ReduceMotion.System
              )}
              style={{ paddingHorizontal: 16, paddingTop: 8 }}
            >
              {current.value === "security" ? (
                <Security onSave={onSave} />
              ) : (
                <Text style={[fontSize.lg, { color: colors.mutedForeground }]}>
                  This section isn't part of the sample. Choose Sign-In &
                  Security.
                </Text>
              )}
            </AnimatedView>
          </>
        ) : (
          <>
            <HeaderLargeTitle style={{ gap: 8, paddingBottom: 16 }}>
              <Avatar size="xl" style={{ width: 72, height: 72 }}>
                <AvatarFallback style={{ backgroundColor: palette.indigo500 }}>
                  JR
                </AvatarFallback>
              </Avatar>
              <Text
                role="heading"
                style={[fontSize["2xl"], { fontWeight: "600" }]}
              >
                Jamie Rivera
              </Text>
              <Text style={[fontSize.sm, { color: colors.mutedForeground }]}>
                jamie@example.com
              </Text>
            </HeaderLargeTitle>
            <View style={{ paddingHorizontal: 16 }}>
              <ItemGroup variant="inset">
                {ITEMS.map((item, index) => (
                  <React.Fragment key={item.value}>
                    {index > 0 ? (
                      <ItemSeparator style={{ marginStart: 50 }} />
                    ) : null}
                    <Item
                      size="sm"
                      onPress={() => setSection(item.value)}
                      style={styles.row}
                    >
                      <ItemMedia>
                        <Icon as={item.icon} size={20} color={colors.primary} />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle style={{ fontWeight: "400" }}>
                          {item.label}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Icon
                          as={CaretRightIcon}
                          weight="bold"
                          size={14}
                          color={colors.mutedForeground}
                          style={
                            I18nManager.isRTL
                              ? { transform: [{ rotate: "180deg" }] }
                              : undefined
                          }
                        />
                      </ItemActions>
                    </Item>
                  </React.Fragment>
                ))}
              </ItemGroup>
            </View>
          </>
        )}
        <View style={{ height: 32 }} />
      </HeaderScrollView>
    </Screen>
  )
}

export { SettingsAccount }
