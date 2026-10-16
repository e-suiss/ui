import {
  ChartBarIcon,
  DesktopIcon,
  DeviceMobileIcon,
  GearIcon,
  GlobeIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, useWindowDimensions, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import { Picker, PickerItem } from "@/components/patterns/picker"
import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
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
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const ROLES = ["Admin", "Editor", "Support", "Viewer"]

const TABS = ["Profile", "Sessions", "Security"]

type Tint = Tone

type User = {
  name: string
  email: string
  role: string
  status: string
  tint: Tint
}

const USERS: User[] = [
  {
    name: "Jamie Rivera",
    email: "jamie@example.com",
    role: "Admin",
    status: "Active",
    tint: "indigo500",
  },
  {
    name: "Morgan Lee",
    email: "morgan@example.com",
    role: "Editor",
    status: "Active",
    tint: "orange500",
  },
  {
    name: "Riley Chen",
    email: "riley@example.com",
    role: "Support",
    status: "Active",
    tint: "green500",
  },
  {
    name: "Taylor Kim",
    email: "taylor@example.com",
    role: "Viewer",
    status: "Suspended",
    tint: "cyan500",
  },
  {
    name: "Avery Brooks",
    email: "avery@example.com",
    role: "Editor",
    status: "Invited",
    tint: "pink500",
  },
  {
    name: "Jordan Park",
    email: "jordan@example.com",
    role: "Support",
    status: "Active",
    tint: "teal400",
  },
]

type Session = {
  device: string
  place: string
  time: string
  icon: PhosphorIcon
}

const INITIAL_SESSIONS: Session[] = [
  {
    device: "Book Pro · Browser",
    place: "San Francisco, US",
    time: "Now",
    icon: DesktopIcon,
  },
  {
    device: "Phone Pro · App",
    place: "San Francisco, US",
    time: "2 hr ago",
    icon: DeviceMobileIcon,
  },
  {
    device: "Desktop · Browser",
    place: "Seattle, US",
    time: "3 days ago",
    icon: GlobeIcon,
  },
]

const SECURITY = [
  { label: "Two-factor authentication", initial: true },
  { label: "Require passkey", initial: false },
  { label: "Sign-in alerts", initial: true },
]

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  wideRoot: { margin: 16 },
  listWide: { gap: 2, paddingHorizontal: 16, paddingTop: 20 },
  compact: { paddingHorizontal: 16, paddingBottom: 32 },
  detailWide: { padding: 24 },
  listHeading: {
    ...fontSize.sm,
    paddingHorizontal: 4,
    paddingBottom: 8,
    fontWeight: "600",
  },
  listItem: { paddingVertical: 6 },
  listRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  listText: { minWidth: 0, flex: 1 },
  smallAvatar: { width: 28, height: 28 },
  detail: { gap: 20 },
  profile: { flexDirection: "row", alignItems: "center", gap: 14 },
  profileText: { minWidth: 0, flex: 1, gap: 2 },
  name: { ...fontSize["2xl"], fontWeight: "700" },
  tab: { paddingHorizontal: 16 },
  panel: { gap: 12 },
  regular: { fontWeight: "400" },
  shrink: { flexShrink: 1 },
  picker: { backgroundColor: "transparent", paddingHorizontal: 4 },
  sessionSeparator: { marginStart: 60 },
  sessionMedia: { width: 30, height: 30, borderRadius: 7 },
  tight: { gap: 0 },
  start: { alignSelf: "flex-start" },
})

const initials = (name: string) =>
  name
    .split(" ")
    .map((part) => part[0])
    .join("")

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

function UserAvatar({
  user,
  size,
  style,
}: {
  user: User
  size: "sm" | "xl"
  style?: React.ComponentProps<typeof Avatar>["style"]
}) {
  const { colors } = useTheme()
  return (
    <Avatar size={size} style={style}>
      <AvatarFallback style={{ backgroundColor: tone(colors, user.tint) }}>
        {initials(user.name)}
      </AvatarFallback>
    </Avatar>
  )
}

