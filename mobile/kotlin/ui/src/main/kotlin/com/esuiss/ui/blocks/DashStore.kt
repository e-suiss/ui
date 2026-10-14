package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.horizontalScroll
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.IntrinsicSize
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.TextAutoSize
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.ChartBar as FillChartBar
import com.adamglin.phosphoricons.fill.Handbag as FillHandbag
import com.adamglin.phosphoricons.fill.House as FillHouse
import com.adamglin.phosphoricons.fill.Users as FillUsers
import com.adamglin.phosphoricons.regular.ChartBar
import com.adamglin.phosphoricons.regular.Handbag
import com.adamglin.phosphoricons.regular.House
import com.adamglin.phosphoricons.regular.Storefront
import com.adamglin.phosphoricons.regular.Users
import com.esuiss.ui.components.BarChart
import com.esuiss.ui.components.ChartCell
import com.esuiss.ui.components.ChartConfig
import com.esuiss.ui.components.ChartConfigItem
import com.esuiss.ui.components.ChartContainer
import com.esuiss.ui.components.ChartMargin
import com.esuiss.ui.components.ChartRadius
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.PopupAlign
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.util.Locale
import kotlin.math.roundToLong

private val StoreEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class StoreRange(val value: String, val label: String, val scale: Double)

private val StoreRanges = listOf(
    StoreRange("24h", "24 Hours", 0.15),
    StoreRange("7d", "7 Days", 1.0),
    StoreRange("30d", "30 Days", 4.3),
)

private class StoreDay(val day: String, val online: Double, val store: Double)

private val StoreWeek = listOf(
    StoreDay("Mon", 42.0, 46.0),
    StoreDay("Tue", 58.0, 44.0),
    StoreDay("Wed", 50.0, 56.0),
    StoreDay("Thu", 68.0, 54.0),
    StoreDay("Fri", 64.0, 70.0),
    StoreDay("Sat", 80.0, 62.0),
    StoreDay("Sun", 72.0, 76.0),
)

private val StoreNames = listOf("Union Square", "Fifth Avenue", "Michigan Avenue")

private class StoreOrder(
    val id: String,
    val name: String,
    val product: String,
    val status: String,
    val total: Double,
    val tint: Colors.() -> Color,
)

private val StoreOrders = listOf(
    StoreOrder("W1048", "Jamie Rivera", "Phone Pro", "Shipped", 999.0) { indigo },
    StoreOrder("W1047", "Morgan Lee", "Book Air", "Processing", 1099.0) { orange },
    StoreOrder("W1046", "Riley Chen", "Watch Series 11", "Delivered", 399.0) { green },
    StoreOrder("W1045", "Avery Brooks", "Pods Studio", "Returned", 549.0) { pink },
    StoreOrder("W1044", "Taylor Kim", "Pad Air", "Delivered", 599.0) { cyan },
)

private val StoreFilters = listOf("All", "Shipped", "Delivered", "Returned")

private val StoreConfig = ChartConfig(
    "online" to ChartConfigItem("Online") { blue },
    "store" to ChartConfigItem("In store") { teal },
)

private class StoreStat(val label: String, val value: String, val change: String, val up: Boolean)

private fun money(value: Double): String {
    val format = NumberFormat.getCurrencyInstance(Locale.US)
    format.maximumFractionDigits = 0
    format.minimumFractionDigits = 0
    return format.format(value)
}

