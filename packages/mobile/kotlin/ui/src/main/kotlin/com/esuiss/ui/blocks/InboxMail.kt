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
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
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
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Archive as BoldArchive
import com.adamglin.phosphoricons.bold.Trash as BoldTrash
import com.adamglin.phosphoricons.fill.Star as FillStar
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.ArrowBendUpLeft
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.NotePencil
import com.adamglin.phosphoricons.regular.PaperPlaneTilt
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Trash
import com.adamglin.phosphoricons.regular.Tray
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Textarea
import com.esuiss.ui.interactions.SwipeAction
import com.esuiss.ui.interactions.SwipeActionVariant
import com.esuiss.ui.interactions.SwipeActions
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val MailRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class MailMessage(
    val id: Int,
    val from: String,
    val subject: String,
    val body: String,
    val time: String,
    val hue: Int,
    unread: Boolean,
    starred: Boolean,
) {
    var unread by mutableStateOf(unread)
    var starred by mutableStateOf(starred)
}

private fun mailMessages() = listOf(
    MailMessage(0, "suiss", "Your order has shipped", "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.", "9:12 AM", 0, unread = true, starred = false),
    MailMessage(1, "Morgan Lee", "Tomorrow's meeting", "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.", "8:40 AM", 30, unread = true, starred = false),
    MailMessage(2, "suiss Cloud", "Your storage is almost full", "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.", "Yesterday", 210, unread = true, starred = false),
    MailMessage(3, "Riley Chen", "Coast trip photos", "I added the photos to the shared album. The ones from the boat tour came out great.", "Yesterday", 150, unread = false, starred = true),
    MailMessage(4, "suiss Store", "Just for you: a Trade In offer", "Bring in your old phone and get up to \$650 off a new one.", "Monday", 0, unread = false, starred = false),
    MailMessage(5, "App Store", "Your receipt", "Your Studio Pro subscription renewed. Total: \$4.99.", "Monday", 0, unread = false, starred = false),
)

private class Mailbox(val value: String, val icon: ImageVector)

private val Mailboxes = listOf(
    Mailbox("Inbox", PhosphorIcons.Regular.Tray),
    Mailbox("Starred", PhosphorIcons.Regular.Star),
    Mailbox("Sent", PhosphorIcons.Regular.PaperPlaneTilt),
    Mailbox("Archive", PhosphorIcons.Regular.Archive),
    Mailbox("Trash", PhosphorIcons.Regular.Trash),
)

private fun senderTint(colors: Colors, hue: Int): Color = when (hue) {
    30 -> colors.orange
    150 -> colors.green
    210 -> colors.blue
    else -> colors.label
}

private fun starTint(colors: Colors): Color = if (colors.isDark) colors.orange else lerp(colors.orange, colors.label, 0.45f)

