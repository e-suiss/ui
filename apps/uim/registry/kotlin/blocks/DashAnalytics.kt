package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.CaretDown
import com.adamglin.phosphoricons.bold.Flame
import com.adamglin.phosphoricons.bold.NotePencil
import com.adamglin.phosphoricons.bold.ChartBar as BoldChartBar
import com.adamglin.phosphoricons.fill.ChartBar as FillChartBar
import com.adamglin.phosphoricons.fill.Star as FillStar
import com.adamglin.phosphoricons.fill.Tag as FillTag
import com.adamglin.phosphoricons.regular.ChartBar
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Tag
import com.esuiss.ui.components.AreaChart
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartCursor
import com.esuiss.ui.components.ChartDot
import com.esuiss.ui.components.ChartFill
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyDescription
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.util.Locale
import kotlin.math.roundToLong

private class AnalyticsApp(val value: String, val label: String, val icon: ImageVector, val tint: Colors.() -> Color)

private val AnalyticsApps = listOf(
    AnalyticsApp("route", "Route", PhosphorIcons.Bold.BoldChartBar) { green },
    AnalyticsApp("notebook", "Notebook", PhosphorIcons.Bold.NotePencil) { orange },
    AnalyticsApp("fitness", "Fitness+", PhosphorIcons.Bold.Flame) { red },
)

private class AnalyticsMetric(val value: String, val label: String, val unit: String, val data: List<Double>)

private val AnalyticsMetrics = listOf(
    AnalyticsMetric("impressions", "Impressions", "K", listOf(12.0, 14.0, 13.0, 18.0, 17.0, 22.0, 25.0, 24.0, 28.0, 31.0, 29.0, 34.0)),
    AnalyticsMetric("downloads", "Downloads", "K", listOf(2.1, 2.4, 2.2, 3.1, 2.9, 3.8, 4.2, 4.0, 4.6, 5.1, 4.8, 5.6)),
    AnalyticsMetric("revenue", "Revenue", "K $", listOf(8.0, 9.0, 9.0, 11.0, 12.0, 14.0, 15.0, 15.0, 17.0, 19.0, 18.0, 21.0)),
    AnalyticsMetric("sessions", "Sessions", "K", listOf(40.0, 42.0, 41.0, 47.0, 48.0, 55.0, 58.0, 57.0, 62.0, 66.0, 64.0, 71.0)),
)

private val AnalyticsRegions = listOf(
    "United States" to 0.46,
    "Germany" to 0.21,
    "United Kingdom" to 0.14,
    "Netherlands" to 0.09,
)

private val AnalyticsConfig = ChartConfig("value" to ChartConfigItem("Value") { accent })

private fun analyticsData(metric: AnalyticsMetric, app: String): List<Double> {
    val appIndex = AnalyticsApps.indexOfFirst { it.value == app }.coerceAtLeast(0)
    return metric.data.map { (it * (1 - appIndex * 0.28) * 100).roundToLong() / 100.0 }
}

