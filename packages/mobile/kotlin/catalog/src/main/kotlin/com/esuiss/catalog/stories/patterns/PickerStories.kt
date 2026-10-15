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
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.Picker
import com.esuiss.ui.patterns.PickerGroup
import com.esuiss.ui.patterns.PickerItem
import com.esuiss.ui.patterns.PickerSeparator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val pickerStories = StoryGroup(
    section = Section.Patterns,
    title = "Picker",
    stories = listOf(
        Story("Default") { PickerDefault() },
        Story("States") { PickerStates() },
    ),
)

@Composable
private fun PickerDefault() {
    var value by rememberSaveable { mutableStateOf<String?>(null) }
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Picker(
            value = value,
            onValueChange = { value = it },
            modifier = Modifier.width(224.dp).semantics { contentDescription = "Fruit" },
            placeholder = "Select a fruit",
        ) {
            PickerGroup(label = "Fruits") {
                PickerItem("cherry", "Cherry")
                PickerItem("banana", "Banana")
                PickerItem("mango", "Mango")
            }
            PickerSeparator()
            PickerGroup(label = "Vegetables") {
                PickerItem("carrot", "Carrot")
                PickerItem("spinach", "Spinach", enabled = false)
            }
        }
        Text("Selected: ${value ?: "none"}", style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground))
    }
}

@Composable
private fun PickerStates() {
    var fruit by rememberSaveable { mutableStateOf<String?>("banana") }
    var invalid by rememberSaveable { mutableStateOf<String?>(null) }
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        Picker(
            value = fruit,
            onValueChange = { fruit = it },
            modifier = Modifier.width(224.dp),
            size = SelectSize.Sm,
        ) {
            PickerItem("cherry", "Cherry")
            PickerItem("banana", "Banana")
        }
        Picker(
            value = invalid,
            onValueChange = { invalid = it },
            modifier = Modifier.width(224.dp),
            placeholder = "Invalid",
            invalid = true,
        ) {
            PickerItem("cherry", "Cherry")
        }
        Picker(
            value = null,
            onValueChange = {},
            modifier = Modifier.width(224.dp),
            placeholder = "Disabled",
            enabled = false,
        ) {
            PickerItem("cherry", "Cherry")
        }
    }
}
