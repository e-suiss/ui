import { cn } from "cn"
import {
  ChartBarIcon,
  CheckIcon,
  GearIcon,
  GlobeIcon,
  KeyIcon,
  LockSimpleIcon,
  type Icon as PhosphorIcon,
  type IconProps as PhosphorIconProps,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { FadeInDown, ReduceMotion } from "react-native-reanimated"
import Svg, { Circle } from "react-native-svg"
import { AnimatedView } from "@/components/ui/animated-view"
import { Button } from "@/components/ui/button"
import { Chip, ChipGroup } from "@/components/ui/chip"
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

type Severity = "High" | "Medium" | "Low"

const LEVELS: Severity[] = ["High", "Medium", "Low"]

const SEVERITY: Record<
  Severity,
  { tint: string; text: string; weight: number }
> = {
  High: { tint: "bg-red-500", text: "text-destructive", weight: 18 },
  Medium: {
    tint: "bg-orange-500",
    text: "text-amber-600 dark:text-amber-400",
    weight: 8,
  },
  Low: { tint: "bg-yellow-500", text: "text-foreground", weight: 3 },
}

const FILTERS = ["Open", "Resolved", "All"]

type Alert = {
  severity: Severity
  title: string
  detail: string
  icon: PhosphorIcon
  resolved: boolean
}

const INITIAL_ALERTS: Alert[] = [
  {
    severity: "High",
    title: "Sign-in from an unusual location",
    detail: "morgan@company.com · Lagos, NG · 3:12 AM",
    icon: GlobeIcon,
    resolved: false,
  },
  {
    severity: "Medium",
    title: "5 failed sign-in attempts",
    detail: "85.104.x.x · last 10 minutes",
    icon: LockSimpleIcon,
    resolved: false,
  },
  {
    severity: "Medium",
    title: "API key expires in 7 days",
    detail: "Payments integration",
    icon: KeyIcon,
    resolved: false,
  },
  {
    severity: "Low",
    title: "Two-factor authentication is off",
    detail: "2 users",
    icon: ShieldIcon,
    resolved: false,
  },
]

const scoreTone = (score: number) => {
  if (score > 85) return "text-green-500"
  if (score > 65) return "text-orange-500"
  return "text-red-500"
}

const ScoreContext = React.createContext(0)

function ScoreTrack({ color }: PhosphorIconProps) {
  return (
    <Svg width={54} height={54} viewBox="0 0 54 54">
      <Circle
        cx={27}
        cy={27}
        r={22}
        fill="none"
        strokeWidth={6}
        stroke={color}
      />
    </Svg>
  )
}

function ScoreArc({ color }: PhosphorIconProps) {
  const score = React.useContext(ScoreContext)
  const length = 2 * Math.PI * 22
  return (
    <Svg width={54} height={54} viewBox="0 0 54 54">
      <Circle
        cx={27}
        cy={27}
        r={22}
        fill="none"
        strokeWidth={6}
        strokeLinecap="round"
        stroke={color}
        strokeDasharray={`${(Math.max(0, score) / 100) * length} ${length}`}
      />
    </Svg>
  )
}

function ScoreRing({ score }: { score: number }) {
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="size-13.5 -rotate-90"
    >
      <Icon as={ScoreTrack} className="absolute size-13.5 text-secondary" />
      <ScoreContext.Provider value={score}>
        <Icon
          as={ScoreArc}
          className={cn("absolute size-13.5", scoreTone(score))}
        />
      </ScoreContext.Provider>
    </View>
  )
}

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

