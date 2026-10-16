"use client"

import * as React from "react"
import { isPlatform, KEY, PLATFORM_LABELS, type Platform } from "@/lib/platform"

const listeners = new Set<() => void>()
let current: Platform | null = null

function readStored(): Platform | null {
  try {
    const query = new URLSearchParams(window.location.search).get("platform")
    if (isPlatform(query)) return query
    const stored = window.localStorage.getItem(KEY)
    return isPlatform(stored) ? stored : null
  } catch {
    return null
  }
}

function apply(platform: Platform) {
  document.documentElement.dataset.platform = platform
  window.dispatchEvent(new Event("platformchange"))
}

function snapshot() {
  if (current === null) current = readStored()
  return current
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function persist(platform: Platform) {
  try {
    window.localStorage.setItem(KEY, platform)
    const url = new URL(window.location.href)
    if (url.searchParams.has("platform")) {
      url.searchParams.set("platform", platform)
      window.history.replaceState(window.history.state, "", url)
    }
    return true
  } catch {
    return false
  }
}

export function selectPlatform(platform: Platform) {
  current = platform
  persist(platform)
  apply(platform)
  for (const listener of listeners) listener()
}

export function useActivePlatform(available: Platform[]) {
  const stored = React.useSyncExternalStore(subscribe, snapshot, () => null)
  return stored && available.includes(stored) ? stored : available[0]
}

function hashTargets() {
  try {
    const id = decodeURIComponent(window.location.hash.slice(1))
    return id
      ? [...document.querySelectorAll<HTMLElement>(`[id="${CSS.escape(id)}"]`)]
      : []
  } catch {
    return []
  }
}

function platformOf(target: HTMLElement, available: Platform[]) {
  let candidates = available
  for (
    let section = target.closest<HTMLElement>("[data-only]");
    section;
    section = section.parentElement?.closest<HTMLElement>("[data-only]") ?? null
  ) {
    const own = (section.dataset.only ?? "").split(" ")
    candidates = candidates.filter((platform) => own.includes(platform))
  }
  return candidates[0]
}

function useHashPlatform(platforms: Platform[]) {
  React.useEffect(() => {
    const reveal = () => {
      const targets = hashTargets()
      const target = targets[0]
      if (
        !target?.closest("[data-only]") ||
        targets.some((item) => item.getClientRects().length > 0)
      )
        return
      const platform = platformOf(target, platforms)
      if (!platform) return
      selectPlatform(platform)
      requestAnimationFrame(() => target.scrollIntoView())
    }
    reveal()
    window.addEventListener("hashchange", reveal)
    return () => window.removeEventListener("hashchange", reveal)
  }, [platforms])
}

export function PlatformScope({
  platforms,
  children,
}: {
  platforms: Platform[]
  children: React.ReactNode
}) {
  useHashPlatform(platforms)
  return (
    <div
      data-platform-scope=""
      data-platforms={platforms.join(" ")}
      data-first={platforms[0]}
      className="contents"
    >
      {children}
    </div>
  )
}

export function PlatformSwitcher({ platforms }: { platforms: Platform[] }) {
  const active = useActivePlatform(platforms)
  return (
    <div
      role="tablist"
      aria-label="Platform"
      className="flex gap-5 overflow-x-auto overflow-y-hidden border-b border-foreground/12 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
    >
      {platforms.map((platform) => (
        <button
          key={platform}
          type="button"
          role="tab"
          aria-selected={active === platform}
          onClick={() => selectPlatform(platform)}
          className="relative h-10 shrink-0 cursor-pointer text-[15px] font-medium tracking-[-0.01em] text-foreground/45 outline-none transition-colors hover:text-foreground focus-visible:ring-3 focus-visible:ring-ring/50"
        >
          {PLATFORM_LABELS[platform]}
          <span data-only={platform} aria-hidden className="contents">
            <span className="absolute inset-0 flex items-center text-foreground">
              {PLATFORM_LABELS[platform]}
            </span>
            <span className="absolute inset-x-0 -bottom-px h-[1.5px] rounded-full bg-foreground" />
          </span>
        </button>
      ))}
    </div>
  )
}

const SectionContext = React.createContext<string | undefined>(undefined)

export const usePlatformSection = () => React.useContext(SectionContext)

export function Only({
  platform,
  children,
}: {
  platform: string
  children: React.ReactNode
}) {
  return (
    <SectionContext.Provider value={platform}>
      <div data-only={platform} className="contents">
        {children}
      </div>
    </SectionContext.Provider>
  )
}
