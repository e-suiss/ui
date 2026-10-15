import {
  AirplaneIcon,
  BellIcon,
  BluetoothIcon,
  CaretRightIcon,
  CellSignalFullIcon,
  GearIcon,
  HourglassIcon,
  MagnifyingGlassIcon,
  MoonIcon,
  type Icon as PhosphorIcon,
  SpeakerHighIcon,
  SunIcon,
  WifiHighIcon,
} from "phosphor-react-native"
import * as React from "react"
import { I18nManager, StyleSheet, View } from "react-native"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Header,
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
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemGroup,
  ItemMedia,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import { Screen } from "@/components/ui/screen"
import { Switch } from "@/components/ui/switch"
import { Text } from "@/components/ui/text"
import {
  fontSize,
  palette,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

type Tone = keyof ThemeColors | keyof typeof palette

function tone(colors: ThemeColors, key: Tone) {
  return { ...colors, ...palette }[key]
}

type Toggles = {
  airplane: boolean
  wifi: boolean
  bluetooth: boolean
  focus: boolean
}

type Row = {
  label: string
  icon: PhosphorIcon
  tint: Tone
  toggle?: keyof Toggles
  detail?: (toggles: Toggles) => string
}

const GROUPS: Row[][] = [
  [
    {
      label: "Airplane Mode",
      icon: AirplaneIcon,
      tint: "orange500",
      toggle: "airplane",
    },
    {
      label: "Wi-Fi",
      icon: WifiHighIcon,
      tint: "blue500",
      detail: (toggles) => (toggles.wifi ? "Home" : "Off"),
    },
    {
      label: "Bluetooth",
      icon: BluetoothIcon,
      tint: "blue500",
      detail: (toggles) => (toggles.bluetooth ? "On" : "Off"),
    },
    {
      label: "Cellular",
      icon: CellSignalFullIcon,
      tint: "green500",
      detail: (toggles) => (toggles.airplane ? "Off" : ""),
    },
  ],
  [
    { label: "Notifications", icon: BellIcon, tint: "red500" },
    { label: "Sounds & Haptics", icon: SpeakerHighIcon, tint: "pink500" },
    { label: "Focus", icon: MoonIcon, tint: "indigo500", toggle: "focus" },
    { label: "Screen Time", icon: HourglassIcon, tint: "indigo500" },
  ],
  [
    { label: "General", icon: GearIcon, tint: "zinc500" },
    { label: "Display & Brightness", icon: SunIcon, tint: "blue500" },
  ],
]

const styles = StyleSheet.create({
  body: { gap: 18, paddingHorizontal: 16, paddingBottom: 32 },
  search: { height: 36, borderRadius: 10 },
  account: { gap: 14, paddingVertical: 10 },
  row: { minHeight: 44, gap: 14, paddingVertical: 6 },
  tile: { width: 29, height: 29, borderRadius: 7 },
  empty: { ...fontSize.base, padding: 30, textAlign: "center" },
})

function Chevron() {
  const { colors } = useTheme()
  return (
    <Icon
      as={CaretRightIcon}
      weight="bold"
      size={14}
      color={colors.mutedForeground}
      style={
        I18nManager.isRTL ? { transform: [{ rotate: "180deg" }] } : undefined
      }
    />
  )
}

function SettingsDevice({
  onAccountPress,
  onRowPress,
}: {
  onAccountPress?: () => void
  onRowPress?: (label: string) => void
}) {
  const { colors, isDark } = useTheme()
  const scroll = useHeaderScroll()
  const [query, setQuery] = React.useState("")
  const [toggles, setToggles] = React.useState<Toggles>({
    airplane: false,
    wifi: true,
    bluetooth: true,
    focus: false,
  })

  const setToggle = (key: keyof Toggles, value: boolean) =>
    setToggles((current) => ({
      ...current,
      [key]: value,
      ...(key === "airplane" && value ? { wifi: false, bluetooth: false } : {}),
    }))

  const matches = (label: string) =>
    !query || label.toLowerCase().includes(query.toLowerCase())
  const visible = GROUPS.map((rows) =>
    rows.filter((row) => matches(row.label))
  ).filter((rows): rows is [Row, ...Row[]] => rows.length > 0)

  const group = {
    backgroundColor: isDark ? colors.muted : colors.background,
  }

  return (
    <Screen
      variant="secondary"
      edges={["top", "right", "left"]}
      style={isDark ? { backgroundColor: colors.background } : undefined}
    >
      <Header scroll={scroll}>
        <HeaderTitle>Settings</HeaderTitle>
      </Header>
      <HeaderScrollView
        scroll={scroll}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
      >
        <HeaderLargeTitle>Settings</HeaderLargeTitle>
        <View style={styles.body}>
          <InputGroup
            style={[styles.search, isDark && { backgroundColor: colors.muted }]}
          >
            <InputGroupAddon>
              <Icon
                as={MagnifyingGlassIcon}
                weight="bold"
                size={16}
                color={colors.mutedForeground}
              />
            </InputGroupAddon>
            <InputGroupInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search"
              accessibilityLabel="Search settings"
              returnKeyType="search"
              autoCorrect={false}
              clearButtonMode="while-editing"
              style={fontSize.lg}
            />
          </InputGroup>
          {query ? null : (
            <ItemGroup variant="inset" style={group}>
              <Item size="sm" onPress={onAccountPress} style={styles.account}>
                <Avatar size="xl" style={{ width: 58, height: 58 }}>
                  <AvatarFallback
                    style={{ backgroundColor: palette.indigo500 }}
                  >
                    <Text style={fontSize.xl}>JR</Text>
                  </AvatarFallback>
                </Avatar>
                <ItemContent style={{ gap: 2 }}>
                  <ItemTitle style={[fontSize.xl, { fontWeight: "600" }]}>
                    Jamie Rivera
                  </ItemTitle>
                  <ItemDescription style={fontSize.sm}>
                    suiss Account, Cloud and more
                  </ItemDescription>
                </ItemContent>
                <Chevron />
              </Item>
            </ItemGroup>
          )}
          {visible.map((rows) => (
            <ItemGroup key={rows[0].label} variant="inset" style={group}>
              {rows.map((row, index) => {
                const detail = row.detail?.(toggles)
                const toggle = row.toggle
                return (
                  <React.Fragment key={row.label}>
                    {index > 0 ? (
                      <ItemSeparator style={{ marginStart: 57 }} />
                    ) : null}
                    <Item
                      size="sm"
                      onPress={
                        toggle ? undefined : () => onRowPress?.(row.label)
                      }
                      style={styles.row}
                    >
                      <ItemMedia
                        style={[
                          styles.tile,
                          { backgroundColor: tone(colors, row.tint) },
                        ]}
                      >
                        <Icon
                          as={row.icon}
                          weight="bold"
                          size={17}
                          color={colors.primaryForeground}
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle
                          nativeID={
                            toggle ? `settings-device-${toggle}` : undefined
                          }
                          style={{ fontWeight: "400" }}
                        >
                          {row.label}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions style={{ gap: 6 }}>
                        {toggle ? (
                          <Switch
                            checked={toggles[toggle]}
                            onCheckedChange={(value) =>
                              setToggle(toggle, value)
                            }
                            accessibilityLabelledBy={`settings-device-${toggle}`}
                          />
                        ) : (
                          <>
                            {detail ? <Text>{detail}</Text> : null}
                            <Chevron />
                          </>
                        )}
                      </ItemActions>
                    </Item>
                  </React.Fragment>
                )
              })}
            </ItemGroup>
          ))}
          {visible.length === 0 ? (
            <Text style={[styles.empty, { color: colors.mutedForeground }]}>
              No Results
            </Text>
          ) : null}
        </View>
      </HeaderScrollView>
    </Screen>
  )
}

export { SettingsDevice }
