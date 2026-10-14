package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.AlertSheetActionVariant
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.patterns.Confirm
import com.esuiss.ui.patterns.ConfirmAction
import com.esuiss.ui.patterns.ConfirmCancel
import com.esuiss.ui.patterns.ConfirmDescription
import com.esuiss.ui.patterns.ConfirmFooter
import com.esuiss.ui.patterns.ConfirmHeader
import com.esuiss.ui.patterns.ConfirmTitle

val confirmStories = StoryGroup(
    section = Section.Patterns,
    title = "Confirm",
    stories = listOf(
        Story("Default") { ConfirmDemo(defaultOpen = false) },
        Story("OpenByDefault") { ConfirmDemo(defaultOpen = true) },
    ),
)

@Composable
private fun ConfirmDemo(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        Button("Delete account", onClick = { open = true }, variant = ButtonVariant.Destructive)
        Confirm(open = open, onOpenChange = { open = it }) {
            ConfirmHeader {
                ConfirmTitle("Delete your account?")
                ConfirmDescription("This permanently deletes your account and all of its data.")
            }
            ConfirmFooter {
                ConfirmCancel("Cancel")
                ConfirmAction("Delete Account", onClick = {}, variant = AlertSheetActionVariant.Destructive)
            }
        }
    }
}
