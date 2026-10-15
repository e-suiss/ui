package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartCell
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale

private class StepsDay(val day: String, val steps: Double)

private val chartData = listOf(
    StepsDay("Monday", 8412.0),
    StepsDay("Tuesday", 10230.0),
    StepsDay("Wednesday", 6120.0),
    StepsDay("Thursday", 12480.0),
    StepsDay("Friday", 9050.0),
    StepsDay("Saturday", 14320.0),
    StepsDay("Sunday", 4870.0),
)

private val chartConfig = ChartConfig(
    "steps" to ChartConfigItem("Steps") { chart4 },
)

@Composable
fun BarChartActive(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    var selected by remember { mutableIntStateOf(5) }
    val day = chartData[selected]
    val stepsFormat = remember { NumberFormat.getNumberInstance(Locale.US) }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText(
                    "Steps",
                    style = Typography.sm.copy(
                        color = if (colors.isDark) colors.chart4 else lerp(colors.chart4, colors.foreground, 0.45f),
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
                Row(
                    Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                    horizontalArrangement = Arrangement.spacedBy(4.dp),
                ) {
                    BasicText(
                        stepsFormat.format(day.steps),
                        Modifier.alignByBaseline(),
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                    )
                    BasicText(
                        "steps",
                        Modifier.alignByBaseline(),
                        style = Typography.base.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                    )
                }
                BasicText("${day.day} · select a bar", style = Typography.sm.copy(color = colors.mutedForeground))
            }
        }
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(160.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                    accessibilityLabel = "Steps",
                    selectedIndex = selected,
                    onSelectedIndexChange = { index -> if (index != null) selected = index },
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0, tickFormatter = { it.take(3) })
                    Bar(
                        "steps",
                        value = { it.steps },
                        radius = ChartRadius(5.dp),
                        maxBarSize = 28.dp,
                        cells = { index -> ChartCell(alpha = if (index == selected) 1f else 0.3f) },
                        isAnimationActive = false,
                    )
                }
            }
        }
    }
}
