package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCurve
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.ChartTooltipIndicator
import com.esuiss.ui.components.LineChart
import com.esuiss.ui.theme.EsuissTheme

private class LineForecastRow(val month: String, val actual: Double?, val forecast: Double?)

private val actual = listOf(12.0, 14.0, 13.0, 17.0, 19.0, 22.0, 24.0, 23.0, 26.0)

private val forecast = listOf(26.0, 28.0, 30.0, 33.0)

private val chartData = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")
    .mapIndexed { index, month ->
        LineForecastRow(month, actual.getOrNull(index), if (index >= 8) forecast[index - 8] else null)
    }

private val chartConfig = ChartConfig(
    "actual" to ChartConfigItem("Actual") { blue },
    "forecast" to ChartConfigItem("Forecast") { blue },
)

@Composable
fun LineChartForecast(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Actual and forecast", description = "The dashed line is the forecast")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 12.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "Actual and forecast",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 2)
                    ChartTooltip { ChartTooltipContent(indicator = ChartTooltipIndicator.Line) }
                    ReferenceArea(8, 11, fill = colors.control, fillOpacity = 0.6f)
                    Line("actual", value = { it.actual }, curve = ChartCurve.Monotone, strokeWidth = 2.5.dp)
                    Line(
                        "forecast",
                        value = { it.forecast },
                        curve = ChartCurve.Monotone,
                        strokeWidth = 2.5.dp,
                        strokeDasharray = listOf(5f, 5f),
                    )
                }
            }
        }
    }
}
