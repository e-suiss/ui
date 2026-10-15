package com.esuiss.ui.blocks

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
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
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.CaretRight
import com.adamglin.phosphoricons.bold.Check
import com.adamglin.phosphoricons.regular.Cloud
import com.adamglin.phosphoricons.regular.CreditCard
import com.adamglin.phosphoricons.regular.DeviceMobile
import com.adamglin.phosphoricons.regular.Key
import com.adamglin.phosphoricons.regular.Shield
import com.adamglin.phosphoricons.regular.User
import com.adamglin.phosphoricons.regular.Users
import com.esuiss.ui.components.Avatar
import com.esuiss.ui.components.AvatarSize
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.KeyboardScrollView
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

private val RevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class AccountSection(val value: String, val label: String, val icon: ImageVector)

private val Sections = listOf(
    AccountSection("personal", "Personal Information", PhosphorIcons.Regular.User),
    AccountSection("security", "Sign-In & Security", PhosphorIcons.Regular.Key),
    AccountSection("payment", "Payment & Shipping", PhosphorIcons.Regular.CreditCard),
    AccountSection("subscriptions", "Subscriptions", PhosphorIcons.Regular.Cloud),
    AccountSection("family", "Family Sharing", PhosphorIcons.Regular.Users),
    AccountSection("devices", "Devices", PhosphorIcons.Regular.DeviceMobile),
    AccountSection("privacy", "Privacy", PhosphorIcons.Regular.Shield),
)

private class EditableField(val field: String, val title: String)

private val EditableFields = listOf(
    EditableField("email", "Email & phone"),
    EditableField("phone", "Trusted phone number"),
)

@Composable
fun SettingsAccount(
    modifier: Modifier = Modifier,
    onSave: (field: String, value: String) -> Unit = { _, _ -> },
) {
    var section by rememberSaveable { mutableStateOf<String?>("security") }
    Screen(modifier) {
        AnimatedContent(
            targetState = section,
            transitionSpec = {
                val forward = targetState != null
                (fadeIn(tween(300)) + slideInHorizontally(tween(450, easing = RevealEasing)) { if (forward) it / 4 else -it / 4 }) togetherWith
                    fadeOut(tween(150))
            },
            label = "section",
        ) { current ->
            if (current == null) {
                AccountHome { section = it }
            } else {
                SectionPage(
                    section = Sections.first { it.value == current },
                    onBack = { section = null },
                    onSave = onSave,
                )
            }
        }
    }
}

@Composable
private fun AccountHome(onSelect: (String) -> Unit) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    Column(
        Modifier
            .fillMaxSize()
            .nestedScroll(header.nestedScrollConnection),
    ) {
        Header(state = header) {
            HeaderTitle("Account")
            HeaderLargeTitle("Account")
        }
        AccountList(Modifier.weight(1f), onSelect)
    }
}

@Composable
private fun AccountList(modifier: Modifier, onSelect: (String) -> Unit) {
    val colors = EsuissTheme.colors
    Column(
        modifier
            .fillMaxSize()
            .verticalScroll(rememberScrollState())
            .padding(16.dp),
        verticalArrangement = Arrangement.spacedBy(20.dp),
    ) {
        Column(
            modifier = Modifier.padding(horizontal = 8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            Avatar(
                modifier = Modifier.size(72.dp),
                size = AvatarSize.Xl,
                fallback = {
                    Box(
                        Modifier
                            .fillMaxSize()
                            .background(Palette.indigo500, CircleShape),
                        contentAlignment = Alignment.Center,
                    ) {
                        BasicText("JR", style = Typography.xl2.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold))
                    }
                },
            )
            BasicText(
                "Jamie Rivera",
                modifier = Modifier.semantics { heading() },
                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            )
            BasicText("jamie@suiss.com", style = Typography.sm.copy(color = colors.mutedForeground))
        }
        ItemGroup(variant = ItemGroupVariant.Inset) {
            Sections.forEachIndexed { index, section ->
                if (index > 0) ItemSeparator(Modifier.padding(start = 34.dp))
                Item(onClick = { onSelect(section.value) }) {
                    ItemMedia { Icon(section.icon, contentDescription = null, size = 20.dp, tint = colors.primary) }
                    ItemContent { ItemTitle(section.label) }
                    ItemActions {
                        Icon(PhosphorIcons.Bold.CaretRight, contentDescription = null, size = 14.dp, tint = colors.mutedForeground)
                    }
                }
            }
        }
    }
}

@Composable
private fun SectionPage(
    section: AccountSection,
    onBack: () -> Unit,
    onSave: (String, String) -> Unit,
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    Column(
        Modifier
            .fillMaxSize()
            .nestedScroll(header.nestedScrollConnection),
    ) {
        Header(state = header) {
            HeaderBack(onClick = onBack, text = "Account")
            HeaderTitle(section.label)
            HeaderLargeTitle(section.label)
        }
        KeyboardScrollView(
            modifier = Modifier.weight(1f),
            contentPadding = PaddingValues(start = 20.dp, end = 20.dp, top = 8.dp, bottom = 32.dp),
            verticalArrangement = Arrangement.spacedBy(14.dp),
        ) {
            if (section.value == "security") {
                Security(onSave)
            } else {
                BasicText(
                    "This section isn't part of the sample. Choose Sign-In & Security.",
                    style = Typography.lg.copy(color = colors.mutedForeground),
                )
            }
        }
    }
}

