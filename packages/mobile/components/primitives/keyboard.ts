import * as React from "react"
import {
  Dimensions,
  Keyboard,
  type KeyboardEvent,
  type KeyboardMetrics,
  Platform,
  useWindowDimensions,
} from "react-native"

interface KeyboardFrame {
  height: number
  accessoryHeight: number
  duration: number
}

let accessoryHeight = 0
const listeners = new Set<() => void>()

function subscribeAccessory(listener: () => void) {
  listeners.add(listener)
  return () => {
    listeners.delete(listener)
  }
}

function getAccessoryHeight() {
  return accessoryHeight
}

function setKeyboardAccessoryHeight(height: number) {
  if (accessoryHeight === height) return
  accessoryHeight = height
  for (const listener of listeners) listener()
}

function keyboardHeight(metrics: KeyboardMetrics, windowHeight: number) {
  const bottom =
    Platform.OS === "ios" ? windowHeight : Dimensions.get("screen").height
  return Math.max(0, bottom - metrics.screenY)
}

function useKeyboard(): KeyboardFrame {
  const { height: windowHeight } = useWindowDimensions()
  const [frame, setFrame] = React.useState({ height: 0, duration: 250 })
  const accessory = React.useSyncExternalStore(
    subscribeAccessory,
    getAccessoryHeight,
    getAccessoryHeight
  )

  React.useEffect(() => {
    const show = Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow"
    const hide = Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide"
    const onShow = (event: KeyboardEvent) => {
      setFrame({
        height: keyboardHeight(event.endCoordinates, windowHeight),
        duration: event.duration || 250,
      })
    }
    const onHide = (event: KeyboardEvent) => {
      setFrame({ height: 0, duration: event?.duration || 250 })
    }
    const subscriptions = [
      Keyboard.addListener(show, onShow),
      Keyboard.addListener("keyboardDidChangeFrame", onShow),
      Keyboard.addListener(hide, onHide),
    ]
    const metrics = Keyboard.metrics()
    if (metrics) {
      setFrame((current) =>
        current.height > 0
          ? current
          : {
              height: keyboardHeight(metrics, windowHeight),
              duration: current.duration,
            }
      )
    }
    return () => {
      for (const subscription of subscriptions) subscription.remove()
    }
  }, [windowHeight])

  const height = frame.height > 0 ? frame.height + accessory : 0

  return {
    height,
    accessoryHeight: frame.height > 0 ? accessory : 0,
    duration: frame.duration,
  }
}

export type { KeyboardFrame }
export { setKeyboardAccessoryHeight, useKeyboard }
