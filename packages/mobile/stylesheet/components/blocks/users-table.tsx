import {
  ChartBarIcon,
  GearIcon,
  MagnifyingGlassIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
import {
  SelectionList,
  SelectionListBar,
  SelectionListItem,
  SelectionListTrigger,
} from "@/components/interactions/selection-list"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Chip, ChipGroup } from "@/components/ui/chip"
import {
  Header,
  HeaderActions,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group"
import { Screen } from "@/components/ui/screen"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

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

type Status = "Active" | "Suspended" | "Invited"

type Tint = Tone

type User = {
  name: string
  email: string
  role: string
  status: Status
  seen: string
  tint: Tint
}

const INITIAL_USERS: User[] = [
  {
    name: "Jamie Rivera",
    email: "jamie@company.com",
    role: "Admin",
    status: "Active",
    seen: "2 min ago",
    tint: "indigo500",
  },
  {
    name: "Morgan Lee",
    email: "morgan@company.com",
    role: "Editor",
    status: "Active",
    seen: "1 hr ago",
    tint: "orange500",
  },
  {
    name: "Riley Chen",
    email: "riley@company.com",
    role: "Support",
    status: "Active",
    seen: "Yesterday",
    tint: "green500",
  },
  {
    name: "Taylor Kim",
    email: "taylor@company.com",
    role: "Viewer",
    status: "Suspended",
    seen: "3 days ago",
    tint: "cyan500",
  },
  {
    name: "Avery Brooks",
    email: "avery@company.com",
    role: "Editor",
    status: "Invited",
    seen: "—",
    tint: "pink500",
  },
  {
    name: "Jordan Park",
    email: "jordan@company.com",
    role: "Support",
    status: "Active",
    seen: "5 hr ago",
    tint: "teal400",
  },
]

const STATUS_COLOR: Record<Status, Tone> = {
  Active: "foreground",
  Suspended: "destructive",
  Invited: "mutedForeground",
}

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  row: {
    minWidth: 0,
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  avatar: { width: 32, height: 32 },
  rowText: { minWidth: 0, flex: 1 },
  name: { ...fontSize.sm, fontWeight: "600" },
  meta: { alignItems: "flex-end", gap: 4 },
  badge: { paddingHorizontal: 8 },
  fill: { flex: 1 },
  body: { gap: 12, paddingTop: 4, paddingBottom: 112 },
  search: { paddingHorizontal: 16 },
  group: { height: 36, borderRadius: 10 },
  chips: { paddingHorizontal: 16 },
  list: { marginHorizontal: 16, overflow: "hidden", borderRadius: radius.xl },
  empty: { ...fontSize.sm, padding: 24, textAlign: "center" },
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

function UserRow({ user, first }: { user: User; first: boolean }) {
  const { colors } = useTheme()
  return (
    <SelectionListItem
      value={user.email}
      accessibilityLabel={`${user.name}, ${user.role}, ${user.status}`}
      style={
        first ? undefined : { borderTopWidth: 1, borderColor: colors.border }
      }
    >
      <View style={styles.row}>
        <Avatar size="sm" style={styles.avatar}>
          <AvatarFallback style={{ backgroundColor: tone(colors, user.tint) }}>
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <View style={styles.rowText}>
          <Text numberOfLines={1} style={styles.name}>
            {user.name}
          </Text>
          <Text
            numberOfLines={1}
            style={[fontSize.xs, { color: colors.mutedForeground }]}
          >
            {user.email}
          </Text>
        </View>
        <View style={styles.meta}>
          <Badge
            variant="secondary"
            style={[styles.badge, { backgroundColor: colors.secondary }]}
          >
            <Text>{user.role}</Text>
          </Badge>
          <Text
            style={[
              fontSize.xs,
              { color: tone(colors, STATUS_COLOR[user.status]) },
            ]}
          >
            {user.status === "Active" ? user.seen : user.status}
          </Text>
        </View>
      </View>
    </SelectionListItem>
  )
}

function UsersTable({
  onInvite,
  onFilterChange,
  onBulkUpdate,
  onNavigate,
}: {
  onInvite?: () => void
  onFilterChange?: (role: string) => void
  onBulkUpdate?: (
    emails: string[],
    patch: { role?: string; status?: Status }
  ) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
  const [section, setSection] = React.useState("users")
  const [users, setUsers] = React.useState(INITIAL_USERS)
  const [query, setQuery] = React.useState("")
  const [role, setRole] = React.useState("All")
  const [editing, setEditing] = React.useState(false)
  const [selected, setSelected] = React.useState<string[]>([])
  const scroll = useHeaderScroll()
  const list = users.filter(
    (user) =>
      (role === "All" || user.role === role) &&
      (!query ||
        `${user.name} ${user.email}`
          .toLowerCase()
          .includes(query.toLowerCase()))
  )

  const bulk = (patch: { role?: string; status?: Status }) => {
    onBulkUpdate?.(selected, patch)
    setUsers((current) =>
      current.map((user) =>
        selected.includes(user.email) ? { ...user, ...patch } : user
      )
    )
    setSelected([])
    setEditing(false)
  }

  let summary = `${users.length} people`
  if (editing) {
    summary = selected.length
      ? `${selected.length} selected`
      : "Tap rows to select"
  }

  if (section !== "users") {
    return (
      <Screen edges={["top", "right", "left"]}>
        <OtherSection value={section} home="Users" />
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

  return (
    <Screen edges={["top", "right", "left"]}>
      <SelectionList
        editing={editing}
        onEditingChange={setEditing}
        value={selected}
        onValueChange={setSelected}
        style={styles.fill}
      >
        <Header scroll={scroll}>
          <HeaderTitle>Users</HeaderTitle>
          <HeaderActions>
            <SelectionListTrigger />
            {editing ? null : (
              <Button
                variant="ghost"
                size="icon"
                accessibilityLabel="Invite"
                onPress={onInvite}
              >
                <Icon
                  as={PlusIcon}
                  weight="bold"
                  size={20}
                  color={colors.primary}
                />
              </Button>
            )}
          </HeaderActions>
        </Header>
        <HeaderScrollView
          scroll={scroll}
          keyboardShouldPersistTaps="handled"
          keyboardDismissMode="on-drag"
        >
          <HeaderLargeTitle
            subtitle={
              <Text
                accessibilityLiveRegion="polite"
                style={[fontSize.sm, { color: colors.mutedForeground }]}
              >
                {summary}
              </Text>
            }
          >
            Users
          </HeaderLargeTitle>
          <View style={styles.body}>
            <View style={styles.search}>
              <InputGroup style={styles.group}>
                <InputGroupAddon>
                  <Icon
                    as={MagnifyingGlassIcon}
                    weight="bold"
                    size={16}
                    color={colors.mutedForeground}
                  />
                </InputGroupAddon>
                <InputGroupInput
                  value={query}
                  onChangeText={setQuery}
                  placeholder="Search"
                  accessibilityLabel="Search users"
                  returnKeyType="search"
                  autoCorrect={false}
                  autoCapitalize="none"
                  clearButtonMode="while-editing"
                />
              </InputGroup>
            </View>
            <ChipGroup
              scrollable
              value={[role]}
              onValueChange={(value) => {
                if (!value[0]) return
                setRole(value[0])
                setSelected([])
                onFilterChange?.(value[0])
              }}
              accessibilityLabel="Role"
              style={styles.chips}
            >
              {["All", ...ROLES].map((item) => (
                <Chip key={item} value={item}>
                  {item}
                </Chip>
              ))}
            </ChipGroup>
            <View style={[styles.list, { backgroundColor: colors.muted }]}>
              {list.map((user, index) => (
                <UserRow key={user.email} user={user} first={index === 0} />
              ))}
              {list.length === 0 ? (
                <Text style={[styles.empty, { color: colors.mutedForeground }]}>
                  No matching users.
                </Text>
              ) : null}
            </View>
          </View>
        </HeaderScrollView>
        <SelectionListBar accessibilityLabel="Selection actions">
          <Button
            variant="plain"
            size="sm"
            disabled={selected.length === 0}
            onPress={() => bulk({ role: "Editor" })}
          >
            <Text>Make Editor</Text>
          </Button>
          <Button
            variant="plain"
            size="sm"
            disabled={selected.length === 0}
            onPress={() => bulk({ status: "Active" })}
          >
            <Text>Activate</Text>
          </Button>
          <Button
            variant="plain"
            size="sm"
            disabled={selected.length === 0}
            onPress={() => bulk({ status: "Suspended" })}
          >
            <Text style={{ color: colors.destructive }}>Suspend</Text>
          </Button>
        </SelectionListBar>
      </SelectionList>
      {editing ? null : (
        <AdminTabBar
          value={section}
          onValueChange={(value) => {
            setSection(value)
            onNavigate?.(value)
          }}
        />
      )}
    </Screen>
  )
}

export { UsersTable }
