package com.esuiss.ui.blocks

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.animateContentSize
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.selection.selectable
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
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.lerp
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
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
import com.adamglin.phosphoricons.bold.Bell
import com.adamglin.phosphoricons.bold.CreditCard
import com.adamglin.phosphoricons.bold.Tag
import com.adamglin.phosphoricons.bold.Trash as BoldTrash
import com.adamglin.phosphoricons.bold.Users
import com.adamglin.phosphoricons.fill.Star as FillStar
import com.adamglin.phosphoricons.regular.Archive
import com.adamglin.phosphoricons.regular.ArrowBendUpLeft
import com.adamglin.phosphoricons.regular.Star
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
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
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private val CategoryRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val CategoryPopEasing = CubicBezierEasing(0.3f, 1.25f, 0.5f, 1f)

private class CategoryMail(
    val id: Int,
    val from: String,
    val subject: String,
    val body: String,
    val time: String,
    val hue: Int,
    val category: String,
    unread: Boolean,
    starred: Boolean,
) {
    var unread by mutableStateOf(unread)
    var starred by mutableStateOf(starred)
}

private fun categoryMail() = listOf(
    CategoryMail(0, "suiss", "Your order has shipped", "Order #W1048 is on its way and arrives tomorrow. A signature is required on delivery.", "9:12 AM", 0, "Transactions", unread = true, starred = false),
    CategoryMail(1, "Morgan Lee", "Tomorrow's meeting", "Does 10:00 tomorrow work? The Q4 budget and the campaign calendar are on the agenda. I'll share the deck tonight.", "8:40 AM", 30, "Primary", unread = true, starred = false),
    CategoryMail(2, "suiss Cloud", "Your storage is almost full", "90% of your Cloud storage is used. Upgrade your plan to keep your backups running.", "Yesterday", 210, "Updates", unread = true, starred = false),
    CategoryMail(3, "Riley Chen", "Coast trip photos", "I added the photos to the shared album. The ones from the boat tour came out great.", "Yesterday", 150, "Primary", unread = false, starred = true),
    CategoryMail(4, "suiss Store", "Just for you: a Trade In offer", "Bring in your old phone and get up to \$650 off a new one.", "Monday", 0, "Promotions", unread = false, starred = false),
    CategoryMail(5, "App Store", "Your receipt", "Your Studio Pro subscription renewed. Total: \$4.99.", "Monday", 0, "Transactions", unread = false, starred = false),
)

private class MailCategory(val value: String, val icon: ImageVector, val tint: (Colors) -> Color)

private val MailCategories = listOf(
    MailCategory("Primary", PhosphorIcons.Bold.Users) { it.primary },
    MailCategory("Transactions", PhosphorIcons.Bold.CreditCard) {
        if (it.isDark) lerp(Palette.green500, Palette.black, 0.4f) else lerp(Palette.green500, it.foreground, 0.4f)
    },
    MailCategory("Updates", PhosphorIcons.Bold.Bell) {
        if (it.isDark) lerp(Palette.purple500, Palette.black, 0.3f) else lerp(Palette.purple500, it.foreground, 0.2f)
    },
    MailCategory("Promotions", PhosphorIcons.Bold.Tag) {
        if (it.isDark) lerp(Palette.pink500, Palette.black, 0.25f) else lerp(Palette.pink500, it.foreground, 0.2f)
    },
)

private fun senderTint(colors: Colors, hue: Int): Color = when (hue) {
    30 -> Palette.orange500
    150 -> Palette.green500
    210 -> Palette.blue500
    else -> colors.foreground
}

private fun starTint(colors: Colors): Color = if (colors.isDark) Palette.orange500 else lerp(Palette.orange500, colors.foreground, 0.45f)

