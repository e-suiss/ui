import { ChatCircleIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, StyleSheet, View } from "react-native"
import { FadeInUp, ReduceMotion } from "react-native-reanimated"
import { Picker, PickerItem } from "@/components/patterns/picker"
import { AnimatedView } from "@/components/ui/animated-view"
import { Icon } from "@/components/ui/icon"
import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import { fontSize, radius, useTheme } from "@/components/ui/theme"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const WALLPAPER =
  "https://images.unsplash.com/photo-1707324148764-99647364afa3?w=600&q=80&auto=format&fit=crop"

type Alert = "lock" | "center" | "banner"

const ALERTS: { value: Alert; label: string }[] = [
  { value: "lock", label: "Lock Screen" },
  { value: "center", label: "Notification Center" },
  { value: "banner", label: "Banners" },
]

const PREVIEW_OPTIONS = ["Always", "When Unlocked", "Never"]

const GROUPING_OPTIONS = ["Automatic", "By App", "Off"]

const MINI_SCREEN_BARS: Record<Alert, number[]> = {
  lock: [58, 74],
  center: [12, 29, 46, 63],
  banner: [8],
}

const styles = StyleSheet.create({
  mini: {
    height: 92,
    width: 64,
    overflow: "hidden",
    borderRadius: radius.xl,
    borderWidth: 2,
  },
  miniTime: {
    ...fontSize.sm,
    position: "absolute",
    left: 0,
    right: 0,
    top: 12,
    textAlign: "center",
    fontWeight: "600",
  },
  miniBar: {
    position: "absolute",
    left: 6,
    right: 6,
    height: 13,
    borderRadius: radius.sm,
  },
  stack: {
    position: "absolute",
    left: 10,
    right: 10,
    bottom: -6,
    height: 20,
    borderRadius: radius["2xl"],
    opacity: 0.55,
  },
  card: {
    flexDirection: "row",
    gap: 10,
    borderRadius: 18,
    paddingHorizontal: 12,
    paddingVertical: 10,
    opacity: 0.95,
  },
  appIcon: {
    width: 30,
    height: 30,
    flexShrink: 0,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 7,
  },
  cardBody: { minWidth: 0, flex: 1, gap: 1 },
  cardHeader: { flexDirection: "row", alignItems: "center", gap: 6 },
  content: {
    gap: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  appHeader: { flexDirection: "row", alignItems: "center", gap: 12 },
  appTile: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
  },
  preview: { height: 300, overflow: "hidden", borderRadius: radius["3xl"] },
  clock: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 40,
    alignItems: "center",
  },
  footnote: {
    ...fontSize["2xs"],
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 14,
    textAlign: "center",
    opacity: 0.85,
  },
  section: { ...fontSize.sm, marginBottom: -12, paddingHorizontal: 4 },
  alerts: { flexDirection: "row", paddingHorizontal: 8 },
  alert: {
    height: "auto",
    flex: 1,
    flexDirection: "column",
    gap: 8,
    borderRadius: radius.xl,
    paddingTop: 14,
    paddingBottom: 12,
    backgroundColor: "transparent",
  },
  checkCircle: {
    width: 22,
    height: 22,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: radius.full,
    borderWidth: 1.5,
  },
})

function bannerFootnote(allow: boolean, banner: boolean, style: string) {
  if (!allow) return "Notifications are off"
  if (!banner) return "No banners"
  return style === "persistent"
    ? "Banner stays until dismissed"
    : "Banner shows briefly"
}

function MiniScreen({ kind }: { kind: Alert }) {
  const { colors } = useTheme()
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      style={[
        styles.mini,
        { borderColor: colors.label, backgroundColor: colors.indigo },
      ]}
    >
      {kind === "lock" ? (
        <Text style={[styles.miniTime, { color: colors.onMedia }]}>9:41</Text>
      ) : null}
      {MINI_SCREEN_BARS[kind].map((top, index) => (
        <View
          key={top}
          style={[
            styles.miniBar,
            {
              top: top - 2,
              opacity: 1 - index * 0.15,
              backgroundColor: colors.onMedia,
            },
          ]}
        />
      ))}
    </View>
  )
}

