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
import { useWindowDimensions, View } from "react-native"
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
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const ROLES = ["Admin", "Editor", "Support", "Viewer"]

const TABS = ["Profile", "Sessions", "Security"]

type User = {
  name: string
  email: string
  role: string
  status: string
  tint: string
}

const USERS: User[] = [
  {
    name: "Jamie Rivera",
    email: "jamie@company.com",
    role: "Admin",
    status: "Active",
    tint: "bg-indigo-500",
  },
  {
    name: "Morgan Lee",
    email: "morgan@company.com",
    role: "Editor",
    status: "Active",
    tint: "bg-orange-500",
  },
  {
    name: "Riley Chen",
    email: "riley@company.com",
    role: "Support",
    status: "Active",
    tint: "bg-green-500",
  },
  {
    name: "Taylor Kim",
    email: "taylor@company.com",
    role: "Viewer",
    status: "Suspended",
    tint: "bg-cyan-500",
  },
  {
    name: "Avery Brooks",
    email: "avery@company.com",
    role: "Editor",
    status: "Invited",
    tint: "bg-pink-500",
  },
  {
    name: "Jordan Park",
    email: "jordan@company.com",
    role: "Support",
    status: "Active",
    tint: "bg-teal-400",
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
  const label = SECTIONS.find((section) => section.value === value)?.label
  return (
    <View className="flex-1 gap-2 px-4 pt-13">
      <Text role="heading" className="text-3xl font-bold">
        {label}
      </Text>
      <Text className="text-lg text-muted-foreground">
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function UserAvatar({
  user,
  size,
  className,
}: {
  user: User
  size: "sm" | "xl"
  className?: string
}) {
  return (
    <Avatar size={size} className={className}>
      <AvatarFallback className={user.tint}>
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
        <ItemTitle nativeID={id} className="font-normal">
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
        <ItemTitle className="font-normal">{label}</ItemTitle>
      </ItemContent>
      <ItemActions className="shrink">
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
        <SplitView className={wide ? "m-4" : undefined}>
          <SplitViewList
            title="Users"
            className={wide ? "gap-0.5 px-4 pt-5" : "px-4 pb-8"}
          >
            {wide ? (
              <Text
                role="heading"
                className="px-1 pb-2 text-sm font-semibold text-muted-foreground"
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
                  className={active ? "bg-primary py-1.5" : "py-1.5"}
                >
                  <View className="flex-row items-center gap-2.5">
                    <UserAvatar user={item} size="sm" className="size-7" />
                    <View className="min-w-0 flex-1">
                      <Text
                        numberOfLines={1}
                        className={
                          active ? "text-sm text-primary-foreground" : "text-sm"
                        }
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={
                          active
                            ? "text-xs text-primary-foreground"
                            : "text-xs text-muted-foreground"
                        }
                      >
                        {overrides[index] ?? item.role}
                      </Text>
                    </View>
                  </View>
                </SplitViewItem>
              )
            })}
          </SplitViewList>
          <SplitViewDetail className={wide ? "p-6" : "px-4 pb-8"}>
            <AnimatedView
              key={selected}
              entering={FadeInDown.duration(800).reduceMotion(
                ReduceMotion.System
              )}
              className="gap-5"
            >
              <View className="flex-row items-center gap-3.5">
                <UserAvatar user={user} size="xl" />
                <View className="min-w-0 flex-1 gap-0.5">
                  <Text role="heading" className="text-2xl font-bold">
                    {user.name}
                  </Text>
                  <Text className="text-sm text-muted-foreground">
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
                  <ToggleGroupItem key={item} value={item} className="px-4">
                    <Text>{item}</Text>
                  </ToggleGroupItem>
                ))}
              </ToggleGroup>
              <AnimatedView
                key={tab}
                entering={FadeInDown.duration(700).reduceMotion(
                  ReduceMotion.System
                )}
                className="gap-3"
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
                        <ItemTitle className="font-normal">Role</ItemTitle>
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
                    <ValueRow label="Status" value={user.status} />
                  </ItemGroup>
                ) : null}
                {tab === "Sessions" ? (
                  <>
                    <ItemGroup variant="inset">
                      {sessions.map((session, index) => (
                        <React.Fragment key={session.device}>
                          {index > 0 ? (
                            <ItemSeparator className="ms-15" />
                          ) : null}
                          <Item size="sm">
                            <ItemMedia className="size-7.5 rounded-[7px] bg-zinc-500">
                              <Icon
                                as={session.icon}
                                weight="bold"
                                className="size-4 text-primary-foreground"
                              />
                            </ItemMedia>
                            <ItemContent className="gap-0">
                              <ItemTitle className="font-normal">
                                {session.device}
                              </ItemTitle>
                              <ItemDescription className="text-xs">
                                {`${session.place} · ${session.time}`}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              {index === 0 ? (
                                <Text className="text-sm text-foreground">
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
                        className="self-start"
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
                      className="self-start"
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
