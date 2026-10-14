import { cn } from "cn"
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
import { Pressable, View } from "react-native"
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

const SECTIONS: { value: string; label: string; icon: PhosphorIcon }[] = [
  { value: "users", label: "Users", icon: UsersIcon },
  { value: "roles", label: "Roles", icon: ShieldIcon },
  { value: "log", label: "Activity", icon: ChartBarIcon },
  { value: "settings", label: "Settings", icon: GearIcon },
]

const DURATIONS = ["24 hours", "7 days", "Permanent"]

type Decision = "approved" | "denied" | null

type Request = {
  name: string
  permission: string
  reason: string
  time: string
  tint: string
  decision: Decision
}

const INITIAL_REQUESTS: Request[] = [
  {
    name: "Morgan Lee",
    permission: "Change prices",
    reason: "I need to update the campaign prices.",
    time: "10 min ago",
    tint: "bg-orange dark:bg-orange",
    decision: null,
  },
  {
    name: "Riley Chen",
    permission: "Export customers",
    reason: "I need the customer list for the monthly report.",
    time: "1 hr ago",
    tint: "bg-green dark:bg-green",
    decision: null,
  },
  {
    name: "Jordan Park",
    permission: "Issue refunds",
    reason: "So I can refund support tickets myself.",
    time: "Yesterday",
    tint: "bg-mint dark:bg-mint",
    decision: null,
  },
  {
    name: "Taylor Kim",
    permission: "Publish",
    reason: "I'd like to publish blog posts.",
    time: "2 days ago",
    tint: "bg-cyan dark:bg-cyan",
    decision: null,
  },
]

const EASING_LAYOUT = LinearTransition.duration(400).reduceMotion(
  ReduceMotion.System
)

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

function RequestRow({
  request,
  first,
  onDecide,
}: {
  request: Request
  first: boolean
  onDecide: (decision: "approved" | "denied") => void
}) {
  return (
    <AnimatedView
      layout={EASING_LAYOUT}
      exiting={FadeOut.duration(400).reduceMotion(ReduceMotion.System)}
    >
      <SwipeActions>
        <SwipeActionsContent className="bg-surface-secondary">
          <View className="flex-row items-start gap-3 ps-4">
            <Avatar className="mt-3 size-[2.125rem]">
              <AvatarFallback className={request.tint}>
                {initials(request.name)}
              </AvatarFallback>
            </Avatar>
            <View
              className={cn(
                "min-w-0 flex-1 gap-2.5 py-3 pe-4",
                !first && "border-t border-separator"
              )}
            >
              <View className="gap-[0.1875rem]">
                <View className="flex-row items-center gap-2">
                  <Text className="text-sm font-semibold">{request.name}</Text>
                  <Text className="text-xs text-label-secondary">
                    {request.time}
                  </Text>
                </View>
                <Text className="text-sm">
                  {`Requests ${request.permission}`}
                </Text>
                <Text className="text-sm text-label-secondary">
                  {request.reason}
                </Text>
              </View>
              {request.decision ? (
                <Text
                  accessibilityLiveRegion="polite"
                  className={cn(
                    "pt-0.5 text-sm font-semibold",
                    request.decision === "approved"
                      ? "text-success"
                      : "text-danger"
                  )}
                >
                  {request.decision === "approved" ? "Approved" : "Denied"}
                </Text>
              ) : (
                <View className="flex-row flex-wrap gap-2">
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
                  className="text-sm text-label-secondary"
                >
                  {`${open} pending ${open === 1 ? "request" : "requests"}`}
                </Text>
              }
            >
              Access requests
            </HeaderLargeTitle>
            <View className="gap-5 px-4 pt-3 pb-8">
              <View className="flex-row items-center gap-2">
                <Text
                  nativeID="roles-requests-duration"
                  className="flex-1 text-sm text-label-secondary"
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
                <View className="overflow-hidden rounded-2xl bg-surface-secondary">
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
                  <Empty className="gap-3 p-10">
                    <EmptyHeader>
                      <EmptyMedia className="mb-0">
                        <Icon
                          as={CheckIcon}
                          weight="bold"
                          className="size-10 text-success"
                        />
                      </EmptyMedia>
                      <EmptyTitle className="text-xl">
                        No pending requests.
                      </EmptyTitle>
                    </EmptyHeader>
                    <EmptyContent>
                      <Pressable
                        role="button"
                        hitSlop={8}
                        onPress={() => setRequests(INITIAL_REQUESTS)}
                        className="active:opacity-60"
                      >
                        <Text className="text-sm text-link">
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
