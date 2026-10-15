package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.CaretRight
import com.adamglin.phosphoricons.bold.Handbag
import com.adamglin.phosphoricons.bold.NotePencil
import com.adamglin.phosphoricons.bold.Shield
import com.adamglin.phosphoricons.bold.Tag
import com.adamglin.phosphoricons.bold.User
import com.adamglin.phosphoricons.fill.ChartBar as FillChartBar
import com.adamglin.phosphoricons.fill.Gear as FillGear
import com.adamglin.phosphoricons.fill.Shield as FillShield
import com.adamglin.phosphoricons.fill.Users as FillUsers
import com.adamglin.phosphoricons.regular.ChartBar
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.Shield
import com.adamglin.phosphoricons.regular.Users
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ChipGroup
import com.esuiss.ui.components.Collapsible
import com.esuiss.ui.components.CollapsibleContent
import com.esuiss.ui.components.CollapsibleTrigger
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
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private val ActivityRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class ActivityKind(val value: String, val icon: ImageVector, val tint: (Colors) -> Color)

private val ActivityKinds = listOf(
    ActivityKind("Price", PhosphorIcons.Bold.Tag) { Palette.orange500 },
    ActivityKind("Content", PhosphorIcons.Bold.NotePencil) { Palette.blue500 },
    ActivityKind("Security", PhosphorIcons.Bold.Shield) { Palette.red500 },
    ActivityKind("Order", PhosphorIcons.Bold.Handbag) { Palette.green500 },
    ActivityKind("User", PhosphorIcons.Bold.User) { Palette.purple500 },
)

private class ActivityEvent(
    val day: String,
    val time: String,
    val actor: String,
    val action: String,
    val target: String,
    val kind: String,
    val diff: Pair<String, String>? = null,
)

private val ActivityEvents = listOf(
    ActivityEvent("Today", "9:41 AM", "Jamie Rivera", "updated", "Price: Phone Pro", "Price", "\$1,049" to "\$1,099"),
    ActivityEvent("Today", "9:12 AM", "Morgan Lee", "published", "Blog: October campaign", "Content"),
    ActivityEvent("Today", "8:55 AM", "System", "blocked", "5 failed sign-ins · 85.104.x.x", "Security"),
    ActivityEvent("Yesterday", "6:20 PM", "Riley Chen", "refunded", "Order W1044 · \$999", "Order"),
    ActivityEvent("Yesterday", "2:03 PM", "Jamie Rivera", "changed a role", "Taylor Kim: Editor → Viewer", "User", "Editor" to "Viewer"),
    ActivityEvent("Yesterday", "10:31 AM", "Jordan Park", "created", "Product: MagCharge Wallet", "Content"),
)

