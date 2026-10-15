import { cn } from "cn"
import { ChatCircleIcon, CheckIcon } from "phosphor-react-native"
import * as React from "react"
import { Image, ScrollView, View } from "react-native"
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

function bannerFootnote(allow: boolean, banner: boolean, style: string) {
  if (!allow) return "Notifications are off"
  if (!banner) return "No banners"
  return style === "persistent"
    ? "Banner stays until dismissed"
    : "Banner shows briefly"
}

function MiniScreen({ kind }: { kind: Alert }) {
  return (
    <View
      accessible={false}
      importantForAccessibility="no-hide-descendants"
      className="h-[5.75rem] w-16 overflow-hidden rounded-xl border-2 border-foreground bg-indigo-500"
    >
      {kind === "lock" ? (
        <Text className="absolute inset-x-0 top-3 text-center text-sm font-semibold text-white">
          9:41
        </Text>
      ) : null}
      {MINI_SCREEN_BARS[kind].map((top, index) => (
        <View
          key={top}
          style={{ top: top - 2, opacity: 1 - index * 0.15 }}
          className="absolute inset-x-1.5 h-[0.8125rem] rounded-sm bg-white"
        />
      ))}
    </View>
  )
}

function Notification({ body, stacked }: { body: string; stacked?: boolean }) {
  return (
    <AnimatedView
      entering={FadeInUp.duration(600).reduceMotion(ReduceMotion.System)}
    >
      {stacked ? (
        <View className="absolute inset-x-2.5 -bottom-1.5 h-5 rounded-2xl bg-card opacity-55" />
      ) : null}
      <View className="flex-row gap-2.5 rounded-[1.125rem] bg-card px-3 py-2.5 opacity-95">
        <View className="size-[1.875rem] shrink-0 items-center justify-center rounded-[7px] bg-green-500">
          <Icon
            as={ChatCircleIcon}
            weight="fill"
            className="size-[1.125rem] text-primary-foreground"
          />
        </View>
        <View className="min-w-0 flex-1 gap-px">
          <View className="flex-row items-center gap-1.5">
            <Text className="flex-1 text-xs font-semibold">Riley Morgan</Text>
            <Text className="text-xs text-muted-foreground">now</Text>
          </View>
          <Text className="text-xs">{body}</Text>
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
        <ItemTitle nativeID={id} className="font-normal">
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
      <ScrollView contentContainerClassName="gap-5 px-4 pt-4 pb-8">
        <View className="flex-row items-center gap-3">
          <View className="size-10 items-center justify-center rounded-[0.625rem] bg-green-500">
            <Icon
              as={ChatCircleIcon}
              weight="fill"
              className="size-6 text-primary-foreground"
            />
          </View>
          <View>
            <Text role="heading" className="text-2xl font-bold">
              Messages
            </Text>
            <Text className="text-sm text-muted-foreground">Notifications</Text>
          </View>
        </View>
        <View
          accessible
          accessibilityRole="image"
          accessibilityLabel={`Lock screen preview. ${footnote}.`}
          className="h-[18.75rem] overflow-hidden rounded-3xl bg-black"
        >
          <Image
            source={{ uri: WALLPAPER }}
            resizeMode="cover"
            accessibilityIgnoresInvertColors
            className="absolute inset-0 size-full"
          />
          <View className="absolute inset-0 bg-black/50 opacity-40" />
          <View className="absolute inset-x-0 top-10 items-center">
            <Text className="text-xs font-semibold text-white opacity-90">
              Tuesday, October 6
            </Text>
            <Text className="text-3xl font-semibold text-white">9:41</Text>
          </View>
          {allow && enabled.banner && bannerVisible ? (
            <View key={bannerKey} className="absolute inset-x-2 top-2">
              <Notification body={body} />
            </View>
          ) : null}
          {allow && enabled.lock ? (
            <View className="absolute inset-x-2 top-40">
              <Notification body={body} stacked={grouping !== "Off"} />
            </View>
          ) : null}
          <Text className="absolute inset-x-0 bottom-3.5 text-center text-xs text-white opacity-85">
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
          style={{ pointerEvents: allow ? "auto" : "none" }}
          accessibilityState={{ disabled: !allow }}
          className={cn("gap-5", !allow && "opacity-35")}
        >
          <Text role="heading" className="-mb-3 px-1 text-sm font-semibold">
            Alerts
          </Text>
          <ItemGroup variant="inset">
            <View className="flex-row px-2">
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
                    className="h-auto flex-1 flex-col gap-2 rounded-xl bg-transparent pt-3.5 pb-3 active:bg-transparent"
                  >
                    <MiniScreen kind={alert.value} />
                    <Text className="text-center text-sm text-foreground">
                      {alert.label}
                    </Text>
                    <View
                      className={cn(
                        "size-[1.375rem] items-center justify-center rounded-full border-[1.5px]",
                        on ? "border-transparent bg-primary" : "border-input"
                      )}
                    >
                      {on ? (
                        <Icon
                          as={CheckIcon}
                          weight="bold"
                          className="size-3 text-primary-foreground"
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
                    <ItemTitle className="font-normal">Banner Style</ItemTitle>
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
          <Text role="heading" className="-mb-3 px-1 text-sm font-semibold">
            Appearance
          </Text>
          <ItemGroup variant="inset">
            {selects.map((row, index) => (
              <React.Fragment key={row.label}>
                {index > 0 ? <ItemSeparator /> : null}
                <Item size="sm" className="py-1.5">
                  <ItemContent>
                    <ItemTitle className="font-normal">{row.label}</ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Picker
                      size="sm"
                      value={row.value}
                      onValueChange={row.onChange}
                      accessibilityLabel={row.label}
                      className="bg-transparent px-1"
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
