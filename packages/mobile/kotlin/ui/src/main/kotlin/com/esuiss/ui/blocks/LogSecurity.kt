package com.esuiss.ui.blocks

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
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
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.Globe
import com.adamglin.phosphoricons.bold.Key
import com.adamglin.phosphoricons.bold.LockSimple
import com.adamglin.phosphoricons.bold.Shield
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
import com.esuiss.ui.components.Header
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
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val SecurityEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private enum class AlertSeverity(val weight: Int) { High(18), Medium(8), Low(3) }

private class SecurityAlert(val severity: AlertSeverity, val title: String, val detail: String, val icon: ImageVector) {
    var resolved by mutableStateOf(false)
}

private fun securityAlerts() = listOf(
    SecurityAlert(AlertSeverity.High, "Sign-in from an unusual location", "morgan@example.com · Lagos, NG · 3:12 AM", PhosphorIcons.Bold.Globe),
    SecurityAlert(AlertSeverity.Medium, "5 failed sign-in attempts", "85.104.x.x · last 10 minutes", PhosphorIcons.Bold.LockSimple),
    SecurityAlert(AlertSeverity.Medium, "API key expires in 7 days", "Payments integration", PhosphorIcons.Bold.Key),
    SecurityAlert(AlertSeverity.Low, "Two-factor authentication is off", "2 users", PhosphorIcons.Bold.Shield),
)

private fun severityTint(colors: Colors, severity: AlertSeverity): Color = when (severity) {
    AlertSeverity.High -> colors.destructive
    AlertSeverity.Medium -> if (colors.isDark) Palette.amber400 else Palette.amber600
    AlertSeverity.Low -> colors.foreground
}

private fun severityText(colors: Colors, severity: AlertSeverity): Color = severityTint(colors, severity)

private fun scoreTone(colors: Colors, score: Int): Color = when {
    score > 85 -> Palette.green500
    score > 65 -> Palette.orange500
    else -> Palette.red500
}

