import * as React from "react"
import { type ImageSourcePropType, Image as RNImage, View } from "react-native"
import { useEffectEvent } from "./hooks"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

type ImageLoadingStatus = "idle" | "loading" | "loaded" | "error"

interface RootState {
  imageLoadingStatus: ImageLoadingStatus
}

type ImageState = RootState

type FallbackState = RootState

type RootProps = BaseUIComponentProps<typeof View, RootState>

type ImageProps = BaseUIComponentProps<typeof RNImage, ImageState> & {
  onLoadingStatusChange?: ((status: ImageLoadingStatus) => void) | undefined
}

type FallbackProps = BaseUIComponentProps<typeof View, FallbackState> & {
  delay?: number | undefined
}

interface RootContextValue {
  imageLoadingStatus: ImageLoadingStatus
  setImageLoadingStatus: (status: ImageLoadingStatus) => void
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error("Avatar parts must be rendered inside Avatar.Root")
  }
  return context
}

function Root({ render, className, style, ref, ...elementProps }: RootProps) {
  const [imageLoadingStatus, setImageLoadingStatus] =
    React.useState<ImageLoadingStatus>("idle")

  const state = React.useMemo<RootState>(
    () => ({ imageLoadingStatus }),
    [imageLoadingStatus]
  )

  const context = React.useMemo<RootContextValue>(
    () => ({ imageLoadingStatus, setImageLoadingStatus, state }),
    [imageLoadingStatus, state]
  )

  const element = useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    props: elementProps,
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "AvatarRoot"

function getSourceKey(source: ImageSourcePropType | undefined) {
  if (source == null) return null
  if (typeof source === "number") return String(source)
  const uris = (Array.isArray(source) ? source : [source])
    .map((item) => item.uri)
    .filter((uri): uri is string => Boolean(uri))
  return uris.length > 0 ? uris.join("|") : null
}

const LOADING_STYLE = { position: "absolute", opacity: 0 } as const

function Image({
  onLoadingStatusChange,
  render,
  className,
  style,
  ref,
  ...elementProps
}: ImageProps) {
  const { imageLoadingStatus, setImageLoadingStatus, state } = useRootContext()
  const sourceKey = getSourceKey(elementProps.source)

  const updateStatus = useEffectEvent((status: ImageLoadingStatus) => {
    setImageLoadingStatus(status)
    onLoadingStatusChange?.(status)
  })

  React.useLayoutEffect(() => {
    updateStatus(sourceKey === null ? "error" : "loading")
    return () => setImageLoadingStatus("idle")
  }, [sourceKey, updateStatus, setImageLoadingStatus])

  const onLoad = () => updateStatus("loaded")
  const onError = () => updateStatus("error")

  return useRender({
    defaultComponent: RNImage,
    render,
    className,
    style,
    state,
    ref,
    enabled:
      imageLoadingStatus === "loading" || imageLoadingStatus === "loaded",
    props: [
      {
        accessibilityLabel: elementProps.alt,
        onLoad,
        onError,
      },
      elementProps,
      imageLoadingStatus === "loaded"
        ? null
        : {
            style: LOADING_STYLE,
            accessibilityElementsHidden: true,
            importantForAccessibility: "no-hide-descendants",
          },
    ],
  })
}

Image.displayName = "AvatarImage"

function Fallback({
  delay,
  render,
  className,
  style,
  ref,
  ...elementProps
}: FallbackProps) {
  const { imageLoadingStatus, state } = useRootContext()
  const [delayPassed, setDelayPassed] = React.useState(delay === undefined)

  React.useEffect(() => {
    if (delay === undefined) return
    const timeout = setTimeout(() => setDelayPassed(true), delay)
    return () => clearTimeout(timeout)
  }, [delay])

  return useRender({
    defaultComponent: View,
    render,
    className,
    style,
    state,
    ref,
    enabled: imageLoadingStatus !== "loaded" && delayPassed,
    props: elementProps,
  })
}

Fallback.displayName = "AvatarFallback"

export type {
  FallbackProps,
  FallbackState,
  ImageLoadingStatus,
  ImageProps,
  ImageState,
  RootContextValue,
  RootProps,
  RootState,
}
export { Fallback, Image, Root, useRootContext }
