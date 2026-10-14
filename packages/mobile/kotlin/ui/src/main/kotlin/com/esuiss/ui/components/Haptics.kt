package com.esuiss.ui.components

import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.hapticfeedback.HapticFeedback
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalHapticFeedback

val LocalHapticsEnabled = staticCompositionLocalOf { true }

@Composable
fun ProvideHaptics(enabled: Boolean, content: @Composable () -> Unit) {
    CompositionLocalProvider(LocalHapticsEnabled provides enabled, content = content)
}

internal class Haptics(private val feedback: HapticFeedback, private val enabled: Boolean) {
    fun perform(type: HapticFeedbackType) {
        if (enabled) feedback.performHapticFeedback(type)
    }

    fun toggle(on: Boolean) = perform(if (on) HapticFeedbackType.ToggleOn else HapticFeedbackType.ToggleOff)

    fun selection() = perform(HapticFeedbackType.SegmentTick)
}

@Composable
internal fun rememberHaptics(): Haptics {
    val feedback = LocalHapticFeedback.current
    val enabled = LocalHapticsEnabled.current
    return remember(feedback, enabled) { Haptics(feedback, enabled) }
}
