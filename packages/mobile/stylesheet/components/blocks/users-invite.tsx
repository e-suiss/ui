import {
  ChartBarIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { Picker, PickerItem } from "@/components/patterns/picker"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Chip } from "@/components/ui/chip"
import { HeaderLargeTitle } from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Input } from "@/components/ui/input"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { KeyboardScrollView } from "@/components/ui/keyboard-scroll-view"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import { fontSize, palette, useTheme } from "@/components/ui/theme"
import { createToastManager, Toaster } from "@/components/ui/toast"

const EMAIL = /.+@.+\..+/
const TRAILING_SEPARATOR = /[, ]$/
const TRAILING_COMMA = /,$/

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const ROLES = ["Admin", "Editor", "Support", "Viewer"]

const toasts = createToastManager()

type Invite = { email: string; role: string; sent: string }

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  scroll: { gap: 20, paddingTop: 12, paddingBottom: 32 },
  body: { gap: 20, paddingHorizontal: 16 },
  top: { alignItems: "flex-start" },
  label: { width: 90, flex: 0, paddingTop: 6 },
  regular: { fontWeight: "400" },
  emails: {
    minHeight: 30,
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 6,
  },
  input: {
    ...fontSize.sm,
    height: 30,
    minWidth: 140,
    flex: 1,
    borderWidth: 0,
    backgroundColor: "transparent",
    paddingHorizontal: 0,
  },
  picker: { backgroundColor: "transparent", paddingHorizontal: 4 },
  footer: { flexDirection: "row", alignItems: "center", gap: 10 },
  summary: { ...fontSize.sm, flex: 1 },
  heading: {
    ...fontSize.sm,
    marginBottom: -8,
    paddingHorizontal: 4,
    fontWeight: "600",
  },
  separator: { marginStart: 56 },
  media: { width: 28, height: 28, borderRadius: 7 },
  tight: { gap: 0 },
  email: { ...fontSize.sm, fontWeight: "400" },
  empty: { ...fontSize.sm, paddingHorizontal: 4 },
})

function AdminTabBar({
  value,
  onValueChange,
}: {
  value: string
  onValueChange: (value: string) => void
}) {
  return (
    <TabBar value={value} onValueChange={(next) => onValueChange(next)}>
      <TabBarList>
        {SECTIONS.map((section) => (
          <TabBarItem
            key={section.value}
            value={section.value}
            icon={section.icon}
          >
            {section.label}
          </TabBarItem>
        ))}
      </TabBarList>
    </TabBar>
  )
}

