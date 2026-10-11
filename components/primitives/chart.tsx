import * as React from "react"
import {
  type AccessibilityActionEvent,
  type GestureResponderEvent,
  type LayoutChangeEvent,
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewProps,
} from "react-native"
import { useHaptics } from "./haptics"

type ChartDatum = Record<string, unknown>

type ChartValue = number | readonly [number, number]

type ChartCurve = "linear" | "natural" | "monotone" | "step"

type ChartMargin = {
  top?: number
  right?: number
  bottom?: number
  left?: number
}

type ChartConfigBase = Record<string, { label?: string; color?: string }>

type ChartGradient<C extends string = string> = {
  direction?: "vertical" | "horizontal"
  stops: { offset: number; color?: C; opacity?: number }[]
}

type ChartDot<C extends string = string> = {
  r?: number
  fill?: C
  stroke?: C
  strokeWidth?: number
}

type ChartPoint = { index: number; value: ChartValue; payload: ChartDatum }

type AxisDomainValue = number | "auto" | "dataMin" | "dataMax"

type AxisTick = string | number

type AxisDomain = readonly [AxisDomainValue, AxisDomainValue]

type CartesianGridProps = {
  vertical?: boolean
  strokeDasharray?: string
}

type XAxisProps = {
  dataKey?: string
  type?: "category" | "number"
  domain?: AxisDomain
  ticks?: readonly AxisTick[]
  interval?: number
  minTickGap?: number
  tickMargin?: number
  hide?: boolean
  tickFormatter?(value: AxisTick, index: number): string
}

type YAxisProps = {
  dataKey?: string
  type?: "category" | "number"
  orientation?: "left" | "right"
  width?: number | "auto"
  domain?: AxisDomain
  ticks?: readonly AxisTick[]
  tickCount?: number
  tickMargin?: number
  hide?: boolean
  tickClassName?: string
  tickStyle?: StyleProp<TextStyle>
  tickFormatter?(value: AxisTick, index: number): string
}

type LabelListProps = {
  dataKey?: string
  position?: "top" | "insideStart"
  offset?: number
  className?: string
  style?: StyleProp<TextStyle>
  formatter?(value: unknown): string | undefined
}

type CellProps<C extends string = string> = {
  fill?: C
  fillOpacity?: number
}

type LineProps<C extends string = string> = {
  dataKey: string
  type?: ChartCurve
  stroke?: C | "none"
  strokeWidth?: number
  strokeDasharray?: string
  dot?: false | ChartDot<C> | ((point: ChartPoint) => ChartDot<C> | false)
  activeDot?: false | ChartDot<C>
  children?: React.ReactNode
}

type AreaProps<C extends string = string> = {
  dataKey: string
  type?: ChartCurve
  stroke?: C | "none"
  strokeWidth?: number
  fill?: C | ChartGradient<C>
  fillOpacity?: number
  stackId?: string
  dot?: false | ChartDot<C> | ((point: ChartPoint) => ChartDot<C> | false)
  activeDot?: false | ChartDot<C>
}

type BarRadius = number | readonly [number, number, number, number]

type BarProps<C extends string = string> = {
  dataKey: string
  fill?: C | ChartGradient<C>
  radius?: BarRadius
  barSize?: number
  maxBarSize?: number
  stackId?: string
  background?: { fill?: C; fillOpacity?: number; radius?: number }
  children?: React.ReactNode
}

type ReferenceLineProps<C extends string = string> = {
  y: number
  stroke?: C
  strokeDasharray?: string
  label?: string
}

type ReferenceAreaProps<C extends string = string> = {
  x1: AxisTick
  x2: AxisTick
  fill?: C
  fillOpacity?: number
}

type SectorProps<C extends string = string> = {
  cx: number
  cy: number
  innerRadius: number
  outerRadius: number
  startAngle: number
  endAngle: number
  cornerRadius: number
  fill: C
  fillOpacity: number
  stroke?: C
  strokeWidth: number
}

type PieLabelEntry = { name: string; value: ChartValue; payload: ChartDatum }

type PieProps<C extends string = string> = {
  data: readonly ChartDatum[]
  dataKey: string
  nameKey: string
  cx?: number | string
  cy?: number | string
  innerRadius?: number | string
  outerRadius?: number | string
  startAngle?: number
  endAngle?: number
  paddingAngle?: number
  cornerRadius?: number
  stroke?: C | "none"
  strokeWidth?: number
  fillOpacity?: number
  label?: (entry: PieLabelEntry) => string | undefined
  labelLine?: { stroke?: C }
  shape?(
    sector: SectorProps<C>,
    index: number
  ): SectorProps<C> | SectorProps<C>[]
  children?: React.ReactNode
}

type RadialBarProps<C extends string = string> = {
  dataKey: string
  fill?: C
  stroke?: C
  strokeWidth?: number
  cornerRadius?: number
  stackId?: string
  background?: { fill?: C; fillOpacity?: number }
  children?: React.ReactNode
}

type PolarAngleAxisProps = {
  domain?: readonly [number, number]
}

type TooltipItem = {
  dataKey: string
  name: string
  value: ChartValue
  color: string
  payload: ChartDatum
}

type TooltipState = {
  active: boolean
  label?: AxisTick
  payload: TooltipItem[]
}

type TooltipProps<C extends string = string> = {
  content?: React.ReactElement | ((state: TooltipState) => React.ReactNode)
  cursor?: boolean | { stroke?: C; strokeWidth?: number }
  defaultIndex?: number
}

type LegendItem = {
  dataKey: string
  value: string
  color: string
  payload?: ChartDatum
}

type LegendProps = {
  content?: React.ReactElement
}

type Shape = {
  key: string
  d?: string
  circle?: { cx: number; cy: number; r: number }
  fill?: string
  fillOpacity?: number
  gradient?: {
    horizontal: boolean
    stops: { offset: number; color: string; opacity: number }[]
  }
  stroke?: string
  strokeWidth?: number
  strokeOpacity?: number
  strokeDasharray?: string
}

type TextItem = {
  key: string
  x: number
  y: number
  value: string
  anchor: "start" | "middle" | "end"
  baseline: "top" | "middle" | "bottom"
  role: "tick" | "label" | "reference"
  className?: string
  style?: StyleProp<TextStyle>
}

type ChartKind = "line" | "area" | "bar" | "composed" | "pie" | "radial"

type DefaultColors = {
  grid: string
  cursor: string
  reference: string
  fallback: string
}

type SurfaceProps = { shapes: Shape[]; width: number; height: number }

type Scene = {
  shapes: Shape[]
  texts: TextItem[]
  count: number
  names: string[]
  range?: string
  legend: LegendItem[]
  hitTest: (x: number, y: number) => number | null
  items: (index: number) => TooltipItem[]
  label: (index: number) => AxisTick | undefined
  anchor: (index: number) => { x: number; y: number }
  overlay: (index: number, cursor: Shape | null) => Shape[]
  external: (index: number) => number
}

type BuildInput = {
  elements: React.ReactElement[]
  config: ChartConfigBase
  colors: DefaultColors
  width: number
  height: number
  props: RootProps
}

type ContainerContextValue = {
  config: ChartConfigBase
  width: number
  height: number
  accessibilityLabel?: string
}

type ContainerProps = ViewProps & {
  config: ChartConfigBase
  className?: string
}

type RootProps = {
  kind: ChartKind
  data?: readonly ChartDatum[]
  margin?: ChartMargin
  layout?: "horizontal" | "vertical"
  stackOffset?: "none" | "expand"
  barGap?: number
  barCategoryGap?: number | string
  innerRadius?: number | string
  outerRadius?: number | string
  startAngle?: number
  endAngle?: number
  barSize?: number
  cx?: number | string
  cy?: number | string
  onActiveIndexChange?: (index: number | null) => void
  children?: React.ReactNode
  colors: DefaultColors
  renderSurface: (props: SurfaceProps) => React.ReactNode
  renderText: (text: TextItem) => React.ReactNode
}

const DEFAULT_MARGIN = { top: 5, right: 5, bottom: 5, left: 5 }
const CHAR_WIDTH = 7
const LINE_HEIGHT = 16
const X_AXIS_HEIGHT = 30
const TICK_SIZE = 6
const TEXT_BOX = 160
const TOOLTIP_GAP = 8
const TAP_SLOP = 10
const RADIAN = Math.PI / 180

const ContainerContext = React.createContext<ContainerContextValue | null>(null)

const TooltipContext = React.createContext<TooltipState>({
  active: false,
  payload: [],
})

const LegendContext = React.createContext<LegendItem[]>([])

function CartesianGrid(_: CartesianGridProps) {
  return null
}

function XAxis(_: XAxisProps) {
  return null
}

function YAxis(_: YAxisProps) {
  return null
}

function Line(_: LineProps) {
  return null
}

function Area(_: AreaProps) {
  return null
}

function Bar(_: BarProps) {
  return null
}

function ReferenceLine(_: ReferenceLineProps) {
  return null
}

function ReferenceArea(_: ReferenceAreaProps) {
  return null
}

function LabelList(_: LabelListProps) {
  return null
}

function Cell(_: CellProps) {
  return null
}

function Pie(_: PieProps) {
  return null
}

function RadialBar(_: RadialBarProps) {
  return null
}

