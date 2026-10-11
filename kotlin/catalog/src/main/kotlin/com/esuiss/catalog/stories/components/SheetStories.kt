package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.KeyboardCapitalization
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Sheet
import com.esuiss.ui.components.SheetDescription
import com.esuiss.ui.components.SheetFooter
import com.esuiss.ui.components.SheetHeader
import com.esuiss.ui.components.SheetSide
import com.esuiss.ui.components.SheetTitle

val sheetStories = StoryGroup(
    section = Section.Components,
    title = "Sheet",
    stories = listOf(
        Story("Default") { SheetDefault(defaultOpen = false) },
        Story("OpenByDefault") { SheetDefault(defaultOpen = true) },
        Story("Sides") { SheetSides() },
        Story("WithCloseLabel") { SheetWithCloseLabel() },
    ),
)

@Composable
private fun ProfileSheet(open: Boolean, onOpenChange: (Boolean) -> Unit, side: SheetSide = SheetSide.Right) {
    var name by rememberSaveable { mutableStateOf("Pedro Duarte") }
    var username by rememberSaveable { mutableStateOf("@peduarte") }
    Sheet(open = open, onOpenChange = onOpenChange, side = side) {
        SheetHeader {
            SheetTitle("Edit profile")
            SheetDescription("Make changes to your profile here. Tap save when you're done.")
        }
        Column(Modifier.padding(horizontal = 24.dp), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Label("Name")
                Input(name, { name = it }, Modifier.semantics { contentDescription = "Name" })
            }
            Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
                Label("Username")
                Input(
                    username,
                    { username = it },
                    Modifier.semantics { contentDescription = "Username" },
                    keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.None, autoCorrectEnabled = false),
                )
            }
        }
        SheetFooter {
            Button("Save changes", onClick = {}, modifier = Modifier.fillMaxWidth())
            Button("Close", onClick = { onOpenChange(false) }, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
        }
    }
}

@Composable
private fun SheetDefault(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button("Open", onClick = { open = true }, variant = ButtonVariant.Outline)
        ProfileSheet(open, { open = it })
    }
}

@Composable
private fun SheetSides() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        SheetSide.entries.forEach { side ->
            var open by rememberSaveable(side.name) { mutableStateOf(false) }
            Button(side.name, onClick = { open = true }, variant = ButtonVariant.Outline)
            ProfileSheet(open, { open = it }, side)
        }
    }
}

@Composable
private fun SheetWithCloseLabel() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Open with label", onClick = { open = true }, variant = ButtonVariant.Outline)
        Sheet(open = open, onOpenChange = { open = it }, side = SheetSide.Bottom, closeLabel = "Done") {
            SheetHeader {
                SheetTitle("Notifications")
                SheetDescription("Choose what you want to be notified about.")
            }
        }
    }
}
