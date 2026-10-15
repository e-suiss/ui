package com.esuiss.ui.interactions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.MutableTransitionState
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInVertically
import androidx.compose.animation.slideOutVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.navigationBars
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.em
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.InputOTP
import com.esuiss.ui.components.InputOTPGroup
import com.esuiss.ui.components.InputOTPSlot
import com.esuiss.ui.components.LocalOtpAppearance
import com.esuiss.ui.components.OtpAppearance
import com.esuiss.ui.components.OtpTone
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.components.shake
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Job
import kotlinx.coroutines.delay
import kotlinx.coroutines.launch

private const val FillInterval = 70L

private const val InvalidHold = 600L

enum class OtpAutofillState { Idle, Filling, Verifying, Verified, Invalid }

@Stable
internal class OtpAutofillController(private val scope: CoroutineScope) {
    var state by mutableStateOf(OtpAutofillState.Idle)
    var value by mutableStateOf("")
    var focused by mutableStateOf(false)
    var maxLength = 0
    var onVerify: suspend (String) -> Boolean = { true }
    var perform: (HapticFeedbackType) -> Unit = {}
    var reduced = false
    val focusRequester = FocusRequester()
    val offset = Animatable(0f)
    private var job: Job? = null

    val locked: Boolean
        get() = state == OtpAutofillState.Filling || state == OtpAutofillState.Verifying || state == OtpAutofillState.Verified

    fun fill(code: String) {
        val digits = code.filterNot { it.isWhitespace() }.take(maxLength)
        if (digits.isEmpty()) return
        job?.cancel()
        job = scope.launch {
            state = OtpAutofillState.Filling
            for (index in 1..digits.length) {
                value = digits.take(index)
                delay(FillInterval)
            }
            if (digits.length == maxLength) verify(digits) else state = OtpAutofillState.Idle
        }
    }

    fun type(next: String) {
        if (next.length - value.length > 1) {
            fill(next)
            return
        }
        job?.cancel()
        state = OtpAutofillState.Idle
        value = next
        if (next.length == maxLength) job = scope.launch { verify(next) }
    }

    private suspend fun verify(code: String) {
        state = OtpAutofillState.Verifying
        if (onVerify(code)) {
            state = OtpAutofillState.Verified
            perform(HapticFeedbackType.Confirm)
            return
        }
        state = OtpAutofillState.Invalid
        perform(HapticFeedbackType.Reject)
        if (!reduced) scope.launch { offset.shake() }
        delay(InvalidHold)
        value = ""
        state = OtpAutofillState.Idle
        runCatching { focusRequester.requestFocus() }
    }
}

@Stable
class OtpAutofillScope internal constructor(
    column: ColumnScope,
    internal val controller: OtpAutofillController,
) : ColumnScope by column {
    val state: OtpAutofillState get() = controller.state

    val value: String get() = controller.value

    val maxLength: Int get() = controller.maxLength

    fun fill(code: String) = controller.fill(code)
}

@Composable
fun OtpAutofill(
    maxLength: Int,
    onVerify: suspend (String) -> Boolean,
    modifier: Modifier = Modifier,
    content: @Composable OtpAutofillScope.() -> Unit,
) {
    val coroutineScope = rememberCoroutineScope()
    val controller = remember { OtpAutofillController(coroutineScope) }
    val haptics = rememberHaptics()
    val reduced = formReducedMotion()
    SideEffect {
        controller.onVerify = onVerify
        controller.perform = haptics::perform
        controller.reduced = reduced
    }
    controller.maxLength = maxLength
    Column(
        modifier = modifier,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        val scope = remember(this, controller) { OtpAutofillScope(this, controller) }
        scope.content()
    }
}