function PolarAngleAxis(_: PolarAngleAxisProps) {
  return null
}

function Tooltip(_: TooltipProps) {
  return null
}

function Legend(_: LegendProps) {
  return null
}

function useContainerContext() {
  const context = React.useContext(ContainerContext)
  if (!context) {
    throw new Error("Chart parts must be used within a <ChartContainer />")
  }
  return context
}

function useTooltipContext() {
  return React.useContext(TooltipContext)
}

function useLegendContext() {
  return React.useContext(LegendContext)
}

function flatten(children: React.ReactNode): React.ReactElement[] {
  const result: React.ReactElement[] = []
  React.Children.forEach(children, (child) => {
    if (!React.isValidElement(child)) return
    if (child.type === React.Fragment) {
      result.push(
        ...flatten((child.props as { children?: React.ReactNode }).children)
      )
      return
    }
    result.push(child)
  })
  return result
}

function propsOf<P>(
  elements: React.ReactElement[],
  type: (props: P) => null
): P[] {
  return elements
    .filter((element) => element.type === type)
    .map((element) => element.props as P)
}

function childrenOf(props: { children?: React.ReactNode }) {
  return flatten(props.children)
}

function clean(value: number) {
  return Number(value.toPrecision(12))
}

function formatNumber(value: number) {
  try {
    return new Intl.NumberFormat().format(value)
  } catch {
    return String(value)
  }
}

function formatValue(value: ChartValue) {
  if (typeof value === "number") return formatNumber(value)
  return `${formatNumber(value[0])}–${formatNumber(value[1])}`
}

function textWidth(value: string) {
  return value.length * CHAR_WIDTH
}

function toNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) ? value : null
}

function toValue(value: unknown): ChartValue | null {
  if (Array.isArray(value)) {
    const low = toNumber(value[0])
    const high = toNumber(value[1])
    return low === null || high === null ? null : [low, high]
  }
  return toNumber(value)
}

function percent(value: number | string | undefined, total: number) {
  if (value === undefined) return 0
  if (typeof value === "number") return value
  const parsed = Number.parseFloat(value)
  if (!Number.isFinite(parsed)) return 0
  return value.trim().endsWith("%") ? (parsed / 100) * total : parsed
}

function digitCount(value: number) {
  return value === 0 ? 1 : Math.floor(Math.log10(Math.abs(value))) + 1
}

function formatStep(rough: number, correction: number) {
  if (rough <= 0) return 0
  const digits = digitCount(rough)
  const unit = 10 ** digits
  const scale = digits !== 1 ? 0.05 : 0.1
  return clean(
    (Math.ceil(clean(rough / unit / scale)) + correction) * scale * unit
  )
}

function calculateStep(
  min: number,
  max: number,
  count: number,
  correction: number
): { step: number; low: number; high: number } {
  const step = formatStep((max - min) / (count - 1), correction)
  if (step === 0) return { step: 0, low: min, high: max }
  let middle = 0
  if (!(min <= 0 && max >= 0)) {
    middle = (min + max) / 2
    middle = clean(middle - (middle % step))
  }
  let below = Math.ceil(clean((middle - min) / step))
  let above = Math.ceil(clean((max - middle) / step))
  const total = below + above + 1
  if (total > count) return calculateStep(min, max, count, correction + 1)
  if (total < count) {
    if (max > 0) above += count - total
    else below += count - total
  }
  return {
    step,
    low: clean(middle - below * step),
    high: clean(middle + above * step),
  }
}

function niceTicks(min: number, max: number, count: number) {
  const tickCount = Math.max(count, 2)
  if (min === max) return [min]
  const { step, low, high } = calculateStep(min, max, tickCount, 0)
  if (step === 0) return [min, max]
  const ticks: number[] = []
  for (let value = low; value <= high + step * 0.1; value += step) {
    ticks.push(clean(value))
  }
  return ticks
}

function fixedTicks(min: number, max: number, count: number) {
  if (min === max) return [min]
  const step = formatStep((max - min) / (Math.max(count, 2) - 1), 0)
  if (step === 0) return [min, max]
  const ticks: number[] = []
  for (let value = min; value < max - step * 0.99; value += step) {
    ticks.push(clean(value))
  }
  ticks.push(max)
  return ticks
}

function round(value: number) {
  return Math.round(value * 100) / 100
}

type Point = { x: number; y: number }

function linearPath(points: Point[]) {
  return points
    .map(
      (point, index) =>
        `${index === 0 ? "M" : "L"}${round(point.x)},${round(point.y)}`
    )
    .join("")
}

function stepPath(points: Point[]) {
  const [first] = points
  if (!first) return ""
  let path = `M${round(first.x)},${round(first.y)}`
  for (let index = 1; index < points.length; index++) {
    const previous = points[index - 1]
    const point = points[index]
    if (!previous || !point) continue
    const middle = round((previous.x + point.x) / 2)
    path += `L${middle},${round(previous.y)}L${middle},${round(point.y)}`
  }
  const last = points[points.length - 1]
  if (last && points.length > 1) path += `L${round(last.x)},${round(last.y)}`
  return path
}

function sign(value: number) {
  return value < 0 ? -1 : 1
}

function monotonePath(points: Point[]) {
  if (points.length < 3) return linearPath(points)
  const count = points.length
  const tangents = new Array<number>(count).fill(0)
  for (let index = 1; index < count - 1; index++) {
    const previous = points[index - 1] as Point
    const point = points[index] as Point
    const next = points[index + 1] as Point
    const h0 = point.x - previous.x
    const h1 = next.x - point.x
    const s0 = (point.y - previous.y) / (h0 || (h1 < 0 ? -0 : 0))
    const s1 = (next.y - point.y) / (h1 || (h0 < 0 ? -0 : 0))
    const p = (s0 * h1 + s1 * h0) / (h0 + h1)
    tangents[index] =
      (sign(s0) + sign(s1)) *
        Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0
  }
  const edge = (from: Point, to: Point, tangent: number) => {
    const h = to.x - from.x
    return h ? ((3 * (to.y - from.y)) / h - tangent) / 2 : tangent
  }
  const first = points[0] as Point
  const second = points[1] as Point
  const last = points[count - 1] as Point
  const beforeLast = points[count - 2] as Point
  tangents[0] = edge(first, second, tangents[1] ?? 0)
  tangents[count - 1] = edge(beforeLast, last, tangents[count - 2] ?? 0)
  let path = `M${round(first.x)},${round(first.y)}`
  for (let index = 0; index < count - 1; index++) {
    const from = points[index] as Point
    const to = points[index + 1] as Point
    const dx = (to.x - from.x) / 3
    const t0 = tangents[index] ?? 0
    const t1 = tangents[index + 1] ?? 0
    path += `C${round(from.x + dx)},${round(from.y + dx * t0)},${round(to.x - dx)},${round(to.y - dx * t1)},${round(to.x)},${round(to.y)}`
  }
  return path
}

function controlPoints(values: number[]) {
  const n = values.length - 1
  const a = new Array<number>(n).fill(0)
  const b = new Array<number>(n).fill(0)
  const r = new Array<number>(n).fill(0)
  const at = (index: number) => values[index] ?? 0
  a[0] = 0
  b[0] = 2
  r[0] = at(0) + 2 * at(1)
  for (let index = 1; index < n - 1; index++) {
    a[index] = 1
    b[index] = 4
    r[index] = 4 * at(index) + 2 * at(index + 1)
  }
  a[n - 1] = 2
  b[n - 1] = 7
  r[n - 1] = 8 * at(n - 1) + at(n)
  for (let index = 1; index < n; index++) {
    const m = (a[index] ?? 0) / (b[index - 1] ?? 1)
    b[index] = (b[index] ?? 0) - m
    r[index] = (r[index] ?? 0) - m * (r[index - 1] ?? 0)
  }
  a[n - 1] = (r[n - 1] ?? 0) / (b[n - 1] ?? 1)
  for (let index = n - 2; index >= 0; index--) {
    a[index] = ((r[index] ?? 0) - (a[index + 1] ?? 0)) / (b[index] ?? 1)
  }
  b[n - 1] = (at(n) + (a[n - 1] ?? 0)) / 2
  for (let index = 0; index < n - 1; index++) {
    b[index] = 2 * at(index + 1) - (a[index + 1] ?? 0)
  }
  return [a, b] as const
}

function naturalPath(points: Point[]) {
  if (points.length < 3) return linearPath(points)
  const [ax, bx] = controlPoints(points.map((point) => point.x))
  const [ay, by] = controlPoints(points.map((point) => point.y))
  const first = points[0] as Point
  let path = `M${round(first.x)},${round(first.y)}`
  for (let index = 1; index < points.length; index++) {
    const point = points[index] as Point
    path += `C${round(ax[index - 1] ?? 0)},${round(ay[index - 1] ?? 0)},${round(bx[index - 1] ?? 0)},${round(by[index - 1] ?? 0)},${round(point.x)},${round(point.y)}`
  }
  return path
}

function curvePath(points: Point[], type: ChartCurve) {
  if (points.length === 0) return ""
  if (type === "natural") return naturalPath(points)
  if (type === "monotone") return monotonePath(points)
  if (type === "step") return stepPath(points)
  return linearPath(points)
}

