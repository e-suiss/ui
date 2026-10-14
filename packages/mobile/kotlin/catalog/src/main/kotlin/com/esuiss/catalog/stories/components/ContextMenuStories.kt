package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.ContextMenu
import com.esuiss.ui.components.DropdownMenuCheckboxItem
import com.esuiss.ui.components.DropdownMenuItem
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.DropdownMenuSeparator
import com.esuiss.ui.components.DropdownMenuSub
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val contextMenuStories = StoryGroup(
    section = Section.Components,
    title = "Context Menu",
    stories = listOf(
        Story("Default") { ContextMenuDemo(defaultOpen = false) },
        Story("Simple") { ContextMenuSimple() },
        Story("OpenByDefault") { ContextMenuDemo(defaultOpen = true) },
    ),
)

@Composable
private fun ContextMenuTriggerArea() {
    val color = EsuissTheme.colors.separator
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .height(144.dp)
            .drawBehind {
                val stroke = 1.dp.toPx()
                drawRoundRect(
                    color = color,
                    topLeft = Offset(stroke / 2, stroke / 2),
                    size = Size(size.width - stroke, size.height - stroke),
                    cornerRadius = CornerRadius(Radius.md.toPx()),
                    style = Stroke(stroke, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4.dp.toPx(), 3.dp.toPx()))),
                )
            },
        contentAlignment = Alignment.Center,
    ) {
        Text("Long press here", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
    }
}

@Composable
private fun ContextMenuDemo(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var showBookmarks by rememberSaveable { mutableStateOf(true) }
    var showUrls by rememberSaveable { mutableStateOf(false) }
    var person by rememberSaveable { mutableStateOf("pedro") }
    ContextMenu(
        expanded = open,
        onExpandedChange = { open = it },
        trigger = { ContextMenuTriggerArea() },
        modifier = Modifier.width(256.dp),
    ) {
        DropdownMenuItem("Back", onClick = {}, inset = true)
        DropdownMenuItem("Forward", onClick = {}, inset = true, enabled = false)
        DropdownMenuItem("Reload", onClick = {}, inset = true)
        DropdownMenuSub("More tools", inset = true) {
            Column(Modifier.width(192.dp)) {
                DropdownMenuItem("Save page", onClick = {})
                DropdownMenuItem("Create shortcut", onClick = {})
                DropdownMenuSeparator()
                DropdownMenuItem("Delete", onClick = {}, variant = MenuItemVariant.Destructive)
            }
        }
        DropdownMenuSeparator()
        DropdownMenuCheckboxItem("Show bookmarks", checked = showBookmarks, onCheckedChange = { showBookmarks = it })
        DropdownMenuCheckboxItem("Show full URLs", checked = showUrls, onCheckedChange = { showUrls = it })
        DropdownMenuSeparator()
        DropdownMenuRadioGroup(value = person, onValueChange = { person = it }) {
            DropdownMenuLabel("People", inset = true)
            DropdownMenuRadioItem("pedro", "Pedro Duarte")
            DropdownMenuRadioItem("colm", "Colm Tuite")
        }
    }
}

@Composable
private fun ContextMenuSimple() {
    var open by rememberSaveable { mutableStateOf(false) }
    ContextMenu(
        expanded = open,
        onExpandedChange = { open = it },
        trigger = { ContextMenuTriggerArea() },
        modifier = Modifier.width(192.dp),
    ) {
        DropdownMenuItem("Profile", onClick = {})
        DropdownMenuItem("Billing", onClick = {})
        DropdownMenuItem("Team", onClick = {})
        DropdownMenuItem("Subscription", onClick = {})
    }
}
