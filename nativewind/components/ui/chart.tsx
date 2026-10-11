import { cn } from "cn"
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg"
import * as ChartPrimitive from "@/components/primitives/chart"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

const CHART_COLORS = {
  blue: { text: "text-blue", bg: "bg-blue", border: "border-blue" },
  green: { text: "text-green", bg: "bg-green", border: "border-green" },
  orange: { text: "text-orange", bg: "bg-orange", border: "border-orange" },
  red: { text: "text-red", bg: "bg-red", border: "border-red" },
  yellow: { text: "text-yellow", bg: "bg-yellow", border: "border-yellow" },
  purple: { text: "text-purple", bg: "bg-purple", border: "border-purple" },
  pink: { text: "text-pink", bg: "bg-pink", border: "border-pink" },
  indigo: { text: "text-indigo", bg: "bg-indigo", border: "border-indigo" },
  teal: { text: "text-teal", bg: "bg-teal", border: "border-teal" },
  mint: { text: "text-mint", bg: "bg-mint", border: "border-mint" },
  cyan: { text: "text-cyan", bg: "bg-cyan", border: "border-cyan" },
  brown: { text: "text-brown", bg: "bg-brown", border: "border-brown" },
  gray: { text: "text-gray", bg: "bg-gray", border: "border-gray" },
  accent: { text: "text-accent", bg: "bg-accent", border: "border-accent" },
  success: { text: "text-success", bg: "bg-success", border: "border-success" },
  danger: { text: "text-danger", bg: "bg-danger", border: "border-danger" },
  warning: { text: "text-warning", bg: "bg-warning", border: "border-warning" },
  link: { text: "text-link", bg: "bg-link", border: "border-link" },
  control: { text: "text-control", bg: "bg-control", border: "border-control" },
  label: { text: "text-label", bg: "bg-label", border: "border-label" },
  "label-secondary": {
    text: "text-label-secondary",
    bg: "bg-label-secondary",
    border: "border-label-secondary",
  },
  "label-tertiary": {
    text: "text-label-tertiary",
    bg: "bg-label-tertiary",
    border: "border-label-tertiary",
  },
  "label-quaternary": {
    text: "text-label-quaternary",
    bg: "bg-label-quaternary",
    border: "border-label-quaternary",
  },
  separator: {
    text: "text-separator",
    bg: "bg-separator",
    border: "border-separator",
  },
  "separator-strong": {
    text: "text-separator-strong",
    bg: "bg-separator-strong",
    border: "border-separator-strong",
  },
  surface: { text: "text-surface", bg: "bg-surface", border: "border-surface" },
  "surface-secondary": {
    text: "text-surface-secondary",
    bg: "bg-surface-secondary",
    border: "border-surface-secondary",
  },
  "surface-raised": {
    text: "text-surface-raised",
    bg: "bg-surface-raised",
    border: "border-surface-raised",
  },
  "on-accent": {
    text: "text-on-accent",
    bg: "bg-on-accent",
    border: "border-on-accent",
  },
} as const

type ChartColor = keyof typeof CHART_COLORS

type ChartConfig = Record<
  string,
  { label?: string; color?: ChartColor; icon?: PhosphorIcon }
>

const DEFAULT_COLORS: ChartPrimitive.DefaultColors = {
  grid: "separator",
  cursor: "separator",
  spoke: "separator-strong",
  reference: "separator",
  fallback: "label",
}

const TEXT_CLASS: Record<ChartPrimitive.TextItem["role"], string> = {
  tick: "text-xs text-label-secondary",
  label: "text-xs font-semibold text-label",
  reference: "text-xs font-semibold text-label-secondary",
}

function isChartColor(value: string | undefined): value is ChartColor {
  return value !== undefined && value in CHART_COLORS
}

type PaletteRender = (color: string) => React.ReactNode

const PaletteContext = React.createContext<PaletteRender | null>(null)

function PaletteSwatch({ color }: PhosphorIconProps) {
  const render = React.useContext(PaletteContext)
  return <>{render?.(color ?? "transparent")}</>
}

function ChartPalette({
  colors,
  children,
}: {
  colors: readonly ChartColor[]
  children: (palette: Partial<Record<ChartColor, string>>) => React.ReactNode
}) {
  const resolve = (
    index: number,
    palette: Partial<Record<ChartColor, string>>
  ): React.ReactNode => {
    const token = colors[index]
    if (token === undefined) return children(palette)
    return (
      <PaletteContext.Provider
        value={(value) => resolve(index + 1, { ...palette, [token]: value })}
      >
        <Icon as={PaletteSwatch} className={CHART_COLORS[token].text} />
      </PaletteContext.Provider>
    )
  }
  return <>{resolve(0, {})}</>
}

