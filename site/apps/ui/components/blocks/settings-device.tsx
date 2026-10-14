"use client"

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
  SpeakerHighIcon,
  SunIcon,
  WifiHighIcon,
} from "@phosphor-icons/react"
import * as React from "react"

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
  icon: React.ElementType
  tint: string
  toggle?: keyof Toggles
  detail?: (toggles: Toggles) => string
}

const groups: Row[][] = [
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

function RowLink(props: React.ComponentProps<"a">) {
  return <a {...props} />
}

const groupClass = "shrink-0 bg-surface dark:bg-surface-secondary"

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
    <section className="flex min-h-170 items-center justify-center bg-surface-secondary sm:p-5">
      <div className="relative flex w-full flex-col overflow-hidden bg-surface-secondary sm:h-165 sm:w-90 sm:rounded-[3.125rem] sm:border-[10px] sm:border-black sm:shadow-[0_0_0_1.5px_var(--color-label-tertiary),0_30px_60px_-20px_rgb(0_0_0/0.45)] dark:bg-surface">
        <div
          aria-hidden
          className="hidden h-12.5 shrink-0 items-center justify-between ps-8.5 pe-7 pt-1 text-base font-semibold sm:flex"
        >
          <span>9:41</span>
          <span className="flex items-center gap-1.25">
            <CellSignalFullIcon weight="bold" className="size-3.75" />
            {toggles.wifi && (
              <WifiHighIcon weight="bold" className="size-3.75" />
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
          <InputGroup className="-mt-2 h-9 shrink-0 rounded-[0.625rem] dark:bg-surface-secondary">
            <InputGroupAddon>
              <MagnifyingGlassIcon weight="bold" />
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
                  render={<RowLink href="#account" />}
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
                  <CaretRightIcon
                    weight="bold"
                    className="size-3.5 text-label-tertiary rtl:rotate-180"
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
                const Icon = row.icon
                const detail = row.detail?.(toggles)
                const switchId = `settings-device-${row.toggle}`
                return (
                  <div key={row.label} role="listitem" className="contents">
                    {index > 0 && <ItemSeparator />}
                    <Item
                      size="sm"
                      render={
                        row.toggle ? (
                          <div />
                        ) : (
                          <RowLink href={`#${row.label}`} />
                        )
                      }
                      className="min-h-11 gap-3.5 py-1.5"
                    >
                      <ItemMedia
                        className={`size-7.25 rounded-[7px] text-white ${row.tint}`}
                      >
                        <Icon weight="bold" className="size-4.25" />
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
                      <ItemActions className="gap-1.5 text-base text-label-secondary">
                        {row.toggle ? (
                          <Switch
                            id={switchId}
                            checked={toggles[row.toggle]}
                            onCheckedChange={(value) =>
                              setToggle(row.toggle as keyof Toggles, value)
                            }
                          />
                        ) : (
                          <>
                            {detail}
                            <CaretRightIcon
                              weight="bold"
                              className="size-3.5 text-label-tertiary rtl:rotate-180"
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
            <p className="p-7.5 text-center text-base text-label-secondary">
              No Results
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
