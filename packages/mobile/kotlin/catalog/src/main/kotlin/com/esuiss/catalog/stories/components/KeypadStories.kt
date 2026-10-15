package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Keypad
import com.esuiss.ui.components.KeypadAccessory
import com.esuiss.ui.components.KeypadKey
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val keypadStories = StoryGroup(
    section = Section.Components,
    title = "Keypad",
    stories = listOf(
        Story("Default") { KeypadKeyLog(KeypadAccessory.None) },
        Story("Decimal") { KeypadKeyLog(KeypadAccessory.Decimal()) },
        Story("Biometric") { KeypadKeyLog(KeypadAccessory.Biometric()) },
        Story("Disabled") { KeypadKeyLog(KeypadAccessory.Biometric(), enabled = false) },
    ),
)

private fun keypadKeyName(key: KeypadKey): String = when (key) {
    is KeypadKey.Digit -> key.value.toString()
    KeypadKey.Decimal -> "decimal"
    KeypadKey.Biometric -> "biometric"
    KeypadKey.Delete -> "delete"
}

@Composable
private fun KeypadKeyLog(accessory: KeypadAccessory, enabled: Boolean = true) {
    var last by rememberSaveable { mutableStateOf<String?>(null) }
    Column(
        modifier = Modifier.fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        Text(
            last?.let { "Last key: $it" } ?: "Press a key",
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm,
            color = EsuissTheme.colors.mutedForeground,
        )
        Keypad(onKeyPress = { last = keypadKeyName(it) }, accessory = accessory, enabled = enabled)
    }
}
