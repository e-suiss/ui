package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AlertSheet
import com.esuiss.ui.components.AlertSheetAction
import com.esuiss.ui.components.AlertSheetActionVariant
import com.esuiss.ui.components.AlertSheetCancel
import com.esuiss.ui.components.AlertSheetDescription
import com.esuiss.ui.components.AlertSheetGroup
import com.esuiss.ui.components.AlertSheetHeader
import com.esuiss.ui.components.AlertSheetTitle
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant

val alertSheetStories = StoryGroup(
    section = Section.Components,
    title = "Alert Sheet",
    stories = listOf(
        Story("Default") { AlertSheetDefault(defaultOpen = false) },
        Story("OpenByDefault") { AlertSheetDefault(defaultOpen = true) },
        Story("NotDismissible") { AlertSheetNotDismissible() },
    ),
)

@Composable
private fun AlertSheetDefault(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button("Show sheet", onClick = { open = true }, variant = ButtonVariant.Outline)
        AlertSheet(open = open, onOpenChange = { open = it }) {
            AlertSheetGroup {
                AlertSheetHeader {
                    AlertSheetTitle("Delete this photo?")
                    AlertSheetDescription("This photo will be deleted from all of your devices.")
                }
                AlertSheetAction("Save to Files", onClick = {})
                AlertSheetAction("Delete Photo", onClick = {}, variant = AlertSheetActionVariant.Destructive)
            }
            AlertSheetCancel("Cancel")
        }
    }
}

@Composable
private fun AlertSheetNotDismissible() {
    var open by rememberSaveable { mutableStateOf(false) }
    Column {
        Button("Sign out", onClick = { open = true }, variant = ButtonVariant.Outline)
        AlertSheet(open = open, onOpenChange = { open = it }, dismissible = false) {
            AlertSheetGroup {
                AlertSheetHeader {
                    AlertSheetTitle("Sign out of all devices?")
                }
                AlertSheetAction("Sign Out", onClick = {}, variant = AlertSheetActionVariant.Destructive)
                AlertSheetAction("Keep Signed In Here", onClick = {}, enabled = false)
            }
            AlertSheetCancel("Cancel")
        }
    }
}