function shapeColors(shapes: ChartPrimitive.Shape[]) {
  const colors = new Set<ChartColor>()
  for (const shape of shapes) {
    if (isChartColor(shape.fill)) colors.add(shape.fill)
    if (isChartColor(shape.stroke)) colors.add(shape.stroke)
    for (const stop of shape.gradient?.stops ?? []) {
      if (isChartColor(stop.color)) colors.add(stop.color)
    }
  }
  return [...colors]
}

function ChartSurface({ shapes, width, height }: ChartPrimitive.SurfaceProps) {
  const id = React.useId().replace(/[^\w-]/g, "")
  return (
    <ChartPalette colors={shapeColors(shapes)}>
      {(palette) => {
        const paint = (token: string | undefined) =>
          isChartColor(token) ? (palette[token] ?? "transparent") : "none"
        return (
          <Svg width={width} height={height}>
            <Defs>
              {shapes
                .filter((shape) => shape.gradient)
                .map((shape) => (
                  <LinearGradient
                    key={shape.key}
                    id={`${id}-${shape.key}`}
                    x1="0"
                    y1="0"
                    x2={shape.gradient?.horizontal ? "1" : "0"}
                    y2={shape.gradient?.horizontal ? "0" : "1"}
                  >
                    {shape.gradient?.stops.map((stop) => (
                      <Stop
                        key={`${stop.offset}-${stop.color}`}
                        offset={stop.offset}
                        stopColor={paint(stop.color)}
                        stopOpacity={stop.opacity}
                      />
                    ))}
                  </LinearGradient>
                ))}
            </Defs>
            {shapes.map((shape) => {
              const fill = shape.gradient
                ? `url(#${id}-${shape.key})`
                : paint(shape.fill)
              if (shape.circle) {
                return (
                  <Circle
                    key={shape.key}
                    cx={shape.circle.cx}
                    cy={shape.circle.cy}
                    r={shape.circle.r}
                    fill={fill}
                    fillOpacity={shape.fillOpacity}
                    stroke={paint(shape.stroke)}
                    strokeWidth={shape.strokeWidth}
                  />
                )
              }
              return (
                <Path
                  key={shape.key}
                  d={shape.d}
                  fill={fill}
                  fillOpacity={shape.fillOpacity}
                  stroke={paint(shape.stroke)}
                  strokeWidth={shape.strokeWidth}
                  strokeOpacity={shape.strokeOpacity}
                  strokeDasharray={shape.strokeDasharray}
                />
              )
            })}
          </Svg>
        )
      }}
    </ChartPalette>
  )
}

function renderSurface(props: ChartPrimitive.SurfaceProps) {
  return <ChartSurface {...props} />
}

function renderText(text: ChartPrimitive.TextItem) {
  return (
    <Text
      numberOfLines={1}
      className={cn(TEXT_CLASS[text.role], text.className)}
    >
      {text.value}
    </Text>
  )
}

const SIZED = /(^|\s)(h-|size-|aspect-)/

function ChartContainer({
  className,
  ...props
}: Omit<ChartPrimitive.ContainerProps, "config"> & {
  config: ChartConfig
}) {
  return (
    <ChartPrimitive.Container
      className={cn(
        "w-full",
        !SIZED.test(className ?? "") && "aspect-video",
        className
      )}
      {...props}
    />
  )
}

function useChart() {
  const { config } = ChartPrimitive.useContainerContext()
  return { config: config as ChartConfig }
}

type ChartRootProps = Pick<
  ChartPrimitive.RootProps,
  "onActiveIndexChange" | "children"
>

type CartesianChartProps = ChartRootProps &
  Pick<ChartPrimitive.RootProps, "data" | "margin">