@Composable
fun DashStore(
    modifier: Modifier = Modifier,
    onRangeChange: (range: String) -> Unit = {},
    onFilterChange: (status: String) -> Unit = {},
    onStoreChange: (store: String?) -> Unit = {},
    onOrderPress: (id: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    var range by rememberSaveable { mutableStateOf("7d") }
    var filter by rememberSaveable { mutableStateOf("All") }
    var store by rememberSaveable { mutableStateOf("") }
    var menu by remember { mutableStateOf(false) }
    val scale = StoreRanges.firstOrNull { it.value == range }?.scale ?: 1.0
    val stats = listOf(
        StoreStat("Revenue", money(1284500 * scale), "+12.4%", true),
        StoreStat("Orders", NumberFormat.getNumberInstance(Locale.US).format((842 * scale).roundToLong()), "+8.1%", true),
        StoreStat("Average order", money(1525.0), "−2.3%", false),
        StoreStat("Conversion", "3.42%", "+0.4 pts", true),
    )

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        DashTabs(
            home = "overview",
            homeLabel = "Overview",
            onNavigate = onNavigate,
            tabs = {
                TabBarItem("overview", "Overview", PhosphorIcons.Regular.House, selectedIcon = PhosphorIcons.Fill.FillHouse)
                TabBarItem("orders", "Orders", PhosphorIcons.Regular.Handbag, selectedIcon = PhosphorIcons.Fill.FillHandbag, badge = "12")
                TabBarItem("customers", "Customers", PhosphorIcons.Regular.Users, selectedIcon = PhosphorIcons.Fill.FillUsers)
                TabBarItem("reports", "Reports", PhosphorIcons.Regular.ChartBar, selectedIcon = PhosphorIcons.Fill.FillChartBar)
            },
        ) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle("Overview")
                    HeaderLargeTitle("Overview", subtitle = store.ifEmpty { "All stores" })
                    HeaderActions {
                        DropdownMenu(
                            expanded = menu,
                            onExpandedChange = { menu = it },
                            align = PopupAlign.End,
                            trigger = {
                                Box(
                                    Modifier
                                        .size(44.dp)
                                        .clickable(
                                            interactionSource = remember { MutableInteractionSource() },
                                            indication = null,
                                            role = Role.Button,
                                        ) { menu = true }
                                        .semantics { contentDescription = "Stores" },
                                    contentAlignment = Alignment.Center,
                                ) {
                                    Icon(PhosphorIcons.Regular.Storefront, contentDescription = null, size = 22.dp, tint = colors.label)
                                }
                            },
                        ) {
                            DropdownMenuLabel("Stores")
                            DropdownMenuRadioGroup(
                                value = store,
                                onValueChange = { value ->
                                    if (value != store) {
                                        onStoreChange(value.ifEmpty { null })
                                        store = value
                                    }
                                },
                            ) {
                                DropdownMenuRadioItem("", closeOnClick = true) {
                                    BasicText("All stores", style = LocalContentStyle.current, maxLines = 1)
                                }
                                for (name in StoreNames) {
                                    DropdownMenuRadioItem(name, closeOnClick = true) {
                                        BasicText(name, style = LocalContentStyle.current, maxLines = 1)
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
                    ToggleGroup(
                        value = range,
                        onValueChange = { value ->
                            if (value != null && value != range) {
                                onRangeChange(value)
                                range = value
                            }
                        },
                        modifier = Modifier.semantics { contentDescription = "Range" },
                        size = ToggleSize.Sm,
                        spacing = 0,
                    ) {
                        for (item in StoreRanges) ToggleGroupItem(item.label, item.value)
                    }
                    StatGrid(stats)
                    WeeklySales(scale)
                    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                        BasicText(
                            "Recent orders",
                            Modifier
                                .padding(horizontal = 4.dp)
                                .semantics { heading() },
                            style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                        )
                        Row(Modifier.horizontalScroll(rememberScrollState())) {
                            ToggleGroup(
                                value = filter,
                                onValueChange = { value ->
                                    if (value != null && value != filter) {
                                        onFilterChange(value)
                                        filter = value
                                    }
                                },
                                modifier = Modifier.semantics { contentDescription = "Order status" },
                                size = ToggleSize.Sm,
                                spacing = 0,
                            ) {
                                for (item in StoreFilters) ToggleGroupItem(item, item)
                            }
                        }
                    }
                    ItemGroup(variant = ItemGroupVariant.Inset) {
                        val visible = StoreOrders.filter { filter == "All" || it.status == filter }
                        for (order in StoreOrders) {
                            key(order.id) {
                                AnimatedVisibility(
                                    visible = order in visible,
                                    enter = fadeIn(tween(300)) + expandVertically(tween(500, easing = StoreEasing)),
                                    exit = fadeOut(tween(200)) + shrinkVertically(tween(500, easing = StoreEasing)),
                                ) {
                                    Column {
                                        if (visible.firstOrNull() != order) {
                                            Box(
                                                Modifier
                                                    .padding(start = 60.dp)
                                                    .fillMaxWidth()
                                                    .height(1.dp)
                                                    .background(colors.separator),
                                            )
                                        }
                                        OrderRow(order) { onOrderPress(order.id) }
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
private fun StatGrid(stats: List<StoreStat>) {
    val colors = EsuissTheme.colors
    val divider = Modifier
        .background(colors.separator)
    Column(
        Modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(Radius.xl))
            .background(colors.surfaceSecondary),
    ) {
        for (row in 0 until 2) {
            if (row > 0) Box(divider.fillMaxWidth().height(1.dp))
            Row(Modifier.height(IntrinsicSize.Min)) {
                StatCell(stats[row * 2], Modifier.weight(1f))
                Box(divider.width(1.dp).fillMaxHeight())
                StatCell(stats[row * 2 + 1], Modifier.weight(1f))
            }
        }
    }
}

@Composable
private fun StatCell(stat: StoreStat, modifier: Modifier) {
    val colors = EsuissTheme.colors
    Column(
        modifier
            .semantics(mergeDescendants = true) {}
            .padding(horizontal = 16.dp, vertical = 14.dp),
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        BasicText(stat.label, style = Typography.sm.copy(color = colors.labelSecondary))
        BasicText(
            stat.value,
            style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
            maxLines = 1,
            autoSize = TextAutoSize.StepBased(
                minFontSize = Typography.lg.fontSize,
                maxFontSize = Typography.xl2.fontSize,
            ),
        )
        BasicText(
            "${stat.change} vs. previous period",
            style = Typography.xs.copy(color = if (stat.up) colors.success else colors.danger),
        )
    }
}

@Composable
private fun WeeklySales(scale: Double) {
    val colors = EsuissTheme.colors
    var active by remember { mutableStateOf<Int?>(null) }
    val day = active?.let { StoreWeek[it] }
    Column(
        Modifier
            .fillMaxWidth()
            .background(colors.surfaceSecondary, RoundedCornerShape(Radius.xl))
            .padding(start = 16.dp, end = 16.dp, top = 14.dp, bottom = 8.dp),
        verticalArrangement = Arrangement.spacedBy(14.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.Top) {
            Column(
                Modifier
                    .weight(1f)
                    .semantics(mergeDescendants = true) { liveRegion = LiveRegionMode.Polite },
            ) {
                BasicText(day?.day ?: "Weekly sales", style = Typography.sm.copy(color = colors.labelSecondary))
                BasicText(
                    day?.let { money((it.online + it.store) * 1000) } ?: money(1284500 * scale),
                    style = Typography.xl2.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                )
            }
            Row(Modifier.clearAndSetSemantics {}, horizontalArrangement = Arrangement.spacedBy(12.dp)) {
                for (key in StoreConfig.keys) {
                    Row(horizontalArrangement = Arrangement.spacedBy(5.dp), verticalAlignment = Alignment.CenterVertically) {
                        Box(
                            Modifier
                                .size(8.dp)
                                .background(StoreConfig[key]?.color?.invoke(colors) ?: colors.labelSecondary, CircleShape),
                        )
                        BasicText(StoreConfig[key]?.label ?: key, style = Typography.xs.copy(color = colors.labelSecondary))
                    }
                }
            }
        }
        ChartContainer(
            StoreConfig,
            Modifier
                .fillMaxWidth()
                .height(160.dp),
        ) {
            BarChart(
                StoreWeek,
                margin = ChartMargin(top = 5.dp, right = 0.dp, bottom = 0.dp, left = 0.dp),
                barGap = 3.dp,
                accessibilityLabel = "Weekly sales",
                selectedIndex = active,
                onSelectedIndexChange = { active = it },
            ) {
                CartesianGrid(strokeDasharray = listOf(2f, 4f))
                XAxis(label = { it.day }, tickMargin = 8.dp, interval = 0)
                for (series in listOf("online", "store")) {
                    Bar(
                        series,
                        value = { if (series == "online") it.online * 1000 else it.store * 1000 },
                        radius = ChartRadius(3.dp),
                        barSize = 12.dp,
                        cells = { index -> ChartCell(alpha = if (active == null || active == index) 1f else 0.35f) },
                        isAnimationActive = false,
                    )
                }
            }
        }
    }
}

@Composable
private fun OrderRow(order: StoreOrder, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    Item(size = ItemSize.Sm, onClick = onClick) {
        ItemMedia {
            Box(
                Modifier
                    .size(32.dp)
                    .background(order.tint(colors), CircleShape)
                    .clearAndSetSemantics {},
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    order.name.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                    style = Typography.sm.copy(color = colors.onAccent, fontWeight = FontWeight.SemiBold),
                )
            }
        }
        ItemContent {
            ItemTitle(order.name)
            ItemDescription("${order.product} · ${order.id}")
        }
        ItemActions {
            Column(horizontalAlignment = Alignment.End) {
                BasicText(
                    money(order.total),
                    style = Typography.base.copy(color = colors.label, fontFeatureSettings = "tnum"),
                    maxLines = 1,
                    overflow = TextOverflow.Clip,
                )
                BasicText(
                    order.status,
                    style = Typography.sm.copy(color = if (order.status == "Returned") colors.danger else colors.labelSecondary),
                )
            }
        }
    }
}
