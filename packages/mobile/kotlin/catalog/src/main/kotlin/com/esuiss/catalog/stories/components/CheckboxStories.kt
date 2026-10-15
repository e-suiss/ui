package com.esuiss.catalog.stories.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.state.ToggleableState
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Label
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TriStateCheckbox
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val checkboxStories = StoryGroup(
    section = Section.Components,
    title = "Checkbox",
    stories = listOf(
        Story("Default") { CheckboxDemo(initial = false) },
        Story("Checked") { CheckboxDemo(initial = true) },
        Story("WithLabel") { CheckboxWithLabel() },
        Story("WithDescription") { CheckboxWithDescription() },
        Story("Disabled") { CheckboxDisabled() },
        Story("Indeterminate") { CheckboxIndeterminate() },
        Story("Invalid") { CheckboxInvalid() },
    ),
)

private fun Modifier.checkboxLabelToggle(onToggle: () -> Unit): Modifier =
    clickable(interactionSource = null, indication = null, onClick = onToggle)

@Composable
private fun CheckboxDemo(initial: Boolean) {
    var checked by rememberSaveable { mutableStateOf(initial) }
    Row {
        Checkbox(checked, { checked = it })
    }
}

@Composable
private fun CheckboxWithLabel() {
    var checked by rememberSaveable { mutableStateOf(false) }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Checkbox(checked, { checked = it }, Modifier.semantics { contentDescription = "Accept terms and conditions" })
        Label("Accept terms and conditions", Modifier.checkboxLabelToggle { checked = !checked })
    }
}

@Composable
private fun CheckboxWithDescription() {
    var checked by rememberSaveable { mutableStateOf(true) }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.Top) {
        Checkbox(checked, { checked = it }, Modifier.semantics { contentDescription = "Enable notifications" })
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(6.dp)) {
            Label("Enable notifications", Modifier.checkboxLabelToggle { checked = !checked })
            Text(
                "You can enable or disable notifications at any time.",
                style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
            )
        }
    }
}

@Composable
private fun CheckboxDisabled() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Checkbox(false, {}, enabled = false)
            Label("Unchecked", enabled = false)
        }
        Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
            Checkbox(true, {}, enabled = false)
            Label("Checked", enabled = false)
        }
    }
}

@Composable
private fun CheckboxIndeterminate() {
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        TriStateCheckbox(ToggleableState.Indeterminate, {}, Modifier.semantics { contentDescription = "Select all" })
        Label("Select all")
    }
}

@Composable
private fun CheckboxInvalid() {
    var checked by rememberSaveable { mutableStateOf(false) }
    Row(horizontalArrangement = Arrangement.spacedBy(12.dp), verticalAlignment = Alignment.CenterVertically) {
        Checkbox(
            checked,
            { checked = it },
            Modifier.semantics { contentDescription = "Accept terms and conditions" },
            invalid = !checked,
        )
        Label("Accept terms and conditions", Modifier.checkboxLabelToggle { checked = !checked })
    }
}
