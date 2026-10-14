import {
  ChartBarIcon,
  CheckIcon,
  GearIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UsersIcon,
  XIcon,
} from "phosphor-react-native"
import * as React from "react"
import { Pressable, StyleSheet, View } from "react-native"
import {
  FadeInDown,
  FadeOut,
  LinearTransition,
  ReduceMotion,
} from "react-native-reanimated"
import {
  SwipeAction,
  SwipeActions,
  SwipeActionsActions,
  SwipeActionsContent,
} from "@/components/interactions/swipe-actions"
import { Picker, PickerItem } from "@/components/patterns/picker"
import { AnimatedView } from "@/components/ui/animated-view"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty"
import {
  Header,
  HeaderLargeTitle,
  HeaderScrollView,
  HeaderTitle,
  useHeaderScroll,
} from "@/components/ui/header"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { TabBar, TabBarItem, TabBarList } from "@/components/ui/tab-bar"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  radius,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const DURATIONS = ["24 hours", "7 days", "Permanent"]

type Decision = "approved" | "denied" | null

type Tint = keyof ThemeColors

type Request = {
  name: string
  permission: string
  reason: string
  time: string
  tint: Tint
  decision: Decision
}

const INITIAL_REQUESTS: Request[] = [
  {
    name: "Morgan Lee",
    permission: "Change prices",
    reason: "I need to update the campaign prices.",
    time: "10 min ago",
    tint: "orange",
    decision: null,
  },
  {
    name: "Riley Chen",
    permission: "Export customers",
    reason: "I need the customer list for the monthly report.",
    time: "1 hr ago",
    tint: "green",
    decision: null,
  },
  {
    name: "Jordan Park",
    permission: "Issue refunds",
    reason: "So I can refund support tickets myself.",
    time: "Yesterday",
    tint: "mint",
    decision: null,
  },
  {
    name: "Taylor Kim",
    permission: "Publish",
    reason: "I'd like to publish blog posts.",
    time: "2 days ago",
    tint: "cyan",
    decision: null,
  },
]

const EASING_LAYOUT = LinearTransition.duration(400).reduceMotion(
  ReduceMotion.System
)

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingStart: 16,
  },
  avatar: { marginTop: 12, width: 34, height: 34 },
  content: {
    minWidth: 0,
    flex: 1,
    gap: 10,
    paddingVertical: 12,
    paddingEnd: 16,
  },
  divider: { borderTopWidth: 1 },
  lines: { gap: 3 },
  top: { flexDirection: "row", alignItems: "center", gap: 8 },
  strong: { ...fontSize.sm, fontWeight: "600" },
  decision: { ...fontSize.sm, paddingTop: 2, fontWeight: "600" },
  actions: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  duration: { flexDirection: "row", alignItems: "center", gap: 8 },
  durationLabel: { ...fontSize.sm, flex: 1 },
  group: { overflow: "hidden", borderRadius: radius["2xl"] },
  empty: { gap: 12, padding: 40 },
  emptyMedia: { marginBottom: 0 },
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
      <Text style={[fontSize.lg, { color: colors.labelSecondary }]}>
        {`This section isn't part of the sample. Choose ${home}.`}
      </Text>
    </View>
  )
}

function RequestRow({
  request,
  first,
  onDecide,
}: {
  request: Request
  first: boolean
  onDecide: (decision: "approved" | "denied") => void
}) {
  const { colors } = useTheme()
  return (
    <AnimatedView
      layout={EASING_LAYOUT}
      exiting={FadeOut.duration(400).reduceMotion(ReduceMotion.System)}
    >
      <SwipeActions>
        <SwipeActionsContent
          style={{ backgroundColor: colors.surfaceSecondary }}
        >
          <View style={styles.row}>
            <Avatar style={styles.avatar}>
              <AvatarFallback style={{ backgroundColor: colors[request.tint] }}>
                {initials(request.name)}
              </AvatarFallback>
            </Avatar>
            <View
              style={[
                styles.content,
                !first && [
                  styles.divider,
                  { borderTopColor: colors.separator },
                ],
              ]}
            >
              <View style={styles.lines}>
                <View style={styles.top}>
                  <Text style={styles.strong}>{request.name}</Text>
                  <Text style={[fontSize.xs, { color: colors.labelSecondary }]}>
                    {request.time}
                  </Text>
                </View>
                <Text style={fontSize.sm}>
                  {`Requests ${request.permission}`}
                </Text>
                <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
                  {request.reason}
                </Text>
              </View>
              {request.decision ? (
                <Text
                  accessibilityLiveRegion="polite"
                  style={[
                    styles.decision,
                    {
                      color:
                        request.decision === "approved"
                          ? colors.success
                          : colors.danger,
                    },
                  ]}
                >
                  {request.decision === "approved" ? "Approved" : "Denied"}
                </Text>
              ) : (
                <View style={styles.actions}>
                  <Button
                    size="sm"
                    variant="secondary"
                    onPress={() => onDecide("denied")}
                  >
                    <Text>Deny</Text>
                  </Button>
                  <Button size="sm" onPress={() => onDecide("approved")}>
                    <Text>Approve</Text>
                  </Button>
                </View>
              )}
            </View>
          </View>
        </SwipeActionsContent>
        {request.decision ? null : (
          <SwipeActionsActions side="leading">
            <SwipeAction fullSwipe onPress={() => onDecide("approved")}>
              <Icon as={CheckIcon} weight="bold" />
              <Text>Approve</Text>
            </SwipeAction>
          </SwipeActionsActions>
        )}
        {request.decision ? null : (
          <SwipeActionsActions side="trailing">
            <SwipeAction
              variant="destructive"
              fullSwipe
              onPress={() => onDecide("denied")}
            >
              <Icon as={XIcon} weight="bold" />
              <Text>Deny</Text>
            </SwipeAction>
          </SwipeActionsActions>
        )}
      </SwipeActions>
    </AnimatedView>
  )
}

