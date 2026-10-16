package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Desktop
import com.adamglin.phosphoricons.bold.DeviceMobile
import com.adamglin.phosphoricons.bold.Globe
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
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerItemData
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography

private val DetailRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class DetailUser(val name: String, val email: String, val role: String, val status: String, val hue: Int)

private val DetailUsers = listOf(
    DetailUser("Jamie Rivera", "jamie@example.com", "Admin", "Active", 250),
    DetailUser("Morgan Lee", "morgan@example.com", "Editor", "Active", 30),
    DetailUser("Riley Chen", "riley@example.com", "Support", "Active", 150),
    DetailUser("Taylor Kim", "taylor@example.com", "Viewer", "Suspended", 200),
    DetailUser("Avery Brooks", "avery@example.com", "Editor", "Invited", 330),
    DetailUser("Jordan Park", "jordan@example.com", "Support", "Active", 100),
)

private val DetailRoles = listOf("Admin", "Editor", "Support", "Viewer").map { PickerItemData(it, it) }

private class DetailSession(val device: String, val place: String, val time: String, val icon: ImageVector)

private fun detailSessions() = listOf(
    DetailSession("Book Pro · Browser", "San Francisco, US", "Now", PhosphorIcons.Bold.Desktop),
    DetailSession("Phone Pro · App", "San Francisco, US", "2 hr ago", PhosphorIcons.Bold.DeviceMobile),
    DetailSession("Desktop · Browser", "Seattle, US", "3 days ago", PhosphorIcons.Bold.Globe),
)

private val DetailSecurity = listOf(
    "Two-factor authentication" to true,
    "Require passkey" to false,
    "Sign-in alerts" to true,
)

private fun detailTint(colors: Colors, hue: Int): Color = when (hue) {
    250 -> Palette.indigo500
    30 -> Palette.orange500
    150 -> Palette.green500
    200 -> Palette.blue500
    330 -> Palette.pink500
    else -> Palette.teal500
}

