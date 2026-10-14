package com.esuiss.ui.components

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.AnimationVector1D
import androidx.compose.animation.core.keyframes
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Backspace
import com.adamglin.phosphoricons.regular.Fingerprint
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val KeypadKeySize = 72.dp

private val KeypadColumnGap = 24.dp

private val KeypadRowGap = 16.dp

private val KeypadRows = listOf(listOf(1, 2, 3), listOf(4, 5, 6), listOf(7, 8, 9))

sealed interface KeypadKey {
    data class Digit(val value: Int) : KeypadKey

    data object Decimal : KeypadKey

    data object Biometric : KeypadKey

    data object Delete : KeypadKey
}

sealed interface KeypadAccessory {
    data object None : KeypadAccessory

    data class Decimal(
        val separator: String = ".",
        val label: String = "Decimal separator",
    ) : KeypadAccessory

    data class Biometric(
        val icon: ImageVector = PhosphorIcons.Regular.Fingerprint,
        val label: String = "Use biometrics",
    ) : KeypadAccessory
}

@Composable
fun Keypad(
    onKeyPress: (KeypadKey) -> Unit,
    modifier: Modifier = Modifier,
    accessory: KeypadAccessory = KeypadAccessory.None,
    deleteLabel: String = "Delete",
    enabled: Boolean = true,
) {
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(KeypadRowGap),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        KeypadRows.forEach { row ->
            Row(horizontalArrangement = Arrangement.spacedBy(KeypadColumnGap)) {
                row.forEach { digit -> KeypadDigit(digit, enabled, onKeyPress) }
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(KeypadColumnGap)) {
            when (accessory) {
                KeypadAccessory.None -> Box(Modifier.size(KeypadKeySize))
                is KeypadAccessory.Decimal -> KeypadButton(
                    onClick = { onKeyPress(KeypadKey.Decimal) },
                    enabled = enabled,
                    filled = true,
                    contentDescription = accessory.label,
                ) {
                    KeypadText(accessory.separator)
                }
                is KeypadAccessory.Biometric -> KeypadButton(
                    onClick = { onKeyPress(KeypadKey.Biometric) },
                    enabled = enabled,
                    filled = false,
                    contentDescription = accessory.label,
                ) {
                    Icon(accessory.icon, contentDescription = null, size = 32.dp)
                }
            }
            KeypadDigit(0, enabled, onKeyPress)
            KeypadButton(
                onClick = { onKeyPress(KeypadKey.Delete) },
                enabled = enabled,
                filled = false,
                contentDescription = deleteLabel,
            ) {
                Icon(PhosphorIcons.Regular.Backspace, contentDescription = null, size = 28.dp)
            }
        }
    }
}

@Composable
private fun KeypadDigit(digit: Int, enabled: Boolean, onKeyPress: (KeypadKey) -> Unit) {
    KeypadButton(onClick = { onKeyPress(KeypadKey.Digit(digit)) }, enabled = enabled, filled = true) {
        KeypadText(digit.toString())
    }
}

@Composable
private fun KeypadText(text: String) {
    BasicText(
        text,
        style = Typography.xl2.copy(
            color = LocalContentColor.current,
            fontWeight = FontWeight.Medium,
            fontFeatureSettings = "tnum",
        ),
    )
}

@Composable
private fun KeypadButton(
    onClick: () -> Unit,
    enabled: Boolean,
    filled: Boolean,
    contentDescription: String? = null,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val haptics = rememberHaptics()
    val background = when {
        !enabled -> if (filled) colors.controlDisabled else Color.Transparent
        pressed -> colors.controlPressed
        filled -> colors.control
        else -> Color.Transparent
    }
    val foreground = if (enabled) colors.label else colors.labelQuaternary
    Box(
        modifier = Modifier
            .size(KeypadKeySize)
            .clip(CircleShape)
            .background(background, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
            ) {
                haptics.selection()
                onClick()
            }
            .then(
                if (contentDescription != null) {
                    Modifier.semantics { this.contentDescription = contentDescription }
                } else {
                    Modifier
                },
            ),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(LocalContentColor provides foreground) {
            content()
        }
    }
}

internal suspend fun Animatable<Float, AnimationVector1D>.shake() {
    snapTo(0f)
    animateTo(
        0f,
        keyframes {
            durationMillis = 400
            -8f at 60
            7f at 140
            -5f at 220
            3f at 300
            0f at 400
        },
    )
}
