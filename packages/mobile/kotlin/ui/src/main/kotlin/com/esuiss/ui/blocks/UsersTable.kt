package com.esuiss.ui.blocks

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
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
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.Plus
import com.adamglin.phosphoricons.fill.ChartBar as FillChartBar
import com.adamglin.phosphoricons.fill.Gear as FillGear
import com.adamglin.phosphoricons.fill.Shield as FillShield
import com.adamglin.phosphoricons.fill.Users as FillUsers
import com.adamglin.phosphoricons.regular.ChartBar
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.Shield
import com.adamglin.phosphoricons.regular.Users
import com.esuiss.ui.components.Badge
import com.esuiss.ui.components.BadgeVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ChipGroup
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderActionsSide
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.InputGroup
import com.esuiss.ui.components.InputGroupAddon
import com.esuiss.ui.components.InputGroupInput
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.rememberHeaderState
import com.esuiss.ui.interactions.SelectionList
import com.esuiss.ui.interactions.SelectionListBar
import com.esuiss.ui.interactions.SelectionListItem
import com.esuiss.ui.interactions.SelectionListScope
import com.esuiss.ui.interactions.SelectionListTrigger
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

private class TableUser(
    val name: String,
    val email: String,
    role: String,
    status: String,
    val seen: String,
    val hue: Int,
) {
    var role by mutableStateOf(role)
    var status by mutableStateOf(status)
}

private fun tableUsers() = listOf(
    TableUser("Jamie Rivera", "jamie@company.com", "Admin", "Active", "2 min ago", 250),
    TableUser("Morgan Lee", "morgan@company.com", "Editor", "Active", "1 hr ago", 30),
    TableUser("Riley Chen", "riley@company.com", "Support", "Active", "Yesterday", 150),
    TableUser("Taylor Kim", "taylor@company.com", "Viewer", "Suspended", "3 days ago", 200),
    TableUser("Avery Brooks", "avery@company.com", "Editor", "Invited", "—", 330),
    TableUser("Jordan Park", "jordan@company.com", "Support", "Active", "5 hr ago", 100),
)

private val TableRoles = listOf("Admin", "Editor", "Support", "Viewer")

private fun tableTint(colors: Colors, hue: Int): Color = when (hue) {
    250 -> Palette.indigo500
    30 -> Palette.orange500
    150 -> Palette.green500
    200 -> Palette.blue500
    330 -> Palette.pink500
    else -> Palette.teal500
}