function areaPath(top: Point[], bottom: Point[], type: ChartCurve) {
  const upper = curvePath(top, type)
  const lower = curvePath([...bottom].reverse(), type)
  if (!upper || !lower) return ""
  return `${upper}L${lower.slice(1)}Z`
}

function polar(cx: number, cy: number, radius: number, angle: number) {
  return {
    x: cx + Math.cos(-RADIAN * angle) * radius,
    y: cy + Math.sin(-RADIAN * angle) * radius,
  }
}

function deltaAngle(start: number, end: number) {
  return sign(end - start) * Math.min(Math.abs(end - start), 359.999)
}

function ringPath(cx: number, cy: number, inner: number, outer: number) {
  const circle = (radius: number, sweep: number) => {
    const r = round(radius)
    return `M${round(cx + radius)},${round(cy)}A${r},${r},0,1,${sweep},${round(cx - radius)},${round(cy)}A${r},${r},0,1,${sweep},${round(cx + radius)},${round(cy)}Z`
  }
  return inner > 0 ? `${circle(outer, 1)}${circle(inner, 0)}` : circle(outer, 1)
}

function plainSectorPath(sector: SectorProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle } = sector
  if (Math.abs(sector.endAngle - startAngle) >= 359.99) {
    return ringPath(cx, cy, innerRadius, outerRadius)
  }
  const angle = deltaAngle(startAngle, sector.endAngle)
  const endAngle = startAngle + angle
  const outerStart = polar(cx, cy, outerRadius, startAngle)
  const outerEnd = polar(cx, cy, outerRadius, endAngle)
  const large = +(Math.abs(angle) > 180)
  let path = `M${round(outerStart.x)},${round(outerStart.y)}A${round(outerRadius)},${round(outerRadius)},0,${large},${+(startAngle > endAngle)},${round(outerEnd.x)},${round(outerEnd.y)}`
  if (innerRadius > 0) {
    const innerStart = polar(cx, cy, innerRadius, startAngle)
    const innerEnd = polar(cx, cy, innerRadius, endAngle)
    path += `L${round(innerEnd.x)},${round(innerEnd.y)}A${round(innerRadius)},${round(innerRadius)},0,${large},${+(startAngle <= endAngle)},${round(innerStart.x)},${round(innerStart.y)}Z`
  } else {
    path += `L${round(cx)},${round(cy)}Z`
  }
  return path
}

function cornerTangent(
  sector: SectorProps,
  radius: number,
  angle: number,
  direction: number,
  external: boolean,
  corner: number
) {
  const centerRadius = corner * (external ? 1 : -1) + radius
  const theta = Math.asin(corner / centerRadius) / RADIAN
  const centerAngle = angle + direction * theta
  const circle = polar(sector.cx, sector.cy, radius, centerAngle)
  const line = polar(
    sector.cx,
    sector.cy,
    centerRadius * Math.cos(theta * RADIAN),
    angle
  )
  return { circle, line, theta }
}

function sectorPath(sector: SectorProps) {
  const { cx, cy, innerRadius, outerRadius, startAngle, endAngle } = sector
  const corner = Math.min(sector.cornerRadius, (outerRadius - innerRadius) / 2)
  if (corner <= 0 || Math.abs(startAngle - endAngle) >= 360) {
    return plainSectorPath(sector)
  }
  const direction = sign(endAngle - startAngle)
  const sweep = +(direction < 0)
  const so = cornerTangent(
    sector,
    outerRadius,
    startAngle,
    direction,
    false,
    corner
  )
  const eo = cornerTangent(
    sector,
    outerRadius,
    endAngle,
    -direction,
    false,
    corner
  )
  const outerArc = Math.abs(startAngle - endAngle) - so.theta - eo.theta
  if (outerArc < 0) return plainSectorPath(sector)
  const c = round(corner)
  let path = `M${round(so.line.x)},${round(so.line.y)}A${c},${c},0,0,${sweep},${round(so.circle.x)},${round(so.circle.y)}A${round(outerRadius)},${round(outerRadius)},0,${+(outerArc > 180)},${sweep},${round(eo.circle.x)},${round(eo.circle.y)}A${c},${c},0,0,${sweep},${round(eo.line.x)},${round(eo.line.y)}`
  if (innerRadius > 0) {
    const si = cornerTangent(
      sector,
      innerRadius,
      startAngle,
      direction,
      true,
      corner
    )
    const ei = cornerTangent(
      sector,
      innerRadius,
      endAngle,
      -direction,
      true,
      corner
    )
    const innerArc = Math.abs(startAngle - endAngle) - si.theta - ei.theta
    path += `L${round(ei.line.x)},${round(ei.line.y)}A${c},${c},0,0,${sweep},${round(ei.circle.x)},${round(ei.circle.y)}A${round(innerRadius)},${round(innerRadius)},0,${+(innerArc > 180)},${+(direction > 0)},${round(si.circle.x)},${round(si.circle.y)}A${c},${c},0,0,${sweep},${round(si.line.x)},${round(si.line.y)}Z`
  } else {
    path += `L${round(cx)},${round(cy)}Z`
  }
  return path
}

function rectPath(
  x: number,
  y: number,
  width: number,
  height: number,
  radius: BarRadius
) {
  const limit = Math.max(0, Math.min(width, height) / 2)
  const corners =
    typeof radius === "number" ? [radius, radius, radius, radius] : radius
  const [tl, tr, br, bl] = corners.map((value) =>
    round(Math.max(0, Math.min(value, limit)))
  ) as [number, number, number, number]
  const right = round(x + width)
  const bottom = round(y + height)
  const left = round(x)
  const top = round(y)
  return `M${left + tl},${top}H${right - tr}A${tr},${tr},0,0,1,${right},${top + tr}V${bottom - br}A${br},${br},0,0,1,${right - br},${bottom}H${left + bl}A${bl},${bl},0,0,1,${left},${bottom - bl}V${top + tl}A${tl},${tl},0,0,1,${left + tl},${top}Z`
}

function gradientOf(
  fill: string | ChartGradient | undefined,
  color: string
): Shape["gradient"] | undefined {
  if (!fill || typeof fill === "string") return undefined
  return {
    horizontal: fill.direction === "horizontal",
    stops: fill.stops.map((stop) => ({
      offset: stop.offset,
      color: stop.color ?? color,
      opacity: stop.opacity ?? 1,
    })),
  }
}

function colorOf(
  fill: string | ChartGradient | undefined,
  fallback: string
): string {
  if (typeof fill === "string") return fill
  return fill?.stops[0]?.color ?? fallback
}

function configColor(config: ChartConfigBase, key: unknown, fallback: string) {
  if (typeof key !== "string") return fallback
  return config[key]?.color ?? fallback
}

function line(
  key: string,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  stroke: string,
  strokeWidth = 1,
  strokeDasharray?: string,
  strokeOpacity?: number
): Shape {
  return {
    key,
    d: `M${round(x1)},${round(y1)}L${round(x2)},${round(y2)}`,
    stroke,
    strokeWidth,
    strokeDasharray,
    strokeOpacity,
  }
}

function emptyScene(): Scene {
  return {
    shapes: [],
    texts: [],
    count: 0,
    names: [],
    legend: [],
    hitTest: () => null,
    items: () => [],
    label: () => undefined,
    anchor: () => ({ x: 0, y: 0 }),
    overlay: () => [],
    external: (index) => index,
  }
}

type SeriesKind = "line" | "area" | "bar"

type Series = {
  kind: SeriesKind
  props: LineProps & AreaProps & BarProps
  cells: CellProps[]
  labels: LabelListProps | undefined
  color: string
  values: ({ from: number | null; to: number } | null)[]
}

function resolveDomain(
  spec: AxisDomain | undefined,
  dataMin: number,
  dataMax: number,
  tickCount: number,
  explicit: readonly AxisTick[] | undefined
) {
  const resolve = (value: AxisDomainValue, fallback: number) => {
    if (typeof value === "number") return value
    if (value === "dataMin") return dataMin
    if (value === "dataMax") return dataMax
    return fallback
  }
  const auto = !spec || spec.includes("auto")
  let low = spec ? resolve(spec[0], dataMin) : Math.min(0, dataMin)
  let high = spec ? resolve(spec[1], dataMax) : Math.max(0, dataMax)
  if (!spec) {
    low = Math.min(low, dataMin)
    high = Math.max(high, dataMax)
  }
  if (low === high) high = low + 1
  const numericTicks = explicit
    ?.map((tick) => toNumber(tick))
    .filter((tick): tick is number => tick !== null)
  let ticks: number[]
  if (auto) {
    ticks = niceTicks(low, high, tickCount)
    low = ticks[0] ?? low
    high = ticks[ticks.length - 1] ?? high
    if (numericTicks?.length) {
      low = Math.min(low, ...numericTicks)
      high = Math.max(high, ...numericTicks)
    }
  } else {
    ticks = fixedTicks(low, high, tickCount)
  }
  if (numericTicks?.length) ticks = numericTicks
  return { low, high, ticks }
}

