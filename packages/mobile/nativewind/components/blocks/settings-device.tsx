import { cn } from "cn"
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
import { I18nManager, View } from "react-native"
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

type Toggles = {
  airplane: boolean
  wifi: boolean
  bluetooth: boolean
  focus: boolean
}

type Row = {
  label: string
  icon: PhosphorIcon
  tint: string
  toggle?: keyof Toggles
  detail?: (toggles: Toggles) => string
}

const GROUPS: Row[][] = [
  [
    {
      label: "Airplane Mode",
      icon: AirplaneIcon,
      tint: "bg-orange",
      toggle: "airplane",
    },
    {
      label: "Wi-Fi",
      icon: WifiHighIcon,
      tint: "bg-blue",
      detail: (toggles) => (toggles.wifi ? "Home" : "Off"),
    },
    {
      label: "Bluetooth",
      icon: BluetoothIcon,
      tint: "bg-blue",
      detail: (toggles) => (toggles.bluetooth ? "On" : "Off"),
    },
    {
      label: "Cellular",
      icon: CellSignalFullIcon,
      tint: "bg-green",
      detail: (toggles) => (toggles.airplane ? "Off" : ""),
    },
  ],
  [
    { label: "Notifications", icon: BellIcon, tint: "bg-red" },
    { label: "Sounds & Haptics", icon: SpeakerHighIcon, tint: "bg-pink" },
    { label: "Focus", icon: MoonIcon, tint: "bg-indigo", toggle: "focus" },
    { label: "Screen Time", icon: HourglassIcon, tint: "bg-indigo" },
  ],
  [
    { label: "General", icon: GearIcon, tint: "bg-gray" },
    { label: "Display & Brightness", icon: SunIcon, tint: "bg-blue" },
  ],
]

const GROUP_CLASS = "bg-surface dark:bg-surface-secondary"

function Chevron() {
  return (
    <Icon
      as={CaretRightIcon}
      weight="bold"
      className={cn(
        "size-3.5 text-label-tertiary",
        I18nManager.isRTL && "rotate-180"
      )}
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

  return (
    <Screen
      variant="secondary"
      edges={["top", "right", "left"]}
      className="dark:bg-surface"
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
        <View className="gap-[1.125rem] px-4 pb-8">
          <InputGroup className="h-9 rounded-[0.625rem] dark:bg-surface-secondary">
            <InputGroupAddon>
              <Icon
                as={MagnifyingGlassIcon}
                weight="bold"
                className="size-4 text-label-secondary"
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
              className="text-lg"
            />
          </InputGroup>
          {query ? null : (
            <ItemGroup variant="inset" className={GROUP_CLASS}>
              <Item
                size="sm"
                onPress={onAccountPress}
                className="gap-3.5 py-2.5"
              >
                <Avatar size="xl" className="size-[3.625rem]">
                  <AvatarFallback className="bg-indigo dark:bg-indigo">
                    <Text className="text-xl">JR</Text>
                  </AvatarFallback>
                </Avatar>
                <ItemContent className="gap-0.5">
                  <ItemTitle className="text-xl font-semibold">
                    Jamie Rivera
                  </ItemTitle>
                  <ItemDescription className="text-sm">
                    suiss Account, Cloud and more
                  </ItemDescription>
                </ItemContent>
                <Chevron />
              </Item>
            </ItemGroup>
          )}
          {visible.map((rows) => (
            <ItemGroup
              key={rows[0].label}
              variant="inset"
              className={GROUP_CLASS}
            >
              {rows.map((row, index) => {
                const detail = row.detail?.(toggles)
                const toggle = row.toggle
                return (
                  <React.Fragment key={row.label}>
                    {index > 0 ? (
                      <ItemSeparator className="ms-[3.5625rem]" />
                    ) : null}
                    <Item
                      size="sm"
                      onPress={
                        toggle ? undefined : () => onRowPress?.(row.label)
                      }
                      className="min-h-11 gap-3.5 py-1.5"
                    >
                      <ItemMedia
                        className={cn(
                          "size-[1.8125rem] rounded-[7px]",
                          row.tint
                        )}
                      >
                        <Icon
                          as={row.icon}
                          weight="bold"
                          className="size-[1.0625rem] text-on-accent"
                        />
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle
                          nativeID={
                            toggle ? `settings-device-${toggle}` : undefined
                          }
                          className="font-normal"
                        >
                          {row.label}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions className="gap-1.5">
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
            <Text className="p-[1.875rem] text-center text-base text-label-secondary">
              No Results
            </Text>
          ) : null}
        </View>
      </HeaderScrollView>
    </Screen>
  )
}

export { SettingsDevice }
