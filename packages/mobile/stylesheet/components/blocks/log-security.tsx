import {
  ChartBarIcon,
  CheckIcon,
  GearIcon,
  GlobeIcon,
  KeyIcon,
  LockSimpleIcon,
  type Icon as PhosphorIcon,
  ShieldIcon,
  UsersIcon,
} from "phosphor-react-native"
import * as React from "react"
import { StyleSheet, View } from "react-native"
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

type Tint = keyof ThemeColors

type Severity = "High" | "Medium" | "Low"

const LEVELS: Severity[] = ["High", "Medium", "Low"]

const SEVERITY: Record<Severity, { tint: Tint; text: Tint; weight: number }> = {
  High: { tint: "red", text: "danger", weight: 18 },
  Medium: { tint: "orange", text: "warning", weight: 8 },
  Low: { tint: "yellow", text: "label", weight: 3 },
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

const RING_LENGTH = 2 * Math.PI * 22

const styles = StyleSheet.create({
  other: { flex: 1, gap: 8, paddingHorizontal: 16, paddingTop: 52 },
  otherTitle: { ...fontSize["3xl"], fontWeight: "700" },
  ring: { width: 54, height: 54, transform: [{ rotate: "-90deg" }] },
  ringLayer: { position: "absolute", top: 0, left: 0 },
  body: { gap: 20, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 32 },
  card: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    gap: 16,
    borderRadius: radius.xl,
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  score: { flex: 1 },
  scoreValue: {
    ...fontSize["3xl"],
    fontWeight: "700",
    fontVariant: ["tabular-nums"],
  },
  levels: { flexDirection: "row", gap: 18 },
  level: { alignItems: "center" },
  levelValue: {
    ...fontSize.xl,
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  group: { overflow: "hidden", borderRadius: radius["2xl"] },
  separator: { marginStart: 58, height: 1 },
  row: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
  },
  tile: {
    width: 30,
    height: 30,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  text: { minWidth: 0, flex: 1 },
  title: { ...fontSize.sm, fontWeight: "600" },
  empty: { ...fontSize.sm, padding: 30, textAlign: "center" },
})

const scoreTone = (score: number): Tint => {
  if (score > 85) return "green"
  if (score > 65) return "orange"
  return "red"
}

function ScoreRing({ score }: { score: number }) {
  const { colors } = useTheme()
  return (
    <View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={styles.ring}
    >
      <Svg width={54} height={54} viewBox="0 0 54 54" style={styles.ringLayer}>
        <Circle
          cx={27}
          cy={27}
          r={22}
          fill="none"
          strokeWidth={6}
          stroke={colors.control}
        />
      </Svg>
      <Svg width={54} height={54} viewBox="0 0 54 54" style={styles.ringLayer}>
        <Circle
          cx={27}
          cy={27}
          r={22}
          fill="none"
          strokeWidth={6}
          strokeLinecap="round"
          stroke={colors[scoreTone(score)]}
          strokeDasharray={`${(Math.max(0, score) / 100) * RING_LENGTH} ${RING_LENGTH}`}
        />
      </Svg>
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

function LogSecurity({
  onFilterChange,
  onResolve,
  onNavigate,
}: {
  onFilterChange?: (filter: string) => void
  onResolve?: (title: string, resolved: boolean) => void
  onNavigate?: (section: string) => void
}) {
  const { colors } = useTheme()
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
                  style={[fontSize.sm, { color: colors.labelSecondary }]}
                >
                  {summary}
                </Text>
              }
            >
              Security
            </HeaderLargeTitle>
            <View style={styles.body}>
              <View
                style={[
                  styles.card,
                  { backgroundColor: colors.surfaceSecondary },
                ]}
              >
                <ScoreRing score={score} />
                <View accessible style={styles.score}>
                  <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
                    Security score
                  </Text>
                  <Text style={styles.scoreValue}>{String(score)}</Text>
                </View>
                <View style={styles.levels}>
                  {LEVELS.map((level) => (
                    <View key={level} accessible style={styles.level}>
                      <Text
                        style={[fontSize.xs, { color: colors.labelSecondary }]}
                      >
                        {level}
                      </Text>
                      <Text
                        style={[
                          styles.levelValue,
                          {
                            color: count(level)
                              ? colors[SEVERITY[level].text]
                              : colors.labelTertiary,
                          },
                        ]}
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
                  <View
                    style={[
                      styles.group,
                      { backgroundColor: colors.surfaceSecondary },
                    ]}
                  >
                    {list.map((alert, index) => (
                      <View key={alert.title}>
                        {index > 0 ? (
                          <View
                            style={[
                              styles.separator,
                              { backgroundColor: colors.separator },
                            ]}
                          />
                        ) : null}
                        <View style={styles.row}>
                          <View
                            style={[
                              styles.tile,
                              {
                                backgroundColor: alert.resolved
                                  ? colors.green
                                  : colors[SEVERITY[alert.severity].tint],
                              },
                            ]}
                          >
                            <Icon
                              as={alert.resolved ? CheckIcon : alert.icon}
                              weight="bold"
                              size={16}
                              color={colors.onAccent}
                            />
                          </View>
                          <View style={styles.text}>
                            <Text numberOfLines={2} style={styles.title}>
                              {alert.title}
                            </Text>
                            <Text
                              numberOfLines={1}
                              style={[
                                fontSize.xs,
                                { color: colors.labelSecondary },
                              ]}
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
                  <Text
                    style={[styles.empty, { color: colors.labelSecondary }]}
                  >
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