@Composable
fun LogActivity(
    modifier: Modifier = Modifier,
    onFilterChange: (filter: String) -> Unit = {},
    onExport: (filter: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    var filter by rememberSaveable { mutableStateOf("All") }
    val list = ActivityEvents.filter { filter == "All" || it.kind == filter }
    val days = list.map { it.day }.distinct()
    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("log", onNavigate) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle("Activity log")
                    HeaderLargeTitle("Activity log")
                    HeaderActions {
                        Button(text = "Export", onClick = { onExport(filter) }, size = ButtonSize.Sm, variant = ButtonVariant.Secondary)
                    }
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    ChipGroup(
                        value = filter,
                        onValueChange = { value ->
                            if (value != null && value != filter) {
                                onFilterChange(value)
                                filter = value
                            }
                        },
                        modifier = Modifier.padding(top = 8.dp),
                        scrollable = true,
                        contentPadding = PaddingValues(horizontal = 16.dp),
                    ) {
                        Chip("All", "All")
                        ActivityKinds.forEach { Chip(it.value, it.value, icon = it.icon) }
                    }
                    key(filter) {
                        ActivityAppear {
                            Column(
                                modifier = Modifier.padding(horizontal = 16.dp),
                                verticalArrangement = Arrangement.spacedBy(20.dp),
                            ) {
                                days.forEach { day ->
                                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        BasicText(
                                            day,
                                            modifier = Modifier
                                                .padding(horizontal = 4.dp)
                                                .semantics { heading() },
                                            style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                        )
                                        ItemGroup(variant = ItemGroupVariant.Inset) {
                                            list.filter { it.day == day }.forEachIndexed { index, event ->
                                                if (index > 0) ItemSeparator(Modifier.padding(start = 38.dp))
                                                ActivityRow(event)
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
    }
}

@Composable
private fun ActivityAppear(content: @Composable () -> Unit) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = ActivityRevealEasing)) }
    Box(
        Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 6.dp.toPx()
        },
    ) {
        content()
    }
}

@Composable
private fun ActivityRow(event: ActivityEvent) {
    val diff = event.diff
    if (diff == null) {
        ActivityItem(event, expanded = null)
        return
    }
    var expanded by rememberSaveable { mutableStateOf(false) }
    Collapsible(expanded = expanded, onExpandedChange = { expanded = it }) {
        CollapsibleTrigger { ActivityItem(event, expanded = expanded) }
        CollapsibleContent { ActivityDiff(diff) }
    }
}

@Composable
private fun ActivityItem(event: ActivityEvent, expanded: Boolean?) {
    val colors = EsuissTheme.colors
    val kind = ActivityKinds.first { it.value == event.kind }
    val rotation by animateFloatAsState(if (expanded == true) 90f else 0f, tween(300, easing = ActivityRevealEasing), label = "caret")
    Item(size = ItemSize.Sm, role = null) {
        ItemMedia {
            Box(
                Modifier
                    .size(28.dp)
                    .background(kind.tint(colors), RoundedCornerShape(7.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(kind.icon, contentDescription = null, size = 16.dp, tint = Palette.white)
            }
        }
        ItemContent {
            BasicText(
                buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(event.actor) }
                    append(" ${event.action}")
                },
                style = Typography.sm.copy(color = colors.foreground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            BasicText(
                event.target,
                style = Typography.xs.copy(color = colors.mutedForeground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        ItemActions {
            BasicText(event.time, style = Typography.sm.copy(color = colors.mutedForeground, fontFeatureSettings = "tnum"))
            Box(Modifier.size(12.dp), contentAlignment = Alignment.Center) {
                if (expanded != null) {
                    Icon(
                        PhosphorIcons.Bold.CaretRight,
                        contentDescription = null,
                        modifier = Modifier.rotate(rotation),
                        size = 12.dp,
                        tint = colors.mutedForeground,
                    )
                }
            }
        }
    }
}

@Composable
private fun ActivityDiff(diff: Pair<String, String>) {
    val colors = EsuissTheme.colors
    Row(
        modifier = Modifier.padding(start = 56.dp, end = 16.dp, bottom = 12.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            BasicText("Before", style = Typography.xs.copy(color = colors.mutedForeground))
            BasicText(diff.first, style = Typography.sm.copy(color = colors.mutedForeground, textDecoration = TextDecoration.LineThrough))
        }
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
            BasicText("After", style = Typography.xs.copy(color = colors.mutedForeground))
            BasicText(diff.second, style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
        }
    }
}

private val AdminSections = listOf("users" to "Users", "roles" to "Roles", "log" to "Activity", "settings" to "Settings")

@Composable
private fun AdminTabs(home: String, onNavigate: (String) -> Unit, content: @Composable () -> Unit) {
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
                BasicText(
                    "This section isn't part of the sample. Choose ${AdminSections.first { it.first == home }.second}.",
                    modifier = Modifier
                        .align(Alignment.Center)
                        .padding(32.dp),
                    style = Typography.base.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                )
            }
        }
        TabBar(
            value = tab,
            onValueChange = {
                onNavigate(it)
                tab = it
            },
        ) {
            TabBarItem("users", "Users", PhosphorIcons.Regular.Users, selectedIcon = PhosphorIcons.Fill.FillUsers)
            TabBarItem("roles", "Roles", PhosphorIcons.Regular.Shield, selectedIcon = PhosphorIcons.Fill.FillShield)
            TabBarItem("log", "Activity", PhosphorIcons.Regular.ChartBar, selectedIcon = PhosphorIcons.Fill.FillChartBar)
            TabBarItem("settings", "Settings", PhosphorIcons.Regular.Gear, selectedIcon = PhosphorIcons.Fill.FillGear)
        }
    }
}
