package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.FlowRow
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.layout.layout
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CalendarBlank
import com.adamglin.phosphoricons.regular.Coffee
import com.adamglin.phosphoricons.regular.ForkKnife
import com.adamglin.phosphoricons.regular.MapPin
import com.adamglin.phosphoricons.regular.Star
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ChipGroup
import com.esuiss.ui.components.ChipSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val chipStories = StoryGroup(
    section = Section.Components,
    title = "Chip",
    stories = listOf(
        Story("Default") { ChipDefault() },
        Story("States") { ChipStates() },
        Story("Sizes") { ChipSizes() },
        Story("WithIcon") { ChipWithIcon() },
        Story("Removable") { ChipRemovable() },
        Story("Controlled") { ChipControlled() },
        Story("GroupSingle") { ChipGroupSingle() },
        Story("GroupMultiple") { ChipGroupMultiple() },
        Story("GroupUncontrolled") { ChipGroupUncontrolled() },
        Story("GroupScrollable") { ChipGroupScrollable() },
        Story("GroupDisabled") { ChipGroupDisabled() },
    ),
)

private val ChipCategories = listOf(
    "all" to "All",
    "coffee" to "Coffee",
    "lunch" to "Lunch",
    "dinner" to "Dinner",
    "bakery" to "Bakery",
    "bars" to "Bars",
    "desserts" to "Desserts",
)

@Composable
private fun ChipItem(
    text: String,
    defaultSelected: Boolean = false,
    size: ChipSize = ChipSize.Default,
    enabled: Boolean = true,
    icon: ImageVector? = null,
    onRemove: (() -> Unit)? = null,
) {
    var selected by rememberSaveable { mutableStateOf(defaultSelected) }
    Chip(
        text,
        selected = selected,
        onSelectedChange = { selected = it },
        size = size,
        enabled = enabled,
        icon = icon,
        onRemove = onRemove,
    )
}

@Composable
private fun ChipSection(label: String, content: @Composable () -> Unit) {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(label, variant = TextVariant.Muted)
        content()
    }
}

@Composable
private fun ChipDefault() {
    Column {
        ChipItem("Open now")
    }
}

@Composable
private fun ChipStates() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        ChipSection("Unselected") { ChipItem("Open now") }
        ChipSection("Selected") { ChipItem("Open now", defaultSelected = true) }
        ChipSection("Disabled") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ChipItem("Open now", enabled = false)
                ChipItem("Open now", defaultSelected = true, enabled = false)
            }
        }
    }
}

@Composable
private fun ChipSizes() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
        ChipSection("Default") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ChipItem("Top rated", icon = PhosphorIcons.Regular.Star)
                ChipItem("Top rated", defaultSelected = true, icon = PhosphorIcons.Regular.Star)
                ChipItem("Nearby", onRemove = {})
            }
        }
        ChipSection("Small") {
            Row(horizontalArrangement = Arrangement.spacedBy(8.dp)) {
                ChipItem("Top rated", size = ChipSize.Sm, icon = PhosphorIcons.Regular.Star)
                ChipItem("Top rated", defaultSelected = true, size = ChipSize.Sm, icon = PhosphorIcons.Regular.Star)
                ChipItem("Nearby", size = ChipSize.Sm, onRemove = {})
            }
        }
    }
}

@Composable
private fun ChipWithIcon() {
    FlowRow(
        Modifier.fillMaxWidth(),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalArrangement = Arrangement.spacedBy(8.dp),
    ) {
        ChipItem("Coffee", icon = PhosphorIcons.Regular.Coffee)
        ChipItem("Restaurants", defaultSelected = true, icon = PhosphorIcons.Regular.ForkKnife)
        ChipItem("Nearby", icon = PhosphorIcons.Regular.MapPin)
        ChipItem("Tonight", enabled = false, icon = PhosphorIcons.Regular.CalendarBlank)
    }
}

@Composable
private fun ChipRemovable() {
    var tags by rememberSaveable { mutableStateOf(listOf("Design", "Mobile", "Accessibility", "Motion")) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        FlowRow(
            Modifier.fillMaxWidth(),
            horizontalArrangement = Arrangement.spacedBy(8.dp),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            tags.forEach { tag ->
                var selected by rememberSaveable(tag) { mutableStateOf(false) }
                Chip(
                    tag,
                    selected = selected,
                    onSelectedChange = { selected = it },
                    onRemove = { tags = tags.filter { it != tag } },
                    removeLabel = "Remove $tag",
                )
            }
        }
        Text("${tags.size} tags", variant = TextVariant.Muted)
    }
}

@Composable
private fun ChipControlled() {
    var selected by rememberSaveable { mutableStateOf(true) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Chip("Free delivery", selected = selected, onSelectedChange = { selected = it })
        Text(if (selected) "Selected" else "Not selected", variant = TextVariant.Muted)
    }
}

@Composable
private fun ChipGroupSingle() {
    var value by rememberSaveable { mutableStateOf<String?>("all") }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ChipGroup(value = value, onValueChange = { value = it }) {
            ChipCategories.take(4).forEach { (key, label) -> Chip(label, value = key) }
        }
        Text("Selected: ${value ?: "none"}", variant = TextVariant.Muted)
    }
}

@Composable
private fun ChipGroupMultiple() {
    var values by rememberSaveable { mutableStateOf(listOf("coffee", "bakery")) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ChipGroup(values = values.toSet(), onValuesChange = { next -> values = values.filter { it in next } + next.filter { it !in values } }) {
            ChipCategories.drop(1).forEach { (key, label) -> Chip(label, value = key) }
        }
        Text("Selected: ${values.joinToString(", ").ifEmpty { "none" }}", variant = TextVariant.Muted)
    }
}

@Composable
private fun ChipGroupUncontrolled() {
    var values by rememberSaveable { mutableStateOf(listOf("lunch")) }
    ChipGroup(values = values.toSet(), onValuesChange = { values = it.toList() }, size = ChipSize.Sm) {
        ChipCategories.drop(1).forEach { (key, label) -> Chip(label, value = key) }
    }
}

@Composable
private fun ChipGroupScrollable() {
    var value by rememberSaveable { mutableStateOf<String?>("all") }
    ChipGroup(
        value = value,
        onValueChange = { value = it },
        modifier = Modifier.layout { measurable, constraints ->
            val bleed = 16.dp.roundToPx()
            val width = constraints.maxWidth + bleed * 2
            val placeable = measurable.measure(constraints.copy(minWidth = width, maxWidth = width))
            layout(constraints.maxWidth, placeable.height) { placeable.place(-bleed, 0) }
        },
        scrollable = true,
        contentPadding = PaddingValues(horizontal = 16.dp),
    ) {
        ChipCategories.forEach { (key, label) -> Chip(label, value = key) }
    }
}

@Composable
private fun ChipGroupDisabled() {
    var value by rememberSaveable { mutableStateOf<String?>("coffee") }
    ChipGroup(value = value, onValueChange = { value = it }, enabled = false) {
        ChipCategories.subList(1, 4).forEach { (key, label) -> Chip(label, value = key) }
    }
}