function OtherSection({ value, home }: { value: string; home: string }) {
  const { colors } = useTheme()
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View style={styles.other}>
      <Text role="heading" style={styles.otherTitle}>
        {label}
      </Text>
      <Text style={[fontSize.lg, { color: colors.mutedForeground }]}>
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function InviteForm({
  onInvite,
  onResend,
  onCancelInvite,
}: {
  onInvite?: (emails: string[], role: string, welcome: boolean) => void
  onResend?: (email: string) => void
  onCancelInvite?: (email: string) => void
}) {
  const { colors } = useTheme()
  const [emails, setEmails] = React.useState(["avery@company.com"])
  const [draft, setDraft] = React.useState("")
  const [role, setRole] = React.useState("Editor")
  const [welcome, setWelcome] = React.useState(true)
  const [pending, setPending] = React.useState<Invite[]>([
    { email: "casey@company.com", role: "Support", sent: "2 days ago" },
    { email: "drew@company.com", role: "Viewer", sent: "5 days ago" },
  ])

  const commit = (value: string) => {
    const email = value.trim().replace(TRAILING_COMMA, "")
    if (EMAIL.test(email) && !emails.includes(email))
      setEmails((current) => [...current, email])
    setDraft("")
  }

  const send = () => {
    onInvite?.(emails, role, welcome)
    setPending((current) => [
      ...emails.map((email) => ({ email, role, sent: "Just now" })),
      ...current,
    ])
    toasts.add({
      title: `${emails.length} ${emails.length === 1 ? "invitation" : "invitations"} sent`,
      type: "success",
    })
    setEmails([])
  }

  return (
    <KeyboardScrollView contentContainerStyle={styles.scroll}>
      <HeaderLargeTitle subtitle="Invitees get a link by email.">
        Invite users
      </HeaderLargeTitle>
      <View style={styles.body}>
        <ItemGroup variant="inset">
          <Item size="sm" style={styles.top}>
            <ItemContent style={styles.label}>
              <ItemTitle nativeID="users-invite-email" style={styles.regular}>
                Email
              </ItemTitle>
            </ItemContent>
            <View style={styles.emails}>
              {emails.map((email) => (
                <Chip
                  key={email}
                  size="sm"
                  selected={false}
                  onRemove={() =>
                    setEmails((current) =>
                      current.filter((item) => item !== email)
                    )
                  }
                  removeLabel={`Remove ${email}`}
                >
                  {email}
                </Chip>
              ))}
              <Input
                value={draft}
                onChangeText={(value) => {
                  if (TRAILING_SEPARATOR.test(value)) commit(value)
                  else setDraft(value)
                }}
                onKeyPress={(event) => {
                  if (event.nativeEvent.key === "Backspace" && !draft)
                    setEmails((current) => current.slice(0, -1))
                }}
                onSubmitEditing={() => commit(draft)}
                onBlur={() => {
                  if (draft) commit(draft)
                }}
                submitBehavior="submit"
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                autoComplete="email"
                placeholder={emails.length ? "Add another" : "name@company.com"}
                accessibilityLabelledBy="users-invite-email"
                style={styles.input}
              />
            </View>
          </Item>
          <ItemSeparator />
          <Item size="sm">
            <ItemContent>
              <ItemTitle style={styles.regular}>Role</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Picker
                size="sm"
                value={role}
                onValueChange={setRole}
                accessibilityLabel="Role"
                style={styles.picker}
              >
                {ROLES.map((item) => (
                  <PickerItem key={item} value={item}>
                    {item}
                  </PickerItem>
                ))}
              </Picker>
            </ItemActions>
          </Item>
          <ItemSeparator />
          <Item size="sm">
            <ItemContent>
              <ItemTitle nativeID="users-invite-welcome" style={styles.regular}>
                Send welcome email
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch
                checked={welcome}
                onCheckedChange={setWelcome}
                accessibilityLabelledBy="users-invite-welcome"
              />
            </ItemActions>
          </Item>
        </ItemGroup>
        <View style={styles.footer}>
          <Text
            accessibilityLiveRegion="polite"
            style={[styles.summary, { color: colors.mutedForeground }]}
          >
            {emails.length
              ? `${emails.length} ${emails.length === 1 ? "person" : "people"} will be invited as ${role}.`
              : "Type an email and press Enter."}
          </Text>
          <Button size="sm" disabled={!emails.length} onPress={send}>
            <Text>Send Invites</Text>
          </Button>
        </View>
        <Text role="heading" style={styles.heading}>
          Pending invitations
        </Text>
        {pending.length > 0 ? (
          <ItemGroup variant="inset">
            {pending.map((invite, index) => (
              <AnimatedView
                key={invite.email}
                entering={FadeInDown.duration(700).reduceMotion(
                  ReduceMotion.System
                )}
              >
                {index > 0 ? <ItemSeparator style={styles.separator} /> : null}
                <Item size="sm">
                  <ItemMedia
                    style={[styles.media, { backgroundColor: palette.zinc500 }]}
                  >
                    <Icon
                      as={EnvelopeSimpleIcon}
                      weight="bold"
                      size={16}
                      color={colors.primaryForeground}
                    />
                  </ItemMedia>
                  <ItemContent style={styles.tight}>
                    <ItemTitle style={styles.email}>{invite.email}</ItemTitle>
                    <ItemDescription style={fontSize.xs}>
                      {`${invite.role} · ${invite.sent}`}
                    </ItemDescription>
                  </ItemContent>
                  <ItemActions>
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => {
                        onResend?.(invite.email)
                        toasts.add({
                          title: `Resent to ${invite.email}`,
                          type: "success",
                        })
                      }}
                    >
                      <Text>Resend</Text>
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onPress={() => {
                        onCancelInvite?.(invite.email)
                        setPending((current) =>
                          current.filter((item) => item.email !== invite.email)
                        )
                      }}
                    >
                      <Text>Cancel</Text>
                    </Button>
                  </ItemActions>
                </Item>
              </AnimatedView>
            ))}
          </ItemGroup>
        ) : (
          <Text style={[styles.empty, { color: colors.mutedForeground }]}>
            No pending invitations.
          </Text>
        )}
      </View>
    </KeyboardScrollView>
  )
}

function UsersInvite({
  onInvite,
  onResend,
  onCancelInvite,
  onNavigate,
}: {
  onInvite?: (emails: string[], role: string, welcome: boolean) => void
  onResend?: (email: string) => void
  onCancelInvite?: (email: string) => void
  onNavigate?: (section: string) => void
}) {
  const [section, setSection] = React.useState("users")

  return (
    <Toaster toastManager={toasts}>
      <Screen edges={["top", "right", "left"]}>
        {section === "users" ? (
          <InviteForm
            onInvite={onInvite}
            onResend={onResend}
            onCancelInvite={onCancelInvite}
          />
        ) : (
          <OtherSection value={section} home="Users" />
        )}
        <AdminTabBar
          value={section}
          onValueChange={(value) => {
            setSection(value)
            onNavigate?.(value)
          }}
        />
      </Screen>
    </Toaster>
  )
}

export { UsersInvite }
