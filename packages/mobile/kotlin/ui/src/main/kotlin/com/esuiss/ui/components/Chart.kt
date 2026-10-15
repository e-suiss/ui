package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.detectHorizontalDragGestures
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.State
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.PathMeasure
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.DrawScope
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.clipRect
import androidx.compose.ui.graphics.drawscope.rotate
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.setProgress
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.TextLayoutResult
import androidx.compose.ui.text.TextMeasurer
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.drawText
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.rememberTextMeasurer
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.TextUnit
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import java.math.BigDecimal
import java.math.MathContext
import java.text.NumberFormat
import kotlin.math.PI
import kotlin.math.abs
import kotlin.math.asin
import kotlin.math.atan2
import kotlin.math.ceil
import kotlin.math.cos
import kotlin.math.floor
import kotlin.math.hypot
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.min
import kotlin.math.pow
import kotlin.math.roundToInt
import kotlin.math.sign
import kotlin.math.sin
import kotlin.math.sqrt

class ChartConfigItem(
    val label: String? = null,
    val icon: ImageVector? = null,
    val color: (Colors.() -> Color)? = null,
)

class ChartConfig(vararg items: Pair<String, ChartConfigItem>) {
    private val entries = linkedMapOf(*items)

    val keys: List<String> get() = entries.keys.toList()

    operator fun get(key: String): ChartConfigItem? = entries[key]
}

val LocalChartConfig = staticCompositionLocalOf { ChartConfig() }

@Composable
fun ChartContainer(
    config: ChartConfig,
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalChartConfig provides config,
        LocalContentStyle provides Typography.xs.copy(color = colors.foreground),
        LocalContentColor provides colors.foreground,
    ) {
        Box(modifier, content = content)
    }
}

@Composable
fun chartColor(key: String): Color = configColor(LocalChartConfig.current, key, EsuissTheme.colors)

private fun configColor(config: ChartConfig, key: String, colors: Colors): Color =
    config[key]?.color?.invoke(colors) ?: colors.mutedForeground

enum class ChartCurve { Natural, Monotone, Linear, Step }

enum class ChartLayout { Horizontal, Vertical }

enum class ChartStackOffset { None, Expand }

enum class ChartAxisOrientation { Left, Right }

enum class ChartTooltipIndicator { Dot, Line, Dashed }

enum class ChartLabelPosition { Top, InsideStart }

enum class ChartEasing { Ease, EaseIn, EaseOut, EaseInOut, Linear }

internal class ChartAnimation(val active: Boolean, val duration: Int, val easing: ChartEasing)

private fun ChartEasing.curve(): Easing = when (this) {
    ChartEasing.Ease -> CubicBezierEasing(0.25f, 0.1f, 0.25f, 1f)
    ChartEasing.EaseIn -> CubicBezierEasing(0.42f, 0f, 1f, 1f)
    ChartEasing.EaseOut -> CubicBezierEasing(0f, 0f, 0.58f, 1f)
    ChartEasing.EaseInOut -> CubicBezierEasing(0.42f, 0f, 0.58f, 1f)
    ChartEasing.Linear -> LinearEasing
}

@Composable
private fun rememberEntrance(animation: ChartAnimation): State<Float> {
    val animated = animation.active && !formReducedMotion()
    val progress = remember { Animatable(if (animated) 0f else 1f) }
    val duration = animation.duration
    val easing = animation.easing
    LaunchedEffect(animated) {
        if (animated) progress.animateTo(1f, tween(duration, easing = easing.curve())) else progress.snapTo(1f)
    }
    return progress.asState()
}

data class ChartMargin(
    val top: Dp = 5.dp,
    val right: Dp = 5.dp,
    val bottom: Dp = 5.dp,
    val left: Dp = 5.dp,
)

data class ChartDot(
    val radius: Dp,
    val color: Color? = null,
    val strokeColor: Color? = null,
    val strokeWidth: Dp = 0.dp,
)

data class ChartRadius(
    val topStart: Dp,
    val topEnd: Dp,
    val bottomEnd: Dp,
    val bottomStart: Dp,
) {
    constructor(all: Dp) : this(all, all, all, all)
}

data class ChartCell(val color: Color? = null, val alpha: Float = 1f)

data class ChartCursor(val color: Color? = null, val width: Dp = 1.dp)

data class ChartSector(val lift: Dp = 0.dp, val ring: ChartRing? = null)

data class ChartRing(val gap: Dp, val width: Dp)

data class ChartLabelList(
    val position: ChartLabelPosition = ChartLabelPosition.Top,
    val offset: Dp = 5.dp,
    val color: Color? = null,
    val fontSize: TextUnit = 12.sp,
    val formatter: ((index: Int, value: Double) -> String)? = null,
)

sealed interface ChartFill {
    data class Solid(val color: Color? = null, val alpha: Float = 1f) : ChartFill

    data class VerticalGradient(val color: Color? = null, val topAlpha: Float, val bottomAlpha: Float) : ChartFill

    data class HorizontalGradient(val stops: List<Pair<Float, Color>>) : ChartFill
}

class ChartTooltipItem internal constructor(
    val key: String,
    val dataKey: String,
    val value: Double,
    val base: Double?,
    val color: Color,
    val index: Int,
    val payload: Any?,
)

class ChartTooltipScope internal constructor(
    val label: String,
    val items: List<ChartTooltipItem>,
)

internal class ChartTooltipSpec(
    val defaultIndex: Int?,
    val cursor: ChartCursor?,
    val content: @Composable ChartTooltipScope.() -> Unit,
)

internal fun chartNumber(value: Double): String {
    val format = NumberFormat.getNumberInstance()
    format.maximumFractionDigits = 3
    return format.format(value)
}

private fun itemValueText(item: ChartTooltipItem): String =
    if (item.base != null) "${chartNumber(item.base)}–${chartNumber(item.value)}" else chartNumber(item.value)

