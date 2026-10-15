package com.esuiss.ui.charts

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartAxisOrientation
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartTooltipContent
import com.esuiss.ui.components.LineChart
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private class LineDotsRow(val month: String, val weight: Double)

private val months = listOf("Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec")

private val chartData = listOf(82.4, 81.6, 81.9, 80.8, 80.1, 79.6, 79.8, 78.9, 78.4, 77.9)
    .mapIndexed { index, weight -> LineDotsRow(months[index], weight) }

private val chartConfig = ChartConfig(
    "weight" to ChartConfigItem("Weight") { Palette.purple500 },
)

@Composable
fun LineChartDots(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val number = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum")
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardContent {
            Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                BasicText(
                    "Weight",
                    style = Typography.sm.copy(
                        color = if (colors.isDark) Palette.purple500 else lerp(Palette.purple500, colors.foreground, 0.15f),
                        fontWeight = FontWeight.SemiBold,
                    ),
                )
                Row(horizontalArrangement = Arrangement.spacedBy(4.dp)) {
                    BasicText("77.9", Modifier.alignByBaseline(), style = number)
                    BasicText(
                        "kg",
                        Modifier.alignByBaseline(),
                        style = Typography.base.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                    )
                }
                BasicText("Down 4.5 kg since January", style = Typography.sm.copy(color = colors.mutedForeground))
            }
        }
        CardContent {
            ChartContainer(
                chartConfig,
                Modifier
                    .fillMaxWidth()
                    .height(160.dp),
            ) {
                LineChart(
                    chartData,
                    margin = ChartMargin(top = 10.dp, right = 4.dp, bottom = 0.dp, left = 12.dp),
                    accessibilityLabel = "Weight",
                ) {
                    CartesianGrid(strokeDasharray = listOf(2f, 4f))
                    XAxis(label = { it.month }, tickMargin = 8.dp, interval = 2)
                    YAxis(
                        orientation = ChartAxisOrientation.Right,
                        tickMargin = 6.dp,
                        domain = 76.0..84.0,
                        ticks = listOf(76.0, 80.0, 84.0),
                        tickFormatter = { it.toInt().toString() },
                    )
                    ChartTooltip {
                        ChartTooltipContent(
                            hideIndicator = true,
                            formatter = { item ->
                                BasicText(
                                    "${item.value} kg",
                                    style = Typography.xs.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                )
                            },
                        )
                    }
                    Line(
                        "weight",
                        value = { it.weight },
                        strokeWidth = 2.dp,
                        dot = ChartDot(3.5.dp),
                        activeDot = ChartDot(5.dp),
                    )
                }
            }
        }
    }
}
