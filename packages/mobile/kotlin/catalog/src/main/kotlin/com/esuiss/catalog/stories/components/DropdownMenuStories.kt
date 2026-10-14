package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.CreditCard
import com.adamglin.phosphoricons.regular.Envelope
import com.adamglin.phosphoricons.regular.Gear
import com.adamglin.phosphoricons.regular.SignOut
import com.adamglin.phosphoricons.regular.User
import com.adamglin.phosphoricons.regular.UserPlus
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.DropdownMenu
import com.esuiss.ui.components.DropdownMenuCheckboxItem
import com.esuiss.ui.components.DropdownMenuGroup
import com.esuiss.ui.components.DropdownMenuItem
import com.esuiss.ui.components.DropdownMenuLabel
import com.esuiss.ui.components.DropdownMenuRadioGroup
import com.esuiss.ui.components.DropdownMenuRadioItem
import com.esuiss.ui.components.DropdownMenuSeparator
import com.esuiss.ui.components.DropdownMenuSub
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.components.PopupAlign

val dropdownMenuStories = StoryGroup(
    section = Section.Components,
    title = "Dropdown Menu",
    stories = listOf(
        Story("Default") { DropdownMenuAccount(defaultOpen = false) },
        Story("Checkboxes") { DropdownMenuCheckboxes() },
        Story("RadioGroup") { DropdownMenuRadio() },
        Story("Inset") { DropdownMenuInset() },
        Story("OpenByDefault") { DropdownMenuAccount(defaultOpen = true) },
    ),
)

@Composable
private fun DropdownMenuDemo(
    label: String,
    defaultOpen: Boolean = false,
    content: @Composable () -> Unit,
) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        DropdownMenu(
            expanded = open,
            onExpandedChange = { open = it },
            trigger = { Button(label, onClick = { open = !open }, variant = ButtonVariant.Outline) },
            modifier = Modifier.width(224.dp),
            align = PopupAlign.Start,
        ) {
            content()
        }
    }
}

@Composable
private fun DropdownMenuAccount(defaultOpen: Boolean) {
    DropdownMenuDemo("Open menu", defaultOpen) {
        DropdownMenuLabel("My account")
        DropdownMenuGroup {
            DropdownMenuItem("Profile", onClick = {}, icon = PhosphorIcons.Regular.User)
            DropdownMenuItem("Billing", onClick = {}, icon = PhosphorIcons.Regular.CreditCard)
            DropdownMenuItem("Settings", onClick = {}, icon = PhosphorIcons.Regular.Gear)
        }
        DropdownMenuSeparator()
        DropdownMenuSub("Invite users", icon = PhosphorIcons.Regular.UserPlus) {
            DropdownMenuItem("Email", onClick = {}, icon = PhosphorIcons.Regular.Envelope)
            DropdownMenuItem("Message", onClick = {}, icon = PhosphorIcons.Regular.ChatCircle)
        }
        DropdownMenuSeparator()
        DropdownMenuItem("Log out", onClick = {}, icon = PhosphorIcons.Regular.SignOut, variant = MenuItemVariant.Destructive)
    }
}

@Composable
private fun DropdownMenuCheckboxes() {
    var statusBar by rememberSaveable { mutableStateOf(true) }
    var activityBar by rememberSaveable { mutableStateOf(false) }
    var panel by rememberSaveable { mutableStateOf(false) }
    DropdownMenuDemo("View") {
        DropdownMenuLabel("Appearance")
        DropdownMenuSeparator()
        DropdownMenuCheckboxItem("Status bar", checked = statusBar, onCheckedChange = { statusBar = it })
        DropdownMenuCheckboxItem("Activity bar", checked = activityBar, onCheckedChange = { activityBar = it }, enabled = false)
        DropdownMenuCheckboxItem("Panel", checked = panel, onCheckedChange = { panel = it })
    }
}

@Composable
private fun DropdownMenuRadio() {
    var position by rememberSaveable { mutableStateOf("bottom") }
    DropdownMenuDemo("Panel position") {
        DropdownMenuLabel("Panel position")
        DropdownMenuSeparator()
        DropdownMenuRadioGroup(value = position, onValueChange = { position = it }) {
            DropdownMenuRadioItem("top", "Top")
            DropdownMenuRadioItem("bottom", "Bottom")
            DropdownMenuRadioItem("right", "Right")
        }
    }
}

@Composable
private fun DropdownMenuInset() {
    DropdownMenuDemo("Open menu") {
        DropdownMenuLabel("Actions", inset = true)
        DropdownMenuItem("Copy", onClick = {}, inset = true)
        DropdownMenuItem("Paste", onClick = {}, inset = true)
        DropdownMenuSeparator()
        DropdownMenuItem("Delete", onClick = {}, inset = true, variant = MenuItemVariant.Destructive)
    }
}
