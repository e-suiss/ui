import { cn } from "cn"
import type { IconProps as PhosphorIconProps } from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import { Gesture, GestureDetector } from "react-native-gesture-handler"
import Svg, { Path } from "react-native-svg"
import { Button } from "@/components/ui/button"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

type SignaturePadPoint = { x: number; y: number }

type SignaturePadStroke = SignaturePadPoint[]

type SignaturePadHandle = {
  toSVG: (options?: { color?: string }) => string
  clear: () => void
  isEmpty: () => boolean
}

type SignaturePadContextValue = {
  strokes: SignaturePadStroke[]
  strokeWidth: number
}

const SignaturePadContext = React.createContext<SignaturePadContextValue>({
  strokes: [],
  strokeWidth: 2.5,
})

function round(value: number) {
  return Math.round(value * 10) / 10
}

function strokePath(stroke: SignaturePadStroke) {
  const [first, ...rest] = stroke
  if (!first) return ""
  if (rest.length === 0) {
    return `M${round(first.x)} ${round(first.y)}L${round(first.x)} ${round(first.y)}`
  }
  let path = `M${round(first.x)} ${round(first.y)}`
  for (let index = 1; index < stroke.length - 1; index++) {
    const point = stroke[index]
    const next = stroke[index + 1]
    if (!point || !next) continue
    path += `Q${round(point.x)} ${round(point.y)} ${round((point.x + next.x) / 2)} ${round((point.y + next.y) / 2)}`
  }
  const last = stroke[stroke.length - 1]
  if (last) path += `L${round(last.x)} ${round(last.y)}`
  return path
}

function signatureToSVG(
  strokes: SignaturePadStroke[],
  width: number,
  height: number,
  strokeWidth: number,
  color: string
) {
  const paths = strokes
    .filter((stroke) => stroke.length > 0)
    .map(
      (stroke) =>
        `<path d="${strokePath(stroke)}" fill="none" stroke="${color}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round"/>`
    )
    .join("")
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${round(width)}" height="${round(height)}" viewBox="0 0 ${round(width)} ${round(height)}">${paths}</svg>`
}

function SignaturePadStrokes({ color }: PhosphorIconProps) {
  const { strokes, strokeWidth } = React.useContext(SignaturePadContext)
  return (
    <Svg width="100%" height="100%">
      <Path
        d={strokes.map(strokePath).join("")}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  )
}

function SignaturePad({
  value: valueProp,
  defaultValue,
  onChange,
  strokeWidth = 2.5,
  disabled = false,
  placeholder = "Sign here",
  clearLabel = "Clear",
  accessibilityLabel = "Signature",
  className,
  ref,
  ...props
}: Omit<React.ComponentProps<typeof View>, "children"> & {
  value?: SignaturePadStroke[]
  defaultValue?: SignaturePadStroke[]
  onChange?: (value: SignaturePadStroke[]) => void
  strokeWidth?: number
  disabled?: boolean
  placeholder?: React.ReactNode
  clearLabel?: React.ReactNode
  ref?: React.Ref<SignaturePadHandle>
}) {
  const [uncontrolled, setUncontrolled] = React.useState<SignaturePadStroke[]>(
    defaultValue ?? []
  )
  const isControlled = valueProp !== undefined
  const value = isControlled ? valueProp : uncontrolled
  const valueRef = React.useRef(value)
  valueRef.current = value
  const [active, setActive] = React.useState<SignaturePadStroke | null>(null)
  const activeRef = React.useRef<SignaturePadStroke | null>(null)
  const sizeRef = React.useRef({ width: 0, height: 0 })

  const commit = React.useCallback(
    (next: SignaturePadStroke[]) => {
      valueRef.current = next
      if (!isControlled) setUncontrolled(next)
      onChange?.(next)
    },
    [isControlled, onChange]
  )

  const clear = React.useCallback(() => {
    activeRef.current = null
    setActive(null)
    if (valueRef.current.length === 0) return
    commit([])
  }, [commit])

  React.useImperativeHandle(
    ref,
    () => ({
      toSVG: (options) =>
        signatureToSVG(
          valueRef.current,
          sizeRef.current.width,
          sizeRef.current.height,
          strokeWidth,
          options?.color ?? "currentColor"
        ),
      clear,
      isEmpty: () => valueRef.current.length === 0,
    }),
    [clear, strokeWidth]
  )

  const gesture = React.useMemo(
    () =>
      Gesture.Pan()
        .runOnJS(true)
        .enabled(!disabled)
        .minDistance(0)
        .maxPointers(1)
        .onBegin((event) => {
          const stroke = [{ x: event.x, y: event.y }]
          activeRef.current = stroke
          setActive(stroke)
        })
        .onUpdate((event) => {
          const current = activeRef.current
          if (!current) return
          const last = current[current.length - 1]
          if (
            last &&
            Math.abs(last.x - event.x) < 1 &&
            Math.abs(last.y - event.y) < 1
          ) {
            return
          }
          const stroke = [...current, { x: event.x, y: event.y }]
          activeRef.current = stroke
          setActive(stroke)
        })
        .onFinalize(() => {
          const stroke = activeRef.current
          activeRef.current = null
          setActive(null)
          if (stroke && stroke.length > 0) commit([...valueRef.current, stroke])
        }),
    [disabled, commit]
  )

  const strokes = active ? [...value, active] : value
  const empty = strokes.length === 0
  const context = React.useMemo(
    () => ({ strokes, strokeWidth }),
    [strokes, strokeWidth]
  )

  return (
    <View
      accessible
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={{ text: empty ? "Empty" : "Signed" }}
      accessibilityState={{ disabled }}
      accessibilityActions={
        empty || disabled ? undefined : [{ name: "clear", label: "Clear" }]
      }
      onAccessibilityAction={(event) => {
        if (event.nativeEvent.actionName === "clear") clear()
      }}
      onLayout={(event) => {
        sizeRef.current = {
          width: event.nativeEvent.layout.width,
          height: event.nativeEvent.layout.height,
        }
      }}
      className={cn(
        "relative h-48 w-full overflow-hidden rounded-2xl border border-separator bg-surface-raised dark:bg-surface-secondary",
        disabled && "opacity-50",
        className
      )}
      {...props}
    >
      <View
        pointerEvents="none"
        className="absolute inset-x-6 bottom-12 flex-row items-end gap-2 border-b border-separator-strong pb-1.5"
      >
        <Text className="text-lg text-label-tertiary">×</Text>
        {empty ? (
          typeof placeholder === "string" || typeof placeholder === "number" ? (
            <Text className="text-sm text-label-tertiary">{placeholder}</Text>
          ) : (
            placeholder
          )
        ) : null}
      </View>
      <GestureDetector gesture={gesture}>
        <View className="absolute inset-0">
          <SignaturePadContext.Provider value={context}>
            <TextClassContext.Provider value={undefined}>
              <View pointerEvents="none" className="absolute inset-0">
                <Icon as={SignaturePadStrokes} className="text-label" />
              </View>
            </TextClassContext.Provider>
          </SignaturePadContext.Provider>
        </View>
      </GestureDetector>
      {!empty && !disabled ? (
        <View className="absolute end-2 top-2">
          <Button variant="ghost" size="sm" onPress={clear}>
            {typeof clearLabel === "string" ||
            typeof clearLabel === "number" ? (
              <Text>{clearLabel}</Text>
            ) : (
              clearLabel
            )}
          </Button>
        </View>
      ) : null}
    </View>
  )
}

export type { SignaturePadHandle, SignaturePadPoint, SignaturePadStroke }
export { SignaturePad }