@Composable
fun OtpAutofillScope.OtpAutofillInput(
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    autoFocus: Boolean = false,
    enabled: Boolean = true,
    content: (@Composable RowScope.() -> Unit)? = null,
) {
    val length = controller.maxLength
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    LaunchedEffect(focused) { controller.focused = focused }
    if (autoFocus) {
        LaunchedEffect(Unit) { runCatching { controller.focusRequester.requestFocus() } }
    }
    val tone = when (controller.state) {
        OtpAutofillState.Verifying -> OtpTone.Verifying
        OtpAutofillState.Verified -> OtpTone.Verified
        OtpAutofillState.Invalid -> OtpTone.Invalid
        else -> OtpTone.Default
    }
    CompositionLocalProvider(
        LocalOtpAppearance provides OtpAppearance(tone, pop = controller.state == OtpAutofillState.Filling),
    ) {
        InputOTP(
            value = controller.value,
            onValueChange = { if (!controller.locked) controller.type(it) },
            maxLength = controller.maxLength,
            modifier = modifier
                .graphicsLayer { translationX = controller.offset.value.dp.toPx() }
                .focusRequester(controller.focusRequester)
                .then(
                    if (contentDescription != null) {
                        Modifier.semantics { this.contentDescription = contentDescription }
                    } else {
                        Modifier
                    },
                ),
            enabled = enabled,
            invalid = controller.state == OtpAutofillState.Invalid,
            readOnly = controller.locked,
            interactionSource = interaction,
            content = content ?: {
                InputOTPGroup {
                    repeat(length) { InputOTPSlot(it) }
                }
            },
        )
    }
}

private class OtpAutofillSuggestionPosition(private val bottomLimit: Int) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset = IntOffset(0, (if (bottomLimit == Int.MAX_VALUE) windowSize.height else bottomLimit) - popupContentSize.height)
}

@Composable
fun OtpAutofillScope.OtpAutofillSuggestion(
    code: String?,
    modifier: Modifier = Modifier,
    source: String = "From Messages",
) {
    val open = !code.isNullOrBlank() && controller.focused && controller.value.isEmpty() &&
        controller.state == OtpAutofillState.Idle
    val last = remember { arrayOf("") }
    if (!code.isNullOrBlank()) last[0] = code
    val shown = last[0]
    val transition = remember { MutableTransitionState(false) }
    transition.targetState = open
    if (!transition.currentState && !transition.targetState) return
    val colors = EsuissTheme.colors
    val density = LocalDensity.current
    val reduced = formReducedMotion()
    val container = LocalWindowInfo.current.containerSize
    val keyboard = WindowInsets.ime.getBottom(density)
    val navigation = WindowInsets.navigationBars.getBottom(density)
    val bottomLimit = if (container.height > 0) container.height - maxOf(keyboard, navigation) else Int.MAX_VALUE
    val provider = remember(bottomLimit) { OtpAutofillSuggestionPosition(bottomLimit) }
    val slide = with(density) { 8.dp.roundToPx() }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Popup(
        popupPositionProvider = provider,
        properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = false),
    ) {
        AnimatedVisibility(
            visibleState = transition,
            enter = if (reduced) {
                fadeIn(tween(300))
            } else {
                fadeIn(tween(300, easing = FormEasing)) + slideInVertically(tween(300, easing = FormEasing)) { slide }
            },
            exit = if (reduced) {
                fadeOut(tween(300))
            } else {
                fadeOut(tween(300, easing = FormEasing)) + slideOutVertically(tween(300, easing = FormEasing)) { slide }
            },
        ) {
            Column(
                modifier = modifier
                    .width(with(density) { container.width.toDp() })
                    .heightIn(min = 44.dp)
                    .background(colors.muted)
                    .alpha(if (pressed) 0.8f else 1f)
                    .drawBehind { drawRect(colors.border, Offset.Zero, Size(size.width, 1.dp.toPx())) }
                    .clickable(
                        interactionSource = interaction,
                        indication = null,
                        enabled = open,
                        role = Role.Button,
                    ) { if (shown.isNotBlank()) fill(shown) }
                    .padding(vertical = 6.dp),
                verticalArrangement = Arrangement.Center,
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                BasicText(source, style = Typography.xs.copy(color = colors.mutedForeground))
                BasicText(
                    shown,
                    style = Typography.base.copy(
                        color = colors.foreground,
                        fontWeight = FontWeight.SemiBold,
                        letterSpacing = 0.05.em,
                        fontFeatureSettings = "tnum",
                    ),
                )
            }
        }
    }
}
