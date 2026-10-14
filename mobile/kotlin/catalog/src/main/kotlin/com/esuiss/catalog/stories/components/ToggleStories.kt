package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.BookmarkSimple
import com.adamglin.phosphoricons.regular.TextB
import com.adamglin.phosphoricons.regular.TextItalic
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Toggle
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.ToggleVariant

val toggleStories = StoryGroup(
    section = Section.Components,
    title = "Toggle",
    stories = listOf(
        Story("Default") { ToggleBold() },
        Story("Pressed") { ToggleBold(initial = true) },
        Story("Variants") { ToggleVariants() },
        Story("Sizes") { ToggleSizes() },
        Story("WithText") { ToggleWithText() },
        Story("Disabled") { ToggleDisabled() },
    ),
)

@Composable
private fun ToggleDemo(
    label: String,
    initial: Boolean = false,
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    enabled: Boolean = true,
    content: @Composable RowScope.() -> Unit,
) {
    var pressed by rememberSaveable { mutableStateOf(initial) }
    Toggle(
        pressed,
        { pressed = it },
        Modifier.semantics { contentDescription = label },
        variant = variant,
        size = size,
        enabled = enabled,
        content = content,
    )
}

@Composable
private fun ToggleRow(content: @Composable () -> Unit) {
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        content()
    }
}

@Composable
private fun ToggleBold(initial: Boolean = false) {
    ToggleRow {
        ToggleDemo("Toggle bold", initial = initial) {
            Icon(PhosphorIcons.Regular.TextB, contentDescription = null)
        }
    }
}

@Composable
private fun ToggleVariants() {
    ToggleRow {
        ToggleDemo("Toggle italic") {
            Icon(PhosphorIcons.Regular.TextItalic, contentDescription = null)
        }
        ToggleDemo("Toggle italic", variant = ToggleVariant.Outline) {
            Icon(PhosphorIcons.Regular.TextItalic, contentDescription = null)
        }
    }
}

@Composable
private fun ToggleSizes() {
    ToggleRow {
        listOf(ToggleSize.Sm to "Small", ToggleSize.Default to "Default", ToggleSize.Lg to "Large").forEach { (size, label) ->
            key(label) {
                ToggleDemo(label, variant = ToggleVariant.Outline, size = size) {
                    Icon(PhosphorIcons.Regular.TextB, contentDescription = null)
                }
            }
        }
    }
}

@Composable
private fun ToggleWithText() {
    ToggleRow {
        ToggleDemo("Bookmark", variant = ToggleVariant.Outline) {
            Icon(PhosphorIcons.Regular.BookmarkSimple, contentDescription = null)
            Text("Bookmark")
        }
    }
}

@Composable
private fun ToggleDisabled() {
    ToggleRow {
        ToggleDemo("Toggle bold", enabled = false) {
            Icon(PhosphorIcons.Regular.TextB, contentDescription = null)
        }
        ToggleDemo("Toggle italic", initial = true, variant = ToggleVariant.Outline, enabled = false) {
            Icon(PhosphorIcons.Regular.TextItalic, contentDescription = null)
        }
    }
}
