package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Combobox
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.MultiCombobox
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val comboboxStories = StoryGroup(
    section = Section.Components,
    title = "Combobox",
    stories = listOf(
        Story("Default") { ComboboxDemo() },
        Story("WithValue") { ComboboxDemo(defaultValue = "Expo") },
        Story("WithClear") { ComboboxDemo(defaultValue = "Remix", showClear = true) },
        Story("Grouped") { ComboboxGrouped() },
        Story("Multiple") { ComboboxMultiple() },
        Story("WithLabel") { ComboboxWithLabel() },
        Story("Disabled") { ComboboxDemo(defaultValue = "Astro", disabled = true) },
        Story("Invalid") { ComboboxInvalid() },
        Story("OpenByDefault") { ComboboxDemo(defaultValue = "Expo") },
    ),
)

private val ComboboxFrameworks = listOf("Next.js", "SvelteKit", "Nuxt.js", "Remix", "Astro", "Gatsby", "Expo")

private data class ComboboxProduce(val value: String, val label: String, val group: String)

private val ComboboxProduceItems = listOf(
    ComboboxProduce("mango", "Mango", "Fruits"),
    ComboboxProduce("banana", "Banana", "Fruits"),
    ComboboxProduce("blueberry", "Blueberry", "Fruits"),
    ComboboxProduce("carrot", "Carrot", "Vegetables"),
    ComboboxProduce("broccoli", "Broccoli", "Vegetables"),
    ComboboxProduce("spinach", "Spinach", "Vegetables"),
)

@Composable
private fun ComboboxDemo(
    defaultValue: String? = null,
    disabled: Boolean = false,
    showClear: Boolean = false,
    label: String? = null,
    invalid: Boolean? = null,
) {
    var value by rememberSaveable { mutableStateOf(defaultValue) }
    Column {
        Combobox(
            items = ComboboxFrameworks,
            value = value,
            onValueChange = { value = it },
            modifier = Modifier
                .width(256.dp)
                .then(if (label != null) Modifier.semantics { contentDescription = label } else Modifier),
            placeholder = "Select a framework",
            emptyText = "No framework found.",
            showClear = showClear,
            invalid = invalid,
            enabled = !disabled,
        )
    }
}

@Composable
private fun ComboboxGrouped() {
    var value by rememberSaveable { mutableStateOf<String?>(null) }
    Column {
        Combobox(
            items = ComboboxProduceItems,
            value = ComboboxProduceItems.firstOrNull { it.value == value },
            onValueChange = { value = it?.value },
            modifier = Modifier.width(256.dp),
            itemText = { it.label },
            placeholder = "Select produce",
            emptyText = "No produce found.",
            groupBy = { it.group },
        )
    }
}

@Composable
private fun ComboboxMultiple() {
    var values by rememberSaveable { mutableStateOf(listOf("Expo", "Astro")) }
    Column {
        MultiCombobox(
            items = ComboboxFrameworks,
            values = values,
            onValuesChange = { values = it },
            modifier = Modifier.width(288.dp),
            placeholder = "Add framework",
            emptyText = "No framework found.",
        )
    }
}

@Composable
private fun ComboboxWithLabel() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Label("Framework")
        ComboboxDemo(label = "Framework")
        Text(
            "Search and pick the framework you use.",
            style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
        )
    }
}

@Composable
private fun ComboboxInvalid() {
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        ComboboxDemo(invalid = true)
        Text("Please select a framework.", style = Typography.sm.copy(color = EsuissTheme.colors.destructive))
    }
}