@Composable
fun InboxMail(
    modifier: Modifier = Modifier,
    onArchive: (id: Int) -> Unit = {},
    onDelete: (id: Int) -> Unit = {},
    onReply: (id: Int, text: String) -> Unit = { _, _ -> },
    onStarChange: (id: Int, starred: Boolean) -> Unit = { _, _ -> },
    onMailboxChange: (mailbox: String) -> Unit = {},
    onNewMessage: () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val mail = remember { mutableStateListOf<MailMessage>().apply { addAll(mailMessages()) } }
    var mailbox by rememberSaveable { mutableStateOf("Inbox") }
    var selected by rememberSaveable { mutableStateOf<Int?>(0) }
    var query by rememberSaveable { mutableStateOf("") }
    var column by rememberSaveable { mutableStateOf(SplitViewColumn.List) }
    val unread = mail.count { it.unread }
    val starred = mail.count { it.starred }
    val counts = mapOf("Inbox" to unread, "Starred" to starred)
    val list = mail.filter {
        (mailbox != "Starred" || it.starred) &&
            (query.isBlank() || "${it.from} ${it.subject} ${it.body}".contains(query.trim(), ignoreCase = true))
    }
    val current = mail.firstOrNull { it.id == selected }

    fun remove(item: MailMessage) {
        mail.remove(item)
        selected = mail.firstOrNull()?.id
        column = SplitViewColumn.List
    }

    fun archive(item: MailMessage) {
        onArchive(item.id)
        remove(item)
    }

    fun delete(item: MailMessage) {
        onDelete(item.id)
        remove(item)
    }

    fun star(item: MailMessage) {
        onStarChange(item.id, !item.starred)
        item.starred = !item.starred
    }

    Screen(modifier) {
        SplitView(column = column, onColumnChange = { column = it }) {
            SplitViewSidebar(title = "Mailboxes") {
                Mailboxes.forEach { box ->
                    SplitViewItem(
                        isActive = mailbox == box.value,
                        onClick = {
                            mailbox = box.value
                            onMailboxChange(box.value)
                        },
                    ) {
                        Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                            Icon(box.icon, contentDescription = null, size = 18.dp, tint = colors.accent)
                            BasicText(box.value, modifier = Modifier.weight(1f), style = Typography.base.copy(color = colors.label))
                            val count = counts[box.value] ?: 0
                            if (count > 0) {
                                BasicText("$count", style = Typography.xs.copy(color = colors.labelSecondary, fontFeatureSettings = "tnum"))
                            }
                        }
                    }
                }
            }
            SplitViewList(title = mailbox) {
                Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                    Row(verticalAlignment = Alignment.CenterVertically) {
                        BasicText(
                            if (unread > 0) "$unread unread" else "All read",
                            modifier = Modifier.weight(1f),
                            style = Typography.xs.copy(color = colors.labelSecondary),
                        )
                        Button(onClick = onNewMessage, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                            Icon(PhosphorIcons.Regular.NotePencil, contentDescription = "New message", size = 20.dp, tint = colors.labelSecondary)
                        }
                    }
                    InputGroup(Modifier.semantics { contentDescription = "Search mail" }) {
                        InputGroupAddon {
                            Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 16.dp, tint = colors.labelSecondary)
                        }
                        InputGroupInput(value = query, onValueChange = { query = it }, placeholder = "Search")
                    }
                    Column(Modifier.padding(top = 4.dp)) {
                        if (list.isEmpty()) {
                            BasicText(
                                "No Results",
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(24.dp),
                                style = Typography.sm.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                            )
                        }
                        list.forEach { item ->
                            key(item.id) {
                                SwipeActions(
                                    leading = listOf(
                                        SwipeAction(
                                            label = if (item.starred) "Unstar" else "Star",
                                            onClick = { star(item) },
                                            icon = PhosphorIcons.Fill.FillStar,
                                            variant = SwipeActionVariant.Default,
                                        ),
                                    ),
                                    trailing = listOf(
                                        SwipeAction(
                                            label = "Archive",
                                            onClick = { archive(item) },
                                            icon = PhosphorIcons.Bold.BoldArchive,
                                            variant = SwipeActionVariant.Archive,
                                        ),
                                        SwipeAction(
                                            label = "Delete",
                                            onClick = { delete(item) },
                                            icon = PhosphorIcons.Bold.BoldTrash,
                                            variant = SwipeActionVariant.Destructive,
                                            fullSwipe = true,
                                        ),
                                    ),
                                ) {
                                    MailRow(item, active = item.id == selected) {
                                        selected = item.id
                                        item.unread = false
                                    }
                                }
                            }
                        }
                    }
                }
            }
            SplitViewDetail {
                if (current != null) {
                    key(current.id) {
                        MailReader(
                            mail = current,
                            onReply = { onReply(current.id, it) },
                            onStar = { star(current) },
                            onArchive = { archive(current) },
                            onDelete = { delete(current) },
                        )
                    }
                } else {
                    BasicText(
                        "No Message Selected",
                        modifier = Modifier
                            .fillMaxWidth()
                            .padding(vertical = 48.dp),
                        style = Typography.base.copy(color = colors.labelSecondary, textAlign = TextAlign.Center),
                    )
                }
            }
        }
    }
}

