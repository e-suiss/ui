package com.esuiss.ui.charts

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.Easing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.AreaChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCursor
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.text.SimpleDateFormat
import java.util.Calendar
import java.util.Date
import java.util.Locale
import kotlin.math.abs
import kotlin.math.ceil
import kotlin.math.roundToInt

private class StockRange(val points: Int, val seed: Long, val volatility: Double, val drift: Double, val caption: String)

private class PricePoint(val index: Int, val price: Double, val label: String, val tick: String)

private val ranges = linkedMapOf(
    "1D" to StockRange(78, 11, 0.0025, 0.46, "Today"),
    "1W" to StockRange(35, 23, 0.004, 0.46, "Past week"),
    "1M" to StockRange(22, 37, 0.012, 0.53, "Past month"),
    "3M" to StockRange(64, 41, 0.014, 0.46, "Past 3 months"),
    "1Y" to StockRange(52, 59, 0.03, 0.46, "Past year"),
    "5Y" to StockRange(60, 73, 0.045, 0.46, "Past 5 years"),
)

private const val LAST_PRICE = 254.32

private const val SAMPLES = 80

private const val MORPH_DURATION = 520

private val MorphEasing = Easing { 1f - (1f - it) * (1f - it) * (1f - it) }

private fun end(): Calendar = Calendar.getInstance().apply {
    clear()
    set(2026, Calendar.OCTOBER, 6, 12, 0)
}

private fun format(pattern: String, date: Date) = SimpleDateFormat(pattern, Locale.US).format(date)

private fun businessDays(count: Int): List<Date> {
    val days = ArrayDeque<Date>()
    val day = end()
    while (days.size < count) {
        val weekday = day.get(Calendar.DAY_OF_WEEK)
        if (weekday != Calendar.SATURDAY && weekday != Calendar.SUNDAY) days.addFirst(day.time)
        day.add(Calendar.DAY_OF_MONTH, -1)
    }
    return days.toList()
}

private fun generate(range: String): List<PricePoint> {
    val spec = ranges.getValue(range)
    var state = spec.seed
    var value = 100.0
    val values = List(spec.points) {
        state = state * 16807 % 2147483647
        value *= 1 + ((state - 1) / 2147483646.0 - spec.drift) * spec.volatility
        value
    }
    val scale = LAST_PRICE / values.last()
    val days = businessDays(spec.points)
    val week = businessDays(5)
    return values.mapIndexed { index, raw ->
        val price = (raw * scale * 100).roundToInt() / 100.0
        when (range) {
            "1D" -> {
                val minutes = 570 + index * 5
                val hour = minutes / 60
                val minute = minutes % 60
                PricePoint(index, price, "$hour:${minute.toString().padStart(2, '0')}", if (minute == 0) "$hour:00" else "")
            }
            "1W" -> {
                val weekday = format("EEE", week[index / 7])
                PricePoint(index, price, "$weekday ${10 + index % 7}:00", if (index % 7 == 0) weekday else "")
            }
            "1M", "3M" -> {
                val label = format("MMM d", days[index])
                PricePoint(index, price, label, label)
            }
            "1Y" -> {
                val day = end().apply { add(Calendar.DAY_OF_MONTH, -(spec.points - 1 - index) * 7) }
                PricePoint(index, price, "${format("MMM d", day.time)}, ${day.get(Calendar.YEAR)}", format("MMM", day.time))
            }
            else -> {
                val month = end().apply {
                    set(Calendar.DAY_OF_MONTH, 1)
                    add(Calendar.MONTH, -(spec.points - 1 - index))
                }
                PricePoint(index, price, format("MMMM yyyy", month.time), month.get(Calendar.YEAR).toString())
            }
        }
    }
}

private fun resample(source: List<PricePoint>): List<PricePoint> {
    val samples = mutableListOf<PricePoint>()
    var previous = -1
    for (index in 0 until SAMPLES) {
        val position = index * (source.size - 1).toDouble() / (SAMPLES - 1)
        val from = position.toInt()
        val to = minOf(source.size - 1, from + 1)
        val nearest = position.roundToInt()
        val start = source[from]
        val stop = source[to]
        val closest = source[nearest]
        val price = start.price + (stop.price - start.price) * (position - from)
        samples += PricePoint(index, (price * 100).roundToInt() / 100.0, closest.label, if (nearest != previous) closest.tick else "")
        previous = nearest
    }
    return samples
}

private fun tickIndexes(points: List<PricePoint>, max: Int): List<Int> {
    val ticks = points.filterIndexed { index, point -> point.tick.isNotEmpty() && point.tick != points.getOrNull(index - 1)?.tick }.map { it.index }
    if (ticks.size <= max) return ticks
    val step = ceil(ticks.size / max.toDouble()).toInt()
    return ticks.filterIndexed { index, _ -> index % step == 0 }
}

private fun twoDigits(): NumberFormat = NumberFormat.getNumberInstance(Locale.US).apply {
    minimumFractionDigits = 2
    maximumFractionDigits = 2
}

