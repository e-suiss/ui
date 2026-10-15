package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.KeyboardOptions
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
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Check as BoldCheck
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.Check
import com.adamglin.phosphoricons.regular.Tray
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val TicketRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class SupportTicket(
    val id: String,
    val title: String,
    val device: String,
    status: String,
    val priority: String,
    val requester: String,
    val hue: Int,
) {
    var status by mutableStateOf(status)
}

private fun supportTickets() = listOf(
    SupportTicket("#4821", "Screen flickers", "Phone Pro", "Open", "High", "Jamie Rivera", 30),
    SupportTicket("#4820", "Battery drains fast", "Book Air", "Pending", "Medium", "Morgan Lee", 200),
    SupportTicket("#4819", "Pods won't pair", "Pods Studio", "Open", "Low", "Avery Brooks", 330),
    SupportTicket("#4818", "Cloud backup error", "Phone Air", "Solved", "Medium", "Taylor Kim", 120),
)

private class SupportView(val value: String, val icon: ImageVector)

private val SupportViews = listOf(
    SupportView("Open", PhosphorIcons.Regular.ChatCircle),
    SupportView("Pending", PhosphorIcons.Regular.ChatCircle),
    SupportView("Solved", PhosphorIcons.Regular.Check),
    SupportView("All", PhosphorIcons.Regular.Tray),
)

private val TicketStatuses = listOf("Open", "Pending", "Solved")

private fun requesterTint(colors: Colors, hue: Int): Color = when (hue) {
    30 -> Palette.orange500
    200 -> Palette.blue500
    330 -> Palette.pink500
    else -> Palette.green500
}

private fun priorityColors(colors: Colors, priority: String): Pair<Color, Color> = when (priority) {
    "High" -> colors.destructive.copy(alpha = if (colors.isDark) 0.2f else 0.1f) to if (colors.isDark) colors.destructive else lerp(colors.destructive, colors.foreground, 0.3f)
    "Medium" -> Palette.amber500.copy(alpha = if (colors.isDark) 0.2f else 0.1f) to if (colors.isDark) Palette.orange500 else lerp(Palette.orange500, colors.foreground, 0.5f)
    else -> colors.secondary to colors.mutedForeground
}

@Composable
fun InboxSupport(
    modifier: Modifier = Modifier,
    onViewChange: (view: String) -> Unit = {},
    onStatusChange: (id: String, status: String) -> Unit = { _, _ -> },
    onReply: (id: String, text: String) -> Unit = { _, _ -> },
) {
    val colors = EsuissTheme.colors
    val tickets = remember { mutableStateListOf<SupportTicket>().apply { addAll(supportTickets()) } }
    var view by rememberSaveable { mutableStateOf("Open") }
    var selected by rememberSaveable { mutableStateOf("#4821") }
    var column by rememberSaveable { mutableStateOf(SplitViewColumn.List) }
    val list = tickets.filter { view == "All" || it.status == view }
    val current = tickets.firstOrNull { it.id == selected }

    fun setStatus(ticket: SupportTicket, status: String) {
        if (ticket.status == status) return
        onStatusChange(ticket.id, status)
        ticket.status = status
    }

    Screen(modifier) {
        SplitView(column = column, onColumnChange = { column = it }) {
            SplitViewSidebar(title = "Support") {
                SupportViews.forEach { item ->
                    SplitViewItem(
                        isActive = view == item.value,
                        onClick = {
                            onViewChange(item.value)
                            view = item.value
                        },
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(item.icon, contentDescription = null, size = 18.dp, tint = colors.primary)
                            BasicText(item.value, modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.foreground))
                            val count = if (item.value == "All") tickets.size else tickets.count { it.status == item.value }
                            BasicText("$count", style = Typography.xs.copy(color = colors.mutedForeground, fontFeatureSettings = "tnum"))
                        }
                    }
                }
            }
            SplitViewList(title = view) {
                list.forEach { ticket ->
                    key(ticket.id) {
                        SwipeActions(
                            trailing = if (ticket.status == "Solved") {
                                emptyList()
                            } else {
                                listOf(
                                    SwipeAction(
                                        label = "Mark as solved",
                                        onClick = { setStatus(ticket, "Solved") },
                                        icon = PhosphorIcons.Bold.BoldCheck,
                                        fullSwipe = true,
                                    ),
                                )
                            },
                        ) {
                            TicketRow(ticket, active = ticket.id == selected) { selected = ticket.id }
                        }
                    }
                }
                if (list.isEmpty()) {
                    BasicText(
                        "No tickets",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(24.dp),
                        style = Typography.sm.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                }
            }
            SplitViewDetail {
                if (current != null) {
                    key(current.id) {
                        TicketDetail(
                            ticket = current,
                            onStatus = { setStatus(current, it) },
                            onReply = { onReply(current.id, it) },
                        )
                    }
                }
            }
        }
    }
}

