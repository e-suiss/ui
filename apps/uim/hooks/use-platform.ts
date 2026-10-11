import * as React from "react"

const MAC_PLATFORM = /mac|iphone|ipad|ipod/i

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string }
}

let isMac: boolean | undefined

export function isMacPlatform() {
  if (isMac === undefined) {
    const { userAgentData, platform } = navigator as NavigatorWithUserAgentData
    isMac = MAC_PLATFORM.test(userAgentData?.platform || platform)
  }
  return isMac
}

function subscribe() {
  return () => undefined
}

function getServerSnapshot() {
  return false
}

export function useIsMac() {
  return React.useSyncExternalStore(subscribe, isMacPlatform, getServerSnapshot)
}

export function useModifierKey(withKey = false) {
  const isMac = useIsMac()
  if (isMac) return "⌘"
  return withKey ? "Ctrl+" : "Ctrl"
}