@Composable
private fun rememberMorph(target: List<Double>): List<Double> {
    val reduced = formReducedMotion()
    var values by remember { mutableStateOf(target) }
    LaunchedEffect(target) {
        val from = values
        if (reduced || from == target) {
            values = target
            return@LaunchedEffect
        }
        Animatable(0f).animateTo(1f, tween(MORPH_DURATION, easing = MorphEasing)) {
            values = target.mapIndexed { index, price ->
                val origin = from.getOrNull(index) ?: price
                origin + (price - origin) * value
            }
        }
    }
    return values
}

@Composable
fun AreaChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    var range by remember { mutableStateOf("1M") }
    var active by remember { mutableStateOf<Int?>(null) }
    val points = remember(range) { resample(generate(range)) }
    val ticks = remember(points) { tickIndexes(points, 6) }
    val priceFormat = remember { twoDigits() }
    val first = points.first().price
    val current = points[active ?: (points.size - 1)]
    val change = current.price - first
    val rising = change >= 0
    val prices = points.map { it.price }
    val animated = rememberMorph(prices)
    val data = points.mapIndexed { index, point -> PricePoint(point.index, animated.getOrElse(index) { point.price }, point.label, point.tick) }
    val min = prices.min()
    val max = prices.max()
    val low = animated.min()
    val high = animated.max()
    val padding = (high - low) * 0.12
    val trend by animateColorAsState(if (rising) (if (colors.isDark) Palette.green400 else Palette.green600) else colors.destructive, tween(500), label = "trend")
    val chartConfig = ChartConfig("price" to ChartConfigItem("Price") { trend })
    val stats = listOf(
        "Open" to priceFormat.format(first),
        "High" to priceFormat.format(max),
        "Low" to priceFormat.format(min),
        "Volume" to if (range == "1D") "41.2M" else "1.24B",
    )
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                        BasicText("ACME", Modifier.alignByBaseline(), style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                        BasicText("Acme Corp.", Modifier.alignByBaseline(), style = Typography.base.copy(color = colors.mutedForeground))
                    }
                    Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                        BasicText(
                            "$${priceFormat.format(current.price)}",
                            Modifier.alignByBaseline(),
                            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                        BasicText(
                            "${if (rising) "+" else "-"}${priceFormat.format(abs(change))} (${priceFormat.format(abs(change / first * 100))}%)",
                            Modifier.alignByBaseline(),
                            style = Typography.base.copy(
                                color = if (rising) (if (colors.isDark) Palette.green400 else Palette.green600) else colors.destructive,
                                fontWeight = FontWeight.SemiBold,
                                fontFeatureSettings = "tnum",
                            ),
                        )
                    }
                    BasicText(
                        if (active == null) ranges.getValue(range).caption else current.label,
                        Modifier.heightIn(min = 20.dp),
                        style = Typography.sm.copy(color = colors.mutedForeground),
                    )
                }
                ToggleGroup(
                    value = range,
                    onValueChange = { value ->
                        if (value != null) {
                            range = value
                            active = null
                        }
                    },
                    size = ToggleSize.Sm,
                    spacing = 0,
                ) {
                    for (key in ranges.keys) ToggleGroupItem(key, key)
                }
            }
        }
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
                ChartContainer(
                    chartConfig,
                    Modifier
                        .fillMaxWidth()
                        .height(288.dp),
                ) {
                    val tickByLabel = points.filter { it.index in ticks }.associate { it.label to it.tick }
                    AreaChart(
                        data,
                        margin = ChartMargin(top = 10.dp, right = 0.dp, bottom = 0.dp, left = 0.dp),
                        accessibilityLabel = "ACME, ${ranges.getValue(range).caption}",
                        selectedIndex = active,
                        onSelectedIndexChange = { active = it },
                    ) {
                        CartesianGrid(strokeDasharray = listOf(2f, 4f))
                        XAxis(label = { it.label }, tickMargin = 8.dp, ticks = ticks, tickFormatter = { tickByLabel[it] ?: "" })
                        YAxis(
                            orientation = ChartAxisOrientation.Right,
                            tickMargin = 6.dp,
                            width = 40.dp,
                            domain = (low - padding)..(high + padding),
                            tickFormatter = { it.roundToInt().toString() },
                        )
                        ReferenceLine(first, stroke = colors.mutedForeground, strokeDasharray = listOf(2f, 3f))
                        ChartTooltip(cursor = ChartCursor(colors.mutedForeground)) { }
                        Area(
                            "price",
                            value = { it.price },
                            strokeWidth = 2.dp,
                            fill = ChartFill.VerticalGradient(topAlpha = 0.3f, bottomAlpha = 0.02f),
                            activeDot = ChartDot(5.dp, strokeColor = colors.muted, strokeWidth = 2.dp),
                            isAnimationActive = false,
                        )
                    }
                }
                Column {
                    for (pair in stats.chunked(2)) {
                        Row(horizontalArrangement = Arrangement.spacedBy(24.dp)) {
                            for ((term, value) in pair) {
                                Column(Modifier.weight(1f)) {
                                    Row(Modifier.padding(vertical = 7.dp)) {
                                        BasicText(term, Modifier.weight(1f), style = Typography.sm.copy(color = colors.mutedForeground))
                                        BasicText(
                                            value,
                                            style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                    Separator()
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}
