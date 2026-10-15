package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
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
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.EnvelopeSimple
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
import com.esuiss.ui.components.ChipSize
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
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.Toaster
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.components.rememberToastState
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private val InviteRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private val InviteEmail = Regex(".+@.+\\..+")

private val InviteRoles = listOf("Admin", "Editor", "Support", "Viewer").map { PickerItemData(it, it) }

private class PendingInvite(val email: String, val role: String, val sent: String)

@Composable
fun UsersInvite(
    modifier: Modifier = Modifier,
    onInvite: (emails: List<String>, role: String, welcome: Boolean) -> Unit = { _, _, _ -> },
    onResend: (email: String) -> Unit = {},
    onCancelInvite: (email: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    val toasts = rememberToastState()
    val emails = remember { mutableStateListOf("avery@company.com") }
    var draft by rememberSaveable { mutableStateOf("") }
    var role by rememberSaveable { mutableStateOf("Editor") }
    var welcome by rememberSaveable { mutableStateOf(true) }
    val pending = remember {
        mutableStateListOf(
            PendingInvite("casey@company.com", "Support", "2 days ago"),
            PendingInvite("drew@company.com", "Viewer", "5 days ago"),
        )
    }

    fun commit(value: String) {
        val email = value.trim().trimEnd(',').trim()
        if (InviteEmail.matches(email) && email !in emails) emails += email
        draft = ""
    }

    fun send() {
        if (emails.isEmpty()) return
        val sent = emails.toList()
        onInvite(sent, role, welcome)
        pending.addAll(0, sent.map { PendingInvite(it, role, "Just now") })
        toasts.success("${sent.size} ${if (sent.size == 1) "invitation" else "invitations"} sent")
        emails.clear()
    }

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("users", onNavigate) {
            Toaster(toasts) {
                Column(
                    Modifier
                        .fillMaxSize()
                        .nestedScroll(header.nestedScrollConnection),
                ) {
                    Header(state = header) {
                        HeaderTitle("Invite users")
                        HeaderLargeTitle("Invite users", subtitle = "Invitees get a link by email.")
                    }
                    KeyboardScrollView(
                        modifier = Modifier.weight(1f),
                        contentPadding = PaddingValues(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 32.dp),
                        verticalArrangement = Arrangement.spacedBy(20.dp),
                    ) {
                        ItemGroup(variant = ItemGroupVariant.Inset) {
                            Row(
                                modifier = Modifier
                                    .fillMaxWidth()
                                    .padding(horizontal = 14.dp, vertical = 10.dp),
                                horizontalArrangement = Arrangement.spacedBy(12.dp),
                            ) {
                                BasicText(
                                    "Email",
                                    modifier = Modifier
                                        .width(90.dp)
                                        .padding(top = 5.dp),
                                    style = Typography.base.copy(color = colors.foreground),
                                )
                                FlowRow(
                                    modifier = Modifier
                                        .weight(1f)
                                        .heightIn(min = 30.dp),
                                    horizontalArrangement = Arrangement.spacedBy(6.dp),
                                    verticalArrangement = Arrangement.spacedBy(6.dp),
                                    itemVerticalAlignment = Alignment.CenterVertically,
                                ) {
                                    emails.forEach { email ->
                                        key(email) {
                                            Chip(
                                                text = email,
                                                selected = false,
                                                onSelectedChange = {},
                                                size = ChipSize.Sm,
                                                onRemove = { emails.remove(email) },
                                                removeLabel = "Remove $email",
                                            )
                                        }
                                    }
                                    InviteField(
                                        value = draft,
                                        placeholder = if (emails.isNotEmpty()) "Add another" else "name@company.com",
                                        onValueChange = { value ->
                                            if (value.endsWith(",") || value.endsWith(" ")) commit(value) else draft = value
                                        },
                                        onCommit = { if (draft.isNotBlank()) commit(draft) },
                                    )
                                }
                            }
                            ItemSeparator()
                            InviteRow("Role") {
                                Picker(
                                    value = role,
                                    onValueChange = { role = it },
                                    modifier = Modifier.semantics { contentDescription = "Role" },
                                    items = InviteRoles,
                                    size = SelectSize.Sm,
                                )
                            }
                            ItemSeparator()
                            InviteRow("Send welcome email") {
                                Switch(
                                    checked = welcome,
                                    onCheckedChange = { welcome = it },
                                    modifier = Modifier.semantics { contentDescription = "Send welcome email" },
                                )
                            }
                        }
                        Row(
                            modifier = Modifier.padding(horizontal = 4.dp),
                            horizontalArrangement = Arrangement.spacedBy(10.dp),
                            verticalAlignment = Alignment.CenterVertically,
                        ) {
                            BasicText(
                                if (emails.isNotEmpty()) {
                                    "${emails.size} ${if (emails.size == 1) "person" else "people"} will be invited as $role."
                                } else {
                                    "Type an email and press Done."
                                },
                                modifier = Modifier
                                    .weight(1f)
                                    .semantics { liveRegion = LiveRegionMode.Polite },
                                style = Typography.sm.copy(color = colors.mutedForeground),
                            )
                            Button(text = "Send Invites", onClick = ::send, size = ButtonSize.Sm, enabled = emails.isNotEmpty())
                        }
                        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                            BasicText(
                                "Pending invitations",
                                modifier = Modifier
                                    .padding(horizontal = 4.dp)
                                    .semantics { heading() },
                                style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                            )
                            if (pending.isEmpty()) {
                                BasicText(
                                    "No pending invitations.",
                                    modifier = Modifier.padding(horizontal = 4.dp),
                                    style = Typography.sm.copy(color = colors.mutedForeground),
                                )
                            } else {
                                ItemGroup(variant = ItemGroupVariant.Inset) {
                                    pending.forEachIndexed { index, invite ->
                                        key(invite.email) {
                                            if (index > 0) ItemSeparator(Modifier.padding(start = 38.dp))
                                            PendingRow(
                                                invite = invite,
                                                onResend = {
                                                    onResend(invite.email)
                                                    toasts.success("Resent to ${invite.email}")
                                                },
                                                onCancel = {
                                                    onCancelInvite(invite.email)
                                                    pending.remove(invite)
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
    }
}

@Composable
private fun InviteField(
    value: String,
    placeholder: String,
    onValueChange: (String) -> Unit,
    onCommit: () -> Unit,
) {
    val colors = EsuissTheme.colors
    val style = Typography.sm.copy(color = colors.foreground)
    BasicTextField(
        value = value,
        onValueChange = onValueChange,
        modifier = Modifier
            .widthIn(min = 140.dp)
            .padding(vertical = 5.dp)
            .onFocusChanged { if (!it.isFocused) onCommit() }
            .semantics { contentDescription = "Email" },
        textStyle = style,
        singleLine = true,
        cursorBrush = SolidColor(colors.primary),
        keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Email, imeAction = ImeAction.Done),
        keyboardActions = KeyboardActions(onDone = { onCommit() }),
        decorationBox = { inner ->
            Box {
                if (value.isEmpty()) BasicText(placeholder, style = style.copy(color = colors.mutedForeground), maxLines = 1)
                inner()
            }
        },
    )
}

@Composable
private fun InviteRow(title: String, action: @Composable () -> Unit) {
    Item(size = ItemSize.Sm, role = null) {
        ItemContent {
            ItemTitle {
                BasicText(
                    title,
                    style = Typography.base.copy(color = EsuissTheme.colors.foreground),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
        }
        ItemActions { action() }
    }
}

@Composable
private fun PendingRow(invite: PendingInvite, onResend: () -> Unit, onCancel: () -> Unit) {
    val colors = EsuissTheme.colors
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(700, easing = InviteRevealEasing)) }
    Item(
        modifier = Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 6.dp.toPx()
        },
        size = ItemSize.Sm,
        role = null,
    ) {
        ItemMedia {
            Box(
                Modifier
                    .size(28.dp)
                    .background(Palette.zinc500, RoundedCornerShape(7.dp)),
                contentAlignment = Alignment.Center,
            ) {
                Icon(PhosphorIcons.Bold.EnvelopeSimple, contentDescription = null, size = 16.dp, tint = Palette.white)
            }
        }
        ItemContent {
            BasicText(
                invite.email,
                style = Typography.sm.copy(color = colors.foreground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            BasicText("${invite.role} · ${invite.sent}", style = Typography.xs.copy(color = colors.mutedForeground))
        }
        ItemActions {
            Button(text = "Resend", onClick = onResend, size = ButtonSize.Xs, variant = ButtonVariant.Secondary)
            Button(text = "Cancel", onClick = onCancel, size = ButtonSize.Xs, variant = ButtonVariant.Destructive)
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