function Notification({ body, stacked }: { body: string; stacked?: boolean }) {
  const { colors } = useTheme()
  return (
    <AnimatedView
      entering={FadeInUp.duration(600).reduceMotion(ReduceMotion.System)}
    >
      {stacked ? (
        <View
          style={[styles.stack, { backgroundColor: colors.surfaceRaised }]}
        />
      ) : null}
      <View style={[styles.card, { backgroundColor: colors.surfaceRaised }]}>
        <View style={[styles.appIcon, { backgroundColor: colors.green }]}>
          <Icon
            as={ChatCircleIcon}
            weight="fill"
            size={18}
            color={colors.onAccent}
          />
        </View>
        <View style={styles.cardBody}>
          <View style={styles.cardHeader}>
            <Text style={[fontSize.xs, { flex: 1, fontWeight: "600" }]}>
              Riley Morgan
            </Text>
            <Text style={[fontSize["2xs"], { color: colors.labelSecondary }]}>
              now
            </Text>
          </View>
          <Text style={fontSize.xs}>{body}</Text>
        </View>
      </View>
    </AnimatedView>
  )
}

function SwitchRow({
  id,
  label,
  checked,
  onCheckedChange,
}: {
  id: string
  label: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <Item size="sm">
      <ItemContent>
        <ItemTitle nativeID={id} style={{ fontWeight: "400" }}>
          {label}
        </ItemTitle>
      </ItemContent>
      <ItemActions>
        <Switch
          checked={checked}
          onCheckedChange={onCheckedChange}
          accessibilityLabelledBy={id}
        />
      </ItemActions>
    </Item>
  )
}