@Composable
fun LogSecurity(
    modifier: Modifier = Modifier,
    onFilterChange: (filter: String) -> Unit = {},
    onResolve: (title: String, resolved: Boolean) -> Unit = { _, _ -> },
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    val alerts = remember { mutableStateListOf<SecurityAlert>().apply { addAll(securityAlerts()) } }
    var filter by rememberSaveable { mutableStateOf("Open") }
    val open = alerts.filter { !it.resolved }
    fun count(level: AlertSeverity) = open.count { it.severity == level }
    val score = 100 - AlertSeverity.entries.sumOf { count(it) * it.weight }
    val list = when (filter) {
        "All" -> alerts.toList()
        "Resolved" -> alerts.filter { it.resolved }
        else -> open
    }
    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("log", onNavigate) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle("Security")
                    HeaderLargeTitle(
                        "Security",
                        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                        subtitle = if (open.isNotEmpty()) "${open.size} open alerts" else "No open alerts",
                    )
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(top = 8.dp, bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    ScoreCard(score, ::count, Modifier.padding(horizontal = 16.dp))
                    ChipGroup(
                        value = filter,
                        onValueChange = { value ->
                            if (value != null && value != filter) {
                                onFilterChange(value)
                                filter = value
                            }
                        },
                        scrollable = true,
                        contentPadding = PaddingValues(horizontal = 16.dp),
                    ) {
                        listOf("Open", "Resolved", "All").forEach { Chip(it, it) }
                    }
                    Box(Modifier.padding(horizontal = 16.dp)) {
                        if (list.isEmpty()) {
                            BasicText(
                                if (filter == "Open") "No open alerts. All good." else "Nothing here yet.",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(30.dp),
                                style = Typography.sm.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                            )
                        } else {
                            ItemGroup(variant = ItemGroupVariant.Inset) {
                                list.forEachIndexed { index, alert ->
                                    if (index > 0) ItemSeparator(Modifier.padding(start = 40.dp))
                                    AlertRow(
                                        alert = alert,
                                        onResolve = {
                                            onResolve(alert.title, true)
                                            alert.resolved = true
                                        },
                                        onReopen = {
                                            onResolve(alert.title, false)
                                            alert.resolved = false
                                        },
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

@Composable
private fun ScoreCard(score: Int, count: (AlertSeverity) -> Int, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val tone by animateColorAsState(scoreTone(colors, score), tween(400), label = "tone")
    val sweep by animateFloatAsState(score / 100f, tween(600, easing = SecurityEasing), label = "sweep")
    val track = colors.secondary
    FlowRow(
        modifier = modifier
            .fillMaxWidth()
            .clip(RoundedCornerShape(Radius.xl))
            .background(colors.muted)
            .padding(horizontal = 16.dp, vertical = 14.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalArrangement = Arrangement.spacedBy(12.dp),
        itemVerticalAlignment = Alignment.CenterVertically,
    ) {
        Row(
            modifier = Modifier
                .weight(1f)
                .semantics(mergeDescendants = true) { contentDescription = "Security score $score" },
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Canvas(
                Modifier
                    .size(54.dp)
                    .clearAndSetSemantics {},
            ) {
                val stroke = 6.dp.toPx()
                val radius = 22.dp.toPx()
                val topLeft = Offset(center.x - radius, center.y - radius)
                val arc = Size(radius * 2, radius * 2)
                drawArc(track, 0f, 360f, false, topLeft, arc, style = Stroke(stroke))
                drawArc(tone, -90f, 360f * sweep, false, topLeft, arc, style = Stroke(stroke, cap = StrokeCap.Round))
            }
            Column(Modifier.clearAndSetSemantics {}) {
                BasicText("Security score", style = Typography.sm.copy(color = colors.mutedForeground), maxLines = 1)
                BasicText("$score", style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.Bold, fontFeatureSettings = "tnum"))
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(18.dp)) {
            AlertSeverity.entries.forEach { level ->
                val value = count(level)
                Column(
                    modifier = Modifier.semantics(mergeDescendants = true) {},
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    BasicText(level.name, style = Typography.xs.copy(color = colors.mutedForeground))
                    BasicText(
                        "$value",
                        style = Typography.xl.copy(
                            color = if (value > 0) severityText(colors, level) else colors.mutedForeground,
                            fontWeight = FontWeight.SemiBold,
                            fontFeatureSettings = "tnum",
                        ),
                    )
                }
            }
        }
    }
}

@Composable
private fun AlertRow(alert: SecurityAlert, onResolve: () -> Unit, onReopen: () -> Unit) {
    val colors = EsuissTheme.colors
    val resolvedTint = if (colors.isDark) Palette.green500 else lerp(Palette.green500, colors.foreground, 0.2f)
    val tint by animateColorAsState(if (alert.resolved) resolvedTint else severityTint(colors, alert.severity), tween(300), label = "tint")
    Item(size = ItemSize.Sm, role = null) {
        ItemMedia {
            Box(
                Modifier
                    .size(30.dp)
                    .background(tint, RoundedCornerShape(7.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(
                    if (alert.resolved) PhosphorIcons.Bold.Check else alert.icon,
                    contentDescription = null,
                    size = 16.dp,
                    tint = if (!alert.resolved && alert.severity == AlertSeverity.Low) colors.background else Palette.white,
                )
            }
        }
        ItemContent {
            BasicText(
                alert.title,
                style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            BasicText(
                "${if (alert.resolved) "Resolved" else "${alert.severity.name} severity"} · ${alert.detail}",
                style = Typography.xs.copy(color = colors.mutedForeground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
        ItemActions {
            if (alert.resolved) {
                Button(text = "Reopen", onClick = onReopen, size = ButtonSize.Sm, variant = ButtonVariant.Secondary)
            } else {
                Button(text = "Resolve", onClick = onResolve, size = ButtonSize.Sm)
            }
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