@Composable
private fun MailRow(mail: MailMessage, active: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    SplitViewItem(isActive = active, onClick = onClick) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Box(
                Modifier
                    .padding(top = 6.dp)
                    .size(8.dp)
                    .background(if (mail.unread) colors.accent else Color.Transparent, CircleShape)
                    .semantics { if (mail.unread) stateDescription = "Unread" },
            )
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    BasicText(
                        mail.from,
                        modifier = Modifier.weight(1f),
                        style = Typography.sm.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    if (mail.starred) {
                        Icon(PhosphorIcons.Fill.FillStar, contentDescription = "Starred", size = 12.dp, tint = starTint(colors))
                    }
                    BasicText(mail.time, style = Typography.xs.copy(color = colors.labelSecondary))
                }
                BasicText(
                    mail.subject,
                    style = Typography.sm.copy(color = colors.label),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                BasicText(
                    mail.body,
                    style = Typography.xs.copy(color = colors.labelSecondary),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
private fun MailSender(mail: MailMessage, size: Dp) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(size)
            .background(senderTint(colors, mail.hue), CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            if (mail.hue != 0) mail.from.split(" ").mapNotNull { it.firstOrNull() }.joinToString("") else "s",
            style = Typography.base.copy(
                color = if (mail.hue != 0) colors.onMedia else colors.surface,
                fontWeight = FontWeight.Medium,
                fontSize = (size.value * 0.4f).sp,
            ),
        )
    }
}

@Composable
private fun MailReader(
    mail: MailMessage,
    onReply: (String) -> Unit,
    onStar: () -> Unit,
    onArchive: () -> Unit,
    onDelete: () -> Unit,
) {
    val colors = EsuissTheme.colors
    var replying by rememberSaveable { mutableStateOf(false) }
    var reply by rememberSaveable { mutableStateOf("") }
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = MailRevealEasing)) }
    Column(Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp, Alignment.End),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            MailAction(PhosphorIcons.Regular.ArrowBendUpLeft, "Reply") { replying = true }
            MailAction(
                if (mail.starred) PhosphorIcons.Fill.FillStar else PhosphorIcons.Regular.Star,
                if (mail.starred) "Unstar" else "Star",
                tint = if (mail.starred) starTint(colors) else colors.labelSecondary,
                onClick = onStar,
            )
            MailAction(PhosphorIcons.Regular.Archive, "Archive", onClick = onArchive)
            MailAction(PhosphorIcons.Regular.Trash, "Delete", onClick = onDelete)
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.separator),
        )
        Column(
            modifier = Modifier
                .padding(top = 22.dp)
                .graphicsLayer {
                    alpha = appear.value
                    translationY = (1f - appear.value) * 8.dp.toPx()
                },
            verticalArrangement = Arrangement.spacedBy(16.dp),
        ) {
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                MailSender(mail, 40.dp)
                Column(Modifier.weight(1f)) {
                    BasicText(mail.from, style = Typography.base.copy(color = colors.label, fontWeight = FontWeight.SemiBold))
                    BasicText("To: Jamie Rivera", style = Typography.xs.copy(color = colors.labelSecondary))
                }
                BasicText(mail.time, style = Typography.xs.copy(color = colors.labelSecondary))
            }
            BasicText(
                mail.subject,
                modifier = Modifier.semantics { heading() },
                style = Typography.xl.copy(color = colors.label, fontWeight = FontWeight.SemiBold),
            )
            BasicText(mail.body, style = Typography.base.copy(color = colors.label, lineHeight = 26.sp))
        }
        if (replying) {
            Column(
                modifier = Modifier.padding(top = 22.dp),
                verticalArrangement = Arrangement.spacedBy(10.dp),
            ) {
                Box(
                    Modifier
                        .fillMaxWidth()
                        .height(1.dp)
                        .background(colors.separator),
                )
                Textarea(
                    value = reply,
                    onValueChange = { reply = it },
                    modifier = Modifier
                        .padding(top = 8.dp)
                        .semantics { contentDescription = "Reply to ${mail.from}" },
                    placeholder = "Reply to ${mail.from}",
                    minLines = 4,
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.Sentences),
                )
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button(
                        text = "Send",
                        onClick = {
                            onReply(reply.trim())
                            reply = ""
                            replying = false
                        },
                        size = ButtonSize.Sm,
                        enabled = reply.isNotBlank(),
                    )
                    Button(text = "Cancel", onClick = { replying = false }, size = ButtonSize.Sm, variant = ButtonVariant.Outline)
                }
            }
        }
    }
}

@Composable
private fun MailAction(
    icon: ImageVector,
    label: String,
    tint: Color = EsuissTheme.colors.labelSecondary,
    onClick: () -> Unit,
) {
    Button(onClick = onClick, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
        Icon(icon, contentDescription = label, size = 18.dp, tint = tint)
    }
}
