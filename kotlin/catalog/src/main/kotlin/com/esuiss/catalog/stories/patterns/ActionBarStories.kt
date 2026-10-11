package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ClipboardText
import com.adamglin.phosphoricons.regular.Copy
import com.adamglin.phosphoricons.regular.Scissors
import com.adamglin.phosphoricons.regular.Trash
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.MenuItemVariant
import com.esuiss.ui.patterns.ActionBar
import com.esuiss.ui.patterns.ActionBarItem
import com.esuiss.ui.patterns.ActionBarLabel
import com.esuiss.ui.patterns.ActionBarScope
import com.esuiss.ui.patterns.ActionBarSeparator

val actionBarStories = StoryGroup(
    section = Section.Patterns,
    title = "Action Bar",
    stories = listOf(
        Story("Default") { ActionBarDemo() },
        Story("Overflow") { ActionBarDemo(defaultOpen = true) },
        Story("WithIcons") { ActionBarDemo(withIcons = true) },
        Story("OpenByDefault") { ActionBarDemo(defaultOpen = true, fileOpen = true) },
        Story("NotDismissible") { ActionBarDemo(dismissible = false, view = false) },
        Story("CustomLabels") { ActionBarDemo(view = false, moreLabel = "Document actions", cancelLabel = "Close") },
        Story("Floating") { ActionBarDemo(defaultOpen = true, floating = true) },
    ),
)

@Composable
private fun ActionBarDemo(
    defaultOpen: Boolean = false,
    fileOpen: Boolean = false,
    withIcons: Boolean = false,
    view: Boolean = true,
    dismissible: Boolean = true,
    floating: Boolean = false,
    moreLabel: String = "More actions",
    cancelLabel: String = "Cancel",
) {
    var open by rememberSaveable { mutableStateOf(defaultOpen) }
    ActionBar(
        open = open,
        onOpenChange = { open = it },
        modifier = Modifier.fillMaxWidth(),
        dismissible = dismissible,
        floating = floating,
        moreLabel = moreLabel,
        cancelLabel = cancelLabel,
    ) {
        actionBarFileMenu(fileOpen)
        actionBarEditMenu(withIcons)
        if (view) actionBarViewMenu()
    }
}

private fun ActionBarScope.actionBarFileMenu(defaultOpen: Boolean) {
    ActionBarMenu(defaultOpen = defaultOpen) {
        ActionBarTrigger("File")
        ActionBarContent {
            ActionBarItem("New tab", onClick = {})
            ActionBarItem("New window", onClick = {})
            ActionBarItem("New incognito window", onClick = {}, enabled = false)
            ActionBarSeparator()
            ActionBarItem("Print", onClick = {})
        }
    }
}

private fun ActionBarScope.actionBarEditMenu(withIcons: Boolean) {
    ActionBarMenu {
        ActionBarTrigger("Edit")
        ActionBarContent {
            ActionBarItem("Cut", onClick = {}, icon = if (withIcons) PhosphorIcons.Regular.Scissors else null)
            ActionBarItem("Copy", onClick = {}, icon = if (withIcons) PhosphorIcons.Regular.Copy else null)
            ActionBarItem("Paste", onClick = {}, icon = if (withIcons) PhosphorIcons.Regular.ClipboardText else null)
            ActionBarSeparator()
            ActionBarItem(
                "Delete",
                onClick = {},
                variant = MenuItemVariant.Destructive,
                icon = if (withIcons) PhosphorIcons.Regular.Trash else null,
            )
        }
    }
}

private fun ActionBarScope.actionBarViewMenu() {
    ActionBarMenu {
        ActionBarTrigger("View")
        ActionBarContent {
            ActionBarLabel("Appearance")
            ActionBarItem("Zoom in", onClick = {})
            ActionBarItem("Zoom out", onClick = {})
            ActionBarItem("Actual size", onClick = {})
        }
    }
}
