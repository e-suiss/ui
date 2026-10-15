import {
  ChartBarIcon,
  GearIcon,
  type Icon as PhosphorIcon,
  PlusIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, useWindowDimensions, View } from "react-native"
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
import { fontSize, useTheme } from "@/components/ui/theme"

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
  newRole: { marginTop: 10, alignSelf: "flex-start" },
  detail: { gap: 18 },
  top: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "flex-start",
    gap: 12,
  },
  topText: { minWidth: 0, flex: 1 },
  title: { ...fontSize["3xl"], fontWeight: "600" },
  actions: { flexDirection: "row", gap: 8 },
  group: { gap: 8 },
  groupHeading: { ...fontSize.sm, paddingHorizontal: 4, fontWeight: "600" },
  tight: { gap: 0 },
  regular: { fontWeight: "400" },
})

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
  const { colors } = useTheme()
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
        <SplitView style={wide ? styles.wideRoot : undefined}>
          <SplitViewList
            title="Roles"
            style={wide ? styles.listWide : styles.compact}
          >
            {wide ? (
              <Text
                role="heading"
                style={[styles.listHeading, { color: colors.mutedForeground }]}
              >
                Roles
              </Text>
            ) : null}
            {ROLES.map((name) => (
              <SplitViewItem
                key={name}
                isActive={name === role}
                onPress={() => setRole(name)}
                style={styles.listItem}
              >
                <Text>{name}</Text>
                <Text style={[fontSize.xs, { color: colors.mutedForeground }]}>
                  {`${state[name].filter(Boolean).length} permissions`}
                </Text>
              </SplitViewItem>
            ))}
            <Button
              size="sm"
              variant="secondary"
              onPress={onNewRole}
              style={styles.newRole}
            >
              <Icon as={PlusIcon} weight="bold" size={13} />
              <Text>New Role</Text>
            </Button>
          </SplitViewList>
          <SplitViewDetail style={wide ? styles.detailWide : styles.compact}>
            <AnimatedView
              key={role}
              entering={FadeInDown.duration(800).reduceMotion(
                ReduceMotion.System
              )}
              style={styles.detail}
            >
              <View style={styles.top}>
                <View style={styles.topText}>
                  <Text role="heading" style={styles.title}>
                    {role}
                  </Text>
                  <Text
                    style={[fontSize.sm, { color: colors.mutedForeground }]}
                  >
                    {`${MEMBERS[role]} ${MEMBERS[role] === 1 ? "user has" : "users have"} this role`}
                  </Text>
                </View>
                {dirty ? (
                  <View style={styles.actions}>
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
                <View key={group.name} style={styles.group}>
                  <Text role="heading" style={styles.groupHeading}>
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
                            <ItemContent style={styles.tight}>
                              <ItemTitle nativeID={id} style={styles.regular}>
                                {permission.name}
                              </ItemTitle>
                              <ItemDescription style={fontSize.xs}>
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