@Composable
fun ChartTooltipScope.ChartTooltipContent(
    modifier: Modifier = Modifier,
    indicator: ChartTooltipIndicator = ChartTooltipIndicator.Dot,
    hideLabel: Boolean = false,
    hideIndicator: Boolean = false,
    labelFormatter: (@Composable (label: String, items: List<ChartTooltipItem>) -> Unit)? = null,
    formatter: (@Composable RowScope.(item: ChartTooltipItem) -> Unit)? = null,
    color: Color? = null,
    payload: List<ChartTooltipItem> = items,
) {
    if (payload.isEmpty()) return
    val colors = EsuissTheme.colors
    val config = LocalChartConfig.current
    val baseStyle = Typography.xs.copy(color = colors.foreground)
    val labelStyle = baseStyle.copy(fontWeight = FontWeight.SemiBold)
    val labelText = config[label]?.label ?: label
    val showLabel = !hideLabel && (labelFormatter != null || labelText.isNotEmpty())
    val nest = payload.size == 1 && indicator != ChartTooltipIndicator.Dot
    val tooltipLabel: @Composable () -> Unit = {
        CompositionLocalProvider(LocalContentStyle provides labelStyle) {
            if (labelFormatter != null) labelFormatter(labelText, payload) else BasicText(labelText, style = labelStyle)
        }
    }
    val shape = RoundedCornerShape(Radius.md)
    CompositionLocalProvider(LocalContentStyle provides baseStyle, LocalContentColor provides colors.foreground) {
        Column(
            modifier = modifier
                .width(IntrinsicSize.Max)
                .widthIn(min = 128.dp)
                .shadow(Shadows.lg, shape)
                .clip(shape)
                .background(colors.popover, shape)
                .border(1.dp, colors.foreground.copy(alpha = if (colors.isDark) 0.1f else 0.05f), shape)
                .padding(horizontal = 10.dp, vertical = 6.dp),
            verticalArrangement = Arrangement.spacedBy(6.dp),
        ) {
            if (showLabel && !nest) tooltipLabel()
            for (item in payload) {
                Row(
                    modifier = Modifier
                        .fillMaxWidth()
                        .height(IntrinsicSize.Min),
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = if (indicator == ChartTooltipIndicator.Dot) Alignment.CenterVertically else Alignment.Top,
                ) {
                    if (formatter != null) {
                        formatter(item)
                    } else {
                        val icon = config[item.key]?.icon
                        if (icon != null) {
                            Icon(icon, null, Modifier.align(Alignment.CenterVertically), size = 10.dp, tint = colors.mutedForeground)
                        } else if (!hideIndicator) {
                            TooltipIndicator(indicator, color ?: item.color, nest)
                        }
                        Row(
                            modifier = Modifier.weight(1f),
                            verticalAlignment = if (nest) Alignment.Bottom else Alignment.CenterVertically,
                        ) {
                            Column(verticalArrangement = Arrangement.spacedBy(6.dp)) {
                                if (nest && showLabel) tooltipLabel()
                                BasicText(
                                    config[item.key]?.label ?: item.key,
                                    style = baseStyle.copy(color = colors.mutedForeground),
                                )
                            }
                            Spacer(Modifier.weight(1f).widthIn(min = 8.dp))
                            BasicText(
                                itemValueText(item),
                                style = baseStyle.copy(
                                    fontFamily = FontFamily.Monospace,
                                    fontWeight = FontWeight.SemiBold,
                                    fontFeatureSettings = "tnum",
                                ),
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun TooltipIndicator(indicator: ChartTooltipIndicator, color: Color, nest: Boolean) {
    when (indicator) {
        ChartTooltipIndicator.Dot -> Box(
            Modifier
                .size(10.dp)
                .background(color, RoundedCornerShape(Radius.xs)),
        )
        ChartTooltipIndicator.Line -> Box(
            Modifier
                .width(4.dp)
                .fillMaxHeight()
                .background(color, RoundedCornerShape(Radius.xs)),
        )
        ChartTooltipIndicator.Dashed -> Box(
            Modifier
                .padding(vertical = if (nest) 2.dp else 0.dp)
                .width(3.dp)
                .fillMaxHeight()
                .drawBehind {
                    drawLine(
                        color,
                        Offset(size.width / 2, 0f),
                        Offset(size.width / 2, size.height),
                        strokeWidth = size.width,
                        pathEffect = PathEffect.dashPathEffect(floatArrayOf(3.dp.toPx(), 2.dp.toPx())),
                    )
                },
        )
    }
}

@Composable
fun ChartLegendContent(
    keys: List<String>,
    modifier: Modifier = Modifier,
    hideIcon: Boolean = false,
) {
    val colors = EsuissTheme.colors
    val config = LocalChartConfig.current
    val order = config.keys
    val sorted = keys.distinct().sortedBy { key -> order.indexOf(key).let { if (it < 0) order.size else it } }
    if (sorted.isEmpty()) return
    FlowRow(
        modifier = modifier
            .fillMaxWidth()
            .padding(top = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterHorizontally),
        verticalArrangement = Arrangement.spacedBy(6.dp),
    ) {
        for (key in sorted) {
            val item = config[key]
            Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                val icon = item?.icon
                if (icon != null && !hideIcon) {
                    Icon(icon, null, size = 12.dp, tint = colors.mutedForeground)
                } else {
                    Box(
                        Modifier
                            .size(8.dp)
                            .background(configColor(config, key, colors), RoundedCornerShape(Radius.xs)),
                    )
                }
                BasicText(item?.label ?: key, style = Typography.xs.copy(color = colors.foreground))
            }
        }
    }
}

internal enum class SeriesKind { Line, Area, Bar }

internal sealed class CartesianLayer<T>

internal class SeriesLayer<T>(
    val kind: SeriesKind,
    val dataKey: String,
    val value: (T) -> Double?,
    val base: ((T) -> Double)?,
    val curve: ChartCurve,
    val stroke: Color?,
    val strokeWidth: Dp,
    val strokeDasharray: List<Float>?,
    val fill: ChartFill,
    val dot: ChartDot?,
    val dotColor: ((T) -> Color)?,
    val activeDot: ChartDot?,
    val stackId: String?,
    val radius: ChartRadius,
    val barSize: Dp?,
    val maxBarSize: Dp?,
    val nameKey: ((T) -> String)?,
    val cells: ((Int) -> ChartCell)?,
    val background: Color?,
    val labelList: ChartLabelList?,
    val animation: ChartAnimation,
) : CartesianLayer<T>()

internal class ReferenceLineLayer<T>(
    val y: Double,
    val stroke: Color?,
    val strokeDasharray: List<Float>?,
    val label: String?,
) : CartesianLayer<T>()

internal class ReferenceAreaLayer<T>(
    val x1: Int,
    val x2: Int,
    val fill: Color?,
    val fillOpacity: Float,
) : CartesianLayer<T>()

internal class CategoryAxis<T>(
    val label: (T) -> String,
    val hide: Boolean,
    val tickMargin: Dp,
    val interval: Int?,
    val ticks: List<Int>?,
    val minTickGap: Dp,
    val tickFormatter: ((String) -> String)?,
    val orientation: ChartAxisOrientation,
    val width: Dp?,
    val tickStyle: TextStyle?,
)

internal class ValueAxis(
    val hide: Boolean,
    val orientation: ChartAxisOrientation,
    val tickMargin: Dp,
    val width: Dp?,
    val domain: ClosedFloatingPointRange<Double>?,
    val ticks: List<Double>?,
    val tickCount: Int,
    val tickFormatter: ((Double) -> String)?,
)

class CartesianChartScope<T> internal constructor() {
    internal val layers = mutableListOf<CartesianLayer<T>>()
    internal var grid: List<Float>? = null
    internal var hasGrid = false
    internal var xCategory: CategoryAxis<T>? = null
    internal var xValue: ValueAxis? = null
    internal val yCategories = mutableListOf<CategoryAxis<T>>()
    internal var yValue: ValueAxis? = null
    internal var tooltip: ChartTooltipSpec? = null
    internal var legend: Boolean? = null

    fun CartesianGrid(strokeDasharray: List<Float>? = null) {
        hasGrid = true
        grid = strokeDasharray
    }

    fun XAxis(
        label: (T) -> String,
        hide: Boolean = false,
        tickMargin: Dp = 2.dp,
        interval: Int? = null,
        ticks: List<Int>? = null,
        minTickGap: Dp = 5.dp,
        tickFormatter: ((String) -> String)? = null,
    ) {
        xCategory = CategoryAxis(label, hide, tickMargin, interval, ticks, minTickGap, tickFormatter, ChartAxisOrientation.Left, null, null)
    }

    fun XAxis(domain: ClosedFloatingPointRange<Double>? = null) {
        xValue = ValueAxis(true, ChartAxisOrientation.Left, 0.dp, null, domain, null, 5, null)
    }

    fun YAxis(
        orientation: ChartAxisOrientation = ChartAxisOrientation.Left,
        hide: Boolean = false,
        tickMargin: Dp = 2.dp,
        width: Dp? = null,
        domain: ClosedFloatingPointRange<Double>? = null,
        ticks: List<Double>? = null,
        tickCount: Int = 5,
        tickFormatter: ((Double) -> String)? = null,
    ) {
        yValue = ValueAxis(hide, orientation, tickMargin, width, domain, ticks, tickCount, tickFormatter)
    }

    fun YAxis(
        label: (T) -> String,
        orientation: ChartAxisOrientation = ChartAxisOrientation.Left,
        tickMargin: Dp = 2.dp,
        width: Dp? = null,
        tickStyle: TextStyle? = null,
        tickFormatter: ((String) -> String)? = null,
    ) {
        yCategories += CategoryAxis(label, false, tickMargin, null, null, 5.dp, tickFormatter, orientation, width, tickStyle)
    }

    fun Line(
        dataKey: String,
        value: (T) -> Double?,
        curve: ChartCurve = ChartCurve.Linear,
        stroke: Color? = null,
        strokeWidth: Dp = 1.dp,
        strokeDasharray: List<Float>? = null,
        dot: ChartDot? = null,
        dotColor: ((T) -> Color)? = null,
        activeDot: ChartDot? = ChartDot(4.dp),
        labelList: ChartLabelList? = null,
        isAnimationActive: Boolean = true,
        animationDuration: Int = 1500,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        layers += SeriesLayer(
            SeriesKind.Line, dataKey, value, null, curve, stroke, strokeWidth, strokeDasharray, ChartFill.Solid(alpha = 0f),
            dot, dotColor, activeDot, null, ChartRadius(0.dp), null, null, null, null, null, labelList,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun Area(
        dataKey: String,
        value: (T) -> Double?,
        base: ((T) -> Double)? = null,
        curve: ChartCurve = ChartCurve.Linear,
        stroke: Color? = null,
        strokeWidth: Dp = 1.dp,
        fill: ChartFill = ChartFill.Solid(alpha = 0.6f),
        stackId: String? = null,
        dot: ChartDot? = null,
        activeDot: ChartDot? = ChartDot(4.dp),
        isAnimationActive: Boolean = true,
        animationDuration: Int = 1500,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        layers += SeriesLayer(
            SeriesKind.Area, dataKey, value, base, curve, stroke, strokeWidth, null, fill,
            dot, null, activeDot, stackId, ChartRadius(0.dp), null, null, null, null, null, null,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun Bar(
        dataKey: String,
        value: (T) -> Double?,
        base: ((T) -> Double)? = null,
        fill: ChartFill = ChartFill.Solid(),
        radius: ChartRadius = ChartRadius(0.dp),
        barSize: Dp? = null,
        maxBarSize: Dp? = null,
        stackId: String? = null,
        nameKey: ((T) -> String)? = null,
        cells: ((Int) -> ChartCell)? = null,
        background: Color? = null,
        labelList: ChartLabelList? = null,
        isAnimationActive: Boolean = true,
        animationDuration: Int = 400,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        layers += SeriesLayer(
            SeriesKind.Bar, dataKey, value, base, ChartCurve.Linear, null, 0.dp, null, fill,
            null, null, null, stackId, radius, barSize, maxBarSize, nameKey, cells, background, labelList,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun ReferenceLine(
        y: Double,
        stroke: Color? = null,
        strokeDasharray: List<Float>? = null,
        label: String? = null,
    ) {
        layers += ReferenceLineLayer(y, stroke, strokeDasharray, label)
    }

    fun ReferenceArea(x1: Int, x2: Int, fill: Color? = null, fillOpacity: Float = 0.5f) {
        layers += ReferenceAreaLayer(x1, x2, fill, fillOpacity)
    }

    fun ChartTooltip(
        defaultIndex: Int? = null,
        cursor: ChartCursor? = ChartCursor(),
        content: @Composable ChartTooltipScope.() -> Unit = { ChartTooltipContent() },
    ) {
        tooltip = ChartTooltipSpec(defaultIndex, cursor, content)
    }

    fun ChartLegend(hideIcon: Boolean = false) {
        legend = hideIcon
    }
}

@Composable
fun <T> LineChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: CartesianChartScope<T>.() -> Unit,
) = CartesianChart(
    data, modifier, margin, ChartLayout.Horizontal, ChartStackOffset.None, 4.dp, null,
    accessibilityLabel, selectedIndex, onSelectedIndexChange, content,
)

@Composable
fun <T> AreaChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    stackOffset: ChartStackOffset = ChartStackOffset.None,
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: CartesianChartScope<T>.() -> Unit,
) = CartesianChart(
    data, modifier, margin, ChartLayout.Horizontal, stackOffset, 4.dp, null,
    accessibilityLabel, selectedIndex, onSelectedIndexChange, content,
)

@Composable
fun <T> BarChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    layout: ChartLayout = ChartLayout.Horizontal,
    barGap: Dp = 4.dp,
    barCategoryGap: Dp? = null,
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: CartesianChartScope<T>.() -> Unit,
) = CartesianChart(
    data, modifier, margin, layout, ChartStackOffset.None, barGap, barCategoryGap,
    accessibilityLabel, selectedIndex, onSelectedIndexChange, content,
)

@Composable
fun <T> ComposedChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: CartesianChartScope<T>.() -> Unit,
) = CartesianChart(
    data, modifier, margin, ChartLayout.Horizontal, ChartStackOffset.None, 4.dp, null,
    accessibilityLabel, selectedIndex, onSelectedIndexChange, content,
)

private data class SeriesFrame(val raw: List<Double>, val top: List<Double>, val bottom: List<Double>)

private data class ChartFrame(val series: Map<String, SeriesFrame>, val lo: Double, val hi: Double)

private fun lerpList(from: List<Double>, to: List<Double>, t: Float): List<Double> =
    if (from.size != to.size) {
        to
    } else {
        to.indices.map { i ->
            val a = from[i]
            val b = to[i]
            if (a.isNaN() || b.isNaN()) b else a + (b - a) * t
        }
    }

private fun blendFrames(from: ChartFrame, to: ChartFrame, t: Float, still: Set<String>): ChartFrame {
    if (t >= 1f) return to
    val series = to.series.mapValues { (key, target) ->
        if (key in still) return@mapValues target
        val origin = from.series[key] ?: return@mapValues target
        SeriesFrame(lerpList(origin.raw, target.raw, t), lerpList(origin.top, target.top, t), lerpList(origin.bottom, target.bottom, t))
    }
    return ChartFrame(series, from.lo + (to.lo - from.lo) * t, from.hi + (to.hi - from.hi) * t)
}

@Composable
private fun rememberFrame(target: ChartFrame, transition: ChartAnimation?, still: Set<String>): ChartFrame {
    val reduced = formReducedMotion()
    val progress = remember { Animatable(1f) }
    var from by remember { mutableStateOf(target) }
    var to by remember { mutableStateOf(target) }
    val current by rememberUpdatedState(transition)
    val stillKeys by rememberUpdatedState(still)
    LaunchedEffect(target) {
        if (target == to) return@LaunchedEffect
        from = blendFrames(from, to, progress.value, stillKeys)
        to = target
        val spec = current
        if (reduced || spec == null) {
            progress.snapTo(1f)
        } else {
            progress.snapTo(0f)
            progress.animateTo(1f, tween(spec.duration, easing = spec.easing.curve()))
        }
    }
    return blendFrames(from, to, progress.value, still)
}

private fun formatStep(rough: Double, correction: Int): Double {
    if (rough <= 0.0 || rough.isNaN()) return 0.0
    val digits = floor(log10(rough)).toInt() + 1
    val unit = 10.0.pow(digits)
    val ratio = rough / unit
    val scale = if (digits != 1) 0.05 else 0.1
    return clean((ceil(ratio / scale - 1e-9) + correction) * scale * unit)
}

private fun clean(value: Double): Double =
    if (value.isFinite()) BigDecimal(value).round(MathContext(12)).toDouble() else value

private fun niceTicks(min: Double, max: Double, count: Int): List<Double> {
    val n = max(count, 2)
    if (min == max) {
        if (min == 0.0) return listOf(0.0, 1.0)
        return listOf(min)
    }
    var correction = 0
    while (correction < 20) {
        val step = formatStep((max - min) / (n - 1), correction)
        if (step <= 0.0) return listOf(min, max)
        val middle = if (min <= 0 && max >= 0) 0.0 else ((min + max) / 2).let { clean(it - it.mod(step)) }
        var below = ceil((middle - min) / step - 1e-9).toInt()
        var up = ceil((max - middle) / step - 1e-9).toInt()
        val total = below + up + 1
        if (total > n) {
            correction++
            continue
        }
        if (total < n) {
            if (max > 0) up += n - total else below += n - total
        }
        return (0 until below + up + 1).map { clean(middle - below * step + it * step) }
    }
    return listOf(min, max)
}

private fun fixedTicks(min: Double, max: Double, count: Int): List<Double> {
    val step = formatStep((max - min) / (max(count, 2) - 1), 0)
    if (step <= 0.0) return listOf(min, max)
    val values = mutableListOf<Double>()
    var v = min
    while (v < max - 0.99 * step) {
        values += v
        v += step
    }
    values += max
    return values
}

private fun <T> cartesianFrame(
    data: List<T>,
    series: List<SeriesLayer<T>>,
    stackOffset: ChartStackOffset,
    axis: ValueAxis?,
): ChartFrame {
    val n = data.size
    val stacks = mutableMapOf<String, DoubleArray>()
    val totals = mutableMapOf<String, DoubleArray>()
    if (stackOffset == ChartStackOffset.Expand) {
        for (s in series) {
            val id = s.stackId ?: continue
            val total = totals.getOrPut(id) { DoubleArray(n) }
            for (i in 0 until n) total[i] += s.value(data[i]) ?: 0.0
        }
    }
    val frames = linkedMapOf<String, SeriesFrame>()
    for (s in series) {
        val raw = data.map { s.value(it) ?: Double.NaN }
        val id = s.stackId
        if (id != null) {
            val acc = stacks.getOrPut(id) { DoubleArray(n) }
            val total = totals[id]
            val bottom = ArrayList<Double>(n)
            val top = ArrayList<Double>(n)
            for (i in 0 until n) {
                val v = if (raw[i].isNaN()) 0.0 else raw[i]
                val scale = if (total != null && total[i] != 0.0) 1.0 / total[i] else 1.0
                bottom += acc[i] * scale
                acc[i] += v
                top += acc[i] * scale
            }
            frames[s.dataKey] = SeriesFrame(raw, top, bottom)
        } else {
            val bottom = s.base?.let { base -> data.map(base) } ?: List(n) { Double.NaN }
            frames[s.dataKey] = SeriesFrame(raw, raw, bottom)
        }
    }
    val domain = axis?.domain
    if (domain != null) return ChartFrame(frames, domain.start, domain.endInclusive)
    if (stackOffset == ChartStackOffset.Expand) return ChartFrame(frames, 0.0, 1.0)
    var lo = 0.0
    var hi = 0.0
    var any = false
    for (frame in frames.values) {
        for (v in frame.top + frame.bottom) {
            if (v.isNaN()) continue
            lo = min(lo, v)
            hi = max(hi, v)
            any = true
        }
    }
    if (!any) return ChartFrame(frames, 0.0, 1.0)
    val ticks = niceTicks(lo, hi, axis?.tickCount ?: 5)
    return ChartFrame(frames, ticks.first(), ticks.last())
}

private fun appendCurve(path: Path, points: List<Offset>, curve: ChartCurve, move: Boolean) {
    if (points.isEmpty()) return
    if (move) path.moveTo(points[0].x, points[0].y) else path.lineTo(points[0].x, points[0].y)
    if (points.size == 1) return
    when (curve) {
        ChartCurve.Linear -> for (i in 1 until points.size) path.lineTo(points[i].x, points[i].y)
        ChartCurve.Step -> for (i in 1 until points.size) {
            val mid = (points[i - 1].x + points[i].x) / 2
            path.lineTo(mid, points[i - 1].y)
            path.lineTo(mid, points[i].y)
            if (i == points.size - 1) path.lineTo(points[i].x, points[i].y)
        }
        ChartCurve.Monotone -> appendMonotone(path, points)
        ChartCurve.Natural -> appendNatural(path, points)
    }
}

private fun appendMonotone(path: Path, p: List<Offset>) {
    val n = p.size
    if (n == 2) {
        path.lineTo(p[1].x, p[1].y)
        return
    }
    val t = FloatArray(n)
    for (i in 1 until n - 1) {
        val h0 = p[i].x - p[i - 1].x
        val h1 = p[i + 1].x - p[i].x
        val s0 = if (h0 != 0f) (p[i].y - p[i - 1].y) / h0 else 0f
        val s1 = if (h1 != 0f) (p[i + 1].y - p[i].y) / h1 else 0f
        val q = if (h0 + h1 != 0f) (s0 * h1 + s1 * h0) / (h0 + h1) else 0f
        val v = (sign(s0) + sign(s1)) * min(min(abs(s0), abs(s1)), 0.5f * abs(q))
        t[i] = if (v.isNaN()) 0f else v
    }
    val hs = p[1].x - p[0].x
    t[0] = if (hs != 0f) (3 * (p[1].y - p[0].y) / hs - t[1]) / 2 else t[1]
    val he = p[n - 1].x - p[n - 2].x
    t[n - 1] = if (he != 0f) (3 * (p[n - 1].y - p[n - 2].y) / he - t[n - 2]) / 2 else t[n - 2]
    for (i in 0 until n - 1) {
        val dx = (p[i + 1].x - p[i].x) / 3
        path.cubicTo(p[i].x + dx, p[i].y + dx * t[i], p[i + 1].x - dx, p[i + 1].y - dx * t[i + 1], p[i + 1].x, p[i + 1].y)
    }
}

private fun naturalControls(x: FloatArray): Pair<FloatArray, FloatArray> {
    val n = x.size - 1
    val a = FloatArray(n)
    val b = FloatArray(n)
    val r = FloatArray(n)
    a[0] = 0f
    b[0] = 2f
    r[0] = x[0] + 2 * x[1]
    for (i in 1 until n - 1) {
        a[i] = 1f
        b[i] = 4f
        r[i] = 4 * x[i] + 2 * x[i + 1]
    }
    a[n - 1] = 2f
    b[n - 1] = 7f
    r[n - 1] = 8 * x[n - 1] + x[n]
    for (i in 1 until n) {
        val m = a[i] / b[i - 1]
        b[i] -= m
        r[i] -= m * r[i - 1]
    }
    a[n - 1] = r[n - 1] / b[n - 1]
    for (i in n - 2 downTo 0) a[i] = (r[i] - a[i + 1]) / b[i]
    b[n - 1] = (x[n] + a[n - 1]) / 2
    for (i in 0 until n - 1) b[i] = 2 * x[i + 1] - a[i + 1]
    return a to b
}

private fun appendNatural(path: Path, p: List<Offset>) {
    if (p.size == 2) {
        path.lineTo(p[1].x, p[1].y)
        return
    }
    val (ax, bx) = naturalControls(FloatArray(p.size) { p[it].x })
    val (ay, by) = naturalControls(FloatArray(p.size) { p[it].y })
    for (i in 0 until p.size - 1) path.cubicTo(ax[i], ay[i], bx[i], by[i], p[i + 1].x, p[i + 1].y)
}

private fun roundedRect(rect: Rect, radius: ChartRadius, density: Density): Path {
    val limit = min(rect.width, rect.height) / 2
    fun r(value: Dp) = with(density) { min(value.toPx(), limit) }.let { CornerRadius(it, it) }
    return Path().apply {
        addRoundRect(RoundRect(rect, r(radius.topStart), r(radius.topEnd), r(radius.bottomEnd), r(radius.bottomStart)))
    }
}

private fun dashEffect(dash: List<Float>?, density: Density): PathEffect? =
    dash?.takeIf { it.isNotEmpty() }?.let { values -> PathEffect.dashPathEffect(FloatArray(values.size) { values[it] * density.density }) }

private fun fillBrush(fill: ChartFill, fallback: Color, bounds: Rect): Brush = when (fill) {
    is ChartFill.Solid -> SolidColor((fill.color ?: fallback).let { it.copy(alpha = it.alpha * fill.alpha) })
    is ChartFill.VerticalGradient -> {
        val color = fill.color ?: fallback
        Brush.verticalGradient(
            listOf(color.copy(alpha = color.alpha * fill.topAlpha), color.copy(alpha = color.alpha * fill.bottomAlpha)),
            startY = bounds.top,
            endY = bounds.bottom,
        )
    }
    is ChartFill.HorizontalGradient -> Brush.horizontalGradient(
        *fill.stops.toTypedArray(),
        startX = bounds.left,
        endX = bounds.right,
    )
}

private fun solidColor(fill: ChartFill): Color? = when (fill) {
    is ChartFill.Solid -> fill.color
    is ChartFill.VerticalGradient -> fill.color
    is ChartFill.HorizontalGradient -> fill.stops.getOrNull(fill.stops.size / 2)?.second
}

private class AxisLabel(val layout: TextLayoutResult, val topLeft: Offset)

private class BarShape(val rect: Rect, val background: Rect?, val color: Color, val alpha: Float)

@Composable
private fun rememberSelection(
    defaultIndex: Int?,
    selectedIndex: Int?,
    onSelectedIndexChange: ((Int?) -> Unit)?,
): Pair<Int?, (Int?) -> Unit> {
    val haptics = rememberHaptics()
    var internal by remember { mutableStateOf(defaultIndex) }
    val selected = if (onSelectedIndexChange != null) selectedIndex else internal
    val select: (Int?) -> Unit = { index ->
        if (index != selected) {
            if (index != null) haptics.selection()
            if (onSelectedIndexChange != null) onSelectedIndexChange(index) else internal = index
        }
    }
    return selected to select
}

private fun Modifier.chartGestures(
    enabled: Boolean,
    hit: State<(Offset) -> Int?>,
    selected: State<Int?>,
    select: State<(Int?) -> Unit>,
): Modifier = if (!enabled) {
    this
} else {
    this
        .pointerInput(Unit) {
            detectTapGestures { offset ->
                val index = hit.value(offset)
                select.value(if (index == null || index == selected.value) null else index)
            }
        }
        .pointerInput(Unit) {
            detectHorizontalDragGestures(
                onDragStart = { offset -> hit.value(offset)?.let { select.value(it) } },
            ) { change, _ ->
                change.consume()
                hit.value(change.position)?.let { select.value(it) }
            }
        }
}

private fun Modifier.chartSemantics(
    description: String,
    interactive: Boolean,
    count: Int,
    selected: Int?,
    describe: (Int) -> String,
    select: (Int?) -> Unit,
): Modifier = semantics {
    contentDescription = description
    if (interactive && count > 0) {
        stateDescription = selected?.let(describe) ?: ""
        progressBarRangeInfo = ProgressBarRangeInfo((selected ?: 0).toFloat(), 0f..(count - 1).coerceAtLeast(1).toFloat(), (count - 2).coerceAtLeast(0))
        setProgress { value ->
            select(value.roundToInt().coerceIn(0, count - 1))
            true
        }
    }
}

@Composable
private fun TooltipOverlay(
    scope: ChartTooltipScope,
    anchor: Rect,
    content: @Composable ChartTooltipScope.() -> Unit,
) {
    val gap = with(LocalDensity.current) { 8.dp.roundToPx() }
    Layout(content = { Box { scope.content() } }, modifier = Modifier.fillMaxSize()) { measurables, constraints ->
        val placeable = measurables.first().measure(Constraints(maxWidth = constraints.maxWidth, maxHeight = constraints.maxHeight))
        layout(constraints.maxWidth, constraints.maxHeight) {
            val limit = max(0, constraints.maxWidth - placeable.width)
            val above = anchor.top.roundToInt() - gap - placeable.height
            if (above >= 0) {
                placeable.place((anchor.center.x - placeable.width / 2f).roundToInt().coerceIn(0, limit), above)
            } else {
                val right = anchor.right.roundToInt() + gap
                val left = anchor.left.roundToInt() - gap - placeable.width
                val x = when {
                    right + placeable.width <= constraints.maxWidth -> right
                    left >= 0 -> left
                    else -> right.coerceIn(0, limit)
                }
                placeable.place(x, 0)
            }
        }
    }
}

private fun measure(measurer: TextMeasurer, text: String, style: TextStyle) = measurer.measure(text, style, maxLines = 1)

@Composable
private fun <T> CartesianChart(
    data: List<T>,
    modifier: Modifier,
    margin: ChartMargin,
    layout: ChartLayout,
    stackOffset: ChartStackOffset,
    barGap: Dp,
    barCategoryGap: Dp?,
    accessibilityLabel: String?,
    selectedIndex: Int?,
    onSelectedIndexChange: ((Int?) -> Unit)?,
    content: CartesianChartScope<T>.() -> Unit,
) {
    val scope = CartesianChartScope<T>().apply(content)
    val config = LocalChartConfig.current
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val measurer = rememberTextMeasurer()
    val vertical = layout == ChartLayout.Vertical
    val series = scope.layers.filterIsInstance<SeriesLayer<T>>()
    val band = series.any { it.kind == SeriesKind.Bar }
    val valueAxis = if (vertical) scope.xValue else scope.yValue
    val frame = rememberFrame(
        cartesianFrame(data, series, stackOffset, valueAxis),
        series.firstOrNull { it.animation.active }?.animation,
        series.filter { !it.animation.active }.map { it.dataKey }.toSet(),
    )
    val entrance = series.associate { s -> s.dataKey to key(s.dataKey) { rememberEntrance(s.animation) } }
    fun grow(s: SeriesLayer<T>): Float = entrance[s.dataKey]?.value ?: 1f
    val tooltip = scope.tooltip
    val (selected, select) = rememberSelection(tooltip?.defaultIndex, selectedIndex, onSelectedIndexChange)
    val interactive = tooltip != null || onSelectedIndexChange != null
    val n = data.size
    val categoryAxis = if (vertical) scope.yCategories.firstOrNull() else scope.xCategory
    fun categoryLabel(i: Int) = categoryAxis?.label?.invoke(data[i]) ?: ""
    fun seriesKey(s: SeriesLayer<T>, i: Int) = s.nameKey?.invoke(data[i]) ?: s.dataKey
    fun seriesColor(s: SeriesLayer<T>, i: Int): Color =
        s.cells?.invoke(i)?.color ?: (if (s.kind == SeriesKind.Line) s.stroke else solidColor(s.fill)) ?: s.stroke ?: configColor(config, seriesKey(s, i), colors)
    fun items(i: Int): List<ChartTooltipItem> = series.mapNotNull { s ->
        val f = frame.series[s.dataKey] ?: return@mapNotNull null
        val raw = f.raw.getOrNull(i) ?: return@mapNotNull null
        if (raw.isNaN()) return@mapNotNull null
        val base = s.base?.invoke(data[i])
        ChartTooltipItem(seriesKey(s, i), s.dataKey, raw, base, seriesColor(s, i), i, data[i])
    }
    fun describe(i: Int): String {
        val label = categoryLabel(i).let { config[it]?.label ?: it }
        val values = items(i).joinToString(", ") { "${config[it.key]?.label ?: it.key} ${itemValueText(it)}" }
        return if (label.isEmpty()) values else "$label: $values"
    }
    val description = listOfNotNull(
        accessibilityLabel,
        if (n > 1 && categoryAxis != null) "${categoryLabel(0)} to ${categoryLabel(n - 1)}" else null,
    ).joinToString(", ")
    val tickStyle = Typography.xs.copy(color = colors.mutedForeground)
    val legendKeys = series.flatMap { s -> if (s.nameKey != null) data.map { s.nameKey.invoke(it) } else listOf(s.dataKey) }

    Column(modifier.fillMaxSize()) {
        BoxWithConstraints(
            Modifier
                .weight(1f)
                .fillMaxWidth(),
        ) {
            val width = constraints.maxWidth.toFloat()
            val height = constraints.maxHeight.toFloat()
            val px = { dp: Dp -> with(density) { dp.toPx() } }
            val tickSize = px(6.dp)
            val lo = frame.lo
            val hi = frame.hi
            val tolerance = abs(hi - lo) * 1e-6
            val ticks = (
                valueAxis?.ticks ?: if (valueAxis?.domain != null || stackOffset == ChartStackOffset.Expand) {
                    fixedTicks(lo, hi, valueAxis?.tickCount ?: 5)
                } else {
                    niceTicks(lo, hi, valueAxis?.tickCount ?: 5)
                }
                ).filter { it >= min(lo, hi) - tolerance && it <= max(lo, hi) + tolerance }
            val valueLabels = if (!vertical && valueAxis != null && !valueAxis.hide) {
                ticks.map { measure(measurer, valueAxis.tickFormatter?.invoke(it) ?: chartNumber(it), tickStyle) }
            } else {
                emptyList()
            }
            var leftWidth = 0f
            var rightWidth = 0f
            if (valueLabels.isNotEmpty() && valueAxis != null) {
                val w = valueAxis.width?.let(px) ?: ((valueLabels.maxOf { it.size.width }) + tickSize + px(valueAxis.tickMargin))
                if (valueAxis.orientation == ChartAxisOrientation.Right) rightWidth = w else leftWidth = w
            }
            val categoryLabels = if (vertical) {
                scope.yCategories.map { axis ->
                    val style = axis.tickStyle?.let { tickStyle.merge(it) } ?: tickStyle
                    val labels = data.map { measure(measurer, axis.label(it).let { l -> axis.tickFormatter?.invoke(l) ?: l }, style) }
                    val w = axis.width?.let(px) ?: ((labels.maxOfOrNull { it.size.width } ?: 0) + tickSize + px(axis.tickMargin))
                    if (axis.orientation == ChartAxisOrientation.Right) rightWidth += w else leftWidth += w
                    axis to labels
                }
            } else {
                emptyList()
            }
            val xAxis = scope.xCategory
            val xHeight = if (!vertical && xAxis != null && !xAxis.hide) {
                max(px(30.dp), tickSize + px(xAxis.tickMargin) + measure(measurer, "0", tickStyle).size.height)
            } else {
                0f
            }
            val plot = Rect(
                px(margin.left) + leftWidth,
                px(margin.top),
                width - px(margin.right) - rightWidth,
                height - px(margin.bottom) - xHeight,
            )
            val catStart = if (vertical) plot.top else plot.left
            val catLength = if (vertical) plot.height else plot.width
            val bandSize = if (n > 0) catLength / n else catLength
            fun center(i: Int): Float = when {
                band -> catStart + bandSize * (i + 0.5f)
                n <= 1 -> catStart + catLength / 2
                else -> catStart + catLength * i / (n - 1)
            }
            val span = if (hi - lo == 0.0) 1.0 else hi - lo
            fun valuePx(v: Double): Float = if (vertical) {
                plot.left + ((v - lo) / span * plot.width).toFloat()
            } else {
                plot.bottom - ((v - lo) / span * plot.height).toFloat()
            }
            val baselineValue = when {
                lo <= 0.0 && hi >= 0.0 -> 0.0
                lo > 0.0 -> lo
                else -> hi
            }
            val bars = series.filter { it.kind == SeriesKind.Bar }
            val groups = bars.map { it.stackId ?: "#${it.dataKey}" }.distinct()
            val gapPx = px(barGap)
            val barSizePx: Float
            val barStart: Float
            if (groups.isNotEmpty()) {
                val explicit = bars.firstNotNullOfOrNull { it.barSize }?.let(px)
                val size = if (explicit != null) {
                    explicit
                } else {
                    val offset = barCategoryGap?.let(px) ?: (bandSize * 0.1f)
                    val original = (bandSize - 2 * offset - (groups.size - 1) * gapPx) / groups.size
                    val cap = bars.mapNotNull { it.maxBarSize }.minOrNull()?.let(px)
                    if (cap != null) min(original, cap) else original
                }
                barSizePx = max(0f, size)
                barStart = (bandSize - (groups.size * barSizePx + (groups.size - 1) * gapPx)) / 2
            } else {
                barSizePx = 0f
                barStart = 0f
            }
            fun barShape(s: SeriesLayer<T>, i: Int): BarShape? {
                val f = frame.series[s.dataKey] ?: return null
                val raw = f.raw.getOrNull(i) ?: return null
                if (raw.isNaN()) return null
                val top = f.top[i]
                val bottom = f.bottom[i].let { if (it.isNaN()) baselineValue else it }
                val g = groups.indexOf(s.stackId ?: "#${s.dataKey}")
                val pos = catStart + bandSize * i + barStart + g * (barSizePx + gapPx)
                val scale = grow(s)
                val base = valuePx(baselineValue)
                val a = base + (valuePx(top) - base) * scale
                val b = base + (valuePx(bottom) - base) * scale
                val rect = if (vertical) {
                    Rect(min(a, b), pos, max(a, b), pos + barSizePx)
                } else {
                    Rect(pos, min(a, b), pos + barSizePx, max(a, b))
                }
                val backgroundRect = s.background?.let {
                    if (vertical) Rect(plot.left, pos, plot.right, pos + barSizePx) else Rect(pos, plot.top, pos + barSizePx, plot.bottom)
                }
                val cell = s.cells?.invoke(i)
                return BarShape(rect, backgroundRect, seriesColor(s, i), cell?.alpha ?: 1f)
            }
            fun points(s: SeriesLayer<T>, values: List<Double>): List<Offset?> =
                values.mapIndexed { i, v -> if (v.isNaN()) null else Offset(center(i), valuePx(v)) }
            fun anchor(i: Int): Rect {
                var top = Float.MAX_VALUE
                var end = Float.MIN_VALUE
                for (s in series) {
                    val f = frame.series[s.dataKey] ?: continue
                    if (f.raw.getOrNull(i)?.isNaN() != false) continue
                    if (s.kind == SeriesKind.Bar) {
                        val shape = barShape(s, i) ?: continue
                        top = min(top, shape.rect.top)
                        end = max(end, shape.rect.right)
                    } else {
                        top = min(top, valuePx(f.top[i]))
                    }
                }
                if (vertical) {
                    val c = center(i)
                    val x = if (end == Float.MIN_VALUE) plot.center.x else (plot.left + end) / 2
                    return Rect(x, c - bandSize / 2, x, c + bandSize / 2)
                }
                val y = if (top == Float.MAX_VALUE) plot.top else top
                return Rect(center(i), y, center(i), y)
            }
            val hit: (Offset) -> Int? = { offset ->
                if (n == 0) {
                    null
                } else {
                    val p = if (vertical) offset.y else offset.x
                    val index = when {
                        band -> floor((p - catStart) / bandSize).toInt()
                        n == 1 -> 0
                        else -> ((p - catStart) / catLength * (n - 1)).roundToInt()
                    }
                    index.coerceIn(0, n - 1)
                }
            }
            val hitState = rememberUpdatedState(hit)
            val selectedState = rememberUpdatedState(selected)
            val selectState = rememberUpdatedState(select)

            val xLabels = mutableListOf<AxisLabel>()
            if (!vertical && xAxis != null && !xAxis.hide && n > 0) {
                val candidates = xAxis.ticks ?: xAxis.interval?.let { step -> (0 until n).filter { it % (step + 1) == 0 } } ?: (0 until n).toList()
                val measured = candidates.filter { it in 0 until n }.map { i ->
                    i to measure(measurer, xAxis.label(data[i]).let { xAxis.tickFormatter?.invoke(it) ?: it }, tickStyle)
                }
                val kept = if (xAxis.interval == null) {
                    val result = mutableListOf<Pair<Int, TextLayoutResult>>()
                    var limit = Float.MAX_VALUE
                    for ((i, text) in measured.asReversed()) {
                        if (text.size.width == 0) continue
                        val start = (center(i) - text.size.width / 2f).coerceIn(0f, max(0f, width - text.size.width))
                        val end = start + text.size.width
                        if (end + px(xAxis.minTickGap) <= limit) {
                            result += i to text
                            limit = start
                        }
                    }
                    result
                } else {
                    measured
                }
                for ((i, text) in kept) {
                    val w = text.size.width.toFloat()
                    val x = (center(i) - w / 2).coerceIn(0f, max(0f, width - w))
                    xLabels += AxisLabel(text, Offset(x, plot.bottom + tickSize + px(xAxis.tickMargin) - px(4.dp)))
                }
            }
            val yLabels = mutableListOf<AxisLabel>()
            if (valueAxis != null && valueLabels.isNotEmpty()) {
                ticks.forEachIndexed { index, tick ->
                    val text = valueLabels[index]
                    val y = valuePx(tick) - text.size.height / 2f
                    val x = if (valueAxis.orientation == ChartAxisOrientation.Right) {
                        plot.right + tickSize + px(valueAxis.tickMargin)
                    } else {
                        plot.left - tickSize - px(valueAxis.tickMargin) - text.size.width
                    }
                    yLabels += AxisLabel(text, Offset(x, y))
                }
            }
            for ((axis, labels) in categoryLabels) {
                labels.forEachIndexed { i, text ->
                    val y = center(i) - text.size.height / 2f
                    val x = if (axis.orientation == ChartAxisOrientation.Right) {
                        plot.right + tickSize + px(axis.tickMargin)
                    } else {
                        plot.left - tickSize - px(axis.tickMargin) - text.size.width
                    }
                    yLabels += AxisLabel(text, Offset(x, y))
                }
            }
            val referenceLabels = scope.layers.filterIsInstance<ReferenceLineLayer<T>>().associateWith { layer ->
                layer.label?.let { measure(measurer, it, tickStyle.copy(fontWeight = FontWeight.SemiBold)) }
            }
            val labelTexts = series.associateWith { s ->
                val list = s.labelList ?: return@associateWith emptyList<TextLayoutResult?>()
                val style = TextStyle(color = list.color ?: colors.foreground, fontSize = list.fontSize, fontWeight = FontWeight.SemiBold)
                (0 until n).map { i ->
                    val raw = frame.series[s.dataKey]?.raw?.getOrNull(i)
                    if (raw == null || raw.isNaN()) null else measure(measurer, list.formatter?.invoke(i, raw) ?: chartNumber(raw), style)
                }
            }

            Box(
                Modifier
                    .fillMaxSize()
                    .chartSemantics(description, interactive, n, selected, ::describe, select)
                    .chartGestures(interactive, hitState, selectedState, selectState),
            ) {
                Canvas(Modifier.fillMaxSize()) {
                    if (scope.hasGrid && !vertical) {
                        val effect = dashEffect(scope.grid, density)
                        for (tick in ticks) {
                            val y = valuePx(tick)
                            drawLine(colors.border.copy(alpha = colors.border.alpha * 0.5f), Offset(plot.left, y), Offset(plot.right, y), 1.dp.toPx(), pathEffect = effect)
                        }
                    }
                    val cursor = tooltip?.cursor
                    if (cursor != null && selected != null && selected in 0 until n) {
                        val c = center(selected)
                        val color = cursor.color ?: colors.border
                        if (vertical) {
                            drawLine(color, Offset(plot.left, c), Offset(plot.right, c), cursor.width.toPx())
                        } else {
                            drawLine(color, Offset(c, plot.top), Offset(c, plot.bottom), cursor.width.toPx())
                        }
                    }
                    val reveals = mutableMapOf<SeriesLayer<T>, Float>()
                    for (layer in scope.layers) {
                        when (layer) {
                            is ReferenceAreaLayer -> {
                                if (n == 0) continue
                                val a = center(layer.x1.coerceIn(0, n - 1))
                                val b = center(layer.x2.coerceIn(0, n - 1))
                                val color = layer.fill ?: colors.secondary
                                drawRect(
                                    color.copy(alpha = color.alpha * layer.fillOpacity),
                                    Offset(min(a, b), plot.top),
                                    androidx.compose.ui.geometry.Size(abs(b - a), plot.height),
                                )
                            }
                            is ReferenceLineLayer -> {
                                val y = valuePx(layer.y)
                                drawLine(
                                    layer.stroke ?: colors.border,
                                    Offset(plot.left, y),
                                    Offset(plot.right, y),
                                    1.dp.toPx(),
                                    pathEffect = dashEffect(layer.strokeDasharray, density),
                                )
                                referenceLabels[layer]?.let { text ->
                                    drawText(text, topLeft = Offset(plot.left + 5.dp.toPx(), y - 5.dp.toPx() - text.size.height))
                                }
                            }
                            is SeriesLayer -> {
                                val g = grow(layer)
                                val reveal = if (layer.kind == SeriesKind.Area && g < 1f) plot.left + plot.width * g else null
                                reveals[layer] = drawSeries(data, layer, frame, ::points, ::barShape, ::seriesColor, valuePx(baselineValue), density, g, reveal)
                            }
                        }
                    }
                    if (selected != null && selected in 0 until n) {
                        for (s in series) {
                            val dot = s.activeDot ?: continue
                            val v = frame.series[s.dataKey]?.top?.getOrNull(selected) ?: continue
                            if (v.isNaN() || frame.series[s.dataKey]?.raw?.getOrNull(selected)?.isNaN() != false) continue
                            drawDot(dot, Offset(center(selected), valuePx(v)), dot.color ?: seriesColor(s, selected))
                        }
                    }
                    for (s in series) {
                        val list = s.labelList ?: continue
                        val texts = labelTexts[s] ?: continue
                        if (s.kind == SeriesKind.Bar && grow(s) < 1f) continue
                        val reveal = reveals[s] ?: Float.MAX_VALUE
                        for (i in 0 until n) {
                            val text = texts.getOrNull(i) ?: continue
                            if (center(i) > reveal + 0.5f) continue
                            val top = if (s.kind == SeriesKind.Bar) {
                                barShape(s, i)?.rect?.top ?: continue
                            } else {
                                valuePx(frame.series[s.dataKey]?.top?.get(i) ?: continue)
                            }
                            drawText(
                                text,
                                topLeft = Offset(center(i) - text.size.width / 2f, top - list.offset.toPx() - text.size.height),
                            )
                        }
                    }
                    for (label in xLabels + yLabels) drawText(label.layout, topLeft = label.topLeft)
                }
                if (tooltip != null && selected != null && selected in 0 until n) {
                    val list = items(selected)
                    if (list.isNotEmpty()) {
                        TooltipOverlay(ChartTooltipScope(categoryLabel(selected), list), anchor(selected), tooltip.content)
                    }
                }
            }
        }
        val legend = scope.legend
        if (legend != null) ChartLegendContent(legendKeys, hideIcon = legend)
    }
}

private fun DrawScope.drawDot(dot: ChartDot, center: Offset, color: Color) {
    drawCircle(color, dot.radius.toPx(), center)
    if (dot.strokeWidth > 0.dp) {
        drawCircle(dot.strokeColor ?: Color.Transparent, dot.radius.toPx(), center, style = Stroke(dot.strokeWidth.toPx()))
    }
}

private fun <T> DrawScope.drawSeries(
    data: List<T>,
    s: SeriesLayer<T>,
    frame: ChartFrame,
    points: (SeriesLayer<T>, List<Double>) -> List<Offset?>,
    barShape: (SeriesLayer<T>, Int) -> BarShape?,
    seriesColor: (SeriesLayer<T>, Int) -> Color,
    baseline: Float,
    density: Density,
    grow: Float,
    reveal: Float?,
): Float {
    val f = frame.series[s.dataKey] ?: return Float.MAX_VALUE
    val n = f.raw.size
    var limit = Float.MAX_VALUE
    when (s.kind) {
        SeriesKind.Bar -> {
            for (i in 0 until n) {
                val shape = barShape(s, i) ?: continue
                shape.background?.let { drawPath(roundedRect(it, s.radius, density), s.background ?: Color.Transparent) }
                if (shape.rect.width <= 0f && shape.rect.height <= 0f) continue
                val brush = fillBrush(s.fill, shape.color, shape.rect)
                drawPath(roundedRect(shape.rect, s.radius, density), brush, alpha = shape.alpha)
            }
        }
        SeriesKind.Line, SeriesKind.Area -> {
            val top = points(s, f.top)
            val color = seriesColor(s, 0)
            val segments = mutableListOf<List<Int>>()
            var current = mutableListOf<Int>()
            for (i in 0 until n) {
                if (top[i] == null || f.raw[i].isNaN() && s.stackId == null) {
                    if (current.isNotEmpty()) segments += current
                    current = mutableListOf()
                } else {
                    current += i
                }
            }
            if (current.isNotEmpty()) segments += current
            if (reveal != null) limit = reveal
            if (s.kind == SeriesKind.Area) {
                val bottom = points(s, f.bottom)
                for (segment in segments) {
                    if (segment.size < 2) continue
                    val path = Path()
                    val upper = segment.map { top[it]!! }
                    appendCurve(path, upper, s.curve, true)
                    val lower = segment.map { i -> bottom[i] ?: Offset(top[i]!!.x, baseline) }.asReversed()
                    if (s.stackId != null || bottom.any { it != null }) {
                        appendCurve(path, lower, s.curve, false)
                    } else {
                        path.lineTo(lower.first().x, lower.first().y)
                        path.lineTo(lower.last().x, lower.last().y)
                    }
                    path.close()
                    val bounds = path.getBounds()
                    clipTo(reveal) {
                        drawPath(path, fillBrush(s.fill, color, Rect(bounds.left, upper.minOf { it.y }, bounds.right, bounds.bottom)))
                    }
                }
            }
            if (s.strokeWidth > 0.dp) {
                val effect = dashEffect(s.strokeDasharray, density)
                val paths = segments.filter { it.size >= 2 }.map { segment ->
                    Path().apply { appendCurve(this, segment.map { top[it]!! }, s.curve, true) }
                }
                val measure = PathMeasure()
                val lengths = paths.map { measure.setPath(it, false); measure.length }
                var remaining = if (s.kind == SeriesKind.Line && grow < 1f) lengths.sum() * grow else Float.MAX_VALUE
                if (s.kind == SeriesKind.Line && grow < 1f) limit = Float.MIN_VALUE
                paths.forEachIndexed { index, full ->
                    if (remaining <= 0f) return@forEachIndexed
                    val length = lengths[index]
                    val path = if (remaining >= length) {
                        full
                    } else {
                        measure.setPath(full, false)
                        Path().also { measure.getSegment(0f, remaining, it, true) }
                    }
                    if (s.kind == SeriesKind.Line && grow < 1f) {
                        measure.setPath(full, false)
                        limit = measure.getPosition(min(remaining, length)).x
                    }
                    remaining -= length
                    clipTo(reveal) {
                        drawPath(
                            path,
                            s.stroke ?: color,
                            style = Stroke(s.strokeWidth.toPx(), cap = if (effect == null) StrokeCap.Round else StrokeCap.Butt, join = StrokeJoin.Round, pathEffect = effect),
                        )
                    }
                }
            }
            val dot = s.dot
            if (dot != null) {
                for (i in 0 until n) {
                    val p = top[i] ?: continue
                    if (f.raw[i].isNaN()) continue
                    if (p.x > limit + 0.5f) continue
                    drawDot(dot, p, dot.color ?: s.dotColor?.invoke(data[i]) ?: s.stroke ?: color)
                }
            }
        }
    }
    return limit
}

private inline fun DrawScope.clipTo(reveal: Float?, block: DrawScope.() -> Unit) {
    if (reveal == null) {
        block()
    } else {
        clipRect(-size.width, -size.height, reveal, size.height * 2, block = block)
    }
}

internal class PieSpec(
    val values: List<Double>,
    val keys: List<String>,
    val payloads: List<Any?>,
    val innerRadius: Float,
    val outerRadius: Float,
    val cx: Float,
    val cy: Float,
    val startAngle: Float,
    val endAngle: Float,
    val paddingAngle: Float,
    val cornerRadius: Dp,
    val stroke: Color?,
    val strokeWidth: Dp,
    val fillOpacity: Float,
    val cells: ((Int) -> ChartCell)?,
    val sectors: ((Int) -> ChartSector)?,
    val label: ((Int) -> String)?,
    val labelLine: Color?,
    val animation: ChartAnimation,
)

class PieChartScope internal constructor() {
    internal val pies = mutableListOf<PieSpec>()
    internal var tooltip: ChartTooltipSpec? = null
    internal var legend: Boolean? = null

    fun <T> Pie(
        data: List<T>,
        value: (T) -> Double,
        nameKey: (T) -> String,
        innerRadius: Float = 0f,
        outerRadius: Float = 0.8f,
        cx: Float = 0.5f,
        cy: Float = 0.5f,
        startAngle: Float = 0f,
        endAngle: Float = 360f,
        paddingAngle: Float = 0f,
        cornerRadius: Dp = 0.dp,
        stroke: Color? = null,
        strokeWidth: Dp = 1.dp,
        fillOpacity: Float = 1f,
        cells: ((Int) -> ChartCell)? = null,
        sectors: ((Int) -> ChartSector)? = null,
        label: ((Int) -> String)? = null,
        labelLine: Color? = null,
        isAnimationActive: Boolean = true,
        animationDuration: Int = 1500,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        pies += PieSpec(
            data.map(value), data.map(nameKey), data, innerRadius, outerRadius, cx, cy, startAngle, endAngle, paddingAngle,
            cornerRadius, stroke, strokeWidth, fillOpacity, cells, sectors, label, labelLine,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun ChartTooltip(
        defaultIndex: Int? = null,
        content: @Composable ChartTooltipScope.() -> Unit = { ChartTooltipContent() },
    ) {
        tooltip = ChartTooltipSpec(defaultIndex, null, content)
    }

    fun ChartLegend(hideIcon: Boolean = false) {
        legend = hideIcon
    }
}

internal class RadialBarSpec<T>(
    val dataKey: String,
    val value: (T) -> Double,
    val nameKey: ((T) -> String)?,
    val fill: Color?,
    val cornerRadius: Dp,
    val background: Color?,
    val stackId: String?,
    val stroke: Color?,
    val strokeWidth: Dp,
    val cells: ((Int) -> ChartCell)?,
    val labelList: ChartLabelList?,
    val animation: ChartAnimation,
)

class RadialBarChartScope<T> internal constructor() {
    internal val bars = mutableListOf<RadialBarSpec<T>>()
    internal var domain: ClosedFloatingPointRange<Double>? = null
    internal var tooltip: ChartTooltipSpec? = null
    internal var legend: Boolean? = null

    fun PolarAngleAxis(domain: ClosedFloatingPointRange<Double>) {
        this.domain = domain
    }

    fun RadialBar(
        dataKey: String,
        value: (T) -> Double,
        nameKey: ((T) -> String)? = null,
        fill: Color? = null,
        cornerRadius: Dp = 0.dp,
        background: Color? = null,
        stackId: String? = null,
        stroke: Color? = null,
        strokeWidth: Dp = 0.dp,
        cells: ((Int) -> ChartCell)? = null,
        labelList: ChartLabelList? = null,
        isAnimationActive: Boolean = true,
        animationDuration: Int = 1500,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        bars += RadialBarSpec(
            dataKey, value, nameKey, fill, cornerRadius, background, stackId, stroke, strokeWidth, cells, labelList,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun ChartTooltip(
        defaultIndex: Int? = null,
        content: @Composable ChartTooltipScope.() -> Unit = { ChartTooltipContent() },
    ) {
        tooltip = ChartTooltipSpec(defaultIndex, null, content)
    }

    fun ChartLegend(hideIcon: Boolean = false) {
        legend = hideIcon
    }
}

private fun polar(center: Offset, radius: Float, angle: Float): Offset {
    val rad = angle * PI.toFloat() / 180f
    return Offset(center.x + radius * cos(rad), center.y - radius * sin(rad))
}

private fun Path.cornerArc(center: Offset, radius: Float, from: Offset, to: Offset) {
    val start = atan2(from.y - center.y, from.x - center.x) * 180f / PI.toFloat()
    val end = atan2(to.y - center.y, to.x - center.x) * 180f / PI.toFloat()
    var sweep = end - start
    while (sweep > 180f) sweep -= 360f
    while (sweep < -180f) sweep += 360f
    arcTo(Rect(center, radius), start, sweep, false)
}

internal fun sectorPath(center: Offset, inner: Float, outer: Float, startAngle: Float, endAngle: Float, cornerRadius: Float): Path {
    val path = Path()
    val sweep = endAngle - startAngle
    if (outer <= 0f || sweep == 0f) return path
    if (abs(sweep) >= 360f) {
        path.addOval(Rect(center, outer))
        if (inner > 0f) {
            path.addOval(Rect(center, inner))
            path.fillType = PathFillType.EvenOdd
        }
        return path
    }
    val s = sign(sweep)
    val half = abs(sweep) / 2f * PI.toFloat() / 180f
    val sinHalf = sin(half)
    var cr = min(cornerRadius, (outer - inner) / 2f)
    cr = min(cr, outer * sinHalf / (1f + sinHalf))
    if (cr <= 0.5f) {
        val a = polar(center, outer, startAngle)
        path.moveTo(a.x, a.y)
        path.arcTo(Rect(center, outer), -startAngle, -sweep, false)
        if (inner > 0f) {
            path.arcTo(Rect(center, inner), -endAngle, sweep, false)
        } else {
            path.lineTo(center.x, center.y)
        }
        path.close()
        return path
    }
    val dOuter = asin(cr / (outer - cr)) * 180f / PI.toFloat()
    val side = sqrt((outer - cr) * (outer - cr) - cr * cr)
    val s0 = polar(center, side, startAngle)
    path.moveTo(s0.x, s0.y)
    path.cornerArc(polar(center, outer - cr, startAngle + s * dOuter), cr, s0, polar(center, outer, startAngle + s * dOuter))
    path.arcTo(Rect(center, outer), -(startAngle + s * dOuter), -(sweep - 2 * s * dOuter), false)
    val s1 = polar(center, side, endAngle)
    path.cornerArc(polar(center, outer - cr, endAngle - s * dOuter), cr, polar(center, outer, endAngle - s * dOuter), s1)
    if (inner > 0f) {
        val dInner = asin(min(1f, cr / (inner + cr))) * 180f / PI.toFloat()
        val innerSide = sqrt((inner + cr) * (inner + cr) - cr * cr)
        val i1 = polar(center, innerSide, endAngle)
        path.lineTo(i1.x, i1.y)
        path.cornerArc(polar(center, inner + cr, endAngle - s * dInner), cr, i1, polar(center, inner, endAngle - s * dInner))
        path.arcTo(Rect(center, inner), -(endAngle - s * dInner), sweep - 2 * s * dInner, false)
        val i0 = polar(center, innerSide, startAngle)
        path.cornerArc(polar(center, inner + cr, startAngle + s * dInner), cr, polar(center, inner, startAngle + s * dInner), i0)
    } else {
        path.lineTo(center.x, center.y)
    }
    path.close()
    return path
}

private fun angleOf(center: Offset, point: Offset): Float {
    val a = atan2(-(point.y - center.y), point.x - center.x) * 180f / PI.toFloat()
    return if (a < 0) a + 360f else a
}

private fun angleWithin(angle: Float, start: Float, end: Float): Boolean {
    val lo = min(start, end)
    val hi = max(start, end)
    var a = angle
    while (a < lo) a += 360f
    while (a > lo + 360f) a -= 360f
    return a <= hi
}

private class PieSlice(
    val pie: Int,
    val index: Int,
    val start: Float,
    val end: Float,
    val inner: Float,
    val outer: Float,
    val center: Offset,
    val color: Color,
)

@Composable
fun PieChart(
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: PieChartScope.() -> Unit,
) {
    val scope = PieChartScope().apply(content)
    val config = LocalChartConfig.current
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val measurer = rememberTextMeasurer()
    val tooltip = scope.tooltip
    val (selected, select) = rememberSelection(tooltip?.defaultIndex, selectedIndex, onSelectedIndexChange)
    val interactive = tooltip != null || onSelectedIndexChange != null
    val offsets = scope.pies.runningFold(0) { acc, pie -> acc + pie.values.size }
    val count = offsets.last()
    fun locate(flat: Int): Pair<Int, Int>? {
        for (p in scope.pies.indices) if (flat < offsets[p + 1]) return p to flat - offsets[p]
        return null
    }
    fun sliceColor(p: Int, i: Int): Color =
        scope.pies[p].cells?.invoke(i)?.color ?: configColor(config, scope.pies[p].keys[i], colors)
    fun items(flat: Int): List<ChartTooltipItem> {
        val (p, i) = locate(flat) ?: return emptyList()
        val pie = scope.pies[p]
        return listOf(ChartTooltipItem(pie.keys[i], pie.keys[i], pie.values[i], null, sliceColor(p, i), i, pie.payloads[i]))
    }
    fun describe(flat: Int) = items(flat).joinToString(", ") { "${config[it.key]?.label ?: it.key}: ${itemValueText(it)}" }
    val description = listOfNotNull(accessibilityLabel, scope.pies.firstOrNull()?.keys?.joinToString(", ") { config[it]?.label ?: it }).joinToString(", ")
    val legendKeys = scope.pies.lastOrNull()?.keys ?: emptyList()
    val labelStyle = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold)
    val entrance = scope.pies.mapIndexed { p, pie -> key(p) { rememberEntrance(pie.animation) } }

    Column(modifier.fillMaxSize()) {
        BoxWithConstraints(
            Modifier
                .weight(1f)
                .fillMaxWidth(),
        ) {
            val px = { dp: Dp -> with(density) { dp.toPx() } }
            val left = px(margin.left)
            val top = px(margin.top)
            val innerWidth = constraints.maxWidth - left - px(margin.right)
            val innerHeight = constraints.maxHeight - top - px(margin.bottom)
            val maxRadius = min(innerWidth, innerHeight) / 2f
            val slices = mutableListOf<PieSlice>()
            scope.pies.forEachIndexed { p, pie ->
                val center = Offset(left + pie.cx * innerWidth, top + pie.cy * innerHeight)
                val delta = (pie.endAngle - pie.startAngle).let { sign(it) * min(abs(it), 360f) }
                val nonZero = pie.values.count { it != 0.0 }
                val padding = (if (abs(delta) >= 360f) nonZero else nonZero - 1).coerceAtLeast(0) * pie.paddingAngle
                val real = abs(delta) - padding
                val total = pie.values.sum().takeIf { it > 0 } ?: 1.0
                var start = pie.startAngle
                pie.values.forEachIndexed { i, v ->
                    if (i > 0) start += sign(delta) * pie.paddingAngle * (if (v != 0.0) 1 else 0)
                    val end = start + sign(delta) * (v / total * real).toFloat()
                    slices += PieSlice(p, i, start, end, pie.innerRadius * maxRadius, pie.outerRadius * maxRadius, center, sliceColor(p, i))
                    start = end
                }
            }
            val hit: (Offset) -> Int? = { offset ->
                slices.lastOrNull { slice ->
                    val d = hypot(offset.x - slice.center.x, offset.y - slice.center.y)
                    val lift = scope.pies[slice.pie].sectors?.invoke(slice.index)?.lift?.let(px) ?: 0f
                    d >= slice.inner && d <= slice.outer + lift && angleWithin(angleOf(slice.center, offset), slice.start, slice.end)
                }?.let { offsets[it.pie] + it.index }
            }
            val hitState = rememberUpdatedState(hit)
            val selectedState = rememberUpdatedState(selected)
            val selectState = rememberUpdatedState(select)
            val labels = slices.associateWith { slice ->
                scope.pies[slice.pie].label?.invoke(slice.index)?.let { measure(measurer, it, labelStyle) }
            }
            Box(
                Modifier
                    .fillMaxSize()
                    .chartSemantics(description, interactive, count, selected, ::describe, select)
                    .chartGestures(interactive, hitState, selectedState, selectState),
            ) {
                Canvas(Modifier.fillMaxSize().clipToBounds()) {
                    for (slice in slices) {
                        val pie = scope.pies[slice.pie]
                        val g = entrance[slice.pie].value
                        val start = pie.startAngle + (slice.start - pie.startAngle) * g
                        val end = pie.startAngle + (slice.end - pie.startAngle) * g
                        val sector = pie.sectors?.invoke(slice.index)
                        val cell = pie.cells?.invoke(slice.index)
                        val outer = slice.outer + (sector?.lift?.toPx() ?: 0f)
                        val path = sectorPath(slice.center, slice.inner, outer, start, end, pie.cornerRadius.toPx())
                        val alpha = pie.fillOpacity * (cell?.alpha ?: 1f)
                        drawPath(path, slice.color, alpha = alpha)
                        sector?.ring?.let { ring ->
                            val r0 = outer + ring.gap.toPx()
                            drawPath(sectorPath(slice.center, r0, r0 + ring.width.toPx(), start, end, 0f), slice.color, alpha = alpha)
                        }
                        if (pie.stroke != null && pie.strokeWidth > 0.dp) {
                            drawPath(path, pie.stroke, style = Stroke(pie.strokeWidth.toPx(), join = StrokeJoin.Round))
                        }
                    }
                    for (slice in slices) {
                        val text = labels[slice] ?: continue
                        if (entrance[slice.pie].value < 1f) continue
                        val pie = scope.pies[slice.pie]
                        val mid = (slice.start + slice.end) / 2f
                        val from = polar(slice.center, slice.outer, mid)
                        val to = polar(slice.center, slice.outer + 20.dp.toPx(), mid)
                        pie.labelLine?.let { drawLine(it, from, to, 1.dp.toPx()) }
                        val x = if (to.x > slice.center.x) to.x else to.x - text.size.width
                        drawText(text, topLeft = Offset(x, to.y - text.size.height / 2f))
                    }
                }
                if (tooltip != null && selected != null && selected in 0 until count) {
                    val list = items(selected)
                    val (p, i) = locate(selected) ?: (0 to 0)
                    val slice = slices.firstOrNull { it.pie == p && it.index == i }
                    if (list.isNotEmpty() && slice != null) {
                        val point = polar(slice.center, slice.outer, (slice.start + slice.end) / 2f)
                        TooltipOverlay(ChartTooltipScope("", list), Rect(point, point), tooltip.content)
                    }
                }
            }
        }
        val legend = scope.legend
        if (legend != null) ChartLegendContent(legendKeys, hideIcon = legend)
    }
}

@Composable
fun <T> RadialBarChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    innerRadius: Float = 0f,
    outerRadius: Float = 0.8f,
    cx: Float = 0.5f,
    cy: Float = 0.5f,
    startAngle: Float = 0f,
    endAngle: Float = 360f,
    barSize: Dp? = null,
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: RadialBarChartScope<T>.() -> Unit,
) {
    val scope = RadialBarChartScope<T>().apply(content)
    val config = LocalChartConfig.current
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val measurer = rememberTextMeasurer()
    val tooltip = scope.tooltip
    val (selected, select) = rememberSelection(tooltip?.defaultIndex, selectedIndex, onSelectedIndexChange)
    val interactive = tooltip != null || onSelectedIndexChange != null
    val n = data.size
    fun key(bar: RadialBarSpec<T>, i: Int) = bar.nameKey?.invoke(data[i]) ?: bar.dataKey
    fun color(bar: RadialBarSpec<T>, i: Int) = bar.cells?.invoke(i)?.color ?: bar.fill ?: configColor(config, key(bar, i), colors)
    fun items(i: Int) = scope.bars.map { bar ->
        ChartTooltipItem(key(bar, i), bar.dataKey, bar.value(data[i]), null, color(bar, i), i, data[i])
    }
    fun describe(i: Int) = items(i).joinToString(", ") { "${config[it.key]?.label ?: it.key}: ${itemValueText(it)}" }
    val description = listOfNotNull(accessibilityLabel).joinToString(", ")
    val legendKeys = (0 until n).flatMap { i -> scope.bars.map { key(it, i) } }
    val stacks = (0 until n).map { i ->
        val acc = mutableMapOf<String, Double>()
        scope.bars.map { bar ->
            val id = bar.stackId ?: "#${bar.dataKey}"
            val from = acc[id] ?: 0.0
            val to = from + bar.value(data[i])
            acc[id] = to
            from to to
        }
    }
    val domain = scope.domain ?: run {
        val max = stacks.flatten().maxOfOrNull { it.second } ?: 1.0
        niceTicks(0.0, max, 5).let { it.first()..it.last() }
    }
    val groups = scope.bars.map { it.stackId ?: "#${it.dataKey}" }.distinct()
    val entrance = scope.bars.mapIndexed { b, bar -> key(b, bar.dataKey) { rememberEntrance(bar.animation) } }

    Column(modifier.fillMaxSize()) {
        BoxWithConstraints(
            Modifier
                .weight(1f)
                .fillMaxWidth(),
        ) {
            val px = { dp: Dp -> with(density) { dp.toPx() } }
            val left = px(margin.left)
            val top = px(margin.top)
            val innerWidth = constraints.maxWidth - left - px(margin.right)
            val innerHeight = constraints.maxHeight - top - px(margin.bottom)
            val maxRadius = min(innerWidth, innerHeight) / 2f
            val center = Offset(left + cx * innerWidth, top + cy * innerHeight)
            val r0 = innerRadius * maxRadius
            val r1 = outerRadius * maxRadius
            val bandSize = if (n > 0) (r1 - r0) / n else r1 - r0
            val gap = px(4.dp)
            val size = barSize?.let(px) ?: ((bandSize - 2 * bandSize * 0.1f - (groups.size - 1) * gap) / groups.size.coerceAtLeast(1))
            val start = (bandSize - (groups.size * size + (groups.size - 1) * gap)) / 2f
            val span = (domain.endInclusive - domain.start).takeIf { it != 0.0 } ?: 1.0
            fun angle(v: Double) = startAngle + ((v - domain.start) / span).toFloat() * (endAngle - startAngle)
            fun ring(i: Int, bar: RadialBarSpec<T>): Pair<Float, Float> {
                val g = groups.indexOf(bar.stackId ?: "#${bar.dataKey}")
                val inner = r0 + bandSize * i + start + g * (size + gap)
                return inner to inner + size
            }
            val hit: (Offset) -> Int? = { offset ->
                val d = hypot(offset.x - center.x, offset.y - center.y)
                if (n == 0 || d < r0 || d > r1) null else floor((d - r0) / bandSize).toInt().coerceIn(0, n - 1)
            }
            val hitState = rememberUpdatedState(hit)
            val selectedState = rememberUpdatedState(selected)
            val selectState = rememberUpdatedState(select)
            Box(
                Modifier
                    .fillMaxSize()
                    .chartSemantics(description, interactive, n, selected, ::describe, select)
                    .chartGestures(interactive, hitState, selectedState, selectState),
            ) {
                Canvas(Modifier.fillMaxSize().clipToBounds()) {
                    for (i in 0 until n) {
                        scope.bars.forEachIndexed { b, bar ->
                            val (inner, outer) = ring(i, bar)
                            val corner = bar.cornerRadius.toPx()
                            bar.background?.let {
                                drawPath(sectorPath(center, inner, outer, startAngle, endAngle, corner), it)
                            }
                            val (from, to) = stacks[i][b]
                            val a0 = angle(from)
                            val path = sectorPath(center, inner, outer, a0, a0 + (angle(to) - a0) * entrance[b].value, corner)
                            drawPath(path, color(bar, i), alpha = bar.cells?.invoke(i)?.alpha ?: 1f)
                            if (bar.stroke != null && bar.strokeWidth > 0.dp) {
                                drawPath(path, bar.stroke, style = Stroke(bar.strokeWidth.toPx(), join = StrokeJoin.Round))
                            }
                        }
                    }
                    for (i in 0 until n) {
                        scope.bars.forEachIndexed { b, bar ->
                            val list = bar.labelList ?: return@forEachIndexed
                            if (entrance[b].value < 1f) return@forEachIndexed
                            val (inner, outer) = ring(i, bar)
                            val (from, _) = stacks[i][b]
                            val raw = bar.value(data[i])
                            val text = measure(
                                measurer,
                                list.formatter?.invoke(i, raw) ?: chartNumber(raw),
                                TextStyle(color = list.color ?: colors.primaryForeground, fontSize = list.fontSize, fontWeight = FontWeight.SemiBold),
                            )
                            val mid = (inner + outer) / 2f
                            val direction = sign(endAngle - startAngle).let { if (it == 0f) 1f else it }
                            val a = angle(from) + direction * (list.offset.toPx() / mid) * 180f / PI.toFloat()
                            val point = polar(center, mid, a)
                            val rotation = if (direction < 0) 90f - a else -90f - a
                            rotate(rotation, point) {
                                drawText(text, topLeft = Offset(point.x, point.y - text.size.height / 2f))
                            }
                        }
                    }
                }
                if (tooltip != null && selected != null && selected in 0 until n) {
                    val list = items(selected)
                    val outer = scope.bars.maxOfOrNull { ring(selected, it).second } ?: r1
                    val point = Offset(center.x, center.y - outer)
                    if (list.isNotEmpty()) TooltipOverlay(ChartTooltipScope("", list), Rect(point, point), tooltip.content)
                }
            }
        }
        val legend = scope.legend
        if (legend != null) ChartLegendContent(legendKeys, hideIcon = legend)
    }
}

enum class PolarGridType { Polygon, Circle }

internal class PolarGridSpec(
    val gridType: PolarGridType,
    val stroke: Color?,
    val strokeWidth: Dp,
    val fill: Color?,
    val fillOpacity: Float,
)

internal class PolarAngleAxisSpec<T>(
    val label: (T) -> String,
    val tickStyle: TextStyle?,
    val activeTickStyle: TextStyle?,
)

internal class PolarRadiusAxisSpec(
    val angle: Float,
    val domain: ClosedFloatingPointRange<Double>?,
    val tickCount: Int,
    val tick: Boolean,
    val tickStyle: TextStyle?,
)

internal class RadarSpec<T>(
    val dataKey: String,
    val value: (T) -> Double,
    val fill: Color?,
    val fillOpacity: Float,
    val stroke: Color?,
    val strokeWidth: Dp,
    val strokeOpacity: Float,
    val dot: ChartDot?,
    val activeDot: ChartDot?,
    val animation: ChartAnimation,
)

class RadarChartScope<T> internal constructor() {
    internal var grid: PolarGridSpec? = null
    internal var angleAxis: PolarAngleAxisSpec<T>? = null
    internal var radiusAxis: PolarRadiusAxisSpec? = null
    internal val radars = mutableListOf<RadarSpec<T>>()
    internal var tooltip: ChartTooltipSpec? = null
    internal var legend: Boolean? = null

    fun PolarGrid(
        gridType: PolarGridType = PolarGridType.Polygon,
        stroke: Color? = null,
        strokeWidth: Dp = 1.dp,
        fill: Color? = null,
        fillOpacity: Float = 1f,
    ) {
        grid = PolarGridSpec(gridType, stroke, strokeWidth, fill, fillOpacity)
    }

    fun PolarAngleAxis(
        label: (T) -> String,
        tickStyle: TextStyle? = null,
        activeTickStyle: TextStyle? = null,
    ) {
        angleAxis = PolarAngleAxisSpec(label, tickStyle, activeTickStyle)
    }

    fun PolarRadiusAxis(
        angle: Float = 0f,
        domain: ClosedFloatingPointRange<Double>? = null,
        tickCount: Int = 5,
        tick: Boolean = true,
        tickStyle: TextStyle? = null,
    ) {
        radiusAxis = PolarRadiusAxisSpec(angle, domain, tickCount, tick, tickStyle)
    }

    fun Radar(
        dataKey: String,
        value: (T) -> Double,
        fill: Color? = null,
        fillOpacity: Float = 1f,
        stroke: Color? = null,
        strokeWidth: Dp = 1.dp,
        strokeOpacity: Float = 1f,
        dot: ChartDot? = null,
        activeDot: ChartDot? = ChartDot(4.dp),
        isAnimationActive: Boolean = true,
        animationDuration: Int = 1500,
        animationEasing: ChartEasing = ChartEasing.Ease,
    ) {
        radars += RadarSpec(
            dataKey, value, fill, fillOpacity, stroke, strokeWidth, strokeOpacity, dot, activeDot,
            ChartAnimation(isAnimationActive, animationDuration, animationEasing),
        )
    }

    fun ChartTooltip(
        defaultIndex: Int? = null,
        cursor: ChartCursor? = ChartCursor(),
        content: @Composable ChartTooltipScope.() -> Unit = { ChartTooltipContent() },
    ) {
        tooltip = ChartTooltipSpec(defaultIndex, cursor, content)
    }

    fun ChartLegend(hideIcon: Boolean = false) {
        legend = hideIcon
    }
}

private class RadarTick(val layout: TextLayoutResult, val topLeft: Offset, val rotation: Float, val pivot: Offset)

@Composable
fun <T> RadarChart(
    data: List<T>,
    modifier: Modifier = Modifier,
    margin: ChartMargin = ChartMargin(),
    outerRadius: Float = 0.8f,
    cy: Float = 0.5f,
    accessibilityLabel: String? = null,
    selectedIndex: Int? = null,
    onSelectedIndexChange: ((Int?) -> Unit)? = null,
    content: RadarChartScope<T>.() -> Unit,
) {
    val scope = RadarChartScope<T>().apply(content)
    val config = LocalChartConfig.current
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val measurer = rememberTextMeasurer()
    val tooltip = scope.tooltip
    val (selected, select) = rememberSelection(tooltip?.defaultIndex, selectedIndex, onSelectedIndexChange)
    val interactive = tooltip != null || onSelectedIndexChange != null
    val n = data.size
    val angleAxis = scope.angleAxis
    val radiusAxis = scope.radiusAxis
    fun categoryLabel(i: Int) = angleAxis?.label?.invoke(data[i]) ?: ""
    fun color(radar: RadarSpec<T>) = radar.fill ?: radar.stroke ?: configColor(config, radar.dataKey, colors)
    fun items(i: Int) = scope.radars.map { radar ->
        ChartTooltipItem(radar.dataKey, radar.dataKey, radar.value(data[i]), null, color(radar), i, data[i])
    }
    fun describe(i: Int): String {
        val label = categoryLabel(i).let { config[it]?.label ?: it }
        val values = items(i).joinToString(", ") { "${config[it.key]?.label ?: it.key} ${itemValueText(it)}" }
        return if (label.isEmpty()) values else "$label: $values"
    }
    val description = listOfNotNull(
        accessibilityLabel,
        if (angleAxis != null && n > 0) (0 until n).joinToString(", ") { categoryLabel(it) } else null,
    ).joinToString(", ")
    val legendKeys = scope.radars.map { it.dataKey }
    val ticks = run {
        val domain = radiusAxis?.domain
        val count = radiusAxis?.tickCount ?: 5
        if (domain != null) {
            niceTicks(domain.start, domain.endInclusive, count).filter { it >= domain.start - 1e-9 && it <= domain.endInclusive + 1e-9 }
        } else {
            val max = scope.radars.flatMap { radar -> data.map(radar.value) }.maxOrNull()?.coerceAtLeast(0.0) ?: 1.0
            niceTicks(0.0, max, count)
        }
    }
    val lo = radiusAxis?.domain?.start ?: ticks.first()
    val hi = radiusAxis?.domain?.endInclusive ?: ticks.last()
    val tickStyle = Typography.xs.copy(color = colors.mutedForeground)
    val entrance = scope.radars.associateWith { radar -> key(radar.dataKey) { rememberEntrance(radar.animation) } }

    Column(modifier.fillMaxSize()) {
        BoxWithConstraints(
            Modifier
                .weight(1f)
                .fillMaxWidth(),
        ) {
            val px = { dp: Dp -> with(density) { dp.toPx() } }
            val left = px(margin.left)
            val top = px(margin.top)
            val innerWidth = constraints.maxWidth - left - px(margin.right)
            val innerHeight = constraints.maxHeight - top - px(margin.bottom)
            val center = Offset(left + innerWidth / 2f, top + cy * innerHeight)
            val radius = outerRadius * min(innerWidth, innerHeight) / 2f
            val span = (hi - lo).takeIf { it != 0.0 } ?: 1.0
            fun radiusOf(v: Double) = (((v - lo) / span).toFloat() * radius).coerceAtLeast(0f)
            fun angleOf(i: Int) = 90f - 360f * i / n.coerceAtLeast(1)
            fun vertex(radar: RadarSpec<T>, i: Int) = polar(center, radiusOf(radar.value(data[i])) * (entrance[radar]?.value ?: 1f), angleOf(i))
            val hit: (Offset) -> Int? = { offset ->
                if (n == 0) {
                    null
                } else {
                    val angle = atan2(-(offset.y - center.y), offset.x - center.x) * 180f / PI.toFloat()
                    val step = 360f / n
                    (((90f - angle) / step).roundToInt() % n + n) % n
                }
            }
            val hitState = rememberUpdatedState(hit)
            val selectedState = rememberUpdatedState(selected)
            val selectState = rememberUpdatedState(select)
            val angleTicks = if (angleAxis != null) {
                (0 until n).map { i ->
                    val active = i == selected && angleAxis.activeTickStyle != null
                    val base = angleAxis.tickStyle?.let { tickStyle.merge(it) } ?: tickStyle
                    val style = if (active) base.merge(angleAxis.activeTickStyle) else base
                    val layout = measure(measurer, categoryLabel(i), style)
                    val a = angleOf(i)
                    val point = polar(center, radius + px(8.dp), a)
                    val rad = a * PI.toFloat() / 180f
                    val cos = cos(rad)
                    val sin = -sin(rad)
                    val w = layout.size.width.toFloat()
                    val x = when {
                        cos > 1e-5f -> point.x
                        cos < -1e-5f -> point.x - w
                        else -> point.x - w / 2f
                    }
                    val cap = 0.71f * with(density) { style.fontSize.toPx() }
                    val baseline = when {
                        abs(cos) <= cos(PI.toFloat() / 4f) && sin > 0f -> point.y + cap
                        abs(cos) <= cos(PI.toFloat() / 4f) -> point.y
                        else -> point.y + cap / 2f
                    }
                    RadarTick(layout, Offset(x, baseline - layout.firstBaseline), 0f, point)
                }
            } else {
                emptyList()
            }
            val radiusTicks = if (radiusAxis != null && radiusAxis.tick) {
                val style = radiusAxis.tickStyle?.let { tickStyle.merge(it) } ?: tickStyle
                ticks.map { value ->
                    val layout = measure(measurer, chartNumber(value), style)
                    val point = polar(center, radiusOf(value), radiusAxis.angle)
                    RadarTick(layout, Offset(point.x, point.y - layout.firstBaseline), 90f - radiusAxis.angle, point)
                }
            } else {
                emptyList()
            }
            Box(
                Modifier
                    .fillMaxSize()
                    .chartSemantics(description, interactive, n, selected, ::describe, select)
                    .chartGestures(interactive, hitState, selectedState, selectState),
            ) {
                Canvas(Modifier.fillMaxSize()) {
                    val grid = scope.grid
                    if (grid != null && n > 0) {
                        val stroke = grid.stroke ?: colors.border
                        val width = grid.strokeWidth.toPx()
                        fun ring(r: Float): Path = Path().apply {
                            if (grid.gridType == PolarGridType.Circle) {
                                addOval(Rect(center, r))
                            } else {
                                for (i in 0 until n) {
                                    val p = polar(center, r, angleOf(i))
                                    if (i == 0) moveTo(p.x, p.y) else lineTo(p.x, p.y)
                                }
                                close()
                            }
                        }
                        val radii = ticks.map(::radiusOf).filter { it > 0f }
                        val outer = radii.maxOrNull() ?: radius
                        if (grid.fill != null) {
                            val path = ring(outer)
                            drawPath(path, grid.fill, alpha = grid.fillOpacity)
                            drawPath(path, stroke, style = Stroke(width, join = StrokeJoin.Round))
                        }
                        for (i in 0 until n) drawLine(stroke, center, polar(center, outer, angleOf(i)), width)
                        for (r in radii) drawPath(ring(r), stroke, style = Stroke(width, join = StrokeJoin.Round))
                    }
                    val cursor = tooltip?.cursor
                    if (cursor != null && selected != null && selected in 0 until n) {
                        drawLine(cursor.color ?: colors.input, center, polar(center, radius, angleOf(selected)), max(cursor.width.toPx(), 1.5.dp.toPx()))
                    }
                    for (radar in scope.radars) {
                        if (n == 0) break
                        val path = Path()
                        for (i in 0 until n) {
                            val p = vertex(radar, i)
                            if (i == 0) path.moveTo(p.x, p.y) else path.lineTo(p.x, p.y)
                        }
                        path.close()
                        val fill = radar.fill ?: configColor(config, radar.dataKey, colors)
                        if (radar.fillOpacity > 0f) drawPath(path, fill, alpha = radar.fillOpacity)
                        val stroke = radar.stroke ?: configColor(config, radar.dataKey, colors)
                        if (radar.strokeWidth > 0.dp && radar.strokeOpacity > 0f) {
                            drawPath(path, stroke, alpha = radar.strokeOpacity, style = Stroke(radar.strokeWidth.toPx(), join = StrokeJoin.Round))
                        }
                        val dot = radar.dot ?: continue
                        val ring = dot.strokeColor ?: stroke.copy(alpha = stroke.alpha * radar.strokeOpacity)
                        for (i in 0 until n) drawDot(dot.copy(strokeColor = ring), vertex(radar, i), dot.color ?: fill)
                    }
                    if (selected != null && selected in 0 until n) {
                        for (radar in scope.radars) {
                            val dot = radar.activeDot ?: continue
                            drawDot(dot, vertex(radar, selected), dot.color ?: color(radar))
                        }
                    }
                    for (tick in radiusTicks + angleTicks) {
                        if (tick.rotation == 0f) {
                            drawText(tick.layout, topLeft = tick.topLeft)
                        } else {
                            rotate(tick.rotation, tick.pivot) { drawText(tick.layout, topLeft = tick.topLeft) }
                        }
                    }
                }
                if (tooltip != null && selected != null && selected in 0 until n) {
                    val list = items(selected)
                    if (list.isNotEmpty()) {
                        val point = scope.radars.map { vertex(it, selected) }.minByOrNull { it.y } ?: polar(center, radius, angleOf(selected))
                        TooltipOverlay(ChartTooltipScope(categoryLabel(selected), list), Rect(point, point), tooltip.content)
                    }
                }
            }
        }
        val legend = scope.legend
        if (legend != null) ChartLegendContent(legendKeys, hideIcon = legend)
    }
}