@Composable
fun UsersTable(
    modifier: Modifier = Modifier,
    onInvite: () -> Unit = {},
    onFilterChange: (role: String) -> Unit = {},
    onBulkUpdate: (emails: List<String>, role: String?, status: String?) -> Unit = { _, _, _ -> },
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val header = rememberHeaderState()
    val users = remember { mutableStateListOf<TableUser>().apply { addAll(tableUsers()) } }
    var query by rememberSaveable { mutableStateOf("") }
    var role by rememberSaveable { mutableStateOf("All") }
    var editing by rememberSaveable { mutableStateOf(false) }
    var selected by remember { mutableStateOf(listOf<String>()) }
    val list = users.filter {
        (role == "All" || it.role == role) &&
            (query.isBlank() || "${it.name} ${it.email}".contains(query.trim(), ignoreCase = true))
    }

    fun bulk(role: String? = null, status: String? = null) {
        onBulkUpdate(selected, role, status)
        users.filter { it.email in selected }.forEach { user ->
            if (role != null) user.role = role
            if (status != null) user.status = status
        }
        selected = emptyList()
        editing = false
    }

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("users", onNavigate) {
            SelectionList(
                editing = editing,
                onEditingChange = { editing = it },
                value = selected,
                onValueChange = { selected = it },
            ) {
                Column(
                    Modifier
                        .fillMaxSize()
                        .nestedScroll(header.nestedScrollConnection),
                ) {
                    Header(state = header) {
                        HeaderActions(side = HeaderActionsSide.Leading) { SelectionListTrigger() }
                        HeaderTitle("Users")
                        HeaderLargeTitle("Users", subtitle = "${users.size} people")
                        HeaderActions {
                            Button(onClick = onInvite, size = ButtonSize.Sm) {
                                Icon(PhosphorIcons.Bold.Plus, contentDescription = null, size = 13.dp)
                                BasicText("Invite", style = LocalContentStyle.current)
                            }
                        }
                    }
                    Column(
                        Modifier
                            .weight(1f)
                            .fillMaxWidth()
                            .verticalScroll(rememberScrollState())
                            .padding(start = 16.dp, end = 16.dp, top = 8.dp, bottom = 96.dp),
                        verticalArrangement = Arrangement.spacedBy(16.dp),
                    ) {
                        InputGroup(Modifier.semantics { contentDescription = "Search users" }) {
                            InputGroupAddon {
                                Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 16.dp, tint = colors.mutedForeground)
                            }
                            InputGroupInput(value = query, onValueChange = { query = it }, placeholder = "Search")
                        }
                        ChipGroup(
                            value = role,
                            onValueChange = { value ->
                                if (value != null && value != role) {
                                    onFilterChange(value)
                                    role = value
                                    selected = emptyList()
                                }
                            },
                            modifier = Modifier.semantics { contentDescription = "Role" },
                            scrollable = true,
                        ) {
                            (listOf("All") + TableRoles).forEach { Chip(it, it) }
                        }
                        Column(
                            Modifier
                                .fillMaxWidth()
                                .clip(RoundedCornerShape(Radius.xl2))
                                .background(colors.muted),
                        ) {
                            list.forEachIndexed { index, user ->
                                key(user.email) {
                                    if (index > 0) {
                                        Box(
                                            Modifier
                                                .padding(start = if (editing) 96.dp else 56.dp)
                                                .fillMaxWidth()
                                                .height(1.dp)
                                                .background(colors.border),
                                        )
                                    }
                                    UserTableRow(user)
                                }
                            }
                            if (list.isEmpty()) {
                                BasicText(
                                    "No matching users.",
                                    modifier = Modifier
                                        .fillMaxWidth()
                                        .padding(24.dp),
                                    style = Typography.sm.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                                )
                            }
                        }
                        BasicText(
                            if (selected.isNotEmpty()) "${selected.size} selected" else "Tap rows to select",
                            modifier = Modifier.padding(horizontal = 4.dp),
                            style = Typography.xs.copy(color = colors.mutedForeground),
                        )
                    }
                }
                SelectionListBar {
                    val empty = this@SelectionList.selected.isEmpty()
                    Button(
                        text = "Make Editor",
                        onClick = { bulk(role = "Editor") },
                        modifier = Modifier.weight(1f),
                        variant = ButtonVariant.Plain,
                        size = ButtonSize.Sm,
                        enabled = !empty,
                    )
                    Button(
                        text = "Activate",
                        onClick = { bulk(status = "Active") },
                        modifier = Modifier.weight(1f),
                        variant = ButtonVariant.Plain,
                        size = ButtonSize.Sm,
                        enabled = !empty,
                    )
                    Button(
                        text = "Suspend",
                        onClick = { bulk(status = "Suspended") },
                        modifier = Modifier.weight(1f),
                        variant = ButtonVariant.Destructive,
                        size = ButtonSize.Sm,
                        enabled = !empty,
                    )
                }
            }
        }
    }
}

@Composable
private fun SelectionListScope.UserTableRow(user: TableUser) {
    val colors = EsuissTheme.colors
    val status = when (user.status) {
        "Suspended" -> colors.destructive
        "Invited" -> colors.mutedForeground
        else -> colors.foreground
    }
    SelectionListItem(user.email, contentDescription = user.name) {
        Row(
            modifier = Modifier
                .weight(1f)
                .clickable(
                    interactionSource = remember { MutableInteractionSource() },
                    indication = null,
                    role = Role.Checkbox,
                    onClickLabel = "Select ${user.name}",
                ) {
                    setEditing(true)
                    toggle(user.email)
                }
                .padding(horizontal = 16.dp, vertical = 10.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                Modifier
                    .size(28.dp)
                    .background(tableTint(colors, user.hue), CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                BasicText(
                    user.name.split(" ").mapNotNull { it.firstOrNull() }.joinToString(""),
                    style = Typography.xs.copy(color = Palette.white, fontWeight = FontWeight.Medium),
                )
            }
            Column(Modifier.weight(1f)) {
                BasicText(
                    user.name,
                    style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
                BasicText(
                    user.email,
                    style = Typography.xs.copy(color = colors.mutedForeground),
                    maxLines = 1,
                    overflow = TextOverflow.Ellipsis,
                )
            }
            Column(horizontalAlignment = Alignment.End, verticalArrangement = Arrangement.spacedBy(2.dp)) {
                Badge(user.role, variant = BadgeVariant.Outline)
                BasicText(user.status, style = Typography.xs.copy(color = status))
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
