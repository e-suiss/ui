"use client"

import { ChatCircleIcon, CheckIcon } from "@phosphor-icons/react"
import * as React from "react"

import {
  Item,
  ItemActions,
  ItemContent,
  ItemGroup,
  ItemSeparator,
  ItemTitle,
} from "@/components/ui/item"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Toggle } from "@/components/ui/toggle"
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group"

const wallpaper =
  "https://images.unsplash.com/photo-1707324148764-99647364afa3?w=600&q=80&auto=format&fit=crop"

type Alert = "lock" | "center" | "banner"

const alerts: { value: Alert; label: string }[] = [
  { value: "lock", label: "Lock Screen" },
  { value: "center", label: "Notification Center" },
  { value: "banner", label: "Banners" },
]

const previewOptions = ["Always", "When Unlocked", "Never"]
const groupingOptions = ["Automatic", "By App", "Off"]

const miniScreenBars: Record<Alert, number[]> = {
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
  const bars = miniScreenBars[kind]
  return (
    <span
      aria-hidden
      className="relative block h-23 w-16 overflow-hidden rounded-xl bg-linear-170 from-[oklch(0.75_0.08_250)] to-[oklch(0.6_0.1_290)] ring-2 ring-label ring-inset"
    >
      {kind === "lock" && (
        <span className="absolute inset-x-0 top-3.5 text-center text-sm font-semibold text-white">
          9:41
        </span>
      )}
      {bars.map((top, index) => (
        <span
          key={top}
          style={{ top, opacity: 1 - index * 0.15 }}
          className="absolute inset-x-2 h-3.25 rounded-sm bg-white shadow-[0_1px_3px_rgb(0_0_0/0.15)]"
        />
      ))}
    </span>
  )
}

function Notification({ body, stacked }: { body: string; stacked?: boolean }) {
  return (
    <div className="relative transition-[opacity,translate] duration-800 ease-[cubic-bezier(0.32,0.72,0,1)] starting:-translate-y-6 starting:opacity-0 motion-reduce:transition-none">
      {stacked && (
        <span className="absolute inset-x-2.5 -bottom-1.5 h-5 rounded-2xl bg-white/55" />
      )}
      <div className="relative flex gap-2.5 rounded-[1.125rem] bg-white/82 px-3 py-2.5 text-black/88 backdrop-blur-xl backdrop-saturate-180">
        <span className="flex size-7.5 shrink-0 items-center justify-center rounded-[7px] bg-green text-white">
          <ChatCircleIcon weight="fill" className="size-4.5" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-px">
          <div className="flex items-center gap-1.5">
            <span className="flex-1 text-xs font-semibold">Riley Morgan</span>
            <span className="text-2xs text-black/55">now</span>
          </div>
          <p className="text-xs leading-snug">{body}</p>
        </div>
      </div>
    </div>
  )
}