function visibleTicks(
  positions: number[],
  labels: string[],
  interval: number | undefined,
  minTickGap: number
) {
  if (interval !== undefined) {
    return positions
      .map((_, index) => index)
      .filter((index) => index % (interval + 1) === 0)
  }
  const kept: number[] = []
  let edge = Number.POSITIVE_INFINITY
  for (let index = positions.length - 1; index >= 0; index--) {
    const position = positions[index] ?? 0
    const half = textWidth(labels[index] ?? "") / 2
    if (position + half + minTickGap <= edge || kept.length === 0) {
      kept.unshift(index)
      edge = position - half
    }
  }
  return kept
}

function buildCartesian(input: BuildInput): Scene {
  const { elements, config, colors, width, height, props } = input
  const data = props.data ?? []
  const count = data.length
  if (count === 0 || width <= 0 || height <= 0) return emptyScene()
  const margin = { ...DEFAULT_MARGIN, ...props.margin }
  const vertical = props.layout === "vertical"
  const grid = propsOf(elements, CartesianGrid)[0]
  const xAxis = propsOf(elements, XAxis)[0]
  const yAxes = propsOf(elements, YAxis)
  const references = propsOf(elements, ReferenceLine)
  const areas = propsOf(elements, ReferenceArea)
  const categoryAxis: (XAxisProps & YAxisProps) | undefined = vertical
    ? yAxes[0]
    : xAxis
  const valueAxis: (XAxisProps & YAxisProps) | undefined = vertical
    ? xAxis
    : yAxes[0]
  const series: Series[] = elements
    .filter(
      (element) =>
        element.type === Line || element.type === Area || element.type === Bar
    )
    .map((element) => {
      const kind: SeriesKind =
        element.type === Line ? "line" : element.type === Area ? "area" : "bar"
      const seriesProps = element.props as LineProps & AreaProps & BarProps
      const children = childrenOf(seriesProps)
      const fallback = configColor(config, seriesProps.dataKey, colors.fallback)
      const color =
        kind === "line"
          ? seriesProps.stroke && seriesProps.stroke !== "none"
            ? seriesProps.stroke
            : fallback
          : kind === "area" &&
              seriesProps.stroke &&
              seriesProps.stroke !== "none"
            ? seriesProps.stroke
            : colorOf(seriesProps.fill, fallback)
      return {
        kind,
        props: seriesProps,
        cells: propsOf(children, Cell),
        labels: propsOf(children, LabelList)[0],
        color,
        values: [],
      }
    })
  const band = series.some((item) => item.kind === "bar")
  const expand = props.stackOffset === "expand"
  const totals = data.map((datum) => {
    const sums: Record<string, number> = {}
    for (const item of series) {
      if (!item.props.stackId) continue
      const value = toNumber(datum[item.props.dataKey])
      if (value === null) continue
      sums[item.props.stackId] =
        (sums[item.props.stackId] ?? 0) + Math.abs(value)
    }
    return sums
  })
  const running = data.map(() => ({}) as Record<string, number>)
  for (const item of series) {
    item.values = data.map((datum, index) => {
      const value = toValue(datum[item.props.dataKey])
      if (value === null) return null
      if (typeof value !== "number") return { from: value[0], to: value[1] }
      const stackId = item.kind === "line" ? undefined : item.props.stackId
      if (!stackId) return { from: null, to: value }
      const stack = running[index] ?? {}
      const total = totals[index]?.[stackId] ?? 0
      const scaled = expand ? (total ? value / total : 0) : value
      const base = stack[stackId] ?? 0
      stack[stackId] = base + scaled
      return { from: base, to: base + scaled }
    })
  }
  const numbers: number[] = []
  for (const item of series) {
    for (const value of item.values) {
      if (!value) continue
      numbers.push(value.to)
      if (value.from !== null) numbers.push(value.from)
    }
  }
  for (const reference of references) numbers.push(reference.y)
  const dataMin = numbers.length ? Math.min(...numbers) : 0
  const dataMax = numbers.length ? Math.max(...numbers) : 1
  const domain = resolveDomain(
    valueAxis?.domain,
    dataMin,
    dataMax,
    valueAxis?.tickCount ?? 5,
    valueAxis?.ticks
  )
  const categories = data.map((datum, index) =>
    categoryAxis?.dataKey ? datum[categoryAxis.dataKey] : index
  )
  const numericCategory = !vertical && categoryAxis?.type === "number"
  const categoryNumbers = categories.map((value) => toNumber(value) ?? 0)
  const categoryDomain = numericCategory
    ? resolveDomain(
        categoryAxis?.domain ?? ["dataMin", "dataMax"],
        Math.min(...categoryNumbers),
        Math.max(...categoryNumbers),
        5,
        undefined
      )
    : null
  const formatTick = (
    axis: XAxisProps | YAxisProps | undefined,
    value: AxisTick,
    index: number
  ) => (axis?.tickFormatter ? axis.tickFormatter(value, index) : String(value))
  const valueLabels = domain.ticks.map((tick, index) =>
    formatTick(valueAxis, tick, index)
  )
  const axisWidth = (axis: YAxisProps, labels: string[]) => {
    if (typeof axis.width === "number") return axis.width
    if (axis.width === undefined) return 60
    return (
      Math.max(0, ...labels.map(textWidth)) +
      TICK_SIZE +
      (axis.tickMargin ?? 2) +
      2
    )
  }
  const yLabels = (axis: YAxisProps) =>
    vertical
      ? data.map((datum, index) =>
          formatTick(
            axis,
            (axis.dataKey ? datum[axis.dataKey] : index) as AxisTick,
            index
          )
        )
      : domain.ticks.map((tick, index) => formatTick(axis, tick, index))
  let leftWidth = 0
  let rightWidth = 0
  for (const axis of yAxes) {
    if (axis.hide) continue
    const size = axisWidth(axis, yLabels(axis))
    if (axis.orientation === "right") rightWidth += size
    else leftWidth += size
  }
  const xHeight = xAxis && !xAxis.hide ? X_AXIS_HEIGHT : 0
  const plot = {
    left: margin.left + leftWidth,
    right: width - margin.right - rightWidth,
    top: margin.top,
    bottom: height - margin.bottom - xHeight,
  }
  const plotWidth = Math.max(1, plot.right - plot.left)
  const plotHeight = Math.max(1, plot.bottom - plot.top)
  const span = domain.high - domain.low || 1
  const valuePosition = (value: number) =>
    vertical
      ? plot.left + ((value - domain.low) / span) * plotWidth
      : plot.bottom - ((value - domain.low) / span) * plotHeight
  const categoryStart = vertical ? plot.top : plot.left
  const categoryLength = vertical ? plotHeight : plotWidth
  const bandSize = categoryLength / count
  const position = (index: number) => {
    if (categoryDomain) {
      const range = categoryDomain.high - categoryDomain.low || 1
      return (
        plot.left +
        (((categoryNumbers[index] ?? 0) - categoryDomain.low) / range) *
          plotWidth
      )
    }
    if (band) return categoryStart + bandSize * (index + 0.5)
    if (count === 1) return categoryStart + categoryLength / 2
    return categoryStart + (index * categoryLength) / (count - 1)
  }
  const positions = data.map((_, index) => position(index))
  const baseline = Math.min(Math.max(0, domain.low), domain.high)
  const shapes: Shape[] = []
  const texts: TextItem[] = []
  const categoryLabels = categories.map((value, index) =>
    formatTick(categoryAxis, value as AxisTick, index)
  )
  let tickIndexes: number[]
  if (categoryAxis?.ticks) {
    const wanted = categoryAxis.ticks.map(String)
    tickIndexes = categories
      .map((value, index) => (wanted.includes(String(value)) ? index : -1))
      .filter((index) => index >= 0)
  } else {
    tickIndexes = vertical
      ? positions.map((_, index) => index)
      : visibleTicks(
          positions,
          categoryLabels,
          categoryAxis?.interval,
          categoryAxis?.minTickGap ?? 5
        )
  }
  if (grid) {
    if (!vertical) {
      domain.ticks.forEach((tick) => {
        const y = valuePosition(tick)
        shapes.push(
          line(
            `grid-h-${tick}`,
            plot.left,
            y,
            plot.right,
            y,
            colors.grid,
            1,
            grid.strokeDasharray,
            0.5
          )
        )
      })
      if (grid.vertical !== false) {
        for (const index of tickIndexes) {
          const x = positions[index] ?? 0
          shapes.push(
            line(
              `grid-v-${index}`,
              x,
              plot.top,
              x,
              plot.bottom,
              colors.grid,
              1,
              grid.strokeDasharray,
              0.5
            )
          )
        }
      }
    } else {
      domain.ticks.forEach((tick) => {
        const x = valuePosition(tick)
        shapes.push(
          line(
            `grid-v-${tick}`,
            x,
            plot.top,
            x,
            plot.bottom,
            colors.grid,
            1,
            grid.strokeDasharray,
            0.5
          )
        )
      })
    }
  }
  for (const [index, area] of areas.entries()) {
    const from = categories.indexOf(area.x1)
    const to = categories.indexOf(area.x2)
    if (from < 0 || to < 0) continue
    const half = band ? bandSize / 2 : 0
    const x1 = (positions[Math.min(from, to)] ?? 0) - half
    const x2 = (positions[Math.max(from, to)] ?? 0) + half
    shapes.push({
      key: `area-${index}`,
      d: rectPath(x1, plot.top, x2 - x1, plotHeight, 0),
      fill: area.fill ?? colors.reference,
      fillOpacity: area.fillOpacity ?? 0.5,
    })
  }
  if (categoryAxis && !categoryAxis.hide && !vertical) {
    if (categoryDomain && categoryAxis.ticks) {
      const range = categoryDomain.high - categoryDomain.low || 1
      categoryAxis.ticks.forEach((tick, index) => {
        const value = toNumber(tick)
        if (value === null) return
        const label = formatTick(categoryAxis, tick, index)
        if (!label) return
        texts.push({
          key: `x-${tick}`,
          x: plot.left + ((value - categoryDomain.low) / range) * plotWidth,
          y: plot.bottom + TICK_SIZE + (categoryAxis.tickMargin ?? 2),
          value: label,
          anchor: "middle",
          baseline: "top",
          role: "tick",
        })
      })
    } else {
      for (const index of tickIndexes) {
        const label = categoryLabels[index] ?? ""
        if (!label) continue
        texts.push({
          key: `x-${index}`,
          x: positions[index] ?? 0,
          y: plot.bottom + TICK_SIZE + (categoryAxis.tickMargin ?? 2),
          value: label,
          anchor: "middle",
          baseline: "top",
          role: "tick",
        })
      }
    }
  }
  let leftOffset = plot.left
  let rightOffset = plot.right
  for (const [axisIndex, axis] of yAxes.entries()) {
    if (axis.hide) continue
    const labels = yLabels(axis)
    const right = axis.orientation === "right"
    const size = axisWidth(axis, labels)
    const gap = TICK_SIZE + (axis.tickMargin ?? 2)
    const x = right ? rightOffset + gap : leftOffset - gap
    labels.forEach((label, index) => {
      texts.push({
        key: `y-${axisIndex}-${index}`,
        x,
        y: vertical
          ? (positions[index] ?? 0)
          : valuePosition(domain.ticks[index] ?? 0),
        value: label,
        anchor: right ? "start" : "end",
        baseline: "middle",
        role: "tick",
        className: axis.tickClassName,
        style: axis.tickStyle,
      })
    })
    if (right) rightOffset += size
    else leftOffset -= size
  }
  if (vertical && valueAxis && !valueAxis.hide) {
    domain.ticks.forEach((tick, index) => {
      texts.push({
        key: `xv-${index}`,
        x: valuePosition(tick),
        y: plot.bottom + TICK_SIZE + (valueAxis.tickMargin ?? 2),
        value: valueLabels[index] ?? "",
        anchor: "middle",
        baseline: "top",
        role: "tick",
      })
    })
  }
  const slots: string[] = []
  for (const [index, item] of series.entries()) {
    if (item.kind !== "bar") continue
    const slot = item.props.stackId ?? `series-${index}`
    if (!slots.includes(slot)) slots.push(slot)
  }
  const categoryGap =
    typeof props.barCategoryGap === "number"
      ? props.barCategoryGap
      : percent(props.barCategoryGap ?? "10%", bandSize)
  const barGap = props.barGap ?? 4
  const slotFrame = (slot: string) => {
    const index = slots.indexOf(slot)
    const owner = series.find(
      (item, seriesIndex) =>
        item.kind === "bar" &&
        (item.props.stackId ?? `series-${seriesIndex}`) === slot
    )
    const fixed = owner?.props.barSize
    if (fixed !== undefined) {
      const sum = slots.length * fixed + (slots.length - 1) * barGap
      const start = (bandSize - sum) / 2
      return { offset: start + (fixed + barGap) * index, size: fixed }
    }
    const original =
      (bandSize - 2 * categoryGap - (slots.length - 1) * barGap) / slots.length
    const size = Math.max(
      1,
      Math.min(original, owner?.props.maxBarSize ?? Number.POSITIVE_INFINITY)
    )
    return {
      offset: categoryGap + (original + barGap) * index + (original - size) / 2,
      size,
    }
  }
  const barRect = (seriesIndex: number, index: number) => {
    const item = series[seriesIndex]
    const value = item?.values[index]
    if (!item || !value) return null
    const frame = slotFrame(item.props.stackId ?? `series-${seriesIndex}`)
    const start = categoryStart + bandSize * index + frame.offset
    const from = valuePosition(value.from ?? baseline)
    const to = valuePosition(value.to)
    const low = Math.min(from, to)
    const extent = Math.abs(to - from)
    return vertical
      ? { x: low, y: start, width: extent, height: frame.size, end: to }
      : { x: start, y: low, width: frame.size, height: extent, end: to }
  }
  const strokes: Shape[] = []
  const dots: Shape[] = []
  for (const [seriesIndex, item] of series.entries()) {
    const key = `${item.kind}-${seriesIndex}-${item.props.dataKey}`
    if (item.kind === "bar") {
      const background = item.props.background
      data.forEach((_, index) => {
        const frame = slotFrame(item.props.stackId ?? `series-${seriesIndex}`)
        const start = categoryStart + bandSize * index + frame.offset
        if (background) {
          shapes.push({
            key: `${key}-background-${index}`,
            d: vertical
              ? rectPath(
                  plot.left,
                  start,
                  plotWidth,
                  frame.size,
                  background.radius ?? 0
                )
              : rectPath(
                  start,
                  plot.top,
                  frame.size,
                  plotHeight,
                  background.radius ?? 0
                ),
            fill: background.fill ?? item.color,
            fillOpacity: background.fillOpacity ?? 1,
          })
        }
      })
      data.forEach((datum, index) => {
        const rect = barRect(seriesIndex, index)
        if (!rect || rect.width <= 0 || rect.height <= 0) return
        const cell = item.cells[index]
        const color = cell?.fill ?? item.color
        shapes.push({
          key: `${key}-${index}`,
          d: rectPath(
            rect.x,
            rect.y,
            rect.width,
            rect.height,
            item.props.radius ?? 0
          ),
          fill: color,
          fillOpacity: cell?.fillOpacity ?? 1,
          gradient: cell?.fill
            ? undefined
            : gradientOf(item.props.fill, item.color),
        })
        if (item.labels) {
          const raw = datum[item.labels.dataKey ?? item.props.dataKey]
          const text = item.labels.formatter
            ? item.labels.formatter(raw)
            : String(raw ?? "")
          if (text) {
            const offset = item.labels.offset ?? 5
            texts.push({
              key: `${key}-label-${index}`,
              x: vertical
                ? rect.x + rect.width + offset
                : rect.x + rect.width / 2,
              y: vertical ? rect.y + rect.height / 2 : rect.y - offset,
              value: text,
              anchor: vertical ? "start" : "middle",
              baseline: vertical ? "middle" : "bottom",
              role: "label",
              className: item.labels.className,
              style: item.labels.style,
            })
          }
        }
      })
      continue
    }
    const segments: { top: Point[]; bottom: Point[]; indexes: number[] }[] = []
    let current: { top: Point[]; bottom: Point[]; indexes: number[] } | null =
      null
    item.values.forEach((value, index) => {
      if (!value) {
        current = null
        return
      }
      if (!current) {
        current = { top: [], bottom: [], indexes: [] }
        segments.push(current)
      }
      const x = positions[index] ?? 0
      current.top.push({ x, y: valuePosition(value.to) })
      current.bottom.push({ x, y: valuePosition(value.from ?? baseline) })
      current.indexes.push(index)
    })
    const type = item.props.type ?? "linear"
    const stroke =
      item.props.stroke === "none"
        ? undefined
        : (item.props.stroke ?? item.color)
    if (item.kind === "area") {
      const fallback = configColor(config, item.props.dataKey, colors.fallback)
      const fillColor = colorOf(item.props.fill, fallback)
      segments.forEach((segment, index) => {
        shapes.push({
          key: `${key}-fill-${index}`,
          d: areaPath(segment.top, segment.bottom, type),
          fill: fillColor,
          fillOpacity: item.props.fillOpacity ?? 0.6,
          gradient: gradientOf(item.props.fill, fallback),
        })
      })
    }
    if (stroke) {
      segments.forEach((segment, index) => {
        strokes.push({
          key: `${key}-stroke-${index}`,
          d: curvePath(segment.top, type),
          stroke,
          strokeWidth: item.props.strokeWidth ?? 1,
          strokeDasharray: item.props.strokeDasharray,
        })
      })
    }
    const dot = item.props.dot
    for (const segment of segments) {
      segment.indexes.forEach((index, position) => {
        const point = segment.top[position]
        const value = toValue(data[index]?.[item.props.dataKey])
        if (!point || value === null) return
        if (dot) {
          const spec =
            typeof dot === "function"
              ? dot({ index, value, payload: data[index] ?? {} })
              : dot
          if (spec) {
            dots.push({
              key: `${key}-dot-${index}`,
              circle: { cx: point.x, cy: point.y, r: spec.r ?? 3 },
              fill: spec.fill ?? item.color,
              stroke: spec.stroke,
              strokeWidth: spec.strokeWidth ?? (spec.stroke ? 1 : 0),
            })
          }
        }
        if (item.labels) {
          const raw = data[index]?.[item.labels.dataKey ?? item.props.dataKey]
          const text = item.labels.formatter
            ? item.labels.formatter(raw)
            : String(raw ?? "")
          if (text) {
            texts.push({
              key: `${key}-label-${index}`,
              x: point.x,
              y: point.y - (item.labels.offset ?? 5),
              value: text,
              anchor: "middle",
              baseline: "bottom",
              role: "label",
              className: item.labels.className,
              style: item.labels.style,
            })
          }
        }
      })
    }
  }
  shapes.push(...strokes)
  for (const [index, reference] of references.entries()) {
    const y = valuePosition(reference.y)
    shapes.push(
      line(
        `reference-${index}`,
        plot.left,
        y,
        plot.right,
        y,
        reference.stroke ?? colors.reference,
        1,
        reference.strokeDasharray
      )
    )
    if (reference.label) {
      texts.push({
        key: `reference-label-${index}`,
        x: plot.left + 4,
        y: y - 4,
        value: reference.label,
        anchor: "start",
        baseline: "bottom",
        role: "reference",
      })
    }
  }
  shapes.push(...dots)
  const topAt = (index: number) => {
    let top = Number.POSITIVE_INFINITY
    series.forEach((item, seriesIndex) => {
      if (item.kind === "bar") {
        const rect = barRect(seriesIndex, index)
        if (rect) top = Math.min(top, vertical ? rect.y : rect.y)
        return
      }
      const value = item.values[index]
      if (value) top = Math.min(top, valuePosition(value.to))
    })
    return Number.isFinite(top) ? top : plot.top
  }
  const rightAt = (index: number) => {
    let right = plot.left
    series.forEach((_, seriesIndex) => {
      const rect = barRect(seriesIndex, index)
      if (rect) right = Math.max(right, rect.x + rect.width)
    })
    return right
  }
  const nearest = (coordinate: number) => {
    if (categoryDomain) {
      let best = 0
      positions.forEach((value, index) => {
        if (
          Math.abs(value - coordinate) <
          Math.abs((positions[best] ?? 0) - coordinate)
        ) {
          best = index
        }
      })
      return best
    }
    const raw = band
      ? Math.floor((coordinate - categoryStart) / bandSize)
      : count === 1
        ? 0
        : Math.round(
            ((coordinate - categoryStart) * (count - 1)) / categoryLength
          )
    return Math.max(0, Math.min(count - 1, raw))
  }
  const names = series.map(
    (item) => config[item.props.dataKey]?.label ?? item.props.dataKey
  )
  const first = categories[0]
  const last = categories[count - 1]
  return {
    shapes,
    texts,
    count,
    names,
    range:
      numericCategory || first === undefined || last === undefined
        ? undefined
        : count > 1
          ? `${String(first)} to ${String(last)}`
          : String(first),
    legend: series.map((item) => ({
      dataKey: item.props.dataKey,
      value: item.props.dataKey,
      color: item.color,
    })),
    hitTest: (x, y) => nearest(vertical ? y : x),
    items: (index) =>
      series.flatMap((item) => {
        const datum = data[index] ?? {}
        const value = toValue(datum[item.props.dataKey])
        if (value === null) return []
        return [
          {
            dataKey: item.props.dataKey,
            name: item.props.dataKey,
            value,
            color: item.cells[index]?.fill ?? item.color,
            payload: datum,
          },
        ]
      }),
    label: (index) => {
      const value = categories[index]
      return typeof value === "string" || typeof value === "number"
        ? value
        : undefined
    },
    anchor: (index) =>
      vertical
        ? { x: rightAt(index), y: (positions[index] ?? 0) - bandSize / 2 }
        : { x: positions[index] ?? 0, y: topAt(index) },
    overlay: (index, cursor) => {
      const result: Shape[] = []
      const at = positions[index] ?? 0
      if (cursor) {
        result.push(
          vertical
            ? line(
                "cursor",
                plot.left,
                at,
                plot.right,
                at,
                cursor.stroke ?? colors.cursor,
                cursor.strokeWidth
              )
            : line(
                "cursor",
                at,
                plot.top,
                at,
                plot.bottom,
                cursor.stroke ?? colors.cursor,
                cursor.strokeWidth
              )
        )
      }
      series.forEach((item, seriesIndex) => {
        if (item.kind === "bar" || item.props.activeDot === false) return
        const value = item.values[index]
        if (!value) return
        const spec = item.props.activeDot ?? {}
        result.push({
          key: `active-${seriesIndex}`,
          circle: { cx: at, cy: valuePosition(value.to), r: spec.r ?? 4 },
          fill: spec.fill ?? item.color,
          stroke: spec.stroke,
          strokeWidth: spec.strokeWidth ?? (spec.stroke ? 1 : 0),
        })
      })
      return result
    },
    external: (index) => index,
  }
}

