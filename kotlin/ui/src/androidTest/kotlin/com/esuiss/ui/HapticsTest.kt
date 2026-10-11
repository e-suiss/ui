package com.esuiss.ui

import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableDoubleStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.hapticfeedback.HapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.test.junit4.v2.createComposeRule
import androidx.compose.ui.test.onNodeWithContentDescription
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.performClick
import androidx.compose.ui.test.performTouchInput
import androidx.test.ext.junit.runners.AndroidJUnit4
import com.esuiss.ui.components.Checkbox
import com.esuiss.ui.components.Chip
import com.esuiss.ui.components.ProvideHaptics
import com.esuiss.ui.components.RadioGroup
import com.esuiss.ui.components.RadioGroupItem
import com.esuiss.ui.components.Switch
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.Toggle
import com.esuiss.ui.components.ToggleGroup
import com.esuiss.ui.components.ToggleGroupItem
import com.esuiss.ui.interactions.ReorderList
import com.esuiss.ui.interactions.ReorderListHandle
import com.esuiss.ui.interactions.ReorderListItem
import com.esuiss.ui.interactions.Stepper
import com.esuiss.ui.interactions.StepperGroup
import com.esuiss.ui.interactions.StepperIncrement
import com.esuiss.ui.theme.EsuissTheme
import org.junit.Assert.assertEquals
import org.junit.Rule
import org.junit.Test
import org.junit.runner.RunWith

private class RecordingHaptics : HapticFeedback {
    val events = mutableListOf<HapticFeedbackType>()

    override fun performHapticFeedback(hapticFeedbackType: HapticFeedbackType) {
        events += hapticFeedbackType
    }
}

@RunWith(AndroidJUnit4::class)
class HapticsTest {
    @get:Rule
    val compose = createComposeRule()

    private fun render(recorder: RecordingHaptics, content: @Composable () -> Unit) {
        compose.setContent {
            EsuissTheme(darkTheme = false) {
                CompositionLocalProvider(LocalHapticFeedback provides recorder, content = content)
            }
        }
    }

    @Composable
    private fun Controls() {
        var on by remember { mutableStateOf(false) }
        var checked by remember { mutableStateOf(false) }
        var pressed by remember { mutableStateOf(false) }
        var radio by remember { mutableStateOf("a") }
        var single by remember { mutableStateOf<String?>(null) }
        var chip by remember { mutableStateOf(false) }
        var count by remember { mutableDoubleStateOf(0.0) }
        Column {
            Switch(on, { on = it }, Modifier.testTag("switch"))
            Checkbox(checked, { checked = it }, Modifier.testTag("checkbox"))
            Toggle("Bold", pressed, { pressed = it })
            RadioGroup(radio, { radio = it }) {
                RadioGroupItem("a", Modifier.testTag("radioA"))
                RadioGroupItem("b", Modifier.testTag("radioB"))
            }
            ToggleGroup(single, { single = it }) {
                ToggleGroupItem("Left", "left")
            }
            Chip("Coffee", chip, { chip = it })
            Stepper(count, { count = it }) {
                StepperGroup { StepperIncrement() }
            }
            Text("state $on $checked $pressed $radio $single $chip ${count.toInt()}")
        }
    }

    @Test
    fun controlsPerformFeedback() {
        val recorder = RecordingHaptics()
        render(recorder) { Controls() }
        compose.onNodeWithTag("switch").performClick()
        compose.onNodeWithTag("switch").performClick()
        compose.onNodeWithTag("checkbox").performClick()
        compose.onNodeWithText("Bold").performClick()
        compose.onNodeWithTag("radioA").performClick()
        compose.onNodeWithTag("radioB").performClick()
        compose.onNodeWithText("Left").performClick()
        compose.onNodeWithText("Coffee").performClick()
        compose.onNodeWithContentDescription("Increase").performClick()
        compose.waitForIdle()
        compose.onNodeWithText("state false true true b left true 1").assertExists()
        assertEquals(
            listOf(
                HapticFeedbackType.ToggleOn,
                HapticFeedbackType.ToggleOff,
                HapticFeedbackType.ToggleOn,
                HapticFeedbackType.ToggleOn,
                HapticFeedbackType.SegmentTick,
                HapticFeedbackType.SegmentTick,
                HapticFeedbackType.ToggleOn,
                HapticFeedbackType.SegmentTick,
            ),
            recorder.events,
        )
    }

    @Test
    fun disabledHapticsStaySilent() {
        val recorder = RecordingHaptics()
        render(recorder) { ProvideHaptics(enabled = false) { Controls() } }
        compose.onNodeWithTag("switch").performClick()
        compose.onNodeWithTag("checkbox").performClick()
        compose.onNodeWithTag("radioB").performClick()
        compose.onNodeWithContentDescription("Increase").performClick()
        compose.waitForIdle()
        compose.onNodeWithText("state true true false b null false 1").assertExists()
        assertEquals(emptyList<HapticFeedbackType>(), recorder.events)
    }

    @Test
    fun reorderListPerformsFeedback() {
        val recorder = RecordingHaptics()
        render(recorder) {
            var items by remember { mutableStateOf(listOf("Bread", "Eggs", "Milk")) }
            Column {
                ReorderList(items, { items = it }) { item ->
                    ReorderListItem {
                        Text(item)
                        ReorderListHandle(contentDescription = "Reorder $item")
                    }
                }
                Text("Order: ${items.joinToString()}")
            }
        }
        compose.onNodeWithContentDescription("Reorder Bread").performTouchInput {
            down(center)
            repeat(10) {
                advanceEventTime(16)
                moveBy(Offset(0f, 30f))
            }
            up()
        }
        compose.waitForIdle()
        compose.onNodeWithText("Order: Eggs, Milk, Bread").assertExists()
        assertEquals(
            listOf(
                HapticFeedbackType.LongPress,
                HapticFeedbackType.SegmentTick,
                HapticFeedbackType.SegmentTick,
                HapticFeedbackType.GestureEnd,
            ),
            recorder.events,
        )
    }
}
