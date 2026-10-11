import {
  ChartBarIcon,
  EnvelopeSimpleIcon,
  GearIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
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
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View className="flex-1 gap-2 px-4 pt-[3.25rem]">
      <Text role="heading" className="text-3xl font-bold">
        {label}
      </Text>
      <Text className="text-lg text-label-secondary">
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
    <KeyboardScrollView contentContainerClassName="gap-5 pt-3 pb-8">
      <HeaderLargeTitle subtitle="Invitees get a link by email.">
        Invite users
      </HeaderLargeTitle>
      <View className="gap-5 px-4">
        <ItemGroup variant="inset">
          <Item size="sm" className="items-start">
            <ItemContent className="w-[5.625rem] flex-none pt-1.5">
              <ItemTitle nativeID="users-invite-email" className="font-normal">
                Email
              </ItemTitle>
            </ItemContent>
            <View className="min-h-[1.875rem] min-w-0 flex-1 flex-row flex-wrap items-center gap-1.5">
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
                className="h-[1.875rem] min-w-[8.75rem] flex-1 border-0 bg-transparent px-0 text-sm"
              />
            </View>
          </Item>
          <ItemSeparator />
          <Item size="sm">
            <ItemContent>
              <ItemTitle className="font-normal">Role</ItemTitle>
            </ItemContent>
            <ItemActions>
              <Picker
                size="sm"
                value={role}
                onValueChange={setRole}
                accessibilityLabel="Role"
                className="bg-transparent px-1"
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
              <ItemTitle
                nativeID="users-invite-welcome"
                className="font-normal"
              >
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
        <View className="flex-row items-center gap-2.5">
          <Text
            accessibilityLiveRegion="polite"
            className="flex-1 text-sm text-label-secondary"
          >
            {emails.length
              ? `${emails.length} ${emails.length === 1 ? "person" : "people"} will be invited as ${role}.`
              : "Type an email and press Enter."}
          </Text>
          <Button size="sm" disabled={!emails.length} onPress={send}>
            <Text>Send Invites</Text>
          </Button>
        </View>
        <Text role="heading" className="-mb-2 px-1 text-sm font-semibold">
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
                {index > 0 ? <ItemSeparator className="ms-14" /> : null}
                <Item size="sm">
                  <ItemMedia className="size-7 rounded-[7px] bg-gray">
                    <Icon
                      as={EnvelopeSimpleIcon}
                      weight="bold"
                      className="size-4 text-on-accent"
                    />
                  </ItemMedia>
                  <ItemContent className="gap-0">
                    <ItemTitle className="text-sm font-normal">
                      {invite.email}
                    </ItemTitle>
                    <ItemDescription className="text-xs">
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
          <Text className="px-1 text-sm text-label-secondary">
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