type PieSlice = {
  pie: number
  index: number
  sector: SectorProps
  mid: number
  item: TooltipItem
}

function buildPie(input: BuildInput): Scene {
  const { elements, config, colors, width, height, props } = input
  if (width <= 0 || height <= 0) return emptyScene()
  const margin = { ...DEFAULT_MARGIN, ...props.margin }
  const areaWidth = width - margin.left - margin.right
  const areaHeight = height - margin.top - margin.bottom
  const maxRadius = Math.min(Math.abs(areaWidth), Math.abs(areaHeight)) / 2
  const pies = elements.filter((element) => element.type === Pie)
  const shapes: Shape[] = []
  const texts: TextItem[] = []
  const slices: PieSlice[] = []
  const bounds: { cx: number; cy: number; inner: number; outer: number }[] = []
  pies.forEach((element, pieIndex) => {
    const pie = element.props as PieProps
    const cells = propsOf(childrenOf(pie), Cell)
    const cx = margin.left + percent(pie.cx ?? "50%", areaWidth)
    const cy = margin.top + percent(pie.cy ?? "50%", areaHeight)
    const inner = percent(pie.innerRadius ?? 0, maxRadius)
    const outer = percent(pie.outerRadius ?? "80%", maxRadius)
    bounds.push({ cx, cy, inner, outer })
    const startAngle = pie.startAngle ?? 0
    const endAngle = pie.endAngle ?? 360
    const delta =
      sign(endAngle - startAngle) *
      Math.min(Math.abs(endAngle - startAngle), 360)
    const direction = sign(delta)
    const padding = pie.paddingAngle ?? 0
    const values = pie.data.map((datum) => toNumber(datum[pie.dataKey]) ?? 0)
    const nonZero = values.filter((value) => value !== 0).length
    const totalPadding =
      (Math.abs(delta) >= 360 ? nonZero : nonZero - 1) * padding
    const available = Math.abs(delta) - totalPadding
    const sum = values.reduce((total, value) => total + Math.abs(value), 0)
    let cursor = startAngle
    values.forEach((value, index) => {
      const datum = pie.data[index] ?? {}
      const start =
        index === 0
          ? startAngle
          : cursor + direction * padding * (value !== 0 ? 1 : 0)
      const end =
        start + direction * (sum ? (Math.abs(value) / sum) * available : 0)
      cursor = end
      const name = String(datum[pie.nameKey] ?? "")
      const cell = cells[index]
      const fill =
        cell?.fill ??
        configColor(
          config,
          name,
          configColor(config, pie.dataKey, colors.fallback)
        )
      const sector: SectorProps = {
        cx,
        cy,
        innerRadius: inner,
        outerRadius: outer,
        startAngle: start,
        endAngle: end,
        cornerRadius: pie.cornerRadius ?? 0,
        fill,
        fillOpacity: cell?.fillOpacity ?? pie.fillOpacity ?? 1,
        stroke: pie.stroke === "none" ? undefined : pie.stroke,
        strokeWidth: pie.strokeWidth ?? 0,
      }
      const shaped = pie.shape ? pie.shape(sector, index) : sector
      const list = Array.isArray(shaped) ? shaped : [shaped]
      list.forEach((part, partIndex) => {
        shapes.push({
          key: `pie-${pieIndex}-${index}-${partIndex}`,
          d: sectorPath(part),
          fill: part.fill,
          fillOpacity: part.fillOpacity,
          stroke: part.stroke && part.strokeWidth > 0 ? part.stroke : undefined,
          strokeWidth: part.strokeWidth,
        })
      })
      const mid = (start + end) / 2
      slices.push({
        pie: pieIndex,
        index,
        sector,
        mid,
        item: {
          dataKey: pie.dataKey,
          name,
          value: toValue(datum[pie.dataKey]) ?? 0,
          color: fill,
          payload: datum,
        },
      })
      if (pie.label && value !== 0) {
        const text = pie.label({
          name,
          value: toValue(datum[pie.dataKey]) ?? 0,
          payload: datum,
        })
        if (text) {
          const from = polar(cx, cy, outer, mid)
          const to = polar(cx, cy, outer + 20, mid)
          if (pie.labelLine) {
            shapes.push(
              line(
                `pie-line-${pieIndex}-${index}`,
                from.x,
                from.y,
                to.x,
                to.y,
                pie.labelLine.stroke ?? fill
              )
            )
          }
          const right = to.x > cx
          texts.push({
            key: `pie-label-${pieIndex}-${index}`,
            x: to.x + (right ? 2 : -2),
            y: to.y,
            value: text,
            anchor: right ? "start" : "end",
            baseline: "middle",
            role: "label",
          })
        }
      }
    })
  })
  const contains = (slice: PieSlice, angle: number) => {
    const { startAngle, endAngle } = slice.sector
    const direction = sign(endAngle - startAngle)
    const width = Math.abs(endAngle - startAngle)
    const offset = ((((angle - startAngle) * direction) % 360) + 360) % 360
    return offset <= width
  }
  const firstPie = pies[0]?.props as PieProps | undefined
  return {
    shapes,
    texts,
    count: slices.length,
    names: slices.map(
      (slice) => config[slice.item.name]?.label ?? slice.item.name
    ),
    legend: firstPie
      ? slices
          .filter((slice) => slice.pie === 0)
          .map((slice) => ({
            dataKey: firstPie.nameKey,
            value: slice.item.name,
            color: slice.item.color,
            payload: slice.item.payload,
          }))
      : [],
    hitTest: (x, y) => {
      for (let pieIndex = bounds.length - 1; pieIndex >= 0; pieIndex--) {
        const bound = bounds[pieIndex]
        if (!bound) continue
        const distance = Math.hypot(x - bound.cx, y - bound.cy)
        if (distance < bound.inner - 4 || distance > bound.outer + 12) continue
        const angle = Math.atan2(bound.cy - y, x - bound.cx) / RADIAN
        const match = slices.findIndex(
          (slice) => slice.pie === pieIndex && contains(slice, angle)
        )
        if (match >= 0) return match
      }
      return null
    },
    items: (index) => {
      const slice = slices[index]
      return slice ? [slice.item] : []
    },
    label: () => undefined,
    anchor: (index) => {
      const slice = slices[index]
      if (!slice) return { x: width / 2, y: height / 2 }
      return polar(
        slice.sector.cx,
        slice.sector.cy,
        slice.sector.outerRadius,
        slice.mid
      )
    },
    overlay: () => [],
    external: (index) => slices[index]?.index ?? index,
  }
}

