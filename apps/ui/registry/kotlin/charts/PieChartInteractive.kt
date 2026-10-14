package com.esuiss.ui.charts

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.snap
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.State
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartSector
import com.esuiss.ui.components.PieChart
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.util.Locale
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

private class PieInteractiveStorage(val label: String, val total: Double, val used: Map<String, Double>)

private val kinds = listOf("apps", "photos", "system", "backups", "drive", "messages", "mail", "other", "free")

private val storage = linkedMapOf(
    "phone" to PieInteractiveStorage(
        "Phone",
        256.0,
        mapOf("apps" to 62.4, "photos" to 48.1, "system" to 25.8, "messages" to 9.8, "other" to 6.3),
    ),
    "cloud" to PieInteractiveStorage(
        "Cloud",
        200.0,
        mapOf("photos" to 96.2, "backups" to 31.4, "drive" to 18.7, "messages" to 7.9, "mail" to 2.3),
    ),
)

private val chartConfig = ChartConfig(
    "apps" to ChartConfigItem("Apps") { red },
    "photos" to ChartConfigItem("Photos") { orange },
    "system" to ChartConfigItem("System") { gray },
    "backups" to ChartConfigItem("Backups") { purple },
    "drive" to ChartConfigItem("Drive") { blue },
    "messages" to ChartConfigItem("Messages") { green },
    "mail" to ChartConfigItem("Mail") { cyan },
    "other" to ChartConfigItem("Other") { yellow },
    "free" to ChartConfigItem("Free") { control },
)

private val MorphEasing = CubicBezierEasing(0.65f, 0f, 0.35f, 1f)

private fun sizes(device: String): List<Double> {
    val entry = storage.getValue(device)
    val taken = entry.used.values.sum()
    return kinds.map { if (it == "free") entry.total - taken else entry.used[it] ?: 0.0 }
}

private fun gigabytes(value: Double) = String.format(Locale.US, "%.1f", max(0.0, value))