@Composable
fun UsersDetail(
    modifier: Modifier = Modifier,
    onRoleChange: (email: String, role: String) -> Unit = { _, _ -> },
    onSignOut: (device: String) -> Unit = {},
    onSignOutAll: () -> Unit = {},
    onSecurityChange: (email: String, setting: String, enabled: Boolean) -> Unit = { _, _, _ -> },
    onSendPasswordReset: (email: String) -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var selected by rememberSaveable { mutableStateOf(0) }
    var tab by rememberSaveable { mutableStateOf("Profile") }
    var column by rememberSaveable { mutableStateOf(SplitViewColumn.List) }
    val overrides = remember { mutableStateMapOf<Int, String>() }
    val security = remember { mutableStateMapOf<String, Boolean>() }
    val sessions = remember { mutableStateListOf<DetailSession>().apply { addAll(detailSessions()) } }
    val user = DetailUsers[selected]
    val role = overrides[selected] ?: user.role

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("users", onNavigate) {
            SplitView(column = column, onColumnChange = { column = it }) {
                SplitViewList(title = "Users") {
                    DetailUsers.forEachIndexed { index, item ->
                        SplitViewItem(
                            isActive = index == selected,
                            onClick = {
                                selected = index
                                tab = "Profile"
                            },
                        ) {
                            Row(horizontalArrangement = Arrangement.spacedBy(10.dp), verticalAlignment = Alignment.CenterVertically) {
                                DetailAvatar(item, 28.dp)
                                Column {
                                    BasicText(item.name, style = Typography.sm.copy(color = colors.foreground))
                                    BasicText(overrides[index] ?: item.role, style = Typography.xs.copy(color = colors.mutedForeground))
                                }
                            }
                        }
                    }
                }
                SplitViewDetail {
                    key(selected) {
                        DetailAppear {
                            Column(
                                modifier = Modifier.padding(top = 8.dp),
                                verticalArrangement = Arrangement.spacedBy(20.dp),
                            ) {
                                Row(horizontalArrangement = Arrangement.spacedBy(14.dp), verticalAlignment = Alignment.CenterVertically) {
                                    DetailAvatar(user, 64.dp)
                                    Column(verticalArrangement = Arrangement.spacedBy(2.dp)) {
                                        BasicText(
                                            user.name,
                                            modifier = Modifier.semantics { heading() },
                                            style = Typography.xl.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
                                        )
                                        BasicText("${user.email} · $role", style = Typography.sm.copy(color = colors.mutedForeground))
                                    }
                                }
                                ToggleGroup(
                                    value = tab,
                                    onValueChange = { if (it != null) tab = it },
                                    modifier = Modifier.semantics { contentDescription = "Section" },
                                    size = ToggleSize.Sm,
                                    spacing = 0,
                                ) {
                                    listOf("Profile", "Sessions", "Security").forEach { ToggleGroupItem(it, it) }
                                }
                                key(tab) {
                                    DetailAppear {
                                        Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
                                            when (tab) {
                                                "Profile" -> DetailProfile(user, role) { value ->
                                                    onRoleChange(user.email, value)
                                                    overrides[selected] = value
                                                }
                                                "Sessions" -> DetailSessions(
                                                    sessions = sessions,
                                                    onSignOut = { session ->
                                                        onSignOut(session.device)
                                                        sessions.remove(session)
                                                    },
                                                    onSignOutAll = {
                                                        onSignOutAll()
                                                        while (sessions.size > 1) sessions.removeAt(sessions.lastIndex)
                                                    },
                                                )
                                                else -> {
                                                    ItemGroup(variant = ItemGroupVariant.Inset) {
                                                        DetailSecurity.forEachIndexed { index, (label, initial) ->
                                                            if (index > 0) ItemSeparator()
                                                            val keyName = "$selected-$label"
                                                            DetailRow(label) {
                                                                Switch(
                                                                    checked = security[keyName] ?: initial,
                                                                    onCheckedChange = {
                                                                        onSecurityChange(user.email, label, it)
                                                                        security[keyName] = it
                                                                    },
                                                                    modifier = Modifier.semantics { contentDescription = label },
                                                                )
                                                            }
                                                        }
                                                    }
                                                    Button(
                                                        text = "Send Password Reset Link",
                                                        onClick = { onSendPasswordReset(user.email) },
                                                        size = ButtonSize.Sm,
                                                        variant = ButtonVariant.Destructive,
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
    }
}

@Composable
private fun DetailAppear(content: @Composable () -> Unit) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = DetailRevealEasing)) }
    Box(
        Modifier.graphicsLayer {
            alpha = appear.value
            translationY = (1f - appear.value) * 8.dp.toPx()
        },
    ) {
        content()
    }
}

@Composable
private fun DetailAvatar(user: DetailUser, size: Dp) {
    val colors = EsuissTheme.colors
    Box(
        Modifier
            .size(size)
            .background(detailTint(colors, user.hue), CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        BasicText(
            user.name.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
            style = Typography.xs.copy(color = Palette.white, fontWeight = FontWeight.Medium, fontSize = (size.value * 0.38f).sp),
        )
    }
}

@Composable
private fun DetailRow(title: String, action: @Composable () -> Unit) {
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
private fun DetailProfile(user: DetailUser, role: String, onRole: (String) -> Unit) {
    val colors = EsuissTheme.colors
    ItemGroup(variant = ItemGroupVariant.Inset) {
        listOf(
            "Full name" to user.name,
            "Email" to user.email,
            "Department" to "Product",
            "Joined" to "March 12, 2024",
        ).forEach { (label, value) ->
            DetailRow(label) { BasicText(value, style = Typography.base.copy(color = colors.mutedForeground), maxLines = 1) }
            ItemSeparator()
        }
        DetailRow("Role") {
            Picker(
                value = role,
                onValueChange = onRole,
                modifier = Modifier.semantics { contentDescription = "Role" },
                items = DetailRoles,
                size = SelectSize.Sm,
            )
        }
        ItemSeparator()
        DetailRow("Status") { BasicText(user.status, style = Typography.base.copy(color = colors.mutedForeground)) }
    }
}

@Composable
private fun DetailSessions(
    sessions: List<DetailSession>,
    onSignOut: (DetailSession) -> Unit,
    onSignOutAll: () -> Unit,
) {
    val colors = EsuissTheme.colors
    ItemGroup(variant = ItemGroupVariant.Inset) {
        sessions.forEachIndexed { index, session ->
            key(session.device) {
                if (index > 0) ItemSeparator(Modifier.padding(start = 40.dp))
                Item(size = ItemSize.Sm, role = null) {
                    ItemMedia {
                        Box(
                            Modifier
                                .size(30.dp)
                                .background(Palette.zinc500, RoundedCornerShape(7.dp)),
                            contentAlignment = Alignment.Center,
                        ) {
                            Icon(session.icon, contentDescription = null, size = 16.dp, tint = Palette.white)
                        }
                    }
                    ItemContent {
                        BasicText(
                            session.device,
                            style = Typography.base.copy(color = colors.foreground),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        BasicText(
                            "${session.place} · ${session.time}",
                            style = Typography.xs.copy(color = colors.mutedForeground),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                    }
                    ItemActions {
                        if (index == 0) {
                            BasicText("This device", style = Typography.sm.copy(color = colors.foreground))
                        } else {
                            Button(text = "Sign Out", onClick = { onSignOut(session) }, size = ButtonSize.Sm, variant = ButtonVariant.Secondary)
                        }
                    }
                }
            }
        }
    }
    if (sessions.size > 1) {
        Button(
            text = "Sign Out All Other Sessions",
            onClick = onSignOutAll,
            size = ButtonSize.Sm,
            variant = ButtonVariant.Destructive,
        )
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