function SecurityToggle({
  label,
  initial,
  onChange,
}: {
  label: string
  initial: boolean
  onChange: (enabled: boolean) => void
}) {
  const [on, setOn] = React.useState(initial)
  const id = `users-detail-${label.toLowerCase().replaceAll(" ", "-")}`

  return (
    <Item size="sm">
      <ItemContent>
        <ItemTitle nativeID={id} style={styles.regular}>
          {label}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Switch
          checked={on}
          onCheckedChange={(value) => {
            setOn(value)
            onChange(value)
          }}
          accessibilityLabelledBy={id}
        />
      </ItemActions>
    </Item>
  )
}

function ValueRow({ label, value }: { label: string; value: string }) {
  return (
    <Item size="sm">
      <ItemContent>
        <ItemTitle style={styles.regular}>{label}</ItemTitle>
      </ItemContent>
      <ItemActions style={styles.shrink}>
        <Text numberOfLines={1}>{value}</Text>
      </ItemActions>
    </Item>
  )
}

function UsersDetail({
  onRoleChange,
  onSignOut,
  onSignOutAll,
  onSecurityChange,
  onSendPasswordReset,
  onNavigate,
}: {
  onRoleChange?: (email: string, role: string) => void
  onSignOut?: (device: string) => void
  onSignOutAll?: () => void
  onSecurityChange?: (email: string, setting: string, enabled: boolean) => void
  onSendPasswordReset?: (email: string) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
  const { width } = useWindowDimensions()
  const wide = width >= 768
  const [section, setSection] = React.useState("users")
  const [selected, setSelected] = React.useState(0)
  const [tab, setTab] = React.useState("Profile")
  const [overrides, setOverrides] = React.useState<Record<number, string>>({})
  const [sessions, setSessions] = React.useState(INITIAL_SESSIONS)
  const user = USERS[selected] ?? USERS[0]
  if (!user) return null
  const role = overrides[selected] ?? user.role

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "users" ? (
        <SplitView style={wide ? styles.wideRoot : undefined}>
          <SplitViewList
            title="Users"
            style={wide ? styles.listWide : styles.compact}
          >
            {wide ? (
              <Text
                role="heading"
                style={[styles.listHeading, { color: colors.mutedForeground }]}
              >
                Users
              </Text>
            ) : null}
            {USERS.map((item, index) => {
              const active = wide && index === selected
              return (
                <SplitViewItem
                  key={item.email}
                  isActive={index === selected}
                  onPress={() => {
                    setSelected(index)
                    setTab("Profile")
                  }}
                  style={
                    active
                      ? { paddingVertical: 6, backgroundColor: colors.primary }
                      : styles.listItem
                  }
                >
                  <View style={styles.listRow}>
                    <UserAvatar
                      user={item}
                      size="sm"
                      style={styles.smallAvatar}
                    />
                    <View style={styles.listText}>
                      <Text
                        numberOfLines={1}
                        style={[
                          fontSize.sm,
                          active && { color: colors.primaryForeground },
                        ]}
                      >
                        {item.name}
                      </Text>
                      <Text
                        style={[
                          fontSize.xs,
                          {
                            color: active
                              ? colors.primaryForeground
                              : colors.mutedForeground,
                          },
                        ]}
                      >
                        {overrides[index] ?? item.role}
                      </Text>
                    </View>
                  </View>
                </SplitViewItem>
              )
            })}
          </SplitViewList>
          <SplitViewDetail style={wide ? styles.detailWide : styles.compact}>
            <AnimatedView
              key={selected}
              entering={FadeInDown.duration(800).reduceMotion(
                ReduceMotion.System
              )}
              style={styles.detail}
            >
              <View style={styles.profile}>
                <UserAvatar user={user} size="xl" />
                <View style={styles.profileText}>
                  <Text role="heading" style={styles.name}>
                    {user.name}
                  </Text>
                  <Text
                    style={[fontSize.sm, { color: colors.mutedForeground }]}
                  >
                    {`${user.email} · ${role}`}
                  </Text>
                </View>
              </View>
              <ToggleGroup
                spacing={0}
                size="sm"
                value={[tab]}
                onValueChange={(value) => {
                  if (value[0]) setTab(value[0])
                }}
                accessibilityLabel="Section"
              >
                {TABS.map((item) => (
                  <ToggleGroupItem key={item} value={item} style={styles.tab}>
                    <Text>{item}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <AnimatedView
                key={tab}
                entering={FadeInDown.duration(700).reduceMotion(
                  ReduceMotion.System
                )}
                style={styles.panel}
              >
                {tab === "Profile" ? (
                  <ItemGroup variant="inset">
                    {[
                      ["Full name", user.name],
                      ["Email", user.email],
                      ["Department", "Product"],
                      ["Joined", "March 12, 2024"],
                    ].map(([label = "", value = ""]) => (
                      <React.Fragment key={label}>
                        <ValueRow label={label} value={value} />
                        <ItemSeparator />
                      </React.Fragment>
                    ))}
                    <Item size="sm">
                      <ItemContent>
                        <ItemTitle style={styles.regular}>Role</ItemTitle>
                      </ItemContent>
                      <ItemActions>
                        <Picker
                          size="sm"
                          value={role}
                          onValueChange={(value) => {
                            onRoleChange?.(user.email, value)
                            setOverrides((current) => ({
                              ...current,
                              [selected]: value,
                            }))
                          }}
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
                    <ValueRow label="Status" value={user.status} />
                  </ItemGroup>
                ) : null}
                {tab === "Sessions" ? (
                  <>
                    <ItemGroup variant="inset">
                      {sessions.map((session, index) => (
                        <React.Fragment key={session.device}>
                          {index > 0 ? (
                            <ItemSeparator style={styles.sessionSeparator} />
                          ) : null}
                          <Item size="sm">
                            <ItemMedia
                              style={[
                                styles.sessionMedia,
                                { backgroundColor: palette.zinc500 },
                              ]}
                            >
                              <Icon
                                as={session.icon}
                                weight="bold"
                                size={16}
                                color={colors.primaryForeground}
                              />
                            </ItemMedia>
                            <ItemContent style={styles.tight}>
                              <ItemTitle style={styles.regular}>
                                {session.device}
                              </ItemTitle>
                              <ItemDescription style={fontSize.xs}>
                                {`${session.place} · ${session.time}`}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              {index === 0 ? (
                                <Text
                                  style={[
                                    fontSize.sm,
                                    { color: colors.foreground },
                                  ]}
                                >
                                  This device
                                </Text>
                              ) : (
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  onPress={() => {
                                    onSignOut?.(session.device)
                                    setSessions((current) =>
                                      current.filter(
                                        (item) => item.device !== session.device
                                      )
                                    )
                                  }}
                                >
                                  <Text>Sign Out</Text>
                                </Button>
                              )}
                            </ItemActions>
                          </Item>
                        </React.Fragment>
                      ))}
                    </ItemGroup>
                    {sessions.length > 1 ? (
                      <Button
                        size="sm"
                        variant="destructive"
                        style={styles.start}
                        onPress={() => {
                          onSignOutAll?.()
                          setSessions((current) => current.slice(0, 1))
                        }}
                      >
                        <Text>Sign Out All Other Sessions</Text>
                      </Button>
                    ) : null}
                  </>
                ) : null}
                {tab === "Security" ? (
                  <>
                    <ItemGroup key={selected} variant="inset">
                      {SECURITY.map((setting, index) => (
                        <React.Fragment key={setting.label}>
                          {index > 0 ? <ItemSeparator /> : null}
                          <SecurityToggle
                            label={setting.label}
                            initial={setting.initial}
                            onChange={(enabled) =>
                              onSecurityChange?.(
                                user.email,
                                setting.label,
                                enabled
                              )
                            }
                          />
                        </React.Fragment>
                      ))}
                    </ItemGroup>
                    <Button
                      size="sm"
                      variant="destructive"
                      style={styles.start}
                      onPress={() => onSendPasswordReset?.(user.email)}
                    >
                      <Text>Send Password Reset Link</Text>
                    </Button>
                  </>
                ) : null}
              </AnimatedView>
            </AnimatedView>
          </SplitViewDetail>
        </SplitView>
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
  )
}

export { UsersDetail }
