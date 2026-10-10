package com.esuiss.ui.interactions

import androidx.compose.foundation.background
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.gestures.waitForUpOrCancellation
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardActions
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusManager
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.disabled
import androidx.compose.ui.semantics.onClick
import androidx.compose.ui.semantics.role
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.text.input.KeyboardType
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Minus
import com.adamglin.phosphoricons.bold.Plus
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalIconSize
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import java.text.NumberFormat
import java.text.ParsePosition
import kotlin.math.floor
import kotlin.math.log10
import kotlin.math.max
import kotlin.math.pow
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private const val StartDelay = 400L

private const val FirstTick = 180.0

private const val MinTick = 35.0

private const val Acceleration = 0.86

@Immutable
private class StepperContext(
    val value: Double,
    val enabled: Boolean,
    val format: NumberFormat,
    val canChange: (Int) -> Boolean,
    val change: (Int) -> Boolean,
    val commit: (Double) -> Unit,
)

private val LocalStepper = staticCompositionLocalOf<StepperContext?> { null }

private fun stepperContext(): Nothing = error("Stepper parts must be used within a Stepper")

@Composable
fun Stepper(
    value: Double,
    onValueChange: (Double) -> Unit,
    modifier: Modifier = Modifier,
    min: Double = Double.NEGATIVE_INFINITY,
    max: Double = Double.POSITIVE_INFINITY,
    step: Double = 1.0,
    enabled: Boolean = true,
    format: NumberFormat = remember { NumberFormat.getNumberInstance() },
    content: @Composable RowScope.() -> Unit,
) {
    val currentValue by rememberUpdatedState(value)
    val currentOnValueChange by rememberUpdatedState(onValueChange)
    val canChange: (Int) -> Boolean = { direction ->
        enabled && if (direction > 0) currentValue < max else currentValue > min
    }
    val context = StepperContext(
        value = value,
        enabled = enabled,
        format = format,
        canChange = canChange,
        change = { direction ->
            if (!canChange(direction)) {
                false
            } else {
                val precision = max(0, -floor(log10(step)).toInt())
                val factor = 10.0.pow(precision)
                val next = Math.round((currentValue + direction * step) * factor) / factor
                currentOnValueChange(next.coerceIn(min, max))
                true
            }
        },
        commit = { next -> currentOnValueChange(next.coerceIn(min, max)) },
    )
    CompositionLocalProvider(LocalStepper provides context) {
        Row(
            modifier = modifier,
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
            content = content,
        )
    }
}

@Composable
fun StepperInput(
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
) {
    val stepper = LocalStepper.current ?: stepperContext()
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    val formatted = stepper.format.format(stepper.value)
    var text by remember { mutableStateOf(formatted) }
    LaunchedEffect(formatted, focused) {
        if (!focused) text = formatted
    }
    val focusManager = LocalFocusManager.current
    val commit = {
        val position = ParsePosition(0)
        val parsed = stepper.format.parse(text.trim(), position)
        if (parsed != null && position.index > 0) stepper.commit(parsed.toDouble())
        text = stepper.format.format(stepper.value)
    }
    LaunchedEffect(focused) {
        if (!focused && text != formatted) commit()
    }
    CompositionLocalProvider(
        LocalTextSelectionColors provides TextSelectionColors(colors.accent, colors.accent.copy(alpha = 0.3f)),
    ) {
        BasicTextField(
            value = text,
            onValueChange = { text = it },
            modifier = modifier
                .height(32.dp)
                .width(64.dp)
                .padding(horizontal = 4.dp)
                .then(
                    if (contentDescription != null) {
                        Modifier.semantics { this.contentDescription = contentDescription }
                    } else {
                        Modifier
                    },
                ),
            enabled = stepper.enabled,
            singleLine = true,
            textStyle = Typography.base.copy(
                color = if (stepper.enabled) colors.label else colors.labelQuaternary,
                textAlign = TextAlign.End,
                fontFeatureSettings = "tnum",
            ),
            keyboardOptions = KeyboardOptions(keyboardType = KeyboardType.Decimal, imeAction = ImeAction.Done),
            keyboardActions = KeyboardActions(onDone = { focusManager.clearFocusAndCommit(commit) }),
            interactionSource = interaction,
            cursorBrush = SolidColor(colors.accent),
            decorationBox = { inner ->
                Box(contentAlignment = Alignment.CenterEnd) { inner() }
            },
        )
    }
}

private fun FocusManager.clearFocusAndCommit(commit: () -> Unit) {
    commit()
    clearFocus()
}

@Composable
fun StepperGroup(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier
            .height(32.dp)
            .background(EsuissTheme.colors.control, RoundedCornerShape(Radius.lg)),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun StepperDecrement(
    modifier: Modifier = Modifier,
    contentDescription: String = "Decrease",
    content: (@Composable () -> Unit)? = null,
) {
    StepperButton(-1, PhosphorIcons.Bold.Minus, contentDescription, modifier, content)
}

@Composable
fun StepperIncrement(
    modifier: Modifier = Modifier,
    contentDescription: String = "Increase",
    content: (@Composable () -> Unit)? = null,
) {
    StepperButton(1, PhosphorIcons.Bold.Plus, contentDescription, modifier, content)
}

@Composable
fun StepperSeparator(modifier: Modifier = Modifier) {
    Box(
        modifier = modifier
            .width(1.dp)
            .height(18.dp)
            .background(EsuissTheme.colors.separator),
    )
}

@Composable
private fun StepperButton(
    direction: Int,
    icon: ImageVector,
    contentDescription: String,
    modifier: Modifier,
    content: (@Composable () -> Unit)?,
) {
    val stepper = LocalStepper.current ?: stepperContext()
    val colors = EsuissTheme.colors
    val enabled = stepper.canChange(direction)
    val currentStepper by rememberUpdatedState(stepper)
    val scope = rememberCoroutineScope()
    var pressed by remember { mutableStateOf(false) }
    val shape = if (direction < 0) {
        RoundedCornerShape(topStart = Radius.lg, bottomStart = Radius.lg)
    } else {
        RoundedCornerShape(topEnd = Radius.lg, bottomEnd = Radius.lg)
    }
    Box(
        modifier = modifier
            .fillMaxHeight()
            .width(48.dp)
            .background(if (pressed && enabled) colors.controlPressed else Color.Transparent, shape)
            .semantics {
                this.contentDescription = contentDescription
                role = Role.Button
                if (enabled) {
                    onClick {
                        currentStepper.change(direction)
                    }
                } else {
                    disabled()
                }
            }
            .pointerInput(enabled) {
                if (!enabled) return@pointerInput
                awaitEachGesture {
                    awaitFirstDown()
                    pressed = true
                    var repeat: Job? = null
                    if (currentStepper.change(direction)) {
                        repeat = scope.launch {
                            delay(StartDelay)
                            var count = 1
                            while (currentStepper.change(direction)) {
                                delay(max(MinTick, FirstTick * Acceleration.pow(count)).toLong())
                                count++
                            }
                        }
                    }
                    waitForUpOrCancellation()
                    repeat?.cancel()
                    pressed = false
                }
            },
        contentAlignment = Alignment.Center,
    ) {
        val tint = if (enabled) colors.label else colors.labelQuaternary
        CompositionLocalProvider(LocalContentColor provides tint, LocalIconSize provides 16.dp) {
            if (content != null) content() else Icon(icon, contentDescription = null, size = 16.dp, tint = tint)
        }
    }
}
