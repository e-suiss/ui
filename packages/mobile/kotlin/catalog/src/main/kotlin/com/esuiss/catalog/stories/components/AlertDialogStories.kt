package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AlertDialog
import com.esuiss.ui.components.AlertDialogAction
import com.esuiss.ui.components.AlertDialogCancel
import com.esuiss.ui.components.AlertDialogDescription
import com.esuiss.ui.components.AlertDialogFooter
import com.esuiss.ui.components.AlertDialogHeader
import com.esuiss.ui.components.AlertDialogMedia
import com.esuiss.ui.components.AlertDialogSize
import com.esuiss.ui.components.AlertDialogTitle
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme

val alertDialogStories = StoryGroup(
    section = Section.Components,
    title = "Alert Dialog",
    stories = listOf(
        Story("Default") { AlertDialogDefault(defaultOpen = false) },
        Story("OpenByDefault") { AlertDialogDefault(defaultOpen = true) },
        Story("Small") { AlertDialogSmall() },
        Story("WithMedia") { AlertDialogWithMedia() },
        Story("Destructive") { AlertDialogDestructive() },
    ),
)

@Composable
private fun AlertDialogDefault(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button("Show dialog", onClick = { open = true }, variant = ButtonVariant.Outline)
        AlertDialog(open = open, onOpenChange = { open = it }) {
            AlertDialogHeader {
                AlertDialogTitle("Are you absolutely sure?")
                AlertDialogDescription(
                    "This action cannot be undone. This will permanently delete your account and remove your data from our servers.",
                )
            }
            AlertDialogFooter {
                AlertDialogCancel("Cancel")
                AlertDialogAction("Continue", onClick = {})
            }
        }
    }
}

@Composable
private fun AlertDialogSmall() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Discard draft", onClick = { open = true }, variant = ButtonVariant.Outline)
        AlertDialog(open = open, onOpenChange = { open = it }, size = AlertDialogSize.Sm) {
            AlertDialogHeader {
                AlertDialogTitle("Discard draft?")
                AlertDialogDescription("Your unsaved message will be lost.")
            }
            AlertDialogFooter {
                AlertDialogCancel("Keep")
                AlertDialogAction("Discard", onClick = {}, variant = ButtonVariant.Destructive)
            }
        }
    }
}

@Composable
private fun AlertDialogWithMedia() {
    var open by rememberSaveable { mutableStateOf(false) }
    val colors = EsuissTheme.colors
    Column {
        Button("Delete project", onClick = { open = true }, variant = ButtonVariant.Destructive)
        AlertDialog(open = open, onOpenChange = { open = it }) {
            AlertDialogHeader {
                AlertDialogMedia {
                    Box(
                        Modifier
                            .matchParentSize()
                            .background(colors.popover, CircleShape)
                            .background(colors.destructive.copy(alpha = 0.1f), CircleShape),
                    )
                    Icon(PhosphorIcons.Regular.Trash, contentDescription = null, tint = colors.destructive)
                }
                AlertDialogTitle("Delete this project?")
                AlertDialogDescription(
                    "This permanently removes the project and all of its files. This action cannot be undone.",
                )
            }
            AlertDialogFooter {
                AlertDialogCancel("Cancel")
                AlertDialogAction("Delete", onClick = {}, variant = ButtonVariant.Destructive)
            }
        }
    }
}

@Composable
private fun AlertDialogDestructive() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Delete project", onClick = { open = true }, variant = ButtonVariant.Destructive)
        AlertDialog(open = open, onOpenChange = { open = it }) {
            AlertDialogHeader {
                AlertDialogTitle("Delete project?")
                AlertDialogDescription("All deployments and settings for this project will be removed.")
            }
            AlertDialogFooter {
                AlertDialogCancel("Cancel")
                AlertDialogAction("Delete", onClick = {}, variant = ButtonVariant.Destructive)
            }
        }
    }
}