function LogSecurity({
  onFilterChange,
  onResolve,
  onNavigate,
}: {
  onFilterChange?: (filter: string) => void
  onResolve?: (title: string, resolved: boolean) => void
  onNavigate?: (section: string) => void
}) {
  const [section, setSection] = React.useState("log")
  const [alerts, setAlerts] = React.useState(INITIAL_ALERTS)
  const [filter, setFilter] = React.useState("Open")
  const scroll = useHeaderScroll()
  const open = alerts.filter((alert) => !alert.resolved)
  const count = (level: Severity) =>
    open.filter((alert) => alert.severity === level).length
  const score =
    100 -
    LEVELS.reduce(
      (sum, level) => sum + count(level) * SEVERITY[level].weight,
      0
    )
  const list =
    filter === "All"
      ? alerts
      : alerts.filter((alert) => alert.resolved === (filter === "Resolved"))
  const summary = open.length ? `${open.length} open alerts` : "No open alerts"

  const setResolved = (title: string, resolved: boolean) => {
    onResolve?.(title, resolved)
    setAlerts((current) =>
      current.map((alert) =>
        alert.title === title ? { ...alert, resolved } : alert
      )
    )
  }

  return (
    <Screen edges={["top", "right", "left"]}>
      {section === "log" ? (
        <>
          <Header scroll={scroll}>
            <HeaderTitle>Security</HeaderTitle>
          </Header>
          <HeaderScrollView scroll={scroll}>
            <HeaderLargeTitle
              subtitle={
                <Text
                  accessibilityLiveRegion="polite"
                  className="text-sm text-muted-foreground"
                >
                  {summary}
                </Text>
              }
            >
              Security
            </HeaderLargeTitle>
            <View className="gap-5 px-4 pt-3 pb-8">
              <View className="flex-row flex-wrap items-center gap-4 rounded-xl bg-muted px-4 py-3.5">
                <ScoreRing score={score} />
                <View accessible className="flex-1">
                  <Text className="text-sm text-muted-foreground">
                    Security score
                  </Text>
                  <Text className="text-3xl font-bold tabular-nums">
                    {String(score)}
                  </Text>
                </View>
                <View className="flex-row gap-4.5">
                  {LEVELS.map((level) => (
                    <View key={level} accessible className="items-center">
                      <Text className="text-xs text-muted-foreground">
                        {level}
                      </Text>
                      <Text
                        className={cn(
                          "text-xl font-semibold tabular-nums",
                          count(level)
                            ? SEVERITY[level].text
                            : "text-muted-foreground"
                        )}
                      >
                        {String(count(level))}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
              <ChipGroup
                value={[filter]}
                onValueChange={(value) => {
                  if (!value[0]) return
                  setFilter(value[0])
                  onFilterChange?.(value[0])
                }}
                accessibilityLabel="Filter"
              >
                {FILTERS.map((item) => (
                  <Chip key={item} value={item}>
                    {item}
                  </Chip>
                ))}
              </ChipGroup>
              <AnimatedView
                key={filter}
                entering={FadeInDown.duration(700).reduceMotion(
                  ReduceMotion.System
                )}
              >
                {list.length > 0 ? (
                  <View className="overflow-hidden rounded-2xl bg-muted">
                    {list.map((alert, index) => (
                      <View key={alert.title}>
                        {index > 0 ? (
                          <View className="ms-14.5 h-px bg-border" />
                        ) : null}
                        <View className="min-h-13 flex-row items-center gap-3 px-4 py-2.5">
                          <View
                            className={cn(
                              "size-7.5 shrink-0 items-center justify-center rounded-[7px]",
                              alert.resolved
                                ? "bg-green-500"
                                : SEVERITY[alert.severity].tint
                            )}
                          >
                            <Icon
                              as={alert.resolved ? CheckIcon : alert.icon}
                              weight="bold"
                              className="size-4 text-primary-foreground"
                            />
                          </View>
                          <View className="min-w-0 flex-1">
                            <Text
                              numberOfLines={2}
                              className="text-sm font-semibold"
                            >
                              {alert.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              className="text-xs text-muted-foreground"
                            >
                              {`${alert.resolved ? "Resolved" : `${alert.severity} severity`} · ${alert.detail}`}
                            </Text>
                          </View>
                          {alert.resolved ? (
                            <Button
                              size="sm"
                              variant="secondary"
                              onPress={() => setResolved(alert.title, false)}
                            >
                              <Text>Reopen</Text>
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              onPress={() => setResolved(alert.title, true)}
                            >
                              <Text>Resolve</Text>
                            </Button>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                ) : (
                  <Text className="p-7.5 text-center text-sm text-muted-foreground">
                    {filter === "Open"
                      ? "No open alerts. All good."
                      : "Nothing here yet."}
                  </Text>
                )}
              </AnimatedView>
            </View>
          </HeaderScrollView>
        </>
      ) : (
        <OtherSection value={section} home="Activity" />
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

export { LogSecurity }