function buildRadial(input: BuildInput): Scene {
  const { elements, config, colors, width, height, props } = input
  const data = props.data ?? []
  const count = data.length
  if (count === 0 || width <= 0 || height <= 0) return emptyScene()
  const margin = { ...DEFAULT_MARGIN, ...props.margin }
  const areaWidth = width - margin.left - margin.right
  const areaHeight = height - margin.top - margin.bottom
  const maxRadius = Math.min(Math.abs(areaWidth), Math.abs(areaHeight)) / 2
  const cx = margin.left + percent(props.cx ?? "50%", areaWidth)
  const cy = margin.top + percent(props.cy ?? "50%", areaHeight)
  const inner = percent(props.innerRadius ?? 0, maxRadius)
  const outer = percent(props.outerRadius ?? "80%", maxRadius)
  const startAngle = props.startAngle ?? 0
  const endAngle = props.endAngle ?? 360
  const bars = elements
    .filter((element) => element.type === RadialBar)
    .map((element) => {
      const bar = element.props as RadialBarProps
      const children = childrenOf(bar)
      return {
        props: bar,
        cells: propsOf(children, Cell),
        labels: propsOf(children, LabelList)[0],
        color: bar.fill ?? configColor(config, bar.dataKey, colors.fallback),
      }
    })
  const slots: string[] = []
  bars.forEach((bar, index) => {
    const slot = bar.props.stackId ?? `bar-${index}`
    if (!slots.includes(slot)) slots.push(slot)
  })
  const sums = data.map((datum) => {
    const totals: Record<string, number> = {}
    let max = 0
    bars.forEach((bar, index) => {
      const slot = bar.props.stackId ?? `bar-${index}`
      totals[slot] =
        (totals[slot] ?? 0) + (toNumber(datum[bar.props.dataKey]) ?? 0)
      max = Math.max(max, totals[slot] ?? 0)
    })
    return max
  })
  const axis = propsOf(elements, PolarAngleAxis)[0]
  const domainHigh = axis?.domain
    ? axis.domain[1]
    : (niceTicks(0, Math.max(...sums, 0) || 1, 5).at(-1) ?? 1)
  const domainLow = axis?.domain ? axis.domain[0] : 0
  const angleOf = (value: number) =>
    startAngle +
    ((value - domainLow) / (domainHigh - domainLow || 1)) *
      (endAngle - startAngle)
  const bandSize = (outer - inner) / count
  const gap = bandSize * 0.1
  const thickness =
    props.barSize ?? Math.max(1, (bandSize - 2 * gap) / slots.length)
  const ring = (row: number, slot: number) => {
    const total = thickness * slots.length
    const start = inner + bandSize * row + (bandSize - total) / 2
    return {
      inner: start + thickness * slot,
      outer: start + thickness * (slot + 1),
    }
  }
  const shapes: Shape[] = []
  const texts: TextItem[] = []
  const ends: { x: number; y: number }[] = data.map(() => ({ x: cx, y: cy }))
  const direction = sign(endAngle - startAngle)
  data.forEach((datum, row) => {
    const running: Record<string, number> = {}
    const drawn: string[] = []
    bars.forEach((bar, barIndex) => {
      const slotKey = bar.props.stackId ?? `bar-${barIndex}`
      const slot = slots.indexOf(slotKey)
      const radii = ring(row, slot)
      const cell = bar.cells[row]
      const color = cell?.fill ?? bar.color
      const background = bar.props.background
      if (background && !drawn.includes(slotKey)) {
        drawn.push(slotKey)
        shapes.push({
          key: `radial-background-${row}-${slot}`,
          d: sectorPath({
            cx,
            cy,
            innerRadius: radii.inner,
            outerRadius: radii.outer,
            startAngle,
            endAngle,
            cornerRadius: bar.props.cornerRadius ?? 0,
            fill: color,
            fillOpacity: 1,
            strokeWidth: 0,
          }),
          fill: background.fill ?? color,
          fillOpacity: background.fillOpacity ?? 1,
        })
      }
      const value = toNumber(datum[bar.props.dataKey]) ?? 0
      const base = running[slotKey] ?? domainLow
      running[slotKey] = base + value
      const from = angleOf(base)
      const to = angleOf(base + value)
      if (from !== to) {
        shapes.push({
          key: `radial-${row}-${barIndex}`,
          d: sectorPath({
            cx,
            cy,
            innerRadius: radii.inner,
            outerRadius: radii.outer,
            startAngle: from,
            endAngle: to,
            cornerRadius: bar.props.cornerRadius ?? 0,
            fill: color,
            fillOpacity: cell?.fillOpacity ?? 1,
            strokeWidth: bar.props.strokeWidth ?? 0,
          }),
          fill: color,
          fillOpacity: cell?.fillOpacity ?? 1,
          stroke: bar.props.stroke,
          strokeWidth: bar.props.stroke ? (bar.props.strokeWidth ?? 1) : 0,
        })
      }
      ends[row] = polar(cx, cy, radii.outer, to)
      if (bar.labels) {
        const raw = datum[bar.labels.dataKey ?? bar.props.dataKey]
        const text = bar.labels.formatter
          ? bar.labels.formatter(raw)
          : String(raw ?? "")
        if (text) {
          const middle = (radii.inner + radii.outer) / 2
          const offset =
            ((bar.labels.offset ?? 5) +
              (bar.props.cornerRadius ? thickness / 2 : 0)) /
            (middle || 1) /
            RADIAN
          const point = polar(cx, cy, middle, from + direction * offset)
          texts.push({
            key: `radial-label-${row}-${barIndex}`,
            x: point.x,
            y: point.y,
            value: text,
            anchor: "start",
            baseline: "middle",
            role: "label",
            className: bar.labels.className,
            style: bar.labels.style,
          })
        }
      }
    })
  })
  return {
    shapes,
    texts,
    count,
    names: bars.map(
      (bar) => config[bar.props.dataKey]?.label ?? bar.props.dataKey
    ),
    legend: bars.map((bar) => ({
      dataKey: bar.props.dataKey,
      value: bar.props.dataKey,
      color: bar.color,
    })),
    hitTest: (x, y) => {
      const distance = Math.hypot(x - cx, y - cy)
      const row = Math.floor((distance - inner) / bandSize)
      return row >= 0 && row < count ? row : null
    },
    items: (index) =>
      bars.flatMap((bar) => {
        const datum = data[index] ?? {}
        const value = toValue(datum[bar.props.dataKey])
        if (value === null) return []
        return [
          {
            dataKey: bar.props.dataKey,
            name: bar.props.dataKey,
            value,
            color: bar.cells[index]?.fill ?? bar.color,
            payload: datum,
          },
        ]
      }),
    label: () => undefined,
    anchor: (index) => ends[index] ?? { x: cx, y: cy },
    overlay: () => [],
    external: (index) => index,
  }
}

