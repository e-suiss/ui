package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.hapticfeedback.HapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ProvideHaptics
import com.esuiss.ui.components.Slider
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.ReorderList
import com.esuiss.ui.interactions.ReorderListHandle
import com.esuiss.ui.interactions.ReorderListItem
import com.esuiss.ui.interactions.Stepper
import com.esuiss.ui.interactions.StepperDecrement
import com.esuiss.ui.interactions.StepperGroup
import com.esuiss.ui.interactions.StepperIncrement
import com.esuiss.ui.interactions.StepperInput
import com.esuiss.ui.interactions.StepperSeparator
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val hapticsStories = StoryGroup(
    section = Section.Components,
    title = "Haptics",
    stories = listOf(
        Story("Default") { HapticsControlsDemo(enabled = true) },
        Story("Reorder") { HapticsReorderDemo() },
        Story("Disabled") { HapticsControlsDemo(enabled = false) },
    ),
)

private class HapticsLog(private val system: HapticFeedback) : HapticFeedback {
    var last by mutableStateOf("None")
    var count by mutableIntStateOf(0)

    override fun performHapticFeedback(hapticFeedbackType: HapticFeedbackType) {
        last = hapticFeedbackType.toString()
        count += 1
        system.performHapticFeedback(hapticFeedbackType)
    }
}

@Composable
private fun HapticsLogging(content: @Composable (HapticsLog) -> Unit) {
    val system = LocalHapticFeedback.current
    val log = remember(system) { HapticsLog(system) }
    CompositionLocalProvider(LocalHapticFeedback provides log) {
        content(log)
    }
}

@Composable
private fun HapticsLogRow(log: HapticsLog) {
    val colors = EsuissTheme.colors
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .background(colors.muted, RoundedCornerShape(Radius.xl))
            .padding(horizontal = 16.dp, vertical = 12.dp),
        horizontalArrangement = Arrangement.SpaceBetween,
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text("Last haptic", style = Typography.sm.copy(color = colors.mutedForeground))
        Text(
            if (log.count > 0) "${log.last} (${log.count})" else log.last,
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(fontWeight = FontWeight.Medium),
        )
    }
}

@Composable
private fun HapticsRow(label: String, content: @Composable () -> Unit) {
    Row(
        modifier = Modifier.fillMaxWidth().heightIn(min = 44.dp),
        horizontalArrangement = Arrangement.spacedBy(16.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Text(label, modifier = Modifier.weight(1f))
        content()
    }
}

@Composable
private fun HapticsControls() {
    var wifi by rememberSaveable { mutableStateOf(true) }
    var terms by rememberSaveable { mutableStateOf(false) }
    var volume by rememberSaveable { mutableFloatStateOf(40f) }
    var copies by rememberSaveable { mutableDoubleStateOf(1.0) }
    var openNow by rememberSaveable { mutableStateOf(false) }
    var topRated by rememberSaveable { mutableStateOf(false) }
    Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(8.dp)) {
        HapticsRow("Wi-Fi") {
            Switch(wifi, { wifi = it }, Modifier.semantics { contentDescription = "Wi-Fi" })
        }
        HapticsRow("Accept terms") {
            Checkbox(terms, { terms = it }, Modifier.semantics { contentDescription = "Accept terms" })
        }
        HapticsRow("Copies") {
            Stepper(copies, { copies = it }, min = 1.0, max = 9.0) {
                StepperInput(contentDescription = "Copies")
                StepperGroup {
                    StepperDecrement()
                    StepperSeparator()
                    StepperIncrement()
                }
            }
        }
        Row(Modifier.padding(vertical = 8.dp), horizontalArrangement = Arrangement.spacedBy(8.dp)) {
            Chip("Open now", openNow, { openNow = it })
            Chip("Top rated", topRated, { topRated = it })
        }
        Slider(volume, { volume = it }, step = 10f, contentDescription = "Volume")
    }
}

@Composable
private fun HapticsControlsDemo(enabled: Boolean) {
    HapticsLogging { log ->
        ProvideHaptics(enabled = enabled) {
            Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
                HapticsLogRow(log)
                HapticsControls()
            }
        }
    }
}

private val HapticsTasks = listOf("Inbox", "Today", "Upcoming", "Someday")

@Composable
private fun HapticsReorderDemo() {
    var value by rememberSaveable { mutableStateOf(HapticsTasks) }
    val shape = RoundedCornerShape(Radius.xl2)
    HapticsLogging { log ->
        Column(Modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(16.dp)) {
            HapticsLogRow(log)
            ReorderList(
                value,
                { value = it },
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .border(1.dp, EsuissTheme.colors.border, shape),
            ) { task ->
                ReorderListItem {
                    Text(
                        task,
                        modifier = Modifier.weight(1f).padding(vertical = 12.dp),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                    ReorderListHandle(contentDescription = "Reorder $task")
                }
            }
        }
    }
}