@Composable
private fun TicketRow(ticket: SupportTicket, active: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val (fill, ink) = priorityColors(colors, ticket.priority)
    SplitViewItem(isActive = active, onClick = onClick) {
        Column(verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
                BasicText(
                    "${ticket.id} · ${ticket.device}",
                    modifier = Modifier.weight(1f),
                    style = Typography.xs.copy(color = colors.mutedForeground),
                )
                BasicText(
                    ticket.priority,
                    modifier = Modifier
                        .background(fill, RoundedCornerShape(Radius.md))
                        .padding(horizontal = 8.dp, vertical = 2.dp),
                    style = Typography.xs.copy(color = ink, fontWeight = FontWeight.SemiBold),
                )
            }
            BasicText(ticket.title, style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
            Row(
                modifier = Modifier.padding(top = 4.dp),
                horizontalArrangement = Arrangement.spacedBy(6.dp),
                verticalAlignment = Alignment.CenterVertically,
            ) {
                TicketRequester(ticket, 18.dp)
                BasicText(ticket.requester, style = Typography.xs.copy(color = colors.mutedForeground))
            }
        }
    }
}

@Composable
private fun TicketRequester(ticket: SupportTicket, size: Dp) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(size)
            .background(requesterTint(colors, ticket.hue), CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            ticket.requester.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
            style = Typography.xs.copy(color = Palette.white, fontWeight = FontWeight.Medium, fontSize = (size.value * 0.4f).sp),
        )
    }
}

@Composable
private fun TicketDetail(ticket: SupportTicket, onStatus: (String) -> Unit, onReply: (String) -> Unit) {
    val colors = EsuissTheme.colors
    var reply by rememberSaveable { mutableStateOf("") }
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = TicketRevealEasing)) }
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(top = 8.dp)
            .graphicsLayer {
                alpha = appear.value
                translationY = (1f - appear.value) * 8.dp.toPx()
            },
        verticalArrangement = Arrangement.spacedBy(16.dp),
    ) {
        BasicText("${ticket.id} · ${ticket.device}", style = Typography.sm.copy(color = colors.mutedForeground))
        ToggleGroup(
            value = ticket.status,
            onValueChange = { if (it != null) onStatus(it) },
            modifier = Modifier.semantics { contentDescription = "Status" },
            size = ToggleSize.Sm,
            spacing = 0,
        ) {
            TicketStatuses.forEach { ToggleGroupItem(it, it) }
        }
        BasicText(
            ticket.title,
            modifier = Modifier.semantics { heading() },
            style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
        )
        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
            TicketRequester(ticket, 34.dp)
            Column {
                BasicText(ticket.requester, style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                BasicText("Today 8:12 AM", style = Typography.xs.copy(color = colors.mutedForeground))
            }
        }
        BasicText(
            "Hi, this started right after the latest update. I tried restarting but it keeps happening. Can you help?",
            modifier = Modifier
                .widthIn(max = 520.dp)
                .background(colors.muted, RoundedCornerShape(topStart = 4.dp, topEnd = 16.dp, bottomEnd = 16.dp, bottomStart = 16.dp))
                .padding(horizontal = 14.dp, vertical = 12.dp),
            style = Typography.base.copy(color = colors.foreground, lineHeight = 26.sp),
        )
        Column(verticalArrangement = Arrangement.spacedBy(10.dp)) {
            Textarea(
                value = reply,
                onValueChange = { reply = it },
                modifier = Modifier.semantics { contentDescription = "Reply" },
                placeholder = "Write a reply…",
                minLines = 3,
                keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
            )
            Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                Button(
                    text = "Send and set pending",
                    onClick = {
                        onReply(reply.trim())
                        reply = ""
                        onStatus("Pending")
                    },
                    size = ButtonSize.Sm,
                    enabled = reply.isNotBlank(),
                )
                Button(text = "Mark as solved", onClick = { onStatus("Solved") }, size = ButtonSize.Sm, variant = ButtonVariant.Outline)
            }
        }
    }
}