function build(kind: ChartKind, input: BuildInput) {
  if (kind === "pie") return buildPie(input)
  if (kind === "radial") return buildRadial(input)
  return buildCartesian(input)
}

function Container({
  config,
  accessibilityLabel,
  onLayout,
  children,
  ...props
}: ContainerProps) {
  const [size, setSize] = React.useState({ width: 0, height: 0 })
  const handleLayout = (event: LayoutChangeEvent) => {
    const { width, height } = event.nativeEvent.layout
    setSize((current) =>
      current.width === width && current.height === height
        ? current
        : { width, height }
    )
    onLayout?.(event)
  }
  const value = React.useMemo(
    () => ({ config, accessibilityLabel, ...size }),
    [config, accessibilityLabel, size]
  )
  return (
    <ContainerContext.Provider value={value}>
      <View onLayout={handleLayout} {...props}>
        {size.width > 0 && size.height > 0 ? children : null}
      </View>
    </ContainerContext.Provider>
  )
}

function textBox(text: TextItem) {
  const left =
    text.anchor === "start"
      ? text.x
      : text.anchor === "end"
        ? text.x - TEXT_BOX
        : text.x - TEXT_BOX / 2
  const top =
    text.baseline === "top"
      ? text.y
      : text.baseline === "bottom"
        ? text.y - LINE_HEIGHT
        : text.y - LINE_HEIGHT / 2
  return {
    position: "absolute" as const,
    left,
    top,
    width: TEXT_BOX,
    height: LINE_HEIGHT,
    justifyContent: "center" as const,
    alignItems:
      text.anchor === "start"
        ? ("flex-start" as const)
        : text.anchor === "end"
          ? ("flex-end" as const)
          : ("center" as const),
  }
}

