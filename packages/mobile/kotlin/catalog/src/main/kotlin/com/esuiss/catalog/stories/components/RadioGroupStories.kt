package com.esuiss.catalog.stories.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val radioGroupStories = StoryGroup(
    section = Section.Components,
    title = "Radio Group",
    stories = listOf(
        Story("Default") { RadioGroupDemo() },
        Story("WithDescriptions") { RadioGroupWithDescriptions() },
        Story("DisabledItem") { RadioGroupDemo(disabledItem = "compact") },
        Story("Disabled") { RadioGroupDemo(disabled = true) },
        Story("Invalid") { RadioGroupInvalid() },
    ),
)

private class RadioGroupOption(val value: String, val label: String, val description: String = "")

private val radioGroupOptions = listOf(
    RadioGroupOption("default", "Default"),
    RadioGroupOption("comfortable", "Comfortable"),
    RadioGroupOption("compact", "Compact"),
)

private val radioGroupPlans = listOf(
    RadioGroupOption("starter", "Starter", "For individuals getting started."),
    RadioGroupOption("pro", "Pro", "For growing teams that need more."),
    RadioGroupOption("enterprise", "Enterprise", "For large organizations with custom needs."),
)

@Composable
private fun Modifier.radioGroupTap(enabled: Boolean, onTap: () -> Unit): Modifier = clickable(
    interactionSource = remember { MutableInteractionSource() },
    indication = null,
    enabled = enabled,
    onClick = onTap,
)

@Composable
private fun RadioGroupDemo(disabled: Boolean = false, disabledItem: String? = null) {
    var value by rememberSaveable { mutableStateOf("comfortable") }
    RadioGroup(value = value, onValueChange = { value = it }, enabled = !disabled) {
        radioGroupOptions.forEach { option ->
            val isDisabled = disabled || option.value == disabledItem
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                RadioGroupItem(
                    option.value,
                    Modifier.semantics { contentDescription = option.label },
                    enabled = !isDisabled,
                )
                Label(option.label, Modifier.radioGroupTap(!isDisabled) { value = option.value }, enabled = !isDisabled)
            }
        }
    }
}

@Composable
private fun RadioGroupWithDescriptions() {
    var value by rememberSaveable { mutableStateOf("pro") }
    val colors = EsuissTheme.colors
    RadioGroup(value = value, onValueChange = { value = it }) {
        Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
            radioGroupPlans.forEach { plan ->
                Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
                    RadioGroupItem(plan.value, Modifier.semantics { contentDescription = plan.label })
                    Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
                        Label(plan.label, Modifier.radioGroupTap(true) { value = plan.value })
                        Text(plan.description, style = Typography.sm, color = colors.mutedForeground)
                    }
                }
            }
        }
    }
}

@Composable
private fun RadioGroupInvalid() {
    var value by rememberSaveable { mutableStateOf<String?>(null) }
    RadioGroup(value = value, onValueChange = { value = it }) {
        radioGroupOptions.forEach { option ->
            Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
                RadioGroupItem(option.value, Modifier.semantics { contentDescription = option.label }, invalid = true)
                Label(option.label)
            }
        }
    }
}
