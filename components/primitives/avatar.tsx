import * as React from "react"
import {
  type ImageErrorEventData,
  type ImageLoadEventData,
  type ImageSourcePropType,
  type NativeSyntheticEvent,
  Image as RNImage,
  View,
} from "react-native"
import { Slot } from "./slot"
import type {
  ComponentPropsWithAsChild,
  ImageRef,
  SlottableViewProps,
  ViewRef,
} from "./types"

type AvatarStatus = "loading" | "loaded" | "error"

type RootProps = SlottableViewProps & {
  alt: string
}

type ImageProps = Omit<ComponentPropsWithAsChild<typeof RNImage>, "alt"> & {
  children?: React.ReactNode
  onLoadingStatusChange?: (status: "loaded" | "error") => void
}

type FallbackProps = SlottableViewProps

type RootRef = ViewRef
type FallbackRef = ViewRef

interface RootContextValue {
  alt: string
  status: AvatarStatus
  setStatus: (status: AvatarStatus) => void
}

const RootContext = React.createContext<RootContextValue | null>(null)

function useRootContext() {
  const context = React.useContext(RootContext)
  if (!context) {
    throw new Error(
      "Avatar compound components cannot be rendered outside the Avatar component"
    )
  }
  return context
}

function Root({
  asChild,
  alt,
  ref,
  ...props
}: RootProps & React.RefAttributes<RootRef>) {
  const [status, setStatus] = React.useState<AvatarStatus>("error")
  const value = React.useMemo(() => ({ alt, status, setStatus }), [alt, status])
  const Component = asChild ? Slot : View
  return (
    <RootContext.Provider value={value}>
      <Component ref={ref} {...props} />
    </RootContext.Provider>
  )
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

function Image({
  asChild,
  onLoad: onLoadProp,
  onError: onErrorProp,
  onLoadingStatusChange,
  ref,
  ...props
}: ImageProps & React.RefAttributes<ImageRef>) {
  const { alt, status, setStatus } = useRootContext()
  const sourceKey = getSourceKey(props.source)

  React.useLayoutEffect(() => {
    setStatus(sourceKey === null ? "error" : "loading")
    return () => setStatus("error")
  }, [sourceKey, setStatus])

  const onLoad = (event: NativeSyntheticEvent<ImageLoadEventData>) => {
    setStatus("loaded")
    onLoadingStatusChange?.("loaded")
    onLoadProp?.(event)
  }

  const onError = (event: NativeSyntheticEvent<ImageErrorEventData>) => {
    setStatus("error")
    onLoadingStatusChange?.("error")
    onErrorProp?.(event)
  }

  if (status === "error") return null

  const Component = asChild ? Slot : RNImage
  return (
    <Component
      ref={ref}
      alt={alt}
      accessibilityLabel={alt}
      onLoad={onLoad}
      onError={onError}
      {...props}
    />
  )
}

Image.displayName = "AvatarImage"

function Fallback({
  asChild,
  ref,
  ...props
}: FallbackProps & React.RefAttributes<FallbackRef>) {
  const { alt, status } = useRootContext()
  if (status !== "error") return null
  const Component = asChild ? Slot : View
  return <Component ref={ref} role="img" aria-label={alt} {...props} />
}

Fallback.displayName = "AvatarFallback"

export type {
  AvatarStatus,
  FallbackProps,
  FallbackRef,
  ImageProps,
  ImageRef,
  RootProps,
  RootRef,
}
export { Fallback, Image, Root, useRootContext }