@Composable
fun DashAnalytics(
    modifier: Modifier = Modifier,
    onAppChange: (app: String) -> Unit = {},
    onMetricChange: (metric: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    var app by rememberSaveable { mutableStateOf("route") }
    var metric by rememberSaveable { mutableStateOf("downloads") }
    var active by remember { mutableStateOf<Int?>(null) }
    var menu by remember { mutableStateOf(false) }
    val current = AnalyticsMetrics.firstOrNull { it.value == metric } ?: AnalyticsMetrics[1]
    val selectedApp = AnalyticsApps.firstOrNull { it.value == app } ?: AnalyticsApps[0]
    val data = analyticsData(current, app)
    val last = data.lastIndex
    val index = active ?: last
    val latest = data[last]
    fun format(value: Double) = "${String.format(Locale.US, "%.1f", value)} ${current.unit}"

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        DashTabs(
            home = "analytics",
            homeLabel = "Analytics",
            onNavigate = onNavigate,
            tabs = {
                TabBarItem("analytics", "Analytics", PhosphorIcons.Regular.ChartBar, selectedIcon = PhosphorIcons.Fill.FillChartBar)
                TabBarItem("sales", "Sales and Trends", PhosphorIcons.Regular.Tag, selectedIcon = PhosphorIcons.Fill.FillTag)
                TabBarItem("ratings", "Ratings", PhosphorIcons.Regular.Star, selectedIcon = PhosphorIcons.Fill.FillStar)
            },
        ) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle(selectedApp.label)
                    HeaderLargeTitle(selectedApp.label, subtitle = "Last 12 weeks · All regions")
                    HeaderActions {
                        DropdownMenu(
                            expanded = menu,
                            onExpandedChange = { menu = it },
                            align = PopupAlign.End,
                            trigger = {
                                Row(
                                    Modifier
                                        .height(44.dp)
                                        .clickable(
                                            interactionSource = remember { MutableInteractionSource() },
                                            indication = null,
                                            role = Role.Button,
                                        ) { menu = true }
                                        .semantics {
                                            contentDescription = "Apps"
                                            stateDescription = selectedApp.label
                                        }
                                        .padding(horizontal = 8.dp),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalAlignment = Alignment.CenterVertically,
                                ) {
                                    AppTile(selectedApp)
                                    Icon(PhosphorIcons.Bold.CaretDown, contentDescription = null, size = 12.dp, tint = colors.labelSecondary)
                                }
                            },
                        ) {
                            DropdownMenuLabel("Apps")
                            DropdownMenuRadioGroup(
                                value = app,
                                onValueChange = { value ->
                                    if (value != app) {
                                        onAppChange(value)
                                        app = value
                                        active = null
                                    }
                                },
                            ) {
                                for (item in AnalyticsApps) {
                                    DropdownMenuRadioItem(item.value, closeOnClick = true) {
                                        AppTile(item)
                                        BasicText(item.label, style = LocalContentStyle.current, maxLines = 1)
                                    }
                                }
                            }
                        }
                    }
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 24.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    Row(Modifier.horizontalScroll(rememberScrollState())) {
                        ToggleGroup(
                            value = metric,
                            onValueChange = { value ->
                                if (value != null && value != metric) {
                                    onMetricChange(value)
                                    metric = value
                                }
                            },
                            modifier = Modifier.semantics { contentDescription = "Metric" },
                            size = ToggleSize.Sm,
                            spacing = 0,
                        ) {
                            for (item in AnalyticsMetrics) ToggleGroupItem(item.label, item.value)
                        }
                    }
                    Column(
                        Modifier
                            .fillMaxWidth()
                            .background(colors.surfaceSecondary, RoundedCornerShape(Radius.xl))
                            .padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 10.dp),
                        verticalArrangement = Arrangement.spacedBy(12.dp),
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.Bottom) {
                            Column(
                                Modifier
                                    .weight(1f)
                                    .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
                            ) {
                                BasicText(
                                    "${if (index == last) "This week" else "Week ${index + 1}"} · ${current.label}",
                                    style = Typography.sm.copy(color = colors.labelSecondary),
                                )
                                BasicText(
                                    format(data[index]),
                                    style = Typography.xl3.copy(color = colors.label, fontWeight = FontWeight.Bold, fontFeatureSettings = "tnum"),
                                )
                            }
                            BasicText(
                                "+${12 + AnalyticsMetrics.indexOf(current) * 3}%",
                                style = Typography.sm.copy(color = colors.success, fontWeight = FontWeight.SemiBold),
                            )
                        }
                        ChartContainer(
                            AnalyticsConfig,
                            Modifier
                                .fillMaxWidth()
                                .height(176.dp),
                        ) {
                            AreaChart(
                                data.indices.toList(),
                                margin = ChartMargin(top = 8.dp, right = 6.dp, bottom = 6.dp, left = 6.dp),
                                accessibilityLabel = current.label,
                                selectedIndex = index,
                                onSelectedIndexChange = { active = it },
                            ) {
                                CartesianGrid(strokeDasharray = listOf(2f, 4f))
                                XAxis(label = { "Week ${it + 1}" }, hide = true)
                                ChartTooltip(cursor = ChartCursor()) {}
                                Area(
                                    "value",
                                    value = { data[it] },
                                    strokeWidth = 2.5.dp,
                                    fill = ChartFill.VerticalGradient(topAlpha = 0.22f, bottomAlpha = 0f),
                                    activeDot = ChartDot(6.dp, strokeColor = colors.surfaceSecondary, strokeWidth = 2.dp),
                                )
                            }
                        }
                    }
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        BasicText(
                            "By region",
                            Modifier
                                .padding(horizontal = 4.dp)
                                .semantics { heading() },
                            style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                        )
                        ItemGroup(variant = ItemGroupVariant.Inset) {
                            AnalyticsRegions.forEachIndexed { position, (name, share) ->
                                if (position > 0) ItemSeparator()
                                Item(size = ItemSize.Sm) {
                                    ItemContent { ItemTitle(name) }
                                    ItemActions {
                                        BasicText(
                                            format(latest * share),
                                            style = Typography.base.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"),
                                        )
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun AppTile(app: AnalyticsApp) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(24.dp)
            .background(app.tint(colors), RoundedCornerShape(Radius.md)),
        contentAlignment = Alignment.Center,
    ) {
        Icon(app.icon, contentDescription = null, size = 14.dp, tint = colors.onAccent)
    }
}

@Composable
internal fun DashTabs(
    home: String,
    homeLabel: String,
    onNavigate: (String) -> Unit,
    tabs: @Composable RowScope.() -> Unit,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    var tab by rememberSaveable { mutableStateOf(home) }
    Column(Modifier.fillMaxSize()) {
        Box(
            Modifier
                .weight(1f)
                .fillMaxWidth(),
        ) {
            if (tab == home) {
                content()
            } else {
                Empty(
                    Modifier
                        .fillMaxSize()
                        .background(colors.surface),
                ) {
                    EmptyHeader {
                        EmptyDescription("This section isn't part of the sample. Choose $homeLabel.")
                    }
                }
            }
        }
        TabBar(
            value = tab,
            onValueChange = { value ->
                if (value != tab) {
                    onNavigate(value)
                    tab = value
                }
            },
            content = tabs,
        )
    }
}
