package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartLayout
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private class ForecastDay(val day: String, val low: Int, val high: Int)

private val chartData = listOf(
    ForecastDay("Today", 14, 22),
    ForecastDay("Wed", 13, 21),
    ForecastDay("Thu", 15, 24),
    ForecastDay("Fri", 16, 25),
    ForecastDay("Sat", 14, 20),
    ForecastDay("Sun", 11, 17),
    ForecastDay("Mon", 10, 16),
    ForecastDay("Tue", 12, 19),
)

private val chartConfig = ChartConfig(
    "range" to ChartConfigItem("Temperature"),
)

@Composable
fun BarChartRange(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val tick = TextStyle(color = colors.label, fontWeight = FontWeight.SemiBold)
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("8-day forecast", description = "Each bar spans the low and high")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(240.dp),
            ) {
                BarChart(
                    chartData,
                    layout = ChartLayout.Vertical,
                    barCategoryGap = 7.dp,
                    margin = ChartMargin(0.dp, 0.dp, 0.dp, 0.dp),
                    accessibilityLabel = "8-day forecast",
                ) {
                    YAxis(label = { it.day }, tickStyle = tick)
                    YAxis(label = { "${it.high}°" }, orientation = ChartAxisOrientation.Right, tickStyle = tick)
                    XAxis(domain = 8.0..27.0)
                    ChartTooltip(cursor = null) {
                        ChartTooltipContent(
                            hideIndicator = true,
                            formatter = { item ->
                                BasicText(
                                    "${item.base?.toInt()}° to ${item.value.toInt()}°",
                                    style = Typography.xs.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            },
                        )
                    }
                    Bar(
                        "range",
                        value = { it.high.toDouble() },
                        base = { it.low.toDouble() },
                        fill = ChartFill.HorizontalGradient(listOf(0f to colors.teal, 0.55f to colors.yellow, 1f to colors.orange)),
                        radius = ChartRadius(99.dp),
                        background = colors.control,
                    )
                }
            }
        }
    }
}
