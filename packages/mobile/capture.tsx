import * as React from "react"
import { Platform, Settings, View } from "react-native"
import { ReduceMotion } from "react-native-reanimated"
import { FullWindowOverlay } from "react-native-screens"

const HELD_AFTER = 1000

export const capturing =
  Platform.OS === "ios"
    ? Boolean(Settings.get("capture"))
    : process.env.EXPO_PUBLIC_CAPTURE === "1"

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

let loading = 0
let shown = 0
const listeners = new Set<() => void>()

function track(change: number) {
  loading += change
  for (const listener of listeners) listener()
}

export function useShown() {
  React.useEffect(() => {
    shown += 1
    track(0)
    return () => {
      shown -= 1
      track(0)
    }
  }, [])
}

function subscribe(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function stillCarets() {
  const ReactNative = require("react-native") as typeof import("react-native")
  const NativeTextInput = ReactNative.TextInput
  function StillTextInput(props: React.ComponentProps<typeof NativeTextInput>) {
    return <NativeTextInput {...props} caretHidden />
  }
  Object.assign(StillTextInput, { State: NativeTextInput.State })
  Object.defineProperty(ReactNative, "TextInput", {
    configurable: true,
    enumerable: true,
    get: () => StillTextInput,
  })
}

function trackedImages() {
  const ReactNative = require("react-native") as typeof import("react-native")
  const NativeImage = ReactNative.Image
  function TrackedImage(props: React.ComponentProps<typeof NativeImage>) {
    const started = React.useRef(false)
    const loaded = React.useRef(false)
    React.useEffect(
      () => () => {
        if (started.current) track(-1)
      },
      []
    )
    const finish = () => {
      loaded.current = true
      if (!started.current) return
      started.current = false
      track(-1)
    }
    return (
      <NativeImage
        {...props}
        onLoadStart={() => {
          if (!started.current && !loaded.current) {
            started.current = true
            track(1)
          }
          props.onLoadStart?.()
        }}
        onLoad={(event) => {
          finish()
          props.onLoad?.(event)
        }}
        onError={(event) => {
          finish()
          props.onError?.(event)
        }}
        onLoadEnd={() => {
          finish()
          props.onLoadEnd?.()
        }}
      />
    )
  }
  Object.assign(TrackedImage, {
    abortPrefetch: NativeImage.abortPrefetch,
    getSize: NativeImage.getSize,
    getSizeWithHeaders: NativeImage.getSizeWithHeaders,
    prefetch: NativeImage.prefetch,
    prefetchWithMetadata: NativeImage.prefetchWithMetadata,
    queryCache: NativeImage.queryCache,
    resolveAssetSource: NativeImage.resolveAssetSource,
  })
  Object.defineProperty(ReactNative, "Image", {
    configurable: true,
    enumerable: true,
    get: () => TrackedImage,
  })
}

export function ReadyMarker() {
  const ready = React.useSyncExternalStore(
    subscribe,
    () => shown > 0 && loading === 0
  )
  React.useEffect(() => {
    if (Platform.OS === "android") {
      // biome-ignore lint/suspicious/noConsole: the capture script reads readiness from logcat
      console.log(`esuiss-capture ${ready ? "ready" : "busy"}`)
    }
  }, [ready])
  if (!ready || Platform.OS !== "ios") return null
  return (
    <FullWindowOverlay>
      <View
        pointerEvents="none"
        style={{
          position: "absolute",
          top: 50,
          left: 0,
          width: 10,
          height: 10,
          backgroundColor: "#ff00ff",
        }}
      />
    </FullWindowOverlay>
  )
}

if (capturing) {
  holdTimers()
  stillSpinners()
  trackedImages()
  stillCarets()
  Object.assign(ReduceMotion, { Never: ReduceMotion.Always })
}
