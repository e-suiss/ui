import {
  ChartBarIcon,
  GearIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { useWindowDimensions, View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import {
  SplitView,
  SplitViewDetail,
  SplitViewItem,
  SplitViewList,
} from "@/components/patterns/split-view"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const GROUPS = [
  {
    name: "Content",
    permissions: [
      { name: "Create drafts", description: "Can start new content drafts." },
      { name: "Publish", description: "Can make content public." },
      { name: "Delete", description: "Can permanently delete content." },
    ],
  },
  {
    name: "Customers",
    permissions: [
      {
        name: "Customer data",
        description: "Sees names, emails and order history.",
      },
      { name: "Export", description: "Downloads the customer list as CSV." },
    ],
  },
]

const PERMISSIONS = GROUPS.flatMap((group) =>
  group.permissions.map((permission) => permission.name)
)

const ROLES = ["Editor", "Support", "Viewer"] as const

type Role = (typeof ROLES)[number]

type Grants = Record<Role, boolean[]>

const MEMBERS: Record<Role, number> = { Editor: 2, Support: 2, Viewer: 1 }

const DEFAULTS: Grants = {
  Editor: [true, true, false, true, false],
  Support: [false, false, false, true, false],
  Viewer: [false, false, false, false, false],
}

const clone = (value: Grants): Grants => ({
  Editor: [...value.Editor],
  Support: [...value.Support],
  Viewer: [...value.Viewer],
})

const granted = (value: Grants): Record<Role, string[]> => ({
  Editor: PERMISSIONS.filter((_, index) => value.Editor[index]),
  Support: PERMISSIONS.filter((_, index) => value.Support[index]),
  Viewer: PERMISSIONS.filter((_, index) => value.Viewer[index]),
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

function RolesEditor({
  onTogglePermission,
  onSave,
  onRevert,
  onNewRole,
  onNavigate,
}: {
  onTogglePermission?: (
    role: Role,
    permission: string,
    enabled: boolean
  ) => void
  onSave?: (permissions: Record<Role, string[]>) => void
  onRevert?: () => void
  onNewRole?: () => void
  onNavigate?: (section: string) => void
}) {
  const { width } = useWindowDimensions()
  const wide = width >= 768
  const [section, setSection] = React.useState("roles")
  const [role, setRole] = React.useState<Role>("Editor")
  const [state, setState] = React.useState(() => clone(DEFAULTS))
  const [base, setBase] = React.useState(() => clone(DEFAULTS))
  const dirty = JSON.stringify(state) !== JSON.stringify(base)
  let slot = 0

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "roles" ? (
        <SplitView className={wide ? "m-4" : undefined}>
          <SplitViewList
            title="Roles"
            className={wide ? "gap-0.5 px-4 pt-5" : "px-4 pb-8"}
          >
            {wide ? (
              <Text
                role="heading"
                className="px-1 pb-2 text-sm font-semibold text-label-secondary"
              >
                Roles
              </Text>
            ) : null}
            {ROLES.map((name) => (
              <SplitViewItem
                key={name}
                isActive={name === role}
                onPress={() => setRole(name)}
                className="py-1.5"
              >
                <Text>{name}</Text>
                <Text className="text-xs text-label-secondary">
                  {`${state[name].filter(Boolean).length} permissions`}
                </Text>
              </SplitViewItem>
            ))}
            <Button
              size="sm"
              variant="secondary"
              onPress={onNewRole}
              className="mt-2.5 self-start"
            >
              <Icon as={PlusIcon} weight="bold" className="size-3.25" />
              <Text>New Role</Text>
            </Button>
          </SplitViewList>
          <SplitViewDetail className={wide ? "p-6" : "px-4 pb-8"}>
            <AnimatedView
              key={role}
              entering={FadeInDown.duration(800).reduceMotion(
                ReduceMotion.System
              )}
              className="gap-4.5"
            >
              <View className="flex-row flex-wrap items-start gap-3">
                <View className="min-w-0 flex-1">
                  <Text role="heading" className="text-3xl font-semibold">
                    {role}
                  </Text>
                  <Text className="text-sm text-label-secondary">
                    {`${MEMBERS[role]} ${MEMBERS[role] === 1 ? "user has" : "users have"} this role`}
                  </Text>
                </View>
                {dirty ? (
                  <View className="flex-row gap-2">
                    <Button
                      size="sm"
                      variant="secondary"
                      onPress={() => {
                        onRevert?.()
                        setState(clone(base))
                      }}
                    >
                      <Text>Revert</Text>
                    </Button>
                    <Button
                      size="sm"
                      onPress={() => {
                        onSave?.(granted(state))
                        setBase(clone(state))
                      }}
                    >
                      <Text>Save</Text>
                    </Button>
                  </View>
                ) : null}
              </View>
              {GROUPS.map((group) => (
                <View key={group.name} className="gap-2">
                  <Text role="heading" className="px-1 text-sm font-semibold">
                    {group.name}
                  </Text>
                  <ItemGroup variant="inset">
                    {group.permissions.map((permission, position) => {
                      const index = slot++
                      const id = `roles-editor-${index}`
                      return (
                        <React.Fragment key={permission.name}>
                          {position > 0 ? <ItemSeparator /> : null}
                          <Item size="sm">
                            <ItemContent className="gap-0">
                              <ItemTitle nativeID={id} className="font-normal">
                                {permission.name}
                              </ItemTitle>
                              <ItemDescription className="text-xs">
                                {permission.description}
                              </ItemDescription>
                            </ItemContent>
                            <ItemActions>
                              <Switch
                                checked={state[role][index] ?? false}
                                onCheckedChange={(value) => {
                                  onTogglePermission?.(
                                    role,
                                    permission.name,
                                    value
                                  )
                                  setState((current) => ({
                                    ...current,
                                    [role]: current[role].map((item, i) =>
                                      i === index ? value : item
                                    ),
                                  }))
                                }}
                                accessibilityLabelledBy={id}
                              />
                            </ItemActions>
                          </Item>
                        </React.Fragment>
                      )
                    })}
                  </ItemGroup>
                </View>
              ))}
            </AnimatedView>
          </SplitViewDetail>
        </SplitView>
      ) : (
        <OtherSection value={section} home="Roles" />
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

export { RolesEditor }
