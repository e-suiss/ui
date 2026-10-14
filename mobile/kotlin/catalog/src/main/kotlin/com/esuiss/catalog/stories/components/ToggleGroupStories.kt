package com.esuiss.catalog.stories.components

import androidx.compose.foundation.gestures.Orientation
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.TextAlignCenter
import com.adamglin.phosphoricons.regular.TextAlignLeft
import com.adamglin.phosphoricons.regular.TextAlignRight
import com.adamglin.phosphoricons.regular.TextB
import com.adamglin.phosphoricons.regular.TextItalic
import com.adamglin.phosphoricons.regular.TextUnderline
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.components.ToggleSize
import com.esuiss.ui.components.ToggleVariant

val toggleGroupStories = StoryGroup(
    section = Section.Components,
    title = "Toggle Group",
    stories = listOf(
        Story("Default") { ToggleGroupFormatting() },
        Story("Outline") { ToggleGroupFormatting(variant = ToggleVariant.Outline, initial = setOf("italic")) },
        Story("Attached") { ToggleGroupFormatting(variant = ToggleVariant.Outline, spacing = 0) },
        Story("Sizes") { ToggleGroupSizes() },
        Story("Segmented") { ToggleGroupSegmented() },
        Story("SegmentedVertical") { ToggleGroupSegmented(orientation = Orientation.Vertical) },
        Story("SegmentedMultiple") { ToggleGroupFormatting(spacing = 0, initial = setOf("bold", "underline")) },
        Story("SegmentedSizes") { ToggleGroupSegmentedSizes() },
        Story("SingleSelection") { ToggleGroupAlignment() },
        Story("Vertical") { ToggleGroupFormatting(variant = ToggleVariant.Outline, spacing = 0, orientation = Orientation.Vertical) },
        Story("Disabled") { ToggleGroupFormatting(enabled = false) },
    ),
)

private val toggleGroupViews = listOf("day", "week", "month", "year")

@Composable
private fun ToggleGroupIconItem(value: String, label: String, icon: ImageVector) {
    ToggleGroupItem(value, Modifier.semantics { contentDescription = label }) {
        Icon(icon, contentDescription = null)
    }
}

@Composable
private fun ToggleGroupFormatting(
    variant: ToggleVariant = ToggleVariant.Default,
    size: ToggleSize = ToggleSize.Default,
    spacing: Int = 2,
    orientation: Orientation = Orientation.Horizontal,
    enabled: Boolean = true,
    initial: Set<String> = setOf("bold"),
) {
    var values by rememberSaveable { mutableStateOf(initial.toList()) }
    ToggleGroup(
        values = values.toSet(),
        onValuesChange = { values = it.toList() },
        variant = variant,
        size = size,
        spacing = spacing,
        orientation = orientation,
        enabled = enabled,
    ) {
        ToggleGroupIconItem("bold", "Toggle bold", PhosphorIcons.Regular.TextB)
        ToggleGroupIconItem("italic", "Toggle italic", PhosphorIcons.Regular.TextItalic)
        ToggleGroupIconItem("underline", "Toggle underline", PhosphorIcons.Regular.TextUnderline)
    }
}

@Composable
private fun ToggleGroupAlignment() {
    var value by rememberSaveable { mutableStateOf<String?>("left") }
    ToggleGroup(value = value, onValueChange = { value = it }, variant = ToggleVariant.Outline) {
        ToggleGroupIconItem("left", "Align left", PhosphorIcons.Regular.TextAlignLeft)
        ToggleGroupIconItem("center", "Align center", PhosphorIcons.Regular.TextAlignCenter)
        ToggleGroupIconItem("right", "Align right", PhosphorIcons.Regular.TextAlignRight)
    }
}

@Composable
private fun ToggleGroupSegmented(
    items: List<String> = toggleGroupViews,
    size: ToggleSize = ToggleSize.Default,
    orientation: Orientation = Orientation.Horizontal,
) {
    var value by rememberSaveable { mutableStateOf<String?>("week") }
    ToggleGroup(
        value = value,
        onValueChange = { value = it },
        modifier = Modifier.semantics { contentDescription = "Calendar view" },
        size = size,
        spacing = 0,
        orientation = orientation,
    ) {
        items.forEach { item ->
            ToggleGroupItem(item.replaceFirstChar { it.uppercaseChar() }, value = item)
        }
    }
}

@Composable
private fun ToggleGroupSizes() {
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ToggleGroupFormatting(size = ToggleSize.Sm)
        ToggleGroupFormatting()
        ToggleGroupFormatting(size = ToggleSize.Lg)
    }
}

@Composable
private fun ToggleGroupSegmentedSizes() {
    val items = toggleGroupViews.take(3)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ToggleGroupSegmented(items, ToggleSize.Sm)
        ToggleGroupSegmented(items)
        ToggleGroupSegmented(items, ToggleSize.Lg)
    }
}
