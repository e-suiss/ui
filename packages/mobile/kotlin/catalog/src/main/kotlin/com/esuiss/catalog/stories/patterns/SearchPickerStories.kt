package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
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
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.SearchPicker
import com.esuiss.ui.patterns.SearchPickerItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val searchPickerStories = StoryGroup(
    section = Section.Patterns,
    title = "Search Picker",
    stories = listOf(
        Story("Default") { SearchPickerDemo() },
        Story("WithValue") { SearchPickerDemo(initial = "astro") },
        Story("Grouped") {
            SearchPickerDemo(
                items = searchPickerCities,
                placeholder = "Select a city",
                searchPlaceholder = "Search cities...",
                emptyText = "No city found.",
                label = "City",
            )
        },
        Story("WithTitle") { SearchPickerDemo(title = "Framework") },
        Story("WithCloseButton") { SearchPickerDemo(showCloseButton = true) },
        Story("WithCloseLabel") { SearchPickerDemo(showCloseButton = true, closeLabel = "Cancel") },
        Story("Disabled") { SearchPickerDemo(enabled = false) },
        Story("Invalid") { SearchPickerDemo(invalid = true) },
        Story("Controlled") { SearchPickerControlled() },
        Story("Floating") { SearchPickerDemo(floating = true) },
    ),
)

private val searchPickerFrameworks = listOf(
    SearchPickerItem("next", "Next.js"),
    SearchPickerItem("remix", "Remix"),
    SearchPickerItem("astro", "Astro"),
    SearchPickerItem("sveltekit", "SvelteKit"),
    SearchPickerItem("nuxt", "Nuxt"),
    SearchPickerItem("gatsby", "Gatsby", enabled = false),
)

private val searchPickerCities = listOf(
    SearchPickerItem("nyc", "New York", group = "Americas"),
    SearchPickerItem("chi", "Chicago", group = "Americas"),
    SearchPickerItem("sao", "São Paulo", group = "Americas"),
    SearchPickerItem("lon", "London", group = "Europe"),
    SearchPickerItem("ber", "Berlin", group = "Europe"),
    SearchPickerItem("ist", "Istanbul", group = "Europe"),
    SearchPickerItem("tyo", "Tokyo", group = "Asia"),
    SearchPickerItem("sin", "Singapore", group = "Asia"),
)

@Composable
private fun SearchPickerDemo(
    initial: String? = null,
    items: List<SearchPickerItem> = searchPickerFrameworks,
    placeholder: String = "Select a framework",
    searchPlaceholder: String = "Search frameworks...",
    emptyText: String = "No framework found.",
    label: String = "Framework",
    title: String? = null,
    enabled: Boolean = true,
    invalid: Boolean? = null,
    floating: Boolean = false,
    showCloseButton: Boolean = false,
    closeLabel: String? = null,
) {
    var value by rememberSaveable { mutableStateOf(initial) }
    SearchPicker(
        items = items,
        value = value,
        onValueChange = { value = it },
        modifier = Modifier.width(224.dp).semantics { contentDescription = label },
        placeholder = placeholder,
        searchPlaceholder = searchPlaceholder,
        emptyText = emptyText,
        title = title,
        enabled = enabled,
        invalid = invalid,
        floating = floating,
        showCloseButton = showCloseButton,
        closeLabel = closeLabel,
    )
}

@Composable
private fun SearchPickerControlled() {
    var value by rememberSaveable { mutableStateOf<String?>("next") }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        SearchPicker(
            items = searchPickerFrameworks,
            value = value,
            onValueChange = { value = it },
            modifier = Modifier.width(224.dp).semantics { contentDescription = "Framework" },
            placeholder = "Select a framework",
            searchPlaceholder = "Search frameworks...",
            emptyText = "No framework found.",
        )
        Text("Selected: ${value ?: "none"}", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
    }
}
