package com.esuiss.ui.charts

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.AreaChart
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.CardSize
import com.esuiss.ui.components.CardVariant
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.Separator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale

private class Stock(val symbol: String, val name: String, val price: Double, val change: Double, val seed: Long)

private class SparkPoint(val index: Int, val value: Double)

private val stocks = listOf(
    Stock("ACME", "Acme Corp.", 254.32, 1.28, 41),
    Stock("GLBX", "Globex", 512.08, -0.64, 52),
    Stock("INIT", "Initech", 186.4, 2.91, 63),
    Stock("UMBR", "Umbrella", 438.15, -1.87, 74),
)

private val chartConfig = ChartConfig(
    "up" to ChartConfigItem("Rising") { success },
    "down" to ChartConfigItem("Falling") { danger },
)

private fun series(seed: Long, rising: Boolean): List<SparkPoint> {
    var state = seed
    var value = 100.0
    return List(30) { index ->
        state = state * 16807 % 2147483647
        value *= 1 + ((state - 1) / 2147483646.0 - if (rising) 0.44 else 0.56) * 0.02
        SparkPoint(index, value)
    }
}

private fun twoDigits(): NumberFormat = NumberFormat.getNumberInstance(Locale.US).apply {
    minimumFractionDigits = 2
    maximumFractionDigits = 2
}

@Composable
private fun Sparkline(seed: Long, rising: Boolean) {
    val key = if (rising) "up" else "down"
    val data = remember(seed, rising) { series(seed, rising) }
    ChartContainer(
        chartConfig,
        Modifier
            .size(72.dp, 32.dp)
            .clearAndSetSemantics { },
    ) {
        AreaChart(data, margin = ChartMargin(top = 2.dp, right = 0.dp, bottom = 2.dp, left = 0.dp)) {
            YAxis(hide = true, domain = data.minOf { it.value }..data.maxOf { it.value })
            Area(
                key,
                value = { it.value },
                strokeWidth = 1.5.dp,
                fill = ChartFill.VerticalGradient(topAlpha = 0.25f, bottomAlpha = 0.02f),
                activeDot = null,
                isAnimationActive = false,
            )
        }
    }
}

@Composable
fun AreaChartSparkline(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val priceFormat = remember { twoDigits() }
    Card(modifier, variant = CardVariant.Filled, size = CardSize.Sm) {
        CardHeader("Watchlist", description = "Small area charts next to each price")
        CardContent {
            stocks.forEachIndexed { index, stock ->
                val rising = stock.change >= 0
                if (index > 0) Separator()
                Row(
                    Modifier
                        .fillMaxWidth()
                        .padding(vertical = 9.dp),
                    horizontalArrangement = Arrangement.spacedBy(12.dp),
                    verticalAlignment = Alignment.CenterVertically,
                ) {
                    Column(Modifier.weight(1f)) {
                        BasicText(stock.symbol, style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                        BasicText(
                            stock.name,
                            style = Typography.xs.copy(color = colors.labelSecondary),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                    Sparkline(stock.seed, rising)
                    Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(3.dp)) {
                        BasicText(
                            priceFormat.format(stock.price),
                            style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                        )
                        BasicText(
                            "${if (stock.change >= 0) "+" else "-"}${priceFormat.format(kotlin.math.abs(stock.change))}%",
                            Modifier
                                .widthIn(min = 52.dp)
                                .background(if (rising) colors.success else colors.danger, RoundedCornerShape(Radius.md))
                                .padding(horizontal = 6.dp, vertical = 2.dp),
                            style = Typography.xs.copy(
                                color = if (colors.isDark) colors.surface else colors.onAccent,
                                fontWeight = FontWeight.SemiBold,
                                fontFeatureSettings = "tnum",
                                textAlign = TextAlign.End,
                            ),
                        )
                    }
                }
            }
        }
    }
}