function LineChart(props: CartesianChartProps) {
  return (
    <ChartPrimitive.Root
      kind="line"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function AreaChart(
  props: CartesianChartProps & Pick<ChartPrimitive.RootProps, "stackOffset">
) {
  return (
    <ChartPrimitive.Root
      kind="area"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function BarChart(
  props: CartesianChartProps &
    Pick<ChartPrimitive.RootProps, "layout" | "barGap" | "barCategoryGap">
) {
  return (
    <ChartPrimitive.Root
      kind="bar"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function ComposedChart(props: CartesianChartProps) {
  return (
    <ChartPrimitive.Root
      kind="composed"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function PieChart(
  props: ChartRootProps & Pick<ChartPrimitive.RootProps, "margin">
) {
  return (
    <ChartPrimitive.Root
      kind="pie"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function RadialBarChart(
  props: ChartRootProps &
    Pick<
      ChartPrimitive.RootProps,
      | "data"
      | "margin"
      | "innerRadius"
      | "outerRadius"
      | "startAngle"
      | "endAngle"
      | "barSize"
      | "cx"
      | "cy"
    >
) {
  return (
    <ChartPrimitive.Root
      kind="radial"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

function RadarChart(
  props: ChartRootProps &
    Pick<ChartPrimitive.RootProps, "data" | "margin" | "outerRadius" | "cy">
) {
  return (
    <ChartPrimitive.Root
      kind="radar"
      colors={DEFAULT_COLORS}
      renderSurface={renderSurface}
      renderText={renderText}
      {...props}
    />
  )
}

const CartesianGrid: (props: ChartPrimitive.CartesianGridProps) => null =
  ChartPrimitive.CartesianGrid

const XAxis: (props: ChartPrimitive.XAxisProps) => null = ChartPrimitive.XAxis

const YAxis: (props: Omit<ChartPrimitive.YAxisProps, "tickStyle">) => null =
  ChartPrimitive.YAxis

const Line: (props: ChartPrimitive.LineProps<ChartColor>) => null =
  ChartPrimitive.Line

const Area: (props: ChartPrimitive.AreaProps<ChartColor>) => null =
  ChartPrimitive.Area

const Bar: (props: ChartPrimitive.BarProps<ChartColor>) => null =
  ChartPrimitive.Bar

const ReferenceLine: (
  props: ChartPrimitive.ReferenceLineProps<ChartColor>
) => null = ChartPrimitive.ReferenceLine

const ReferenceArea: (
  props: ChartPrimitive.ReferenceAreaProps<ChartColor>
) => null = ChartPrimitive.ReferenceArea

const LabelList: (props: Omit<ChartPrimitive.LabelListProps, "style">) => null =
  ChartPrimitive.LabelList

const Cell: (props: ChartPrimitive.CellProps<ChartColor>) => null =
  ChartPrimitive.Cell

const Pie: (props: ChartPrimitive.PieProps<ChartColor>) => null =
  ChartPrimitive.Pie

const RadialBar: (props: ChartPrimitive.RadialBarProps<ChartColor>) => null =
  ChartPrimitive.RadialBar

const PolarAngleAxis: (
  props: Omit<ChartPrimitive.PolarAngleAxisProps, "tickStyle">
) => null = ChartPrimitive.PolarAngleAxis

const PolarRadiusAxis: (
  props: Omit<ChartPrimitive.PolarRadiusAxisProps, "tickStyle">
) => null = ChartPrimitive.PolarRadiusAxis

const PolarGrid: (props: ChartPrimitive.PolarGridProps<ChartColor>) => null =
  ChartPrimitive.PolarGrid

const Radar: (props: ChartPrimitive.RadarProps<ChartColor>) => null =
  ChartPrimitive.Radar

const ChartTooltip: (props: ChartPrimitive.TooltipProps<ChartColor>) => null =
  ChartPrimitive.Tooltip

const ChartLegend: (props: ChartPrimitive.LegendProps) => null =
  ChartPrimitive.Legend

function configKeyOf(
  config: ChartConfig,
  item: { payload?: ChartPrimitive.ChartDatum },
  key: string
) {
  const value = item.payload?.[key]
  if (typeof value === "string" && value in config) return value
  return key
}

function wrapText(node: React.ReactNode, className?: string) {
  if (typeof node === "string" || typeof node === "number") {
    return <Text className={className}>{node}</Text>
  }
  return node
}

function ChartTooltipContent({
  className,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  formatter,
  nameKey,
}: {
  className?: string
  indicator?: "line" | "dot" | "dashed"
  hideLabel?: boolean
  hideIndicator?: boolean
  nameKey?: string
  labelFormatter?: (
    label: React.ReactNode,
    payload: ChartPrimitive.TooltipItem[]
  ) => React.ReactNode
  formatter?: (
    value: ChartPrimitive.ChartValue,
    name: string,
    item: ChartPrimitive.TooltipItem,
    index: number,
    payload: ChartPrimitive.ChartDatum
  ) => React.ReactNode
}) {
  const { config } = useChart()
  const { active, payload, label } = ChartPrimitive.useTooltipContext()
  const [first] = payload
  if (!active || !first) return null
  let tooltipLabel: React.ReactNode = null
  if (!hideLabel) {
    const itemConfig = config[configKeyOf(config, first, first.dataKey)]
    const value =
      typeof label === "string"
        ? (config[label]?.label ?? label)
        : itemConfig?.label
    const content = labelFormatter ? labelFormatter(value, payload) : value
    if (content !== undefined && content !== null && content !== "") {
      tooltipLabel = (
        <TextClassContext.Provider value="text-xs font-semibold text-label">
          {wrapText(content)}
        </TextClassContext.Provider>
      )
    }
  }
  const nestLabel = payload.length === 1 && indicator !== "dot"
  return (
    <TextClassContext.Provider value="text-xs text-label">
      <View
        className={cn(
          "min-w-32 gap-1.5 rounded-md border border-label-5 bg-surface-raised px-2.5 py-1.5 shadow-lg dark:border-label-10",
          className
        )}
      >
        {nestLabel ? null : tooltipLabel}
        <View className="gap-1.5">
          {payload.map((item, index) => {
            const key = nameKey ?? item.name ?? item.dataKey
            const itemConfig = config[configKeyOf(config, item, key)]
            const color = isChartColor(item.color)
              ? CHART_COLORS[item.color]
              : undefined
            return (
              <View
                key={`${item.dataKey}-${item.name}`}
                className={cn(
                  "w-full flex-row gap-2",
                  indicator === "dot" ? "items-center" : "items-stretch"
                )}
              >
                {formatter ? (
                  wrapText(
                    formatter(item.value, item.name, item, index, item.payload)
                  )
                ) : (
                  <>
                    {itemConfig?.icon ? (
                      <Icon
                        as={itemConfig.icon}
                        className="size-2.5 text-label-secondary"
                      />
                    ) : hideIndicator ? null : (
                      <View
                        className={cn(
                          "shrink-0 rounded-xs",
                          indicator === "dot" && cn("size-2.5", color?.bg),
                          indicator === "line" && cn("w-1", color?.bg),
                          indicator === "dashed" &&
                            cn(
                              "w-0 border-[1.5px] border-dashed",
                              color?.border
                            ),
                          nestLabel && indicator === "dashed" && "my-0.5"
                        )}
                      />
                    )}
                    <View
                      className={cn(
                        "grow flex-row justify-between gap-2",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <View className="gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <Text className="text-xs text-label-secondary">
                          {itemConfig?.label ?? item.name}
                        </Text>
                      </View>
                      <Text className="font-mono text-xs font-semibold text-label tabular-nums">
                        {ChartPrimitive.formatValue(item.value)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            )
          })}
        </View>
      </View>
    </TextClassContext.Provider>
  )
}

function ChartLegendContent({
  className,
  nameKey,
}: {
  className?: string
  nameKey?: string
}) {
  const { config } = useChart()
  const items = ChartPrimitive.useLegendContext()
  if (!items.length) return null
  const keys = Object.keys(config)
  const resolved = items.map((item) => {
    const key = nameKey ?? item.dataKey
    const configKey =
      typeof item.payload?.[key] === "string"
        ? String(item.payload[key])
        : item.value in config
          ? item.value
          : item.dataKey
    return { item, configKey }
  })
  const order = (key: string) => {
    const index = keys.indexOf(key)
    return index === -1 ? keys.length : index
  }
  resolved.sort((a, b) => order(a.configKey) - order(b.configKey))
  return (
    <View
      className={cn(
        "flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1.5 pt-3",
        className
      )}
    >
      {resolved.map(({ item, configKey }) => {
        const itemConfig = config[configKey]
        return (
          <View
            key={`${item.dataKey}-${item.value}`}
            className="flex-row items-center gap-1.5"
          >
            {itemConfig?.icon ? (
              <Icon
                as={itemConfig.icon}
                className="size-3 text-label-secondary"
              />
            ) : (
              <View
                className={cn(
                  "size-2 shrink-0 rounded-xs",
                  isChartColor(item.color) && CHART_COLORS[item.color].bg
                )}
              />
            )}
            <Text className="text-xs text-label">{itemConfig?.label}</Text>
          </View>
        )
      })}
    </View>
  )
}

export type { ChartColor, ChartConfig }
export {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartPalette,
  ChartTooltip,
  ChartTooltipContent,
  ComposedChart,
  LabelList,
  Line,
  LineChart,
  Pie,
  PieChart,
  PolarAngleAxis,
  PolarGrid,
  PolarRadiusAxis,
  Radar,
  RadarChart,
  RadialBar,
  RadialBarChart,
  ReferenceArea,
  ReferenceLine,
  useChart,
  XAxis,
  YAxis,
}
