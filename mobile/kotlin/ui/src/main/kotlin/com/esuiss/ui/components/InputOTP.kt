package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.keyframes
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.autofill.ContentType
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentType
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextRange
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.input.TextFieldValue
import androidx.compose.ui.unit.dp
import androidx.compose.ui.zIndex
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.Minus
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

internal enum class OtpTone { Default, Verifying, Verified, Invalid }

@Immutable
internal class OtpAppearance(val tone: OtpTone, val pop: Boolean)

internal val LocalOtpAppearance = staticCompositionLocalOf { OtpAppearance(OtpTone.Default, pop = false) }

@Immutable
private class OtpState(
    val value: String,
    val maxLength: Int,
    val focused: Boolean,
    val enabled: Boolean,
    val invalid: Boolean,
    val appearance: OtpAppearance,
)

private val LocalOtpState = staticCompositionLocalOf {
    OtpState("", 0, focused = false, enabled = true, invalid = false, appearance = OtpAppearance(OtpTone.Default, pop = false))
}

@Composable
fun InputOTP(
    value: String,
    onValueChange: (String) -> Unit,
    maxLength: Int,
    modifier: Modifier = Modifier,
    enabled: Boolean = LocalFieldState.current.enabled,
    invalid: Boolean = LocalFieldState.current.invalid,
    readOnly: Boolean = false,
    keyboardType: KeyboardType = KeyboardType.NumberPassword,
    onComplete: ((String) -> Unit)? = null,
    keyboardActions: KeyboardActions = KeyboardActions.Default,
    interactionSource: MutableInteractionSource? = null,
    content: @Composable RowScope.() -> Unit = {
        InputOTPGroup {
            repeat(maxLength) { InputOTPSlot(it) }
        }
    },
) {
    val source = interactionSource ?: remember { MutableInteractionSource() }
    val focused by source.collectIsFocusedAsState()
    val currentValue by rememberUpdatedState(value)
    val appearance = LocalOtpAppearance.current
    val numeric = keyboardType == KeyboardType.NumberPassword || keyboardType == KeyboardType.Number
    BasicTextField(
        value = TextFieldValue(value, TextRange(value.length)),
        onValueChange = { next ->
            val filtered = next.text
                .filter { if (numeric) it.isDigit() else it.isLetterOrDigit() }
                .take(maxLength)
            if (filtered != currentValue) {
                onValueChange(filtered)
                if (filtered.length == maxLength) onComplete?.invoke(filtered)
            }
        },
        modifier = modifier.semantics { contentType = ContentType.SmsOtpCode },
        enabled = enabled,
        readOnly = readOnly,
        textStyle = TextStyle(color = Color.Transparent),
        keyboardOptions = KeyboardOptions(keyboardType = keyboardType, imeAction = ImeAction.Done),
        keyboardActions = keyboardActions,
        singleLine = true,
        interactionSource = source,
        cursorBrush = SolidColor(Color.Transparent),
        decorationBox = {
            CompositionLocalProvider(LocalOtpState provides OtpState(value, maxLength, focused, enabled, invalid, appearance)) {
                Row(
                    modifier = Modifier.clearAndSetSemantics {},
                    horizontalArrangement = Arrangement.spacedBy(8.dp),
                    verticalAlignment = Alignment.CenterVertically,
                    content = content,
                )
            }
        },
    )
}

@Composable
fun InputOTPGroup(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier,
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun InputOTPSlot(index: Int, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val state = LocalOtpState.current
    val tone = state.appearance.tone
    val char = state.value.getOrNull(index)
    val active = state.focused && state.maxLength > 0 &&
        index == state.value.length.coerceAtMost(state.maxLength - 1)
    val shape = RoundedCornerShape(Radius.lg)
    val dangerFill = colors.danger.copy(alpha = if (colors.isDark) 0.1f else 0.05f)
    val background = when {
        !state.enabled -> colors.controlDisabled
        tone == OtpTone.Verified -> colors.successSurface
        tone == OtpTone.Invalid || state.invalid -> dangerFill
        else -> colors.control
    }
    val border = when {
        !state.enabled -> Color.Transparent
        tone == OtpTone.Verified -> colors.success
        tone == OtpTone.Invalid -> colors.danger
        active -> colors.accent
        state.invalid -> colors.danger
        else -> Color.Transparent
    }
    val foreground = when {
        !state.enabled -> colors.labelQuaternary
        tone == OtpTone.Verified -> colors.success
        tone == OtpTone.Invalid -> colors.danger
        else -> colors.label
    }
    val spec = tween<Color>(if (tone == OtpTone.Default) 150 else 300, easing = FormEasing)
    val animatedBackground by animateColorAsState(background, spec, label = "background")
    val animatedBorder by animateColorAsState(border, spec, label = "border")
    val animatedForeground by animateColorAsState(foreground, spec, label = "foreground")
    val alpha by animateFloatAsState(if (tone == OtpTone.Verifying) 0.6f else 1f, tween(300, easing = FormEasing), label = "alpha")
    val reduced = formReducedMotion()
    val scale = remember { Animatable(1f) }
    val pop = state.appearance.pop
    LaunchedEffect(char) {
        if (char != null && pop && !reduced) {
            scale.snapTo(0.8f)
            scale.animateTo(
                1f,
                keyframes {
                    durationMillis = 240
                    0.8f at 0 using FormEasing
                    1.08f at 144 using FormEasing
                    1f at 240
                },
            )
        }
    }
    Box(
        modifier = modifier
            .zIndex(if (active) 1f else 0f)
            .graphicsLayer {
                this.alpha = alpha
                scaleX = scale.value
                scaleY = scale.value
            }
            .size(width = 44.dp, height = 52.dp)
            .background(animatedBackground, shape)
            .border(1.5.dp, animatedBorder, shape),
        contentAlignment = Alignment.Center,
    ) {
        if (char != null) {
            BasicText(
                char.toString(),
                style = Typography.xl.copy(
                    color = animatedForeground,
                    fontWeight = FontWeight.SemiBold,
                    fontFeatureSettings = "tnum",
                ),
            )
        } else if (active && tone == OtpTone.Default) {
            OtpCaret()
        }
    }
}

@Composable
fun InputOTPSeparator(modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val enabled = LocalOtpState.current.enabled
    Icon(
        PhosphorIcons.Regular.Minus,
        contentDescription = null,
        modifier = modifier,
        size = 16.dp,
        tint = if (enabled) colors.label else colors.labelQuaternary,
    )
}

@Composable
private fun OtpCaret() {
    val reduced = formReducedMotion()
    val transition = rememberInfiniteTransition(label = "caret")
    val blink by transition.animateFloat(
        initialValue = 1f,
        targetValue = 1f,
        animationSpec = infiniteRepeatable(
            keyframes {
                durationMillis = 1000
                1f at 0
                0f at 200
                0f at 500
                1f at 700
                1f at 1000
            },
        ),
        label = "caret",
    )
    Box(
        Modifier
            .graphicsLayer { alpha = if (reduced) 1f else blink }
            .size(width = 2.dp, height = 24.dp)
            .background(EsuissTheme.colors.accent, CircleShape),
    )
}