@Composable
fun PieChartInteractive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val reduced = formReducedMotion()
    var device by remember { mutableStateOf("phone") }
    var active by remember { mutableStateOf<Int?>(null) }
    val target = sizes(device)
    val values: List<State<Float>> = kinds.indices.map { index ->
        animateFloatAsState(
            target[index].toFloat(),
            if (reduced) snap() else tween(700, easing = MorphEasing),
            label = "size",
        )
    }
    val lifts: List<State<Float>> = kinds.indices.map { index ->
        animateFloatAsState(
            if (active == index) 1f else 0f,
            if (reduced) snap() else tween(260, easing = MorphEasing),
            label = "lift",
        )
    }
    val sizes = values.map { it.value.toDouble() }
    val total = sizes.sum()
    val used = total - sizes.last()
    val value = active?.let { sizes[it] } ?: used
    val swatch = { kind: String -> chartConfig[kind]?.color?.invoke(colors) ?: colors.labelSecondary }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.Top) {
                Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp)) {
                    BasicText(
                        "${storage.getValue(device).label} storage",
                        style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                    )
                    BasicText(
                        "${gigabytes(target.sum() - target.last())} GB of ${storage.getValue(device).total.toInt()} GB used",
                        style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"),
                    )
                }
                ToggleGroup(
                    value = device,
                    onValueChange = { next ->
                        if (next != null) {
                            device = next
                            active = null
                        }
                    },
                    modifier = Modifier.semantics { contentDescription = "Device" },
                    size = ToggleSize.Sm,
                    spacing = 0,
                ) {
                    for ((key, entry) in storage) ToggleGroupItem(entry.label, key)
                }
            }
        }
        CardContent(Modifier.padding(top = 20.dp)) {
            Column(verticalArrangement = Arrangement.spacedBy(20.dp)) {
                StorageBar(sizes, total, active)
                Box(
                    Modifier
                        .align(Alignment.CenterHorizontally)
                        .size(280.dp),
                ) {
                    ChartContainer(chartConfig, Modifier.matchParentSize()) {
                        PieChart(
                            accessibilityLabel = "${storage.getValue(device).label} storage",
                            selectedIndex = active,
                            onSelectedIndexChange = { active = it },
                        ) {
                            Pie(
                                kinds.indices.toList(),
                                value = { max(0.0, sizes[it]) },
                                nameKey = { kinds[it] },
                                innerRadius = 0.64f,
                                outerRadius = 0.88f,
                                startAngle = 90f,
                                endAngle = -270f,
                                stroke = colors.surfaceSecondary,
                                strokeWidth = 3.dp,
                                cornerRadius = 4.dp,
                                sectors = { index -> ChartSector(lift = 7.dp * lifts[index].value) },
                                isAnimationActive = false,
                            )
                        }
                    }
                    Column(
                        Modifier
                            .align(Alignment.Center)
                            .widthIn(max = 160.dp)
                            .semantics { liveRegion = LiveRegionMode.Polite },
                        horizontalAlignment = Alignment.CenterHorizontally,
                    ) {
                        BasicText(
                            active?.let { chartConfig[kinds[it]]?.label } ?: "Used",
                            style = Typography.sm.copy(color = colors.labelSecondary),
                        )
                        BasicText(
                            "${gigabytes(value)} GB",
                            style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                            maxLines = 1,
                        )
                        BasicText(
                            "${(value / max(total, 1.0) * 100).roundToInt()}%",
                            style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"),
                        )
                    }
                }
                Column {
                    kinds.forEachIndexed { index, kind ->
                        AnimatedVisibility(
                            visible = target[index] > 0,
                            enter = fadeIn(tween(500)) + expandVertically(tween(500, easing = MorphEasing)),
                            exit = fadeOut(tween(500)) + shrinkVertically(tween(500, easing = MorphEasing)),
                        ) {
                            StorageRow(
                                label = chartConfig[kind]?.label ?: kind,
                                value = "${gigabytes(sizes[index])} GB",
                                color = swatch(kind),
                                free = kind == "free",
                                selected = active == index,
                                onClick = { active = if (active == index) null else index },
                            )
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun StorageBar(sizes: List<Double>, total: Double, active: Int?) {
    val colors = EsuissTheme.colors
    Layout(
        content = {
            kinds.indices.toList().dropLast(1).forEach { index ->
                Box(
                    Modifier
                        .fillMaxHeight()
                        .graphicsLayer { alpha = if (active == null || active == index) 1f else 0.35f }
                        .background(chartConfig[kinds[index]]?.color?.invoke(colors) ?: colors.labelSecondary),
                )
            }
        },
        modifier = Modifier
            .fillMaxWidth()
            .height(10.dp)
            .clip(CircleShape)
            .background(colors.control)
            .clearAndSetSemantics {},
    ) { measurables, constraints ->
        val width = constraints.maxWidth
        val height = constraints.maxHeight
        var x = 0f
        val placed = measurables.mapIndexed { index, measurable ->
            val share = max(0.0, sizes[index]) / max(total, 1.0)
            val w = (width * share).toFloat()
            val placeable = measurable.measure(Constraints.fixed(w.roundToInt().coerceAtLeast(0), height))
            val start = x
            x += w + min(2.dp.toPx(), (share * 400).toFloat().dp.toPx())
            placeable to start
        }
        layout(width, height) {
            for ((placeable, start) in placed) placeable.place(start.roundToInt(), 0)
        }
    }
}

@Composable
private fun StorageRow(
    label: String,
    value: String,
    color: Color,
    free: Boolean,
    selected: Boolean,
    onClick: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.lg)
    Row(
        Modifier
            .fillMaxWidth()
            .clip(shape)
            .background(if (selected) colors.control else Color.Transparent, shape)
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                role = Role.Button,
                onClick = onClick,
            )
            .semantics { this.selected = selected }
            .padding(horizontal = 8.dp, vertical = 9.dp),
        horizontalArrangement = Arrangement.spacedBy(10.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Box(
            Modifier
                .size(10.dp)
                .background(color, CircleShape)
                .then(if (free) Modifier.border(1.dp, colors.separatorStrong, CircleShape) else Modifier),
        )
        BasicText(
            label,
            Modifier.weight(1f),
            style = Typography.base.copy(color = colors.label),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        BasicText(value, style = Typography.base.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"))
    }
}
