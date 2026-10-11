import type { Icon as PhosphorIcon } from "phosphor-react-native"
import * as React from "react"
import {
  type StyleProp,
  StyleSheet,
  type TextStyle,
  View,
  type ViewStyle,
} from "react-native"
import Svg, { Circle, Defs, LinearGradient, Path, Stop } from "react-native-svg"
import * as ChartPrimitive from "@/components/primitives/chart"
import { Icon } from "@/components/ui/icon"
import { Text, TextStyleContext } from "@/components/ui/text"
import {
  fontSize,
  radius,
  shadow,
  type ThemeColors,
  useTheme,
} from "@/components/ui/theme"

const CHART_COLORS = {
  blue: "blue",
  green: "green",
  orange: "orange",
  red: "red",
  yellow: "yellow",
  purple: "purple",
  pink: "pink",
  indigo: "indigo",
  teal: "teal",
  mint: "mint",
  cyan: "cyan",
  brown: "brown",
  gray: "gray",
  accent: "accent",
  success: "success",
  danger: "danger",
  warning: "warning",
  link: "link",
  control: "control",
  label: "label",
  "label-secondary": "labelSecondary",
  "label-tertiary": "labelTertiary",
  "label-quaternary": "labelQuaternary",
  separator: "separator",
  "separator-strong": "separatorStrong",
  surface: "surface",
  "surface-secondary": "surfaceSecondary",
  "surface-raised": "surfaceRaised",
  "on-accent": "onAccent",
} as const satisfies Record<string, keyof ThemeColors>

type ChartColor = keyof typeof CHART_COLORS

type ChartConfig = Record<
  string,
  { label?: string; color?: ChartColor; icon?: PhosphorIcon }
>

const DEFAULT_COLORS: ChartPrimitive.DefaultColors = {
  grid: "separator",
  cursor: "separator",
  reference: "separator",
  fallback: "label",
}

const styles = StyleSheet.create({
  container: { width: "100%" },
  ratio: { aspectRatio: 16 / 9 },
  tick: { ...fontSize.xs },
  label: { ...fontSize.xs, fontWeight: "600" },
  tooltip: {
    minWidth: 128,
    gap: 6,
    borderRadius: radius.md,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 6,
    ...shadow.lg,
  },
  items: { gap: 6 },
  item: { width: "100%", flexDirection: "row", gap: 8 },
  dot: { width: 10, height: 10, flexShrink: 0, borderRadius: radius.xs },
  line: { width: 4, flexShrink: 0, borderRadius: radius.xs },
  dashed: {
    width: 0,
    flexShrink: 0,
    borderWidth: 1.5,
    borderStyle: "dashed",
    borderRadius: radius.xs,
  },
  nested: { marginVertical: 2 },
  row: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  name: { gap: 6 },
  value: {
    ...fontSize.xs,
    fontFamily: "Menlo",
    fontWeight: "600",
    fontVariant: ["tabular-nums"],
  },
  legend: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "center",
    columnGap: 16,
    rowGap: 6,
    paddingTop: 12,
  },
  legendItem: { flexDirection: "row", alignItems: "center", gap: 6 },
  swatch: { width: 8, height: 8, flexShrink: 0, borderRadius: radius.xs },
})

function isChartColor(value: string | undefined): value is ChartColor {
  return value !== undefined && value in CHART_COLORS
}

function resolveColor(colors: ThemeColors, token: string | undefined) {
  return isChartColor(token) ? colors[CHART_COLORS[token]] : undefined
}

function ChartPalette({
  colors: tokens,
  children,
}: {
  colors: readonly ChartColor[]
  children: (palette: Partial<Record<ChartColor, string>>) => React.ReactNode
}) {
  const { colors } = useTheme()
  const palette: Partial<Record<ChartColor, string>> = {}
  for (const token of tokens) palette[token] = colors[CHART_COLORS[token]]
  return <>{children(palette)}</>
}

function ChartSurface({ shapes, width, height }: ChartPrimitive.SurfaceProps) {
  const { colors } = useTheme()
  const id = React.useId().replace(/[^\w-]/g, "")
  const paint = (token: string | undefined) =>
    isChartColor(token) ? colors[CHART_COLORS[token]] : "none"
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
}

function ChartText({ text }: { text: ChartPrimitive.TextItem }) {
  const { colors } = useTheme()
  return (
    <Text
      numberOfLines={1}
      style={[
        text.role === "tick" ? styles.tick : styles.label,
        {
          color: text.role === "label" ? colors.label : colors.labelSecondary,
        },
        text.style,
      ]}
    >
      {text.value}
    </Text>
  )
}

function renderSurface(props: ChartPrimitive.SurfaceProps) {
  return <ChartSurface {...props} />
}

function renderText(text: ChartPrimitive.TextItem) {
  return <ChartText text={text} />
}

