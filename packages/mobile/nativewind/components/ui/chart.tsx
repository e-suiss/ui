import { cn } from "cn"
import type {
  Icon as PhosphorIcon,
  IconProps as PhosphorIconProps,
} from "phosphor-react-native"
import * as React from "react"
import { View } from "react-native"
import Svg, {
  Circle,
  ClipPath,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from "react-native-svg"
import * as ChartPrimitive from "@/components/primitives/chart"
import { Icon } from "@/components/ui/icon"
import { Text, TextClassContext } from "@/components/ui/text"

const CHART_COLORS = {
  "chart-1": {
    text: "text-chart-1",
    bg: "bg-chart-1",
    border: "border-chart-1",
  },
  "chart-2": {
    text: "text-chart-2",
    bg: "bg-chart-2",
    border: "border-chart-2",
  },
  "chart-3": {
    text: "text-chart-3",
    bg: "bg-chart-3",
    border: "border-chart-3",
  },
  "chart-4": {
    text: "text-chart-4",
    bg: "bg-chart-4",
    border: "border-chart-4",
  },
  "chart-5": {
    text: "text-chart-5",
    bg: "bg-chart-5",
    border: "border-chart-5",
  },
  primary: { text: "text-primary", bg: "bg-primary", border: "border-primary" },
  "primary-foreground": {
    text: "text-primary-foreground",
    bg: "bg-primary-foreground",
    border: "border-primary-foreground",
  },
  secondary: {
    text: "text-secondary",
    bg: "bg-secondary",
    border: "border-secondary",
  },
  muted: { text: "text-muted", bg: "bg-muted", border: "border-muted" },
  "muted-foreground": {
    text: "text-muted-foreground",
    bg: "bg-muted-foreground",
    border: "border-muted-foreground",
  },
  foreground: {
    text: "text-foreground",
    bg: "bg-foreground",
    border: "border-foreground",
  },
  background: {
    text: "text-background",
    bg: "bg-background",
    border: "border-background",
  },
  card: { text: "text-card", bg: "bg-card", border: "border-card" },
  destructive: {
    text: "text-destructive",
    bg: "bg-destructive",
    border: "border-destructive",
  },
  border: { text: "text-border", bg: "bg-border", border: "border-border" },
  input: { text: "text-input", bg: "bg-input", border: "border-input" },
  "red-500": {
    text: "text-red-500",
    bg: "bg-red-500",
    border: "border-red-500",
  },
  "orange-500": {
    text: "text-orange-500",
    bg: "bg-orange-500",
    border: "border-orange-500",
  },
  "amber-500": {
    text: "text-amber-500",
    bg: "bg-amber-500",
    border: "border-amber-500",
  },
  "yellow-500": {
    text: "text-yellow-500",
    bg: "bg-yellow-500",
    border: "border-yellow-500",
  },
  "green-500": {
    text: "text-green-500",
    bg: "bg-green-500",
    border: "border-green-500",
  },
  "teal-400": {
    text: "text-teal-400",
    bg: "bg-teal-400",
    border: "border-teal-400",
  },
  "teal-500": {
    text: "text-teal-500",
    bg: "bg-teal-500",
    border: "border-teal-500",
  },
  "cyan-500": {
    text: "text-cyan-500",
    bg: "bg-cyan-500",
    border: "border-cyan-500",
  },
  "blue-500": {
    text: "text-blue-500",
    bg: "bg-blue-500",
    border: "border-blue-500",
  },
  "indigo-500": {
    text: "text-indigo-500",
    bg: "bg-indigo-500",
    border: "border-indigo-500",
  },
  "purple-500": {
    text: "text-purple-500",
    bg: "bg-purple-500",
    border: "border-purple-500",
  },
  "pink-500": {
    text: "text-pink-500",
    bg: "bg-pink-500",
    border: "border-pink-500",
  },
  "zinc-500": {
    text: "text-zinc-500",
    bg: "bg-zinc-500",
    border: "border-zinc-500",
  },
} as const

type ChartColor = keyof typeof CHART_COLORS

type ChartConfig = Record<
  string,
  { label?: string; color?: ChartColor; icon?: PhosphorIcon }
>

const DEFAULT_COLORS: ChartPrimitive.DefaultColors = {
  grid: "border",
  cursor: "border",
  spoke: "input",
  reference: "border",
  fallback: "foreground",
}

const TEXT_CLASS: Record<ChartPrimitive.TextItem["role"], string> = {
  tick: "text-xs text-muted-foreground",
  label: "text-xs font-semibold text-foreground",
  reference: "text-xs font-semibold text-muted-foreground",
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
              {shapes.map((shape) =>
                shape.clip ? (
                  <ClipPath
                    key={`${shape.key}-clip`}
                    id={`${id}-${shape.key}-clip`}
                  >
                    <Rect
                      x={shape.clip.x}
                      y={shape.clip.y}
                      width={shape.clip.width}
                      height={shape.clip.height}
                    />
                  </ClipPath>
                ) : null
              )}
            </Defs>
            {shapes.map((shape) => {
              const fill = shape.gradient
                ? `url(#${id}-${shape.key})`
                : paint(shape.fill)
              const key = shape.clip ? `${shape.key}-clipped` : shape.key
              const clipPath = shape.clip
                ? `url(#${id}-${shape.key}-clip)`
                : undefined
              if (shape.circle) {
                return (
                  <Circle
                    key={key}
                    clipPath={clipPath}
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
                  key={key}
                  clipPath={clipPath}
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
        <TextClassContext.Provider value="text-xs font-semibold text-foreground">
          {wrapText(content)}
        </TextClassContext.Provider>
      )
    }
  }
  const nestLabel = payload.length === 1 && indicator !== "dot"
  return (
    <TextClassContext.Provider value="text-xs text-foreground">
      <View
        className={cn(
          "min-w-32 gap-1.5 rounded-md border border-foreground-5 bg-popover px-2.5 py-1.5 shadow-lg dark:border-foreground-10",
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
                        className="size-2.5 text-muted-foreground"
                      />
                    ) : (
                      !hideIndicator && (
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
                      )
                    )}
                    <View
                      className={cn(
                        "grow flex-row justify-between gap-2",
                        nestLabel ? "items-end" : "items-center"
                      )}
                    >
                      <View className="gap-1.5">
                        {nestLabel ? tooltipLabel : null}
                        <Text className="text-xs text-muted-foreground">
                          {itemConfig?.label ?? item.name}
                        </Text>
                      </View>
                      <Text className="font-mono text-xs font-semibold text-foreground tabular-nums">
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
    const fallbackKey = item.value in config ? item.value : item.dataKey
    const configKey =
      typeof item.payload?.[key] === "string"
        ? String(item.payload[key])
        : fallbackKey
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
                className="size-3 text-muted-foreground"
              />
            ) : (
              <View
                className={cn(
                  "size-2 shrink-0 rounded-xs",
                  isChartColor(item.color) && CHART_COLORS[item.color].bg
                )}
              />
            )}
            <Text className="text-xs text-foreground">{itemConfig?.label}</Text>
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
