import {
  BellIcon,
  ChatCircleIcon,
  ClockIcon,
  PackageIcon,
  type Icon as PhosphorIcon,
} from "phosphor-react-native"
import { ScrollView, StyleSheet, View } from "react-native"
import { BottomBar, BottomBarContent } from "@/components/ui/bottom-bar"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Screen } from "@/components/ui/screen"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"

function withAlpha(color: string, alpha: number) {
  if (!color.startsWith("#") || color.length !== 7) return color
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

type PermissionPrimerBenefit = {
  icon: PhosphorIcon
  title: string
  description: string
}

const DEFAULT_BENEFITS: PermissionPrimerBenefit[] = [
  {
    icon: PackageIcon,
    title: "Order updates",
    description: "Know when your order ships and when it arrives.",
  },
  {
    icon: ChatCircleIcon,
    title: "Replies from support",
    description: "Get answers without keeping the app open.",
  },
  {
    icon: ClockIcon,
    title: "Only what matters",
    description: "No ads. Change what you get anytime in Settings.",
  },
]

const styles = StyleSheet.create({
  content: {
    flexGrow: 1,
    justifyContent: "center",
    gap: 32,
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  intro: { alignItems: "center", gap: 12 },
  tile: {
    marginBottom: 12,
    width: 80,
    height: 80,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius["3xl"],
  },
  title: { ...fontSize["3xl"], fontWeight: "700", textAlign: "center" },
  description: { ...fontSize.lg, textAlign: "center" },
  list: { gap: 20 },
  row: { flexDirection: "row", alignItems: "flex-start", gap: 16 },
  badge: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.xl,
  },
  text: { flex: 1, gap: 2 },
  benefitTitle: { ...fontSize.base, fontWeight: "600" },
  benefitDescription: { ...fontSize.sm },
})

function PermissionPrimer({
  icon = BellIcon,
  title = "Stay in the loop",
  description = "Turn on notifications so we can tell you when something needs your attention.",
  benefits = DEFAULT_BENEFITS,
  allowLabel = "Allow",
  dismissLabel = "Not now",
  onAllow,
  onDismiss,
}: {
  icon?: PhosphorIcon
  title?: string
  description?: string
  benefits?: PermissionPrimerBenefit[]
  allowLabel?: string
  dismissLabel?: string
  onAllow?: () => void
  onDismiss?: () => void
}) {
  const { colors, isDark } = useTheme()
  return (
    <Screen>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.intro}>
          <View style={[styles.tile, { backgroundColor: colors.primary }]}>
            <Icon
              as={icon}
              weight="fill"
              size={40}
              color={colors.primaryForeground}
            />
          </View>
          <Text role="heading" style={styles.title}>
            {title}
          </Text>
          <Text style={[styles.description, { color: colors.mutedForeground }]}>
            {description}
          </Text>
        </View>
        <View role="list" style={styles.list}>
          {benefits.map((benefit) => (
            <View key={benefit.title} role="listitem" style={styles.row}>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: withAlpha(
                      colors.primary,
                      isDark ? 0.2 : 0.1
                    ),
                  },
                ]}
              >
                <Icon as={benefit.icon} size={22} color={colors.primary} />
              </View>
              <View style={styles.text}>
                <Text style={styles.benefitTitle}>{benefit.title}</Text>
                <Text
                  style={[
                    styles.benefitDescription,
                    { color: colors.mutedForeground },
                  ]}
                >
                  {benefit.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
      <BottomBar>
        <BottomBarContent>
          <Button size="lg" block onPress={onAllow}>
            <Text>{allowLabel}</Text>
          </Button>
          <Button size="lg" variant="plain" block onPress={onDismiss}>
            <Text>{dismissLabel}</Text>
          </Button>
        </BottomBarContent>
      </BottomBar>
    </Screen>
  )
}

export type { PermissionPrimerBenefit }
export { PermissionPrimer }
