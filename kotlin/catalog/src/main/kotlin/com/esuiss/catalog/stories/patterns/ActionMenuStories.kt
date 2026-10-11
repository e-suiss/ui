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
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.patterns.ActionMenu
import com.esuiss.ui.patterns.ActionMenuContent
import com.esuiss.ui.patterns.ActionMenuItem
import com.esuiss.ui.patterns.ActionMenuLabel
import com.esuiss.ui.patterns.ActionMenuSeparator

val actionMenuStories = StoryGroup(
    section = Section.Patterns,
    title = "Action Menu",
    stories = listOf(
        Story("Default") { ActionMenuDemo(defaultOpen = false) },
        Story("OpenByDefault") { ActionMenuDemo(defaultOpen = true) },
    ),
)

@Composable
private fun ActionMenuDemo(defaultOpen: Boolean) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    Column {
        ActionMenu(open = open, onOpenChange = { open = it }) {
            Button("Options", onClick = { open = true }, variant = ButtonVariant.Outline)
            ActionMenuContent {
                ActionMenuLabel("Project")
                ActionMenuItem("Rename", onClick = {})
                ActionMenuItem("Duplicate", onClick = {})
                ActionMenuItem("Move", onClick = {}, enabled = false)
                ActionMenuSeparator()
                ActionMenuItem("Delete", onClick = {}, variant = MenuItemVariant.Destructive)
            }
        }
    }
}
