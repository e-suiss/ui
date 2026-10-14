package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
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
import com.esuiss.ui.components.Dialog
import com.esuiss.ui.components.DialogDescription
import com.esuiss.ui.components.DialogFooter
import com.esuiss.ui.components.DialogHeader
import com.esuiss.ui.components.DialogTitle
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Label

val dialogStories = StoryGroup(
    section = Section.Components,
    title = "Dialog",
    stories = listOf(
        Story("Default") { DialogDefault(defaultOpen = false) },
        Story("OpenByDefault") { DialogDefault(defaultOpen = true) },
        Story("Destructive") { DialogDestructive() },
        Story("WithoutCloseButton") { DialogWithoutCloseButton() },
        Story("WithCloseLabel") { DialogWithCloseLabel() },
    ),
)

@Composable
private fun DialogDefault(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    var name by rememberSaveable { mutableStateOf("Pedro Duarte") }
    var username by rememberSaveable { mutableStateOf("@peduarte") }
    Column {
        Button("Edit profile", onClick = { open = true }, variant = ButtonVariant.Outline)
        Dialog(open = open, onOpenChange = { open = it }) {
            DialogHeader {
                DialogTitle("Edit profile")
                DialogDescription("Make changes to your profile here. Tap save when you're done.")
            }
            Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
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
                        keyboardOptions = KeyboardOptions(capitalization = KeyboardCapitalization.None),
                    )
                }
            }
            DialogFooter {
                Button("Cancel", onClick = { open = false }, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
                Button("Save changes", onClick = {}, modifier = Modifier.fillMaxWidth())
            }
        }
    }
}

@Composable
private fun DialogDestructive() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Delete account", onClick = { open = true }, variant = ButtonVariant.Destructive)
        Dialog(open = open, onOpenChange = { open = it }) {
            DialogHeader {
                DialogTitle("Delete account")
                DialogDescription("This will permanently delete your account and all of its data.")
            }
            DialogFooter {
                Button("Cancel", onClick = { open = false }, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Secondary)
                Button("Delete", onClick = { open = false }, modifier = Modifier.fillMaxWidth(), variant = ButtonVariant.Destructive)
            }
        }
    }
}

@Composable
private fun DialogWithoutCloseButton() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Show terms", onClick = { open = true }, variant = ButtonVariant.Outline)
        Dialog(open = open, onOpenChange = { open = it }, showCloseButton = false) {
            DialogHeader {
                DialogTitle("Terms updated")
                DialogDescription("We have updated our terms of service. Please review the changes before continuing.")
            }
            DialogFooter(showCloseButton = true) {
                Button("Accept", onClick = {}, modifier = Modifier.fillMaxWidth())
            }
        }
    }
}

@Composable
private fun DialogWithCloseLabel() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Open settings", onClick = { open = true }, variant = ButtonVariant.Outline)
        Dialog(open = open, onOpenChange = { open = it }, closeLabel = "Done") {
            DialogHeader {
                DialogTitle("Notification settings")
                DialogDescription("Choose how you want to be notified about activity in your workspace.")
            }
        }
    }
}