@Composable
fun InboxCategories(
    modifier: Modifier = Modifier,
    onCategoryChange: (category: String) -> Unit = {},
    onArchive: (id: Int) -> Unit = {},
    onDelete: (id: Int) -> Unit = {},
    onReply: (id: Int, text: String) -> Unit = { _, _ -> },
    onStarChange: (id: Int, starred: Boolean) -> Unit = { _, _ -> },
) {
    val colors = EsuissTheme.colors
    val mail = remember { mutableStateListOf<CategoryMail>().apply { addAll(categoryMail()) } }
    var category by rememberSaveable { mutableStateOf("Primary") }
    var selected by rememberSaveable { mutableStateOf<Int?>(1) }
    var column by rememberSaveable { mutableStateOf(SplitViewColumn.List) }
    val list = mail.filter { it.category == category }
    val current = list.firstOrNull { it.id == selected }

    fun remove(item: CategoryMail) {
        mail.remove(item)
        selected = mail.firstOrNull { it.category == category }?.id
        column = SplitViewColumn.List
    }

    fun archive(item: CategoryMail) {
        onArchive(item.id)
        remove(item)
    }

    fun delete(item: CategoryMail) {
        onDelete(item.id)
        remove(item)
    }

    fun star(item: CategoryMail) {
        onStarChange(item.id, !item.starred)
        item.starred = !item.starred
    }

    Screen(modifier) {
        SplitView(column = column, onColumnChange = { column = it }) {
            SplitViewList(title = "Inbox") {
                Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                    Row(
                        modifier = Modifier.semantics { contentDescription = "Category" },
                        horizontalArrangement = Arrangement.spacedBy(6.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        MailCategories.forEach { item ->
                            CategoryToggle(
                                category = item,
                                pressed = category == item.value,
                                unread = mail.any { it.category == item.value && it.unread },
                            ) {
                                onCategoryChange(item.value)
                                category = item.value
                                selected = mail.firstOrNull { it.category == item.value }?.id
                            }
                        }
                    }
                    key(category) {
                        Column {
                            if (list.isEmpty()) {
                                BasicText(
                                    "No messages in $category.",
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(30.dp),
                                    style = Typography.sm.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                                )
                            }
                            list.forEachIndexed { index, item ->
                                key(item.id) {
                                    CategoryAppear(index) {
                                        SwipeActions(
                                            leading = listOf(
                                                SwipeAction(
                                                    label = if (item.starred) "Unstar" else "Star",
                                                    onClick = { star(item) },
                                                    icon = PhosphorIcons.Fill.FillStar,
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
                                            CategoryRow(item, active = item.id == selected) {
                                                selected = item.id
                                                item.unread = false
                                            }
                                        }
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
                        CategoryReader(
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
                        style = Typography.base.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                    )
                }
            }
        }
    }
}

@Composable
private fun CategoryToggle(category: MailCategory, pressed: Boolean, unread: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.lg)
    val fill by animateColorAsState(if (pressed) category.tint(colors) else colors.secondary, tween(350), label = "fill")
    val ink by animateColorAsState(if (pressed) Palette.white else colors.mutedForeground, tween(350), label = "ink")
    Box {
        Row(
            modifier = Modifier
                .height(34.dp)
                .clip(shape)
                .background(fill, shape)
                .selectable(
                    selected = pressed,
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Tab,
                    onClick = onClick,
                )
                .semantics { contentDescription = category.value }
                .animateContentSize(tween(350, easing = CategoryPopEasing))
                .padding(horizontal = if (pressed) 14.dp else 11.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(category.icon, contentDescription = null, size = 16.dp, tint = ink)
            if (pressed) {
                BasicText(category.value, style = Typography.sm.copy(color = ink, fontWeight = FontWeight.SemiBold), maxLines = 1)
            }
        }
        if (!pressed && unread) {
            Box(
                Modifier
                    .align(Alignment.TopEnd)
                    .offset(x = (-2).dp, y = 2.dp)
                    .size(10.dp)
                    .border(2.dp, colors.background, CircleShape)
                    .padding(2.dp)
                    .background(colors.primary, CircleShape)
                    .semantics { stateDescription = "Unread" },
            )
        }
    }
}

@Composable
private fun CategoryAppear(index: Int, content: @Composable () -> Unit) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, delayMillis = index * 40, easing = CategoryRevealEasing)) }
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
private fun CategoryRow(mail: CategoryMail, active: Boolean, onClick: () -> Unit) {
    val colors = EsuissTheme.colors
    SplitViewItem(isActive = active, onClick = onClick) {
        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Box(
                Modifier
                    .padding(top = 6.dp)
                    .size(8.dp)
                    .background(if (mail.unread) colors.primary else Color.Transparent, CircleShape)
                    .semantics { if (mail.unread) stateDescription = "Unread" },
            )
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(1.dp)) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    BasicText(
                        mail.from,
                        modifier = Modifier.weight(1f),
                        style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    if (mail.starred) {
                        Icon(PhosphorIcons.Fill.FillStar, contentDescription = "Starred", size = 12.dp, tint = starTint(colors))
                    }
                    BasicText(mail.time, style = Typography.xs.copy(color = colors.mutedForeground))
                }
                BasicText(
                    mail.subject,
                    style = Typography.sm.copy(color = colors.foreground),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                BasicText(
                    mail.body,
                    style = Typography.xs.copy(color = colors.mutedForeground),
                    maxLines = 2,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
    }
}

@Composable
private fun CategorySender(mail: CategoryMail, size: Dp) {
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
                color = if (mail.hue != 0) Palette.white else colors.background,
                fontWeight = FontWeight.Medium,
                fontSize = (size.value * 0.4f).sp,
            ),
        )
    }
}

@Composable
private fun CategoryReader(
    mail: CategoryMail,
    onReply: (String) -> Unit,
    onStar: () -> Unit,
    onArchive: () -> Unit,
    onDelete: () -> Unit,
) {
    val colors = EsuissTheme.colors
    var replying by rememberSaveable { mutableStateOf(false) }
    var reply by rememberSaveable { mutableStateOf("") }
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = CategoryRevealEasing)) }
    Column(Modifier.fillMaxWidth()) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(50.dp),
            horizontalArrangement = Arrangement.spacedBy(2.dp, Alignment.End),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            CategoryAction(PhosphorIcons.Regular.ArrowBendUpLeft, "Reply") { replying = true }
            CategoryAction(
                if (mail.starred) PhosphorIcons.Fill.FillStar else PhosphorIcons.Regular.Star,
                if (mail.starred) "Unstar" else "Star",
                tint = if (mail.starred) starTint(colors) else colors.mutedForeground,
                onClick = onStar,
            )
            CategoryAction(PhosphorIcons.Regular.Archive, "Archive", onClick = onArchive)
            CategoryAction(PhosphorIcons.Regular.Trash, "Delete", onClick = onDelete)
        }
        Box(
            Modifier
                .fillMaxWidth()
                .height(1.dp)
                .background(colors.border),
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
                CategorySender(mail, 40.dp)
                Column(Modifier.weight(1f)) {
                    BasicText(mail.from, style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                    BasicText("To: Jamie Rivera", style = Typography.xs.copy(color = colors.mutedForeground))
                }
                BasicText(mail.time, style = Typography.xs.copy(color = colors.mutedForeground))
            }
            BasicText(
                mail.subject,
                modifier = Modifier.semantics { heading() },
                style = Typography.xl.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            BasicText(mail.body, style = Typography.base.copy(color = colors.foreground, lineHeight = 26.sp))
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
                        .background(colors.border),
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
private fun CategoryAction(
    icon: ImageVector,
    label: String,
    tint: Color = EsuissTheme.colors.mutedForeground,
    onClick: () -> Unit,
) {
    Button(onClick = onClick, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
        Icon(icon, contentDescription = label, size = 18.dp, tint = tint)
    }
}
