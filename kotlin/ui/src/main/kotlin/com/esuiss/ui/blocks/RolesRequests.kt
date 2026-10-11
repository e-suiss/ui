package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
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
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.bold.X
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
import com.esuiss.ui.components.Empty
import com.esuiss.ui.components.EmptyContent
import com.esuiss.ui.components.EmptyHeader
import com.esuiss.ui.components.EmptyMedia
import com.esuiss.ui.components.EmptyTitle
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private val RequestEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val RequestDurations = listOf("24 hours", "7 days", "Permanent").map { PickerItemData(it, it) }

private class AccessRequest(val name: String, val permission: String, val reason: String, val time: String, val hue: Int) {
    var decision by mutableStateOf<String?>(null)
}

private fun accessRequests() = listOf(
    AccessRequest("Morgan Lee", "Change prices", "I need to update the campaign prices.", "10 min ago", 30),
    AccessRequest("Riley Chen", "Export customers", "I need the customer list for the monthly report.", "1 hr ago", 150),
    AccessRequest("Jordan Park", "Issue refunds", "So I can refund support tickets myself.", "Yesterday", 100),
    AccessRequest("Taylor Kim", "Publish", "I'd like to publish blog posts.", "2 days ago", 200),
)

private fun requestTint(colors: Colors, hue: Int): Color = when (hue) {
    30 -> colors.orange
    150 -> colors.green
    200 -> colors.blue
    else -> colors.teal
}

private fun approvedTint(colors: Colors): Color = if (colors.isDark) colors.green else lerp(colors.green, colors.label, 0.45f)

@Composable
fun RolesRequests(
    modifier: Modifier = Modifier,
    onApprove: (name: String, duration: String) -> Unit = { _, _ -> },
    onDeny: (name: String) -> Unit = {},
    onDurationChange: (duration: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    val requests = remember { mutableStateListOf<AccessRequest>().apply { addAll(accessRequests()) } }
    var duration by rememberSaveable { mutableStateOf("Permanent") }
    val open = requests.count { it.decision == null }

    fun decide(request: AccessRequest, decision: String) {
        if (request.decision != null) return
        if (decision == "approved") onApprove(request.name, duration) else onDeny(request.name)
        request.decision = decision
    }

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("roles", onNavigate) {
            Column(
                Modifier
                    .fillMaxSize()
                    .nestedScroll(header.nestedScrollConnection),
            ) {
                Header(state = header) {
                    HeaderTitle("Access requests")
                    HeaderLargeTitle(
                        "Access requests",
                        modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                        subtitle = "$open pending ${if (open == 1) "request" else "requests"}",
                    )
                }
                Column(
                    Modifier
                        .weight(1f)
                        .fillMaxWidth()
                        .verticalScroll(rememberScrollState())
                        .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 32.dp),
                    verticalArrangement = Arrangement.spacedBy(20.dp),
                ) {
                    ItemGroup(variant = ItemGroupVariant.Inset) {
                        Item(size = ItemSize.Sm, role = null) {
                            ItemContent {
                                ItemTitle {
                                    BasicText("Approval length", style = Typography.base.copy(color = colors.label))
                                }
                            }
                            ItemActions {
                                Picker(
                                    value = duration,
                                    onValueChange = {
                                        onDurationChange(it)
                                        duration = it
                                    },
                                    modifier = Modifier.semantics { contentDescription = "Approval length" },
                                    items = RequestDurations,
                                    size = SelectSize.Sm,
                                )
                            }
                        }
                    }
                    if (requests.isNotEmpty()) {
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(Radius.xl2))
                                .background(colors.surfaceSecondary),
                        ) {
                            requests.forEachIndexed { index, request ->
                                key(request.name) {
                                    RequestRow(
                                        request = request,
                                        divided = index > 0,
                                        onDecide = { decide(request, it) },
                                        onRemoved = { requests.remove(request) },
                                    )
                                }
                            }
                        }
                    } else {
                        RequestsEmpty {
                            requests.clear()
                            requests.addAll(accessRequests())
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RequestRow(request: AccessRequest, divided: Boolean, onDecide: (String) -> Unit, onRemoved: () -> Unit) {
    val colors = EsuissTheme.colors
    var closing by remember { mutableStateOf(false) }
    LaunchedEffect(request.decision) {
        if (request.decision == null) return@LaunchedEffect
        delay(500)
        closing = true
        delay(400)
        onRemoved()
    }
    AnimatedVisibility(
        visible = !closing,
        exit = shrinkVertically(tween(400, easing = RequestEasing)) + fadeOut(tween(400)),
    ) {
        SwipeActions(
            enabled = request.decision == null,
            background = colors.surfaceSecondary,
            leading = listOf(
                SwipeAction(
                    label = "Approve",
                    onClick = { onDecide("approved") },
                    icon = PhosphorIcons.Bold.Check,
                    fullSwipe = true,
                ),
            ),
            trailing = listOf(
                SwipeAction(
                    label = "Deny",
                    onClick = { onDecide("denied") },
                    icon = PhosphorIcons.Bold.X,
                    variant = SwipeActionVariant.Destructive,
                    fullSwipe = true,
                ),
            ),
        ) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .background(colors.surfaceSecondary)
                    .padding(start = 16.dp),
                horizontalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Box(
                    Modifier
                        .padding(top = 12.dp)
                        .size(34.dp)
                        .background(requestTint(colors, request.hue), CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        request.name.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                        style = Typography.xs.copy(color = colors.onMedia, fontWeight = FontWeight.Medium),
                    )
                }
                Column(Modifier.weight(1f)) {
                    if (divided) {
                        Box(
                            Modifier
                                .fillMaxWidth()
                                .height(1.dp)
                                .background(colors.separator),
                        )
                    }
                    Column(
                        modifier = Modifier.padding(top = 12.dp, bottom = 12.dp, end = 16.dp),
                        verticalArrangement = Arrangement.spacedBy(10.dp),
                    ) {
                        Column(verticalArrangement = Arrangement.spacedBy(3.dp)) {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                                BasicText(request.name, style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                                BasicText(request.time, style = Typography.xs.copy(color = colors.labelSecondary))
                            }
                            BasicText("Requests ${request.permission}", style = Typography.sm.copy(color = colors.label))
                            BasicText(request.reason, style = Typography.sm.copy(color = colors.labelSecondary))
                        }
                        val decision = request.decision
                        if (decision != null) {
                            BasicText(
                                if (decision == "approved") "Approved" else "Denied",
                                modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
                                style = Typography.sm.copy(
                                    color = if (decision == "approved") approvedTint(colors) else colors.danger,
                                    fontWeight = FontWeight.SemiBold,
                                ),
                            )
                        } else {
                            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                Button(text = "Deny", onClick = { onDecide("denied") }, size = ButtonSize.Sm, variant = ButtonVariant.Secondary)
                                Button(text = "Approve", onClick = { onDecide("approved") }, size = ButtonSize.Sm)
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun RequestsEmpty(onReset: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = RequestEasing)) }
    Empty(
        Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
    ) {
        EmptyHeader {
            EmptyMedia {
                Icon(
                    PhosphorIcons.Bold.Check,
                    contentDescription = null,
                    size = 40.dp,
                    tint = if (colors.isDark) colors.green else lerp(colors.green, colors.label, 0.35f),
                )
            }
            EmptyTitle("No pending requests.")
        }
        EmptyContent {
            Button(text = "Reset the sample ›", onClick = onReset, size = ButtonSize.Sm, variant = ButtonVariant.Link)
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
