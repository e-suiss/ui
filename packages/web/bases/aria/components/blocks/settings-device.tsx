"use client"

import * as React from "react"

import { IconPlaceholder } from "@/app/(create)/components/icon-placeholder"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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
import { Switch } from "@/components/ui/switch"

type Toggles = {
  airplane: boolean
  wifi: boolean
  bluetooth: boolean
  focus: boolean
}

type Row = {
  label: string
  icon: React.ReactNode
  tint: string
  toggle?: keyof Toggles
  detail?: (toggles: Toggles) => string
}

const groups: Row[][] = [
  [
    {
      label: "Airplane Mode",
      icon: (
        <IconPlaceholder
          lucide="PlaneIcon"
          tabler="IconPlane"
          hugeicons="AirplaneIcon"
          phosphor="AirplaneIcon"
          remixicon="RiPlaneLine"
          className="size-4.25"
        />
      ),
      tint: "bg-orange-500",
      toggle: "airplane",
    },
    {
      label: "Wi-Fi",
      icon: (
        <IconPlaceholder
          lucide="WifiIcon"
          tabler="IconWifi"
          hugeicons="Wifi01Icon"
          phosphor="WifiHighIcon"
          remixicon="RiWifiLine"
          className="size-4.25"
        />
      ),
      tint: "bg-blue-500",
      detail: (toggles) => (toggles.wifi ? "Home" : "Off"),
    },
    {
      label: "Bluetooth",
      icon: (
        <IconPlaceholder
          lucide="BluetoothIcon"
          tabler="IconBluetooth"
          hugeicons="BluetoothIcon"
          phosphor="BluetoothIcon"
          remixicon="RiBluetoothLine"
          className="size-4.25"
        />
      ),
      tint: "bg-blue-500",
      detail: (toggles) => (toggles.bluetooth ? "On" : "Off"),
    },
    {
      label: "Cellular",
      icon: (
        <IconPlaceholder
          lucide="SignalIcon"
          tabler="IconAntennaBars5"
          hugeicons="SignalFull02Icon"
          phosphor="CellSignalFullIcon"
          remixicon="RiSignalCellular3Line"
          className="size-4.25"
        />
      ),
      tint: "bg-green-500",
      detail: (toggles) => (toggles.airplane ? "Off" : ""),
    },
  ],
  [
    {
      label: "Notifications",
      icon: (
        <IconPlaceholder
          lucide="BellIcon"
          tabler="IconBell"
          hugeicons="Notification03Icon"
          phosphor="BellIcon"
          remixicon="RiNotificationLine"
          className="size-4.25"
        />
      ),
      tint: "bg-red-500",
    },
    {
      label: "Sounds & Haptics",
      icon: (
        <IconPlaceholder
          lucide="Volume2Icon"
          tabler="IconVolume"
          hugeicons="VolumeHighIcon"
          phosphor="SpeakerHighIcon"
          remixicon="RiVolumeUpLine"
          className="size-4.25"
        />
      ),
      tint: "bg-pink-500",
    },
    {
      label: "Focus",
      icon: (
        <IconPlaceholder
          lucide="MoonIcon"
          tabler="IconMoon"
          hugeicons="MoonIcon"
          phosphor="MoonIcon"
          remixicon="RiMoonLine"
          className="size-4.25"
        />
      ),
      tint: "bg-indigo-500",
      toggle: "focus",
    },
    {
      label: "Screen Time",
      icon: (
        <IconPlaceholder
          lucide="HourglassIcon"
          tabler="IconHourglass"
          hugeicons="HourglassIcon"
          phosphor="HourglassIcon"
          remixicon="RiHourglassLine"
          className="size-4.25"
        />
      ),
      tint: "bg-indigo-500",
    },
  ],
  [
    {
      label: "General",
      icon: (
        <IconPlaceholder
          lucide="SettingsIcon"
          tabler="IconSettings"
          hugeicons="Settings01Icon"
          phosphor="GearIcon"
          remixicon="RiSettingsLine"
          className="size-4.25"
        />
      ),
      tint: "bg-zinc-500",
    },
    {
      label: "Display & Brightness",
      icon: (
        <IconPlaceholder
          lucide="SunIcon"
          tabler="IconSun"
          hugeicons="Sun03Icon"
          phosphor="SunIcon"
          remixicon="RiSunLine"
          className="size-4.25"
        />
      ),
      tint: "bg-blue-500",
    },
  ],
]

