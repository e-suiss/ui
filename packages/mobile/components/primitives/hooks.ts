import * as React from "react"
import { BackHandler } from "react-native"

function useEffectEvent<TArgs extends readonly unknown[], TResult>(
  callback: (...args: TArgs) => TResult
): (...args: TArgs) => TResult {
  const callbackRef = React.useRef(callback)

  React.useLayoutEffect(() => {
    callbackRef.current = callback
  })

  return React.useCallback(
    (...args: TArgs): TResult => callbackRef.current(...args),
    []
  )
}

type PossibleRef<T> = React.Ref<T> | undefined

function assignRef<T>(ref: PossibleRef<T>, value: T | null) {
  if (typeof ref === "function") {
    const cleanup = ref(value)
    return typeof cleanup === "function" ? cleanup : undefined
  }
  if (ref != null) {
    ref.current = value
    return () => {
      ref.current = null
    }
  }
  return undefined
}

function composeRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  return (node) => {
    const cleanups = refs.map((ref) => assignRef(ref, node))
    return () => {
      refs.forEach((ref, index) => {
        const cleanup = cleanups[index]
        if (cleanup) cleanup()
        else if (typeof ref === "function") ref(null)
      })
    }
  }
}

interface ComposedRefsCache<T> {
  refs: PossibleRef<T>[]
  callback: React.RefCallback<T>
}

function useComposedRefs<T>(...refs: PossibleRef<T>[]): React.RefCallback<T> {
  const cacheRef = React.useRef<ComposedRefsCache<T> | null>(null)
  const cached = cacheRef.current
  if (
    cached &&
    cached.refs.length === refs.length &&
    cached.refs.every((ref, index) => ref === refs[index])
  ) {
    return cached.callback
  }
  const callback = composeRefs(...refs)
  cacheRef.current = { refs, callback }
  return callback
}

function useBackHandler(enabled: boolean, onBack: () => void) {
  const handleBack = useEffectEvent(onBack)

  React.useEffect(() => {
    if (!enabled) return
    const subscription = BackHandler.addEventListener(
      "hardwareBackPress",
      () => {
        handleBack()
        return true
      }
    )
    return () => subscription.remove()
  }, [enabled, handleBack])
}

export { useBackHandler, useComposedRefs, useEffectEvent }