function SettingsNotifications() {
  const { colors } = useTheme()
  const [allow, setAllow] = React.useState(true)
  const [enabled, setEnabled] = React.useState<Record<Alert, boolean>>({
    lock: true,
    center: true,
    banner: true,
  })
  const [bannerStyle, setBannerStyle] = React.useState("temporary")
  const [sounds, setSounds] = React.useState(true)
  const [badges, setBadges] = React.useState(true)
  const [previews, setPreviews] = React.useState("Always")
  const [grouping, setGrouping] = React.useState("Automatic")
  const [bannerKey, setBannerKey] = React.useState(0)
  const [bannerVisible, setBannerVisible] = React.useState(true)

  React.useEffect(() => {
    if (bannerStyle !== "temporary" || !bannerVisible) return
    const timer = setTimeout(() => setBannerVisible(false), 2600)
    return () => clearTimeout(timer)
  }, [bannerStyle, bannerVisible])

  const replay = () => {
    setBannerKey((key) => key + 1)
    setBannerVisible(true)
  }

  const body =
    previews === "Never"
      ? "Notification"
      : "Is the weekend trip to the coast still on?"
  const footnote = bannerFootnote(allow, enabled.banner, bannerStyle)

  const selects = [
    {
      label: "Show Previews",
      value: previews,
      options: PREVIEW_OPTIONS,
      onChange: (value: string) => {
        setPreviews(value)
        replay()
      },
    },
    {
      label: "Notification Grouping",
      value: grouping,
      options: GROUPING_OPTIONS,
      onChange: setGrouping,
    },
  ]

  return (
    <Screen edges={["top", "right", "left"]}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.appHeader}>
          <View style={[styles.appTile, { backgroundColor: colors.green }]}>
            <Icon
              as={ChatCircleIcon}
              weight="fill"
              size={24}
              color={colors.onAccent}
            />
          </View>
          <View>
            <Text
              role="heading"
              style={[fontSize["2xl"], { fontWeight: "700" }]}
            >
              Messages
            </Text>
            <Text style={[fontSize.sm, { color: colors.labelSecondary }]}>
              Notifications
            </Text>
          </View>
        </View>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Lock screen preview. ${footnote}.`}
          style={[styles.preview, { backgroundColor: colors.media }]}
        >
          <Image
            source={{ uri: WALLPAPER }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            style={[StyleSheet.absoluteFill, { width: "100%", height: "100%" }]}
          />
          <View
            style={[
              StyleSheet.absoluteFill,
              { backgroundColor: colors.scrim, opacity: 0.4 },
            ]}
          />
          <View style={styles.clock}>
            <Text
              style={[
                fontSize.xs,
                { fontWeight: "600", color: colors.onMedia, opacity: 0.9 },
              ]}
            >
              Tuesday, October 6
            </Text>
            <Text
              style={[
                fontSize["3xl"],
                { fontWeight: "600", color: colors.onMedia },
              ]}
            >
              9:41
            </Text>
          </View>
          {allow && enabled.banner && bannerVisible ? (
            <View
              key={bannerKey}
              style={{ position: "absolute", left: 8, right: 8, top: 8 }}
            >
              <Notification body={body} />
            </View>
          ) : null}
          {allow && enabled.lock ? (
            <View style={{ position: "absolute", left: 8, right: 8, top: 160 }}>
              <Notification body={body} stacked={grouping !== "Off"} />
            </View>
          ) : null}
          <Text style={[styles.footnote, { color: colors.onMedia }]}>
            {footnote}
          </Text>
        </View>
        <ItemGroup variant="inset">
          <SwitchRow
            id="settings-notifications-allow"
            label="Allow Notifications"
            checked={allow}
            onCheckedChange={(value) => {
              setAllow(value)
              replay()
            }}
          />
        </ItemGroup>
        <View
          accessibilityState={{ disabled: !allow }}
          style={[
            { gap: 20, pointerEvents: allow ? "auto" : "none" },
            !allow && { opacity: 0.35 },
          ]}
        >
          <Text role="heading" style={[styles.section, { fontWeight: "600" }]}>
            Alerts
          </Text>
          <ItemGroup variant="inset">
            <View style={styles.alerts}>
              {ALERTS.map((alert) => {
                const on = enabled[alert.value]
                return (
                  <Toggle
                    key={alert.value}
                    pressed={on}
                    onPressedChange={(pressed) => {
                      setEnabled((current) => ({
                        ...current,
                        [alert.value]: pressed,
                      }))
                      replay()
                    }}
                    accessibilityLabel={alert.label}
                    style={styles.alert}
                  >
                    <MiniScreen kind={alert.value} />
                    <Text
                      style={[
                        fontSize.sm,
                        { textAlign: "center", color: colors.label },
                      ]}
                    >
                      {alert.label}
                    </Text>
                    <View
                      style={[
                        styles.checkCircle,
                        on
                          ? {
                              borderColor: "transparent",
                              backgroundColor: colors.accent,
                            }
                          : { borderColor: colors.separatorStrong },
                      ]}
                    >
                      {on ? (
                        <Icon
                          as={CheckIcon}
                          weight="bold"
                          size={12}
                          color={colors.onAccent}
                        />
                      ) : null}
                    </View>
                  </Toggle>
                )
              })}
            </View>
            {enabled.banner ? (
              <>
                <ItemSeparator />
                <Item size="sm">
                  <ItemContent>
                    <ItemTitle style={{ fontWeight: "400" }}>
                      Banner Style
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ToggleGroup
                      spacing={0}
                      size="sm"
                      value={[bannerStyle]}
                      onValueChange={(value) => {
                        if (!value[0]) return
                        setBannerStyle(value[0])
                        replay()
                      }}
                      accessibilityLabel="Banner style"
                    >
                      <ToggleGroupItem value="temporary">
                        <Text>Temporary</Text>
                      </ToggleGroupItem>
                      <ToggleGroupItem value="persistent">
                        <Text>Persistent</Text>
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </ItemActions>
                </Item>
              </>
            ) : null}
            <ItemSeparator />
            <SwitchRow
              id="settings-notifications-sounds"
              label="Sounds"
              checked={sounds}
              onCheckedChange={setSounds}
            />
            <ItemSeparator />
            <SwitchRow
              id="settings-notifications-badges"
              label="Badges"
              checked={badges}
              onCheckedChange={setBadges}
            />
          </ItemGroup>
          <Text role="heading" style={[styles.section, { fontWeight: "600" }]}>
            Appearance
          </Text>
          <ItemGroup variant="inset">
            {selects.map((row, index) => (
              <React.Fragment key={row.label}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item size="sm" style={{ paddingVertical: 6 }}>
                  <ItemContent>
                    <ItemTitle style={{ fontWeight: "400" }}>
                      {row.label}
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Picker
                      size="sm"
                      value={row.value}
                      onValueChange={row.onChange}
                      accessibilityLabel={row.label}
                      style={{
                        backgroundColor: "transparent",
                        paddingHorizontal: 4,
                      }}
                    >
                      {row.options.map((option) => (
                        <PickerItem key={option} value={option}>
                          {option}
                        </PickerItem>
                      ))}
                    </Picker>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </View>
      </ScrollView>
    </Screen>
  )
}

export { SettingsNotifications }