function RowLink(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

const groupClass = "shrink-0 bg-background dark:bg-muted"

export function SettingsDevice() {
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
  const visible = groups
    .map((rows) => rows.filter((row) => matches(row.label)))
    .filter((rows): rows is [Row, ...Row[]] => rows.length > 0)

  return (
    <section className="flex min-h-170 items-center justify-center bg-muted sm:p-5">
      <div className="relative flex w-full flex-col overflow-hidden bg-muted sm:h-165 sm:w-90 sm:rounded-[3.125rem] sm:border-[10px] sm:border-black sm:shadow-[0_0_0_1.5px_var(--color-muted-foreground),0_30px_60px_-20px_rgb(0_0_0/0.45)] dark:bg-background">
        <div
          aria-hidden
          className="hidden h-12.5 shrink-0 items-center justify-between ps-8.5 pe-7 pt-1 text-base font-semibold sm:flex"
        >
          <span>9:41</span>
          <span className="flex items-center gap-1.25">
            <IconPlaceholder
              lucide="SignalIcon"
              tabler="IconAntennaBars5"
              hugeicons="SignalFull02Icon"
              phosphor="CellSignalFullIcon"
              remixicon="RiSignalCellular3Line"
              className="size-3.75"
            />
            {toggles.wifi && (
              <IconPlaceholder
                lucide="WifiIcon"
                tabler="IconWifi"
                hugeicons="Wifi01Icon"
                phosphor="WifiHighIcon"
                remixicon="RiWifiLine"
                className="size-3.75"
              />
            )}
            <span className="flex h-2.75 w-6 rounded-[3px] border border-current p-[1.5px]">
              <span className="flex-1 rounded-[1.5px] bg-current" />
            </span>
          </span>
        </div>
        <span
          aria-hidden
          className="absolute top-2.75 left-1/2 hidden h-7.25 w-25 -translate-x-1/2 rounded-full bg-black sm:block"
        />
        <div className="no-scrollbar flex flex-1 flex-col gap-4.5 overflow-y-auto px-4 pt-6 pb-6 sm:pt-1.5">
          <h1 className="px-1 text-4xl font-bold tracking-tight">Settings</h1>
          <InputGroup className="-mt-2 h-9 shrink-0 rounded-[0.625rem] dark:bg-muted">
            <InputGroupAddon>
              <IconPlaceholder
                lucide="SearchIcon"
                tabler="IconSearch"
                hugeicons="Search01Icon"
                phosphor="MagnifyingGlassIcon"
                remixicon="RiSearchLine"
              />
            </InputGroupAddon>
            <InputGroupInput
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search"
              aria-label="Search settings"
              className="text-lg"
            />
          </InputGroup>
          {!query && (
            <ItemGroup variant="inset" className={groupClass}>
              <div role="listitem" className="contents">
                <Item
                  size="sm"
                  render={(props) => <RowLink href="#account" {...props} />}
                  className="gap-3.5 py-2.5"
                >
                  <Avatar className="size-14.5">
                    <AvatarFallback className="bg-linear-to-br from-[oklch(0.78_0.1_250)] to-[oklch(0.6_0.15_280)] text-xl text-white dark:from-[oklch(0.78_0.1_250)] dark:to-[oklch(0.6_0.15_280)]">
                      JR
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
                  <IconPlaceholder
                    lucide="ChevronRightIcon"
                    tabler="IconChevronRight"
                    hugeicons="ArrowRight01Icon"
                    phosphor="CaretRightIcon"
                    remixicon="RiArrowRightSLine"
                    className="size-3.5 text-muted-foreground rtl:rotate-180"
                  />
                </Item>
              </div>
            </ItemGroup>
          )}
          {visible.map((rows) => (
            <ItemGroup
              key={rows[0].label}
              variant="inset"
              className={`${groupClass} **:data-[slot=item-separator]:ms-14.25`}
            >
              {rows.map((row, index) => {
                const detail = row.detail?.(toggles)
                const switchId = `settings-device-${row.toggle}`
                return (
                  <div key={row.label} role="listitem" className="contents">
                    {index > 0 && <ItemSeparator />}
                    <Item
                      size="sm"
                      render={(props) =>
                        row.toggle ? (
                          <div {...props} />
                        ) : (
                          <RowLink href={`#${row.label}`} {...props} />
                        )
                      }
                      className="min-h-11 gap-3.5 py-1.5"
                    >
                      <ItemMedia
                        className={`size-7.25 rounded-[7px] text-white ${row.tint}`}
                      >
                        {row.icon}
                      </ItemMedia>
                      <ItemContent>
                        <ItemTitle className="text-base font-normal">
                          {row.toggle ? (
                            <label htmlFor={switchId}>{row.label}</label>
                          ) : (
                            row.label
                          )}
                        </ItemTitle>
                      </ItemContent>
                      <ItemActions className="gap-1.5 text-base text-muted-foreground">
                        {row.toggle ? (
                          <Switch
                            id={switchId}
                            isSelected={toggles[row.toggle]}
                            onChange={(value) =>
                              setToggle(row.toggle as keyof Toggles, value)
                            }
                          />
                        ) : (
                          <>
                            {detail}
                            <IconPlaceholder
                              lucide="ChevronRightIcon"
                              tabler="IconChevronRight"
                              hugeicons="ArrowRight01Icon"
                              phosphor="CaretRightIcon"
                              remixicon="RiArrowRightSLine"
                              className="size-3.5 text-muted-foreground rtl:rotate-180"
                            />
                          </>
                        )}
                      </ItemActions>
                    </Item>
                  </div>
                )
              })}
            </ItemGroup>
          ))}
          {visible.length === 0 && (
            <p className="p-7.5 text-center text-base text-muted-foreground">
              No Results
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
