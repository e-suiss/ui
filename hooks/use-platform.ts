import * as React from "react"

type NavigatorWithUserAgentData = Navigator & {
  userAgentData?: { platform?: string }
}

let isMac: boolean | undefined

export function isMacPlatform() {
  if (isMac === undefined) {
    const { userAgentData, platform } = navigator as NavigatorWithUserAgentData
    isMac = /mac|iphone|ipad|ipod/i.test(userAgentData?.platform || platform)
  }
  return isMac
}

function subscribe() {
  return () => {}
}

function getServerSnapshot() {
  return false
}

export function useIsMac() {
  return React.useSyncExternalStore(subscribe, isMacPlatform, getServerSnapshot)
}

export function useModifierKey(withKey = false) {
  return useIsMac() ? "⌘" : withKey ? "Ctrl+" : "Ctrl"
}
