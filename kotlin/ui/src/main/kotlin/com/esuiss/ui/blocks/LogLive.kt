package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
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
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.text.withStyle
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.ChatCircle
import com.adamglin.phosphoricons.bold.Cloud
import com.adamglin.phosphoricons.bold.Handbag
import com.adamglin.phosphoricons.bold.Tag
import com.adamglin.phosphoricons.bold.Warning
import com.adamglin.phosphoricons.fill.ChartBar as FillChartBar
import com.adamglin.phosphoricons.fill.Gear as FillGear
import com.adamglin.phosphoricons.fill.Pause
import com.adamglin.phosphoricons.fill.Play
import com.adamglin.phosphoricons.fill.Shield as FillShield
import com.adamglin.phosphoricons.fill.Users as FillUsers
import com.adamglin.phosphoricons.regular.ChartBar
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.Shield
import com.adamglin.phosphoricons.regular.Users
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
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
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

private val LiveRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class LiveFeedEvent(
    val actor: String,
    val action: String,
    val detail: String,
    val hue: Int = 0,
    val icon: ImageVector? = null,
    val warning: Boolean = false,
)

private val LiveFeed = listOf(
    LiveFeedEvent("Jamie Rivera", "signed in", "Book Pro · San Francisco", hue = 250),
    LiveFeedEvent("System", "finished a backup", "12.4 GB · 3 min", icon = PhosphorIcons.Bold.Cloud),
    LiveFeedEvent("Morgan Lee", "updated a product", "Phone Air · 240 in stock", hue = 30, icon = PhosphorIcons.Bold.Tag),
    LiveFeedEvent("Riley Chen", "answered a ticket", "#4821 Screen flickers", hue = 150, icon = PhosphorIcons.Bold.ChatCircle),
    LiveFeedEvent("System", "raised a warning", "API latency 820 ms", icon = PhosphorIcons.Bold.Warning, warning = true),
    LiveFeedEvent("Jordan Park", "approved an order", "W1052 · \$399", hue = 100, icon = PhosphorIcons.Bold.Handbag),
)

private class LiveEntry(val id: Int, val time: String, val event: LiveFeedEvent)

private fun liveTint(colors: Colors, hue: Int): Color = when (hue) {
    250 -> colors.indigo
    30 -> colors.orange
    150 -> colors.green
    else -> colors.teal
}

@Composable
fun LogLive(
    modifier: Modifier = Modifier,
    onRunningChange: (running: Boolean) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    val entries = remember { mutableStateListOf<LiveEntry>() }
    var running by rememberSaveable { mutableStateOf(true) }
    var count by remember { mutableIntStateOf(0) }
    var next by remember { mutableIntStateOf(0) }
    val format = remember { SimpleDateFormat("h:mm a", Locale.US) }

    fun push() {
        val id = next++
        val event = LiveFeed[id % LiveFeed.size]
        count += 1
        entries.add(0, LiveEntry(id, format.format(Date()), event))
        while (entries.size > 7) entries.removeAt(entries.lastIndex)
    }

    LaunchedEffect(running) {
        if (!running) return@LaunchedEffect
        if (next == 0) push()
        while (true) {
            delay(2200)
            push()
        }
    }

    val stats = listOf(
        "This session" to "$count ${if (count == 1) "event" else "events"}",
        "Active users" to "14",
        "Avg. response" to "182 ms",
    )

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("log", onNavigate) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle("Live activity")
                    HeaderLargeTitle("Live activity", subtitle = if (running) "Events appear as they happen" else "Paused")
                    HeaderActions {
                        Button(
                            onClick = {
                                running = !running
                                onRunningChange(running)
                            },
                            size = ButtonSize.Sm,
                            variant = ButtonVariant.Secondary,
                        ) {
                            Icon(if (running) PhosphorIcons.Fill.Pause else PhosphorIcons.Fill.Play, contentDescription = null, size = 12.dp)
                            BasicText(if (running) "Pause" else "Resume", style = LocalContentStyle.current)
                        }
                    }
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    Row(
                        Modifier
                            .fillMaxWidth()
                            .height(IntrinsicSize.Min)
                            .clip(RoundedCornerShape(Radius.xl))
                            .background(colors.surfaceSecondary),
                    ) {
                        stats.forEachIndexed { index, (label, value) ->
                            if (index > 0) {
                                Box(
                                    Modifier
                                        .width(1.dp)
                                        .fillMaxHeight()
                                        .background(colors.separator),
                                )
                            }
                            Column(
                                Modifier
                                    .weight(1f)
                                    .padding(horizontal = 14.dp, vertical = 12.dp),
                            ) {
                                BasicText(label, style = Typography.xs.copy(color = colors.labelSecondary), maxLines = 1)
                                BasicText(
                                    value,
                                    style = Typography.lg.copy(color = colors.label, fontWeight = FontWeight.SemiBold, fontFeatureSettings = "tnum"),
                                    maxLines = 1,
                                )
                            }
                        }
                    }
                    Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
                        Row(Modifier.padding(horizontal = 4.dp), verticalAlignment = Alignment.CenterVertically) {
                            BasicText(
                                "Recent events",
                                modifier = Modifier
                                    .weight(1f)
                                    .semantics { heading() },
                                style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                            )
                            if (running) LivePulse()
                        }
                        ItemGroup(
                            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                            variant = ItemGroupVariant.Inset,
                        ) {
                            entries.forEachIndexed { index, entry ->
                                key(entry.id) {
                                    if (index > 0) ItemSeparator(Modifier.padding(start = 40.dp))
                                    LiveRow(entry)
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
private fun LivePulse() {
    val colors = EsuissTheme.colors
    val transition = rememberInfiniteTransition(label = "live")
    val alpha by transition.animateFloat(
        initialValue = 1f,
        targetValue = 0.4f,
        animationSpec = infiniteRepeatable(tween(1000), RepeatMode.Reverse),
        label = "pulse",
    )
    Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
        Box(
            Modifier
                .size(7.dp)
                .graphicsLayer { this.alpha = alpha }
                .background(colors.green, CircleShape),
        )
        BasicText("Live", style = Typography.xs.copy(color = colors.labelSecondary))
    }
}

@Composable
private fun LiveRow(entry: LiveEntry) {
    val colors = EsuissTheme.colors
    val event = entry.event
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = LiveRevealEasing)) }
    Item(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (appear.value - 1f) * 10.dp.toPx()
        },
        size = ItemSize.Sm,
        role = null,
    ) {
        ItemMedia {
            if (event.hue != 0) {
                Box(
                    Modifier
                        .size(28.dp)
                        .background(liveTint(colors, event.hue), CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        event.actor.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                        style = Typography.xs3.copy(color = colors.onMedia, fontWeight = FontWeight.Medium),
                    )
                }
            } else {
                Box(
                    Modifier
                        .size(28.dp)
                        .background(if (event.warning) colors.orange else colors.gray, RoundedCornerShape(7.dp)),
                    contentAlignment = Alignment.Center,
                ) {
                    event.icon?.let { Icon(it, contentDescription = null, size = 16.dp, tint = colors.onMedia) }
                }
            }
        }
        ItemContent {
            BasicText(
                buildAnnotatedString {
                    withStyle(SpanStyle(fontWeight = FontWeight.SemiBold)) { append(event.actor) }
                    append(" ${event.action}")
                },
                style = Typography.sm.copy(color = colors.label),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            BasicText(
                event.detail,
                style = Typography.xs.copy(color = colors.labelSecondary),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        ItemActions {
            BasicText(entry.time, style = Typography.sm.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"))
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
                    style = Typography.base.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
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
