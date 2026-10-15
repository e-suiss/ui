package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
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
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.SwitchSize
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val switchStories = StoryGroup(
    section = Section.Components,
    title = "Switch",
    stories = listOf(
        Story("Default") { SwitchDemo(initial = false) },
        Story("Checked") { SwitchDemo(initial = true) },
        Story("Sizes") { SwitchSizes() },
        Story("WithLabel") { SwitchWithLabel() },
        Story("WithDescription") { SwitchWithDescription() },
        Story("Disabled") { SwitchDisabled() },
        Story("Invalid") { SwitchInvalid() },
    ),
)

private fun Modifier.label(text: String): Modifier = semantics { contentDescription = text }

@Composable
private fun Modifier.toggles(onToggle: () -> Unit): Modifier = clickable(
    interactionSource = remember { MutableInteractionSource() },
    indication = null,
    onClick = onToggle,
)

@Composable
private fun SwitchDemo(initial: Boolean) {
    var checked by rememberSaveable { mutableStateOf(initial) }
    Switch(checked, { checked = it })
}

@Composable
private fun SwitchSizes() {
    var wifi by rememberSaveable { mutableStateOf(true) }
    var bluetooth by rememberSaveable { mutableStateOf(true) }
    Row(horizontalArrangement = Arrangement.spacedBy(16.dp), verticalAlignment = Alignment.CenterVertically) {
        Switch(wifi, { wifi = it }, Modifier.label("Wi-Fi"), size = SwitchSize.Sm)
        Switch(bluetooth, { bluetooth = it }, Modifier.label("Bluetooth"))
    }
}

@Composable
private fun SwitchWithLabel() {
    var checked by rememberSaveable { mutableStateOf(false) }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        Switch(checked, { checked = it }, Modifier.label("Airplane mode"))
        Label("Airplane mode", Modifier.toggles { checked = !checked })
    }
}

@Composable
private fun SwitchWithDescription() {
    var checked by rememberSaveable { mutableStateOf(true) }
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.muted, shape)
            .padding(16.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Column(Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(4.dp)) {
            Label("Marketing emails", Modifier.toggles { checked = !checked })
            Text("Receive emails about new products.", style = Typography.sm.copy(color = colors.mutedForeground))
        }
        Switch(checked, { checked = it }, Modifier.label("Marketing emails"))
    }
}

@Composable
private fun SwitchDisabled() {
    Column(verticalArrangement = Arrangement.spacedBy(16.dp)) {
        Switch(false, {}, enabled = false)
        Switch(true, {}, enabled = false)
    }
}

@Composable
private fun SwitchInvalid() {
    var checked by rememberSaveable { mutableStateOf(false) }
    Row(horizontalArrangement = Arrangement.spacedBy(8.dp), verticalAlignment = Alignment.CenterVertically) {
        Switch(checked, { checked = it }, Modifier.label("Accept terms"), invalid = true)
        Label("Accept terms")
    }
}
