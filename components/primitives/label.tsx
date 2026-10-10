import * as React from "react"
import { Pressable, Text as RNText } from "react-native"
import type { BaseUIComponentProps } from "./types"
import { useRender } from "./use-render"

interface RootState {
  disabled: boolean
}

type TextState = RootState

type RootProps = Omit<
  BaseUIComponentProps<typeof Pressable, RootState>,
  "children"
> & {
  children?: React.ReactNode
  disabled?: boolean | undefined
}

type TextProps = BaseUIComponentProps<typeof RNText, TextState>

interface RootContextValue {
  state: RootState
}

const RootContext = React.createContext<RootContextValue | null>(null)

const DEFAULT_STATE: RootState = { disabled: false }

function Root({
  disabled = false,
  render,
  className,
  style,
  ref,
  ...elementProps
}: RootProps) {
  const state = React.useMemo<RootState>(() => ({ disabled }), [disabled])
  const context = React.useMemo<RootContextValue>(() => ({ state }), [state])

  const element = useRender({
    defaultComponent: Pressable,
    render,
    className,
    style,
    state,
    ref,
    props: [{ disabled }, elementProps],
  })

  return <RootContext.Provider value={context}>{element}</RootContext.Provider>
}

Root.displayName = "LabelRoot"

function Text({ render, className, style, ref, ...elementProps }: TextProps) {
  const context = React.useContext(RootContext)
  const state = context?.state ?? DEFAULT_STATE
  return useRender({
    defaultComponent: RNText,
    render,
    className,
    style,
    state,
    ref,
    props: [{ accessibilityState: { disabled: state.disabled } }, elementProps],
  })
}

Text.displayName = "LabelText"

export type { RootContextValue, RootProps, RootState, TextProps, TextState }
export { Root, Text }