@Composable
private fun Security(onSave: (String, String) -> Unit) {
    val colors = EsuissTheme.colors
    val values = remember { mutableStateMapOf("email" to "jamie@suiss.com", "phone" to "+1 (415) 555-0142") }
    var editing by rememberSaveable { mutableStateOf<String?>(null) }
    var passkeys by rememberSaveable { mutableStateOf(true) }
    var saved by remember { mutableStateOf<String?>(null) }

    LaunchedEffect(saved) {
        if (saved == null) return@LaunchedEffect
        delay(2200)
        saved = null
    }

    Column(verticalArrangement = Arrangement.spacedBy(14.dp)) {
        EditableFields.forEach { card ->
            EditableCard(
                title = card.title,
                value = values.getValue(card.field),
                editing = editing == card.field,
                onEdit = { editing = card.field },
                onCancel = { editing = null },
                onSave = { value ->
                    values[card.field] = value
                    editing = null
                    saved = card.title
                    onSave(card.field, value)
                },
            )
        }
        Card {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                BasicText("Passkeys", style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                BasicText(if (passkeys) "On for 3 devices" else "Off", style = Typography.base.copy(color = colors.mutedForeground))
            }
            Switch(
                checked = passkeys,
                onCheckedChange = {
                    passkeys = it
                },
            )
        }
        Card {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                BasicText("Two-factor authentication", style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold))
                BasicText("Codes are sent to your trusted devices.", style = Typography.base.copy(color = colors.mutedForeground))
            }
            BasicText("On", style = Typography.sm.copy(color = if (colors.isDark) Palette.green400 else Palette.green600, fontWeight = FontWeight.SemiBold))
        }
        Column(
            Modifier
                .heightIn(min = 24.dp)
                .semantics { liveRegion = LiveRegionMode.Polite },
        ) {
            AnimatedVisibility(
                visible = saved != null,
                enter = fadeIn(tween(800)) + slideInVertically(tween(800)) { it / 4 },
                exit = fadeOut(tween(200)),
            ) {
                Row(horizontalArrangement = Arrangement.spacedBy(6.dp), verticalAlignment = Alignment.CenterVertically) {
                    Icon(PhosphorIcons.Bold.Check, contentDescription = null, size = 16.dp, tint = if (colors.isDark) Palette.green400 else Palette.green600)
                    BasicText("${saved ?: ""} saved.", style = Typography.sm.copy(color = colors.foreground))
                }
            }
        }
    }
}

@Composable
private fun Card(content: @Composable RowScope.() -> Unit) {
    val shape = RoundedCornerShape(18.dp)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .clip(shape)
            .background(EsuissTheme.colors.muted, shape)
            .padding(horizontal = 20.dp, vertical = 18.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
private fun EditableCard(
    title: String,
    value: String,
    editing: Boolean,
    onEdit: () -> Unit,
    onCancel: () -> Unit,
    onSave: (String) -> Unit,
) {
    val colors = EsuissTheme.colors
    var draft by remember(editing, value) { mutableStateOf(value) }
    val focus = remember { FocusRequester() }
    LaunchedEffect(editing) {
        if (!editing) return@LaunchedEffect
        delay(300)
        runCatching { focus.requestFocus() }
    }
    val shape = RoundedCornerShape(18.dp)
    Column(
        Modifier
            .fillMaxWidth()
            .clip(shape)
            .background(colors.muted, shape)
            .padding(horizontal = 20.dp, vertical = 18.dp),
    ) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(3.dp)) {
                BasicText(
                    title,
                    modifier = Modifier.semantics { heading() },
                    style = Typography.lg.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                )
                if (!editing) BasicText(value, style = Typography.base.copy(color = colors.mutedForeground))
            }
            if (!editing) {
                val interaction = remember { MutableInteractionSource() }
                val pressed by interaction.collectIsPressedAsState()
                BasicText(
                    "Edit ›",
                    modifier = Modifier
                        .graphicsLayer { alpha = if (pressed) 0.8f else 1f }
                        .clickable(
                            interactionSource = interaction,
                            indication = null,
                            role = Role.Button,
                            onClickLabel = "Edit ${title.lowercase()}",
                            onClick = onEdit,
                        )
                        .padding(vertical = 8.dp),
                    style = Typography.base.copy(color = colors.primary),
                )
            }
        }
        AnimatedVisibility(
            visible = editing,
            enter = expandVertically(tween(400, easing = RevealEasing)),
            exit = shrinkVertically(tween(400, easing = RevealEasing)),
        ) {
            Column(
                modifier = Modifier.padding(top = 14.dp),
                verticalArrangement = Arrangement.spacedBy(12.dp),
            ) {
                Input(
                    value = draft,
                    onValueChange = { draft = it },
                    modifier = Modifier.focusRequester(focus),
                    placeholder = title,
                )
                Row(horizontalArrangement = Arrangement.spacedBy(10.dp)) {
                    Button("Save", { onSave(draft) }, size = ButtonSize.Sm)
                    Button("Cancel", onCancel, variant = ButtonVariant.Outline, size = ButtonSize.Sm)
                }
            }
        }
    }
}