function ChartContainer({
  style,
  ...props
}: Omit<ChartPrimitive.ContainerProps, "config" | "className"> & {
  config: ChartConfig
}) {
  const flat = StyleSheet.flatten(style)
  const sized = flat?.height !== undefined || flat?.aspectRatio !== undefined
  return (
    <ChartPrimitive.Container
      style={[styles.container, sized ? null : styles.ratio, style]}
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

const CartesianGrid: (props: ChartPrimitive.CartesianGridProps) => null =
  ChartPrimitive.CartesianGrid

const XAxis: (props: ChartPrimitive.XAxisProps) => null = ChartPrimitive.XAxis

const YAxis: (props: Omit<ChartPrimitive.YAxisProps, "tickClassName">) => null =
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

const LabelList: (
  props: Omit<ChartPrimitive.LabelListProps, "className">
) => null = ChartPrimitive.LabelList

const Cell: (props: ChartPrimitive.CellProps<ChartColor>) => null =
  ChartPrimitive.Cell

const Pie: (props: ChartPrimitive.PieProps<ChartColor>) => null =
  ChartPrimitive.Pie

const RadialBar: (props: ChartPrimitive.RadialBarProps<ChartColor>) => null =
  ChartPrimitive.RadialBar

const PolarAngleAxis: (props: ChartPrimitive.PolarAngleAxisProps) => null =
  ChartPrimitive.PolarAngleAxis

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

function wrapText(node: React.ReactNode) {
  if (typeof node === "string" || typeof node === "number") {
    return <Text>{node}</Text>
  }
  return node
}

function ChartTooltipContent({
  style,
  indicator = "dot",
  hideLabel = false,
  hideIndicator = false,
  labelFormatter,
  formatter,
  nameKey,
}: {
  style?: StyleProp<ViewStyle>
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
  const { colors, isDark } = useTheme()
  const { config } = useChart()
  const { active, payload, label } = ChartPrimitive.useTooltipContext()
  const [first] = payload
  if (!active || !first) return null
  const baseText: TextStyle = { ...fontSize.xs, color: colors.label }
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
        <TextStyleContext.Provider value={{ ...baseText, fontWeight: "600" }}>
          {wrapText(content)}
        </TextStyleContext.Provider>
      )
    }
  }
  const nestLabel = payload.length === 1 && indicator !== "dot"
  return (
    <TextStyleContext.Provider value={baseText}>
      <View
        style={[
          styles.tooltip,
          {
            backgroundColor: colors.surfaceRaised,
            borderColor: isDark ? `${colors.label}1a` : `${colors.label}0d`,
          },
          style,
        ]}
      >
        {nestLabel ? null : tooltipLabel}
        <View style={styles.items}>
          {payload.map((item, index) => {
            const key = nameKey ?? item.name ?? item.dataKey
            const itemConfig = config[configKeyOf(config, item, key)]
            const color = resolveColor(colors, item.color)
            return (
              <View
                key={`${item.dataKey}-${item.name}`}
                style={[
                  styles.item,
                  {
                    alignItems: indicator === "dot" ? "center" : "stretch",
                  },
                ]}
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
                        size={10}
                        color={colors.labelSecondary}
                      />
                    ) : hideIndicator ? null : (
                      <View
                        style={[
                          indicator === "dot" && [
                            styles.dot,
                            { backgroundColor: color },
                          ],
                          indicator === "line" && [
                            styles.line,
                            { backgroundColor: color },
                          ],
                          indicator === "dashed" && [
                            styles.dashed,
                            { borderColor: color },
                          ],
                          nestLabel && indicator === "dashed" && styles.nested,
                        ]}
                      />
                    )}
                    <View
                      style={[
                        styles.row,
                        { alignItems: nestLabel ? "flex-end" : "center" },
                      ]}
                    >
                      <View style={styles.name}>
                        {nestLabel ? tooltipLabel : null}
                        <Text
                          style={[
                            fontSize.xs,
                            { color: colors.labelSecondary },
                          ]}
                        >
                          {itemConfig?.label ?? item.name}
                        </Text>
                      </View>
                      <Text style={[styles.value, { color: colors.label }]}>
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
    </TextStyleContext.Provider>
  )
}

function ChartLegendContent({
  style,
  nameKey,
}: {
  style?: StyleProp<ViewStyle>
  nameKey?: string
}) {
  const { colors } = useTheme()
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
    <View style={[styles.legend, style]}>
      {resolved.map(({ item, configKey }) => {
        const itemConfig = config[configKey]
        return (
          <View key={`${item.dataKey}-${item.value}`} style={styles.legendItem}>
            {itemConfig?.icon ? (
              <Icon
                as={itemConfig.icon}
                size={12}
                color={colors.labelSecondary}
              />
            ) : (
              <View
                style={[
                  styles.swatch,
                  { backgroundColor: resolveColor(colors, item.color) },
                ]}
              />
            )}
            <Text style={[fontSize.xs, { color: colors.label }]}>
              {itemConfig?.label}
            </Text>
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
  RadialBar,
  RadialBarChart,
  ReferenceArea,
  ReferenceLine,
  useChart,
  XAxis,
  YAxis,
}
