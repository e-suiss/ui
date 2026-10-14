package com.esuiss.catalog.stories.components

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
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Select
import com.esuiss.ui.components.SelectGroup
import com.esuiss.ui.components.SelectItem
import com.esuiss.ui.components.SelectLabel
import com.esuiss.ui.components.SelectOption
import com.esuiss.ui.components.SelectSeparator
import com.esuiss.ui.components.SelectSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val selectStories = StoryGroup(
    section = Section.Components,
    title = "Select",
    stories = listOf(
        Story("Default") { SelectDemo() },
        Story("WithValue") { SelectDemo(initial = "blueberry") },
        Story("Small") { SelectDemo(size = SelectSize.Sm) },
        Story("Grouped") { SelectGrouped() },
        Story("WithLabel") { SelectWithLabel() },
        Story("Disabled") { SelectDemo(initial = "mango", enabled = false) },
        Story("Invalid") { SelectInvalid() },
    ),
)

private val selectFruits = listOf(
    SelectOption("mango", "Mango"),
    SelectOption("banana", "Banana"),
    SelectOption("blueberry", "Blueberry"),
    SelectOption("grapes", "Grapes"),
    SelectOption("pineapple", "Pineapple"),
)

private val selectVegetables = listOf(
    SelectOption("carrot", "Carrot"),
    SelectOption("broccoli", "Broccoli"),
    SelectOption("spinach", "Spinach"),
)

@Composable
private fun SelectDemo(
    initial: String? = null,
    size: SelectSize = SelectSize.Default,
    enabled: Boolean = true,
    invalid: Boolean = false,
    label: String? = null,
) {
    var value by rememberSaveable { mutableStateOf(initial) }
    Select(
        value = value,
        onValueChange = { value = it },
        displayValue = selectFruits.firstOrNull { it.value == value }?.label,
        modifier = Modifier
            .width(192.dp)
            .then(if (label != null) Modifier.semantics { contentDescription = label } else Modifier),
        placeholder = "Select a fruit",
        size = size,
        invalid = invalid,
        enabled = enabled,
    ) {
        SelectGroup {
            SelectLabel("Fruits")
            selectFruits.forEach { SelectItem(it.value, it.label) }
        }
    }
}

@Composable
private fun SelectGrouped() {
    var value by rememberSaveable { mutableStateOf<String?>(null) }
    val fruits = selectFruits.take(3)
    Select(
        value = value,
        onValueChange = { value = it },
        displayValue = (fruits + selectVegetables).firstOrNull { it.value == value }?.label,
        modifier = Modifier.width(224.dp),
        placeholder = "Select produce",
    ) {
        SelectGroup {
            SelectLabel("Fruits")
            fruits.forEach { SelectItem(it.value, it.label) }
        }
        SelectSeparator()
        SelectGroup {
            SelectLabel("Vegetables")
            selectVegetables.forEach { SelectItem(it.value, it.label) }
        }
    }
}

@Composable
private fun SelectWithLabel() {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Label("Favorite fruit")
        SelectDemo(label = "Favorite fruit")
        Text("Used to personalize your recommendations.", style = Typography.sm, color = EsuissTheme.colors.labelSecondary)
    }
}

@Composable
private fun SelectInvalid() {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        SelectDemo(invalid = true)
        Text("Please select a fruit.", style = Typography.sm, color = EsuissTheme.colors.danger)
    }
}
