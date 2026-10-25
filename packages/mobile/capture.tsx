import type * as React from "react"
import { Platform, Settings } from "react-native"
import { ReduceMotion } from "react-native-reanimated"

const HELD_AFTER = 1000

export const capturing =
  Platform.OS === "ios" && Boolean(Settings.get("capture"))

function holdTimers() {
  const timeout = globalThis.setTimeout
  globalThis.setTimeout = ((
    handler: (...args: unknown[]) => void,
    ms = 0,
    ...args: unknown[]
  ) =>
    ms >= HELD_AFTER
      ? timeout(() => undefined, ms)
      : timeout(handler, ms, ...args)) as typeof setTimeout
  const interval = globalThis.setInterval
  globalThis.setInterval = ((_handler: unknown, ms = 0) =>
    interval(() => undefined, ms)) as typeof setInterval
}

function stillSpinners() {
  const ReactNative = require("react-native") as typeof import("react-native")
  const Spinner = ReactNative.ActivityIndicator
  function StillSpinner(props: React.ComponentProps<typeof Spinner>) {
    return <Spinner {...props} animating={false} hidesWhenStopped={false} />
  }
  Object.defineProperty(ReactNative, "ActivityIndicator", {
    configurable: true,
    enumerable: true,
    get: () => StillSpinner,
  })
}

if (capturing) {
  holdTimers()
  stillSpinners()
  Object.assign(ReduceMotion, { Never: ReduceMotion.Always })
}