function RolesRequests({
  onApprove,
  onDeny,
  onDurationChange,
  onNavigate,
}: {
  onApprove?: (name: string, duration: string) => void
  onDeny?: (name: string) => void
  onDurationChange?: (duration: string) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
  const [section, setSection] = React.useState("roles")
  const [requests, setRequests] = React.useState(INITIAL_REQUESTS)
  const [duration, setDuration] = React.useState("Permanent")
  const timers = React.useRef<ReturnType<typeof setTimeout>[]>([])
  const scroll = useHeaderScroll()
  const open = requests.filter((request) => !request.decision).length

  React.useEffect(
    () => () => {
      for (const timer of timers.current) clearTimeout(timer)
    },
    []
  )

  const decide = (name: string, decision: "approved" | "denied") => {
    if (decision === "approved") onApprove?.(name, duration)
    else onDeny?.(name)
    setRequests((current) =>
      current.map((request) =>
        request.name === name ? { ...request, decision } : request
      )
    )
    timers.current.push(
      setTimeout(
        () =>
          setRequests((current) =>
            current.filter((request) => request.name !== name)
          ),
        900
      )
    )
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "roles" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>Access requests</HeaderTitle>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle
              subtitle={
                <Text
                  accessibilityLiveRegion="polite"
                  style={[fontSize.sm, { color: colors.labelSecondary }]}
                >
                  {`${open} pending ${open === 1 ? "request" : "requests"}`}
                </Text>
              }
            >
              Access requests
            </HeaderLargeTitle>
            <View style={styles.body}>
              <View style={styles.duration}>
                <Text
                  nativeID="roles-requests-duration"
                  style={[
                    styles.durationLabel,
                    { color: colors.labelSecondary },
                  ]}
                >
                  Approval length
                </Text>
                <Picker
                  size="sm"
                  value={duration}
                  onValueChange={(value) => {
                    setDuration(value)
                    onDurationChange?.(value)
                  }}
                  accessibilityLabelledBy="roles-requests-duration"
                >
                  {DURATIONS.map((item) => (
                    <PickerItem key={item} value={item}>
                      {item}
                    </PickerItem>
                  ))}
                </Picker>
              </View>
              {requests.length > 0 ? (
                <View
                  style={[
                    styles.group,
                    { backgroundColor: colors.surfaceSecondary },
                  ]}
                >
                  {requests.map((request, index) => (
                    <RequestRow
                      key={request.name}
                      request={request}
                      first={index === 0}
                      onDecide={(decision) => decide(request.name, decision)}
                    />
                  ))}
                </View>
              ) : (
                <AnimatedView
                  entering={FadeInDown.duration(800).reduceMotion(
                    ReduceMotion.System
                  )}
                >
                  <Empty style={styles.empty}>
                    <EmptyHeader>
                      <EmptyMedia style={styles.emptyMedia}>
                        <Icon
                          as={CheckIcon}
                          weight="bold"
                          size={40}
                          color={colors.success}
                        />
                      </EmptyMedia>
                      <EmptyTitle style={fontSize.xl}>
                        No pending requests.
                      </EmptyTitle>
                    </EmptyHeader>
                    <EmptyContent>
                      <Pressable
                        role="button"
                        hitSlop={8}
                        onPress={() => setRequests(INITIAL_REQUESTS)}
                        style={({ pressed }) => pressed && { opacity: 0.6 }}
                      >
                        <Text style={[fontSize.sm, { color: colors.link }]}>
                          Reset the sample ›
                        </Text>
                      </Pressable>
                    </EmptyContent>
                  </Empty>
                </AnimatedView>
              )}
            </View>
          </HeaderScrollView>
        </>
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

export { RolesRequests }
