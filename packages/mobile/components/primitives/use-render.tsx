import * as React from "react"
import { useComposedRefs } from "./hooks"
import { mergeClassNames, mergeProps, mergeStyles } from "./merge-props"
import type { ClassNameProp, RenderProp, StyleValue } from "./types"

type AnyProps = Record<string, unknown>

type RefInput<T> = React.Ref<T> | undefined

interface UseRenderParameters<State, RefType = unknown, Props = AnyProps> {
  defaultComponent?: React.ElementType | undefined
  render?: RenderProp<Props, State> | undefined
  props?: object | readonly (object | null | undefined)[] | undefined
  state?: State | undefined
  ref?: RefInput<RefType> | readonly RefInput<RefType>[] | undefined
  className?: ClassNameProp<State>
  style?: StyleValue<unknown, State>
  enabled?: boolean | undefined
}

const EMPTY_STATE = {}

function resolveClassName<State>(
  className: ClassNameProp<State>,
  state: State
): string | undefined {
  return typeof className === "function" ? className(state) : className
}

function resolveStyle<State>(
  style: StyleValue<unknown, State>,
  state: State
): unknown {
  return typeof style === "function"
    ? (style as (value: State) => unknown)(state)
    : style
}

function getElementRef(element: unknown): React.Ref<unknown> | undefined {
  if (!React.isValidElement<AnyProps>(element)) return undefined
  return element.props.ref as React.Ref<unknown> | undefined
}

function toRefList<T>(
  ref: RefInput<T> | readonly RefInput<T>[] | undefined
): RefInput<T>[] {
  if (Array.isArray(ref)) return [...(ref as readonly RefInput<T>[])]
  return [ref as RefInput<T>]
}

function useRender<State extends object, RefType = unknown, Props = AnyProps>(
  parameters: UseRenderParameters<State, RefType, Props>
): React.ReactElement | null {
  const {
    defaultComponent,
    render,
    props,
    state = EMPTY_STATE as State,
    ref,
    className,
    style,
    enabled = true,
  } = parameters

  const propsList: readonly (object | null | undefined)[] = Array.isArray(props)
    ? props
    : [props as object | undefined]

  const merged = mergeProps(...propsList)

  const composedRef = useComposedRefs<unknown>(
    merged.ref as React.Ref<unknown> | undefined,
    getElementRef(render),
    ...(toRefList(ref) as RefInput<unknown>[])
  )

  if (!enabled) return null

  const resolvedClassName = resolveClassName(className, state)
  if (resolvedClassName !== undefined) {
    merged.className = mergeClassNames(
      merged.className as string | undefined,
      resolvedClassName
    )
  }

  const resolvedStyle = resolveStyle(style, state)
  if (resolvedStyle !== undefined) {
    merged.style = mergeStyles(merged.style, resolvedStyle)
  }

  merged.ref = composedRef

  if (typeof render === "function") {
    return render(merged as Props, state)
  }

  if (React.isValidElement<AnyProps>(render)) {
    const { ref: _elementRef, ...elementProps } = render.props
    const renderProps = mergeProps(merged, elementProps)
    renderProps.ref = composedRef
    return React.cloneElement(render, renderProps)
  }

  if (!defaultComponent) {
    throw new Error(
      "useRender requires a defaultComponent when no render prop is provided"
    )
  }

  const DefaultComponent = defaultComponent
  return <DefaultComponent {...merged} />
}

export type { UseRenderParameters }
export { resolveClassName, resolveStyle, useRender }