export function SettingsNotifications() {
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
    const timer = window.setTimeout(() => setBannerVisible(false), 2600)
    return () => window.clearTimeout(timer)
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

  return (
    <section className="grid min-h-140 bg-surface md:grid-cols-[minmax(0,1fr)_18.75rem]">
      <div className="flex flex-col gap-5 px-5 py-6 md:px-8">
        <div className="flex items-center gap-3">
          <span className="flex size-10 items-center justify-center rounded-[0.625rem] bg-green text-white">
            <ChatCircleIcon weight="fill" className="size-6" />
          </span>
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold tracking-tight">Messages</h1>
            <p className="text-sm text-label-secondary">Notifications</p>
          </div>
        </div>
        <ItemGroup variant="inset">
          <Item size="sm" role="listitem">
            <ItemContent>
              <ItemTitle className="text-base font-normal">
                <label htmlFor="settings-notifications-allow">
                  Allow Notifications
                </label>
              </ItemTitle>
            </ItemContent>
            <ItemActions>
              <Switch
                id="settings-notifications-allow"
                checked={allow}
                onCheckedChange={(value) => {
                  setAllow(value)
                  replay()
                }}
              />
            </ItemActions>
          </Item>
        </ItemGroup>
        <div
          inert={!allow}
          data-disabled={allow ? undefined : ""}
          className="flex flex-col gap-5 transition-opacity duration-300 data-disabled:opacity-35"
        >
          <h2 className="-mb-3 px-1 text-sm font-semibold">Alerts</h2>
          <ItemGroup variant="inset">
            <div role="listitem" className="flex px-2">
              {alerts.map((alert) => (
                <Toggle
                  key={alert.value}
                  pressed={enabled[alert.value]}
                  onPressedChange={(pressed) => {
                    setEnabled((current) => ({
                      ...current,
                      [alert.value]: pressed,
                    }))
                    replay()
                  }}
                  className="group/alert h-auto flex-1 flex-col gap-2 rounded-xl pt-3.5 pb-3 hover:bg-transparent aria-pressed:bg-transparent aria-pressed:text-label aria-pressed:hover:bg-transparent aria-pressed:hover:text-label"
                >
                  <MiniScreen kind={alert.value} />
                  <span className="text-sm">{alert.label}</span>
                  <span className="flex size-5.5 items-center justify-center rounded-full border-[1.5px] border-separator-strong text-white transition-[background-color,border-color] duration-250 group-aria-pressed/alert:border-transparent group-aria-pressed/alert:bg-accent">
                    <CheckIcon
                      weight="bold"
                      className="size-3 scale-0 transition-[scale] duration-250 ease-[cubic-bezier(0.3,1.25,0.5,1)] group-aria-pressed/alert:scale-100"
                    />
                  </span>
                </Toggle>
              ))}
            </div>
            {enabled.banner && (
              <>
                <ItemSeparator />
                <Item size="sm" role="listitem">
                  <ItemContent>
                    <ItemTitle className="text-base font-normal">
                      Banner Style
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <ToggleGroup
                      spacing={0}
                      value={[bannerStyle]}
                      onValueChange={(value: string[]) => {
                        if (!value[0]) return
                        setBannerStyle(value[0])
                        replay()
                      }}
                      aria-label="Banner style"
                    >
                      <ToggleGroupItem value="temporary" size="sm">
                        Temporary
                      </ToggleGroupItem>
                      <ToggleGroupItem value="persistent" size="sm">
                        Persistent
                      </ToggleGroupItem>
                    </ToggleGroup>
                  </ItemActions>
                </Item>
              </>
            )}
            <ItemSeparator />
            <Item size="sm" role="listitem">
              <ItemContent>
                <ItemTitle className="text-base font-normal">
                  <label htmlFor="settings-notifications-sounds">Sounds</label>
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <Switch
                  id="settings-notifications-sounds"
                  checked={sounds}
                  onCheckedChange={setSounds}
                />
              </ItemActions>
            </Item>
            <ItemSeparator />
            <Item size="sm" role="listitem">
              <ItemContent>
                <ItemTitle className="text-base font-normal">
                  <label htmlFor="settings-notifications-badges">Badges</label>
                </ItemTitle>
              </ItemContent>
              <ItemActions>
                <Switch
                  id="settings-notifications-badges"
                  checked={badges}
                  onCheckedChange={setBadges}
                />
              </ItemActions>
            </Item>
          </ItemGroup>
          <h2 className="-mb-3 px-1 text-sm font-semibold">Appearance</h2>
          <ItemGroup variant="inset">
            {[
              {
                label: "Show Previews",
                value: previews,
                options: previewOptions,
                onChange: (value: string) => {
                  setPreviews(value)
                  replay()
                },
              },
              {
                label: "Notification Grouping",
                value: grouping,
                options: groupingOptions,
                onChange: setGrouping,
              },
            ].map((row, index) => (
              <React.Fragment key={row.label}>
                {index > 0 && <ItemSeparator />}
                <Item size="sm" role="listitem">
                  <ItemContent>
                    <ItemTitle className="text-base font-normal">
                      {row.label}
                    </ItemTitle>
                  </ItemContent>
                  <ItemActions>
                    <Select
                      value={row.value}
                      onValueChange={(value) => row.onChange(value as string)}
                    >
                      <SelectTrigger
                        size="sm"
                        aria-label={row.label}
                        className="bg-transparent px-1 text-label-secondary"
                      >
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent align="end">
                        {row.options.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </ItemActions>
                </Item>
              </React.Fragment>
            ))}
          </ItemGroup>
        </div>
      </div>
      <div className="flex items-center justify-center bg-surface-secondary p-5">
        <div className="h-117.5 w-57.5 rounded-[2.625rem] border-8 border-black shadow-[0_0_0_1.5px_var(--color-label-tertiary),0_20px_50px_-20px_rgb(0_0_0/0.4)]">
          <div
            role="img"
            aria-label={`Lock screen preview. ${footnote}.`}
            style={{ backgroundImage: `url(${wallpaper})` }}
            className="relative size-full overflow-hidden rounded-[2.125rem] bg-cover bg-center text-white"
          >
            <span className="absolute inset-0 bg-linear-to-b from-black/15 to-black/35" />
            <span className="absolute top-2 left-1/2 h-5.5 w-18.5 -translate-x-1/2 rounded-full bg-black" />
            <div className="absolute inset-x-0 top-12.5 text-center">
              <p className="text-xs font-semibold opacity-90">
                Tuesday, October 6
              </p>
              <p className="text-6xl leading-none font-semibold tracking-tighter">
                9:41
              </p>
            </div>
            {allow && enabled.banner && bannerVisible && (
              <div key={bannerKey} className="absolute inset-x-2 top-9.5">
                <Notification body={body} />
              </div>
            )}
            {allow && enabled.lock && (
              <div className="absolute inset-x-2 top-75">
                <Notification body={body} stacked={grouping !== "Off"} />
              </div>
            )}
            <p className="absolute inset-x-0 bottom-3.5 text-center text-2xs opacity-85">
              {footnote}
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
