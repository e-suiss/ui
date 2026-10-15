package com.esuiss.ui.blocks

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
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
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val RoleRevealEasing = CubicBezierEasing(0.32f, 0.72f, 0f, 1f)

private class RolePermission(val name: String, val description: String)

private class RolePermissionGroup(val name: String, val permissions: List<RolePermission>)

private val RolePermissionGroups = listOf(
    RolePermissionGroup(
        "Content",
        listOf(
            RolePermission("Create drafts", "Can start new content drafts."),
            RolePermission("Publish", "Can make content public."),
            RolePermission("Delete", "Can permanently delete content."),
        ),
    ),
    RolePermissionGroup(
        "Customers",
        listOf(
            RolePermission("Customer data", "Sees names, emails and order history."),
            RolePermission("Export", "Downloads the customer list as CSV."),
        ),
    ),
)

private val RolePermissionNames = RolePermissionGroups.flatMap { group -> group.permissions.map { it.name } }

private val EditorRoles = listOf("Editor", "Support", "Viewer")

private val RoleMembers = mapOf("Editor" to 2, "Support" to 2, "Viewer" to 1)

private val RoleDefaults = mapOf(
    "Editor" to listOf(true, true, false, true, false),
    "Support" to listOf(false, false, false, true, false),
    "Viewer" to listOf(false, false, false, false, false),
)

@Composable
fun RolesEditor(
    modifier: Modifier = Modifier,
    onTogglePermission: (role: String, permission: String, enabled: Boolean) -> Unit = { _, _, _ -> },
    onSave: (permissions: Map<String, List<String>>) -> Unit = {},
    onRevert: () -> Unit = {},
    onNewRole: () -> Unit = {},
    onNavigate: (section: String) -> Unit = {},
) {
    val colors = EsuissTheme.colors
    var role by rememberSaveable { mutableStateOf("Editor") }
    var column by rememberSaveable { mutableStateOf(SplitViewColumn.List) }
    val state = remember { mutableStateMapOf<String, List<Boolean>>().apply { putAll(RoleDefaults) } }
    val base = remember { mutableStateMapOf<String, List<Boolean>>().apply { putAll(RoleDefaults) } }
    val dirty = EditorRoles.any { state[it] != base[it] }

    Screen(modifier, edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        AdminTabs("roles", onNavigate) {
            SplitView(column = column, onColumnChange = { column = it }) {
                SplitViewList(title = "Roles") {
                    EditorRoles.forEach { name ->
                        SplitViewItem(isActive = name == role, onClick = { role = name }) {
                            BasicText(name, style = Typography.base.copy(color = colors.foreground))
                            BasicText(
                                "${state.getValue(name).count { it }} permissions",
                                style = Typography.xs.copy(color = colors.mutedForeground),
                            )
                        }
                    }
                    Button(
                        onClick = onNewRole,
                        modifier = Modifier.padding(top = 10.dp),
                        size = ButtonSize.Sm,
                        variant = ButtonVariant.Secondary,
                    ) {
                        Icon(PhosphorIcons.Bold.Plus, contentDescription = null, size = 13.dp)
                        BasicText("New Role", style = LocalContentStyle.current)
                    }
                }
                SplitViewDetail {
                    key(role) {
                        RoleAppear {
                            Column(
                                modifier = Modifier.padding(top = 8.dp),
                                verticalArrangement = Arrangement.spacedBy(18.dp),
                            ) {
                                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
                                    Column(Modifier.weight(1f)) {
                                        BasicText(
                                            role,
                                            modifier = Modifier.semantics { heading() },
                                            style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                        )
                                        val members = RoleMembers.getValue(role)
                                        BasicText(
                                            "$members ${if (members == 1) "user has" else "users have"} this role",
                                            style = Typography.sm.copy(color = colors.mutedForeground),
                                        )
                                    }
                                    if (dirty) {
                                        Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                                            Button(
                                                text = "Revert",
                                                onClick = {
                                                    state.putAll(base)
                                                    onRevert()
                                                },
                                                size = ButtonSize.Sm,
                                                variant = ButtonVariant.Secondary,
                                            )
                                            Button(
                                                text = "Save",
                                                onClick = {
                                                    base.putAll(state)
                                                    onSave(
                                                        EditorRoles.associateWith { name ->
                                                            RolePermissionNames.filterIndexed { index, _ -> state.getValue(name)[index] }
                                                        },
                                                    )
                                                },
                                                size = ButtonSize.Sm,
                                            )
                                        }
                                    }
                                }
                                RolePermissionGroups.forEach { group ->
                                    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                                        BasicText(
                                            group.name,
                                            modifier = Modifier
                                                .padding(horizontal = 4.dp)
                                                .semantics { heading() },
                                            style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                                        )
                                        ItemGroup(variant = ItemGroupVariant.Inset) {
                                            group.permissions.forEachIndexed { position, permission ->
                                                val index = RolePermissionNames.indexOf(permission.name)
                                                if (position > 0) ItemSeparator()
                                                PermissionRow(
                                                    permission = permission,
                                                    checked = state.getValue(role)[index],
                                                ) { enabled ->
                                                    onTogglePermission(role, permission.name, enabled)
                                                    state[role] = state.getValue(role).mapIndexed { i, value -> if (i == index) enabled else value }
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
private fun RoleAppear(content: @Composable () -> Unit) {
    val appear = remember { Animatable(0f) }
    LaunchedEffect(Unit) { appear.animateTo(1f, tween(800, easing = RoleRevealEasing)) }
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
private fun PermissionRow(permission: RolePermission, checked: Boolean, onCheckedChange: (Boolean) -> Unit) {
    val colors = EsuissTheme.colors
    Item(size = ItemSize.Sm, role = null) {
        ItemContent {
            BasicText(
                permission.name,
                style = Typography.base.copy(color = colors.foreground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
            BasicText(permission.description, style = Typography.xs.copy(color = colors.mutedForeground))
        }
        ItemActions {
            Switch(
                checked = checked,
                onCheckedChange = onCheckedChange,
                modifier = Modifier.semantics { contentDescription = permission.name },
            )
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
