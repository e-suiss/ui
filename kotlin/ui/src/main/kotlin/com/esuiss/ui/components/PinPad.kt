package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Fingerprint
import com.esuiss.ui.theme.EsuissTheme

@Composable
fun PinPad(
    modifier: Modifier = Modifier,
    value: String? = null,
    onValueChange: ((String) -> Unit)? = null,
    defaultValue: String = "",
    length: Int = 6,
    onComplete: ((String) -> Unit)? = null,
    error: Boolean = false,
    enabled: Boolean = true,
    onBiometric: (() -> Unit)? = null,
    biometricIcon: ImageVector = PhosphorIcons.Regular.Fingerprint,
    biometricLabel: String = "Use biometrics",
    deleteLabel: String = "Delete",
    entryLabel: (entered: Int, length: Int) -> String = { entered, total -> "$entered of $total entered" },
) {
    val size = length.coerceIn(4, 8)
    var internal by remember { mutableStateOf(defaultValue.filter { it.isDigit() }.take(size)) }
    val current = (value ?: internal).take(size)
    val haptics = rememberHaptics()
    val reduced = formReducedMotion()
    val offset = remember { Animatable(0f) }
    LaunchedEffect(error) {
        if (error) {
            haptics.perform(HapticFeedbackType.Reject)
            if (!reduced) offset.shake()
        }
    }
    val update: (String) -> Unit = { next ->
        if (value == null) internal = next
        onValueChange?.invoke(next)
    }
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(48.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Row(
            modifier = Modifier
                .graphicsLayer { translationX = offset.value.dp.toPx() }
                .clearAndSetSemantics {
                    contentDescription = entryLabel(current.length, size)
                    liveRegion = LiveRegionMode.Polite
                },
            horizontalArrangement = Arrangement.spacedBy(16.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            repeat(size) { index -> PinPadDot(index < current.length, error, enabled) }
        }
        Keypad(
            onKeyPress = { key ->
                when (key) {
                    is KeypadKey.Digit -> if (current.length < size) {
                        val next = current + key.value
                        update(next)
                        if (next.length == size) onComplete?.invoke(next)
                    }
                    KeypadKey.Delete -> if (current.isNotEmpty()) update(current.dropLast(1))
                    KeypadKey.Biometric -> onBiometric?.invoke()
                    KeypadKey.Decimal -> Unit
                }
            },
            accessory = if (onBiometric != null) KeypadAccessory.Biometric(biometricIcon, biometricLabel) else KeypadAccessory.None,
            deleteLabel = deleteLabel,
            enabled = enabled,
        )
    }
}

@Composable
private fun PinPadDot(filled: Boolean, error: Boolean, enabled: Boolean) {
    val colors = EsuissTheme.colors
    val target = when {
        !enabled -> colors.labelQuaternary
        error -> colors.danger
        filled -> colors.label
        else -> colors.labelTertiary
    }
    val color by animateColorAsState(target, tween(150, easing = FormEasing), label = "dot")
    val fill by animateColorAsState(if (filled) target else Color.Transparent, tween(150, easing = FormEasing), label = "fill")
    Box(
        modifier = Modifier
            .size(14.dp)
            .background(fill, CircleShape)
            .border(1.5.dp, color, CircleShape),
    )
}
