package com.esuiss.ui.charts

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartCell
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.theme.EsuissTheme

private class CashFlow(val month: String, val flow: Double)

private val chartData = listOf(
    CashFlow("January", 42.0),
    CashFlow("February", -18.0),
    CashFlow("March", 26.0),
    CashFlow("April", 55.0),
    CashFlow("May", -31.0),
    CashFlow("June", 12.0),
    CashFlow("July", 38.0),
    CashFlow("August", -9.0),
    CashFlow("September", 47.0),
    CashFlow("October", 21.0),
    CashFlow("November", -14.0),
    CashFlow("December", 60.0),
)

private val chartConfig = ChartConfig(
    "flow" to ChartConfigItem("Cash flow"),
)

@Composable
fun BarChartNegative(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Positive and negative", description = "Monthly cash flow · thousands")
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(192.dp),
            ) {
                BarChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 4.dp),
                    accessibilityLabel = "Positive and negative",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 1, tickFormatter = { it.take(3) })
                    ReferenceLine(0.0, stroke = colors.separatorStrong)
                    ChartTooltip(cursor = null) { ChartTooltipContent(hideIndicator = true) }
                    Bar(
                        "flow",
                        value = { it.flow },
                        radius = ChartRadius(4.dp),
                        maxBarSize = 18.dp,
                        cells = { index -> ChartCell(if (chartData[index].flow >= 0) colors.green else colors.red) },
                    )
                }
            }
        }
    }
}