function Root({
  kind,
  children,
  colors,
  renderSurface,
  renderText,
  onActiveIndexChange,
  ...props
}: RootProps) {
  const container = useContainerContext()
  const haptics = useHaptics()
  const elements = flatten(children)
  const tooltip = propsOf(elements, Tooltip)[0]
  const legend = propsOf(elements, Legend)[0]
  const [legendHeight, setLegendHeight] = React.useState(0)
  const [tooltipSize, setTooltipSize] = React.useState<{
    width: number
    height: number
  } | null>(null)
  const plotHeight = Math.max(0, container.height - (legend ? legendHeight : 0))
  const scene = build(kind, {
    elements,
    config: container.config,
    colors,
    width: container.width,
    height: plotHeight,
    props: { kind, colors, renderSurface, renderText, ...props },
  })
  const interactive = Boolean(tooltip || onActiveIndexChange)
  const [selected, setSelected] = React.useState<number | null>(
    tooltip?.defaultIndex ?? null
  )
  const active =
    selected !== null && selected >= 0 && selected < scene.count
      ? selected
      : null
  const activeRef = React.useRef(active)
  activeRef.current = active
  const touchRef = React.useRef<{
    x: number
    y: number
    previous: number | null
    moved: boolean
  } | null>(null)
  const select = (next: number | null) => {
    if (next === activeRef.current) return
    activeRef.current = next
    setSelected(next)
    if (next !== null) haptics.selection()
    onActiveIndexChange?.(next === null ? null : scene.external(next))
  }
  const locate = (event: GestureResponderEvent) => {
    const { locationX, locationY } = event.nativeEvent
    return { x: locationX, y: locationY }
  }
  const responder = {
    onStartShouldSetResponder: () => true,
    onMoveShouldSetResponder: () => true,
    onResponderTerminationRequest: () => true,
    onResponderGrant: (event: GestureResponderEvent) => {
      const point = locate(event)
      touchRef.current = { ...point, previous: activeRef.current, moved: false }
      const index = scene.hitTest(point.x, point.y)
      if (index !== null) select(index)
    },
    onResponderMove: (event: GestureResponderEvent) => {
      const point = locate(event)
      const touch = touchRef.current
      if (
        touch &&
        Math.hypot(point.x - touch.x, point.y - touch.y) > TAP_SLOP
      ) {
        touch.moved = true
      }
      const index = scene.hitTest(point.x, point.y)
      if (index !== null) select(index)
    },
    onResponderRelease: (event: GestureResponderEvent) => {
      const touch = touchRef.current
      touchRef.current = null
      if (!touch || touch.moved) return
      const point = locate(event)
      const index = scene.hitTest(point.x, point.y)
      if (index === null || index === touch.previous) select(null)
    },
  }
  const items = active === null ? [] : scene.items(active)
  const label = active === null ? undefined : scene.label(active)
  const names = scene.names.filter(Boolean)
  const accessibilityLabel = [
    container.accessibilityLabel ?? names.join(", "),
    scene.range,
  ]
    .filter(Boolean)
    .join(", ")
  const valueText =
    active === null
      ? undefined
      : [
          label === undefined ? undefined : String(label),
          items
            .map((item) => {
              const name =
                container.config[item.name]?.label ??
                container.config[item.dataKey]?.label ??
                item.name
              return `${name} ${formatValue(item.value)}`
            })
            .join(", "),
        ]
          .filter(Boolean)
          .join(": ")
  const onAccessibilityAction = (event: AccessibilityActionEvent) => {
    if (scene.count === 0) return
    const current = activeRef.current
    if (event.nativeEvent.actionName === "increment") {
      select(current === null ? 0 : Math.min(scene.count - 1, current + 1))
    }
    if (event.nativeEvent.actionName === "decrement") {
      select(current === null ? scene.count - 1 : Math.max(0, current - 1))
    }
  }
  const cursor =
    tooltip && tooltip.cursor !== false
      ? typeof tooltip.cursor === "object"
        ? { key: "cursor", ...tooltip.cursor }
        : { key: "cursor" }
      : null
  const shapes =
    active === null
      ? scene.shapes
      : [
          ...scene.shapes.filter((shape) => !shape.circle),
          ...scene
            .overlay(active, cursor)
            .filter((shape) => shape.key === "cursor"),
          ...scene.shapes.filter((shape) => shape.circle),
          ...scene
            .overlay(active, cursor)
            .filter((shape) => shape.key !== "cursor"),
        ]
  const anchor = active === null ? null : scene.anchor(active)
  const content = tooltip?.content
  const state: TooltipState = {
    active: active !== null,
    label,
    payload: items,
  }
  let tooltipNode: React.ReactNode = null
  if (active !== null && content) {
    tooltipNode = typeof content === "function" ? content(state) : content
  }
  let tooltipStyle = null
  if (anchor && tooltipSize) {
    const left = Math.max(
      0,
      Math.min(
        container.width - tooltipSize.width,
        anchor.x - tooltipSize.width / 2
      )
    )
    let top = anchor.y - tooltipSize.height - TOOLTIP_GAP
    if (top < 0) {
      top =
        anchor.y + TOOLTIP_GAP + tooltipSize.height <= plotHeight
          ? anchor.y + TOOLTIP_GAP
          : 0
    }
    tooltipStyle = { left, top, opacity: 1 }
  }
  return (
    <View
      style={styles.root}
      accessible
      accessibilityRole={interactive ? "adjustable" : "image"}
      accessibilityLabel={accessibilityLabel}
      accessibilityValue={valueText ? { text: valueText } : undefined}
      accessibilityActions={
        interactive ? [{ name: "increment" }, { name: "decrement" }] : undefined
      }
      onAccessibilityAction={interactive ? onAccessibilityAction : undefined}
    >
      <View style={{ height: plotHeight }}>
        {renderSurface({ shapes, width: container.width, height: plotHeight })}
        {scene.texts.map((text) => (
          <View key={text.key} pointerEvents="none" style={textBox(text)}>
            {renderText(text)}
          </View>
        ))}
        {interactive ? (
          <View style={StyleSheet.absoluteFill} {...responder} />
        ) : null}
        {tooltipNode ? (
          <View
            pointerEvents="none"
            style={[styles.tooltip, tooltipStyle ?? styles.hidden]}
            onLayout={(event) => {
              const { width, height } = event.nativeEvent.layout
              setTooltipSize((current) =>
                current && current.width === width && current.height === height
                  ? current
                  : { width, height }
              )
            }}
          >
            <TooltipContext.Provider value={state}>
              {tooltipNode}
            </TooltipContext.Provider>
          </View>
        ) : null}
      </View>
      {legend?.content ? (
        <View
          onLayout={(event) => {
            const next = event.nativeEvent.layout.height
            setLegendHeight((current) => (current === next ? current : next))
          }}
        >
          <LegendContext.Provider value={scene.legend}>
            {legend.content}
          </LegendContext.Provider>
        </View>
      ) : null}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex: 1 },
  tooltip: { position: "absolute" },
  hidden: { left: 0, top: 0, opacity: 0 },
})

export type {
  AreaProps,
  AxisDomain,
  AxisTick,
  BarProps,
  BarRadius,
  CartesianGridProps,
  CellProps,
  ChartConfigBase,
  ChartCurve,
  ChartDatum,
  ChartDot,
  ChartGradient,
  ChartKind,
  ChartMargin,
  ChartPoint,
  ChartValue,
  ContainerProps,
  DefaultColors,
  LabelListProps,
  LegendItem,
  LegendProps,
  LineProps,
  PieLabelEntry,
  PieProps,
  PolarAngleAxisProps,
  RadialBarProps,
  ReferenceAreaProps,
  ReferenceLineProps,
  RootProps,
  SectorProps,
  Shape,
  SurfaceProps,
  TextItem,
  TooltipItem,
  TooltipProps,
  TooltipState,
  XAxisProps,
  YAxisProps,
}
export {
  Area,
  Bar,
  CartesianGrid,
  Cell,
  Container,
  formatNumber,
  formatValue,
  LabelList,
  Legend,
  Line,
  Pie,
  PolarAngleAxis,
  RadialBar,
  ReferenceArea,
  ReferenceLine,
  Root,
  Tooltip,
  useContainerContext,
  useLegendContext,
  useTooltipContext,
  XAxis,
  YAxis,
}
