import { cn } from "cn"
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
import { View } from "react-native"
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

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const ROLES = ["Admin", "Editor", "Support", "Viewer"]

type Status = "Active" | "Suspended" | "Invited"

type User = {
  name: string
  email: string
  role: string
  status: Status
  seen: string
  tint: string
}

const INITIAL_USERS: User[] = [
  {
    name: "Jamie Rivera",
    email: "jamie@company.com",
    role: "Admin",
    status: "Active",
    seen: "2 min ago",
    tint: "bg-indigo dark:bg-indigo",
  },
  {
    name: "Morgan Lee",
    email: "morgan@company.com",
    role: "Editor",
    status: "Active",
    seen: "1 hr ago",
    tint: "bg-orange dark:bg-orange",
  },
  {
    name: "Riley Chen",
    email: "riley@company.com",
    role: "Support",
    status: "Active",
    seen: "Yesterday",
    tint: "bg-green dark:bg-green",
  },
  {
    name: "Taylor Kim",
    email: "taylor@company.com",
    role: "Viewer",
    status: "Suspended",
    seen: "3 days ago",
    tint: "bg-cyan dark:bg-cyan",
  },
  {
    name: "Avery Brooks",
    email: "avery@company.com",
    role: "Editor",
    status: "Invited",
    seen: "—",
    tint: "bg-pink dark:bg-pink",
  },
  {
    name: "Jordan Park",
    email: "jordan@company.com",
    role: "Support",
    status: "Active",
    seen: "5 hr ago",
    tint: "bg-mint dark:bg-mint",
  },
]

const STATUS_CLASS: Record<Status, string> = {
  Active: "text-label",
  Suspended: "text-danger",
  Invited: "text-label-secondary",
}

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
      <Text className="text-lg text-label-secondary">
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function UserRow({ user, first }: { user: User; first: boolean }) {
  return (
    <SelectionListItem
      value={user.email}
      accessibilityLabel={`${user.name}, ${user.role}, ${user.status}`}
      className={cn(!first && "border-t border-separator")}
    >
      <View className="min-w-0 flex-1 flex-row items-center gap-3 px-4 py-2.5">
        <Avatar size="sm" className="size-8">
          <AvatarFallback className={user.tint}>
            {initials(user.name)}
          </AvatarFallback>
        </Avatar>
        <View className="min-w-0 flex-1">
          <Text numberOfLines={1} className="text-sm font-semibold">
            {user.name}
          </Text>
          <Text numberOfLines={1} className="text-xs text-label-secondary">
            {user.email}
          </Text>
        </View>
        <View className="items-end gap-1">
          <Badge variant="secondary" className="bg-control px-2">
            <Text>{user.role}</Text>
          </Badge>
          <Text className={cn("text-xs", STATUS_CLASS[user.status])}>
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

  const summary = editing
    ? selected.length
      ? `${selected.length} selected`
      : "Tap rows to select"
    : `${users.length} people`

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
        className="flex-1"
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
                  className="size-5 text-accent"
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
                className="text-sm text-label-secondary"
              >
                {summary}
              </Text>
            }
          >
            Users
          </HeaderLargeTitle>
          <View className="gap-3 pt-1 pb-28">
            <View className="px-4">
              <InputGroup className="h-9 rounded-[0.625rem]">
                <InputGroupAddon>
                  <Icon
                    as={MagnifyingGlassIcon}
                    weight="bold"
                    className="size-4 text-label-secondary"
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
              className="px-4"
            >
              {["All", ...ROLES].map((item) => (
                <Chip key={item} value={item}>
                  {item}
                </Chip>
              ))}
            </ChipGroup>
            <View className="mx-4 overflow-hidden rounded-xl bg-surface-secondary">
              {list.map((user, index) => (
                <UserRow key={user.email} user={user} first={index === 0} />
              ))}
              {list.length === 0 ? (
                <Text className="p-6 text-center text-sm text-label-secondary">
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
            <Text
              className={
                selected.length === 0 ? "text-label-quaternary" : "text-danger"
              }
            >
              Suspend
            </Text>
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
