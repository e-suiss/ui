package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.relocation.BringIntoViewRequester
import androidx.compose.foundation.relocation.bringIntoViewRequester
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.composed
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.focus.onFocusChanged
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalWindowInfo
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.IntOffset
import androidx.compose.ui.unit.IntRect
import androidx.compose.ui.unit.IntSize
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.window.Popup
import androidx.compose.ui.window.PopupPositionProvider
import androidx.compose.ui.window.PopupProperties
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretDown
import com.adamglin.phosphoricons.regular.CaretUp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val InputAccessoryBarHeight = 44.dp

@Stable
class InputAccessoryState {
    private val requesters = mutableStateMapOf<Int, FocusRequester>()
    internal var focused by mutableStateOf<Int?>(null)
    internal var barHeight by mutableIntStateOf(0)

    internal fun register(index: Int, requester: FocusRequester) {
        requesters[index] = requester
    }

    internal fun unregister(index: Int, requester: FocusRequester) {
        if (requesters[index] == requester) requesters.remove(index)
        if (focused == index) focused = null
    }

    internal fun onFocus(index: Int, isFocused: Boolean) {
        if (isFocused) {
            focused = index
        } else if (focused == index) {
            focused = null
        }
    }

    private val order: List<Int>
        get() = requesters.keys.sorted()

    val hasPrevious: Boolean
        get() = focused?.let { current -> order.any { it < current } } ?: false

    val hasNext: Boolean
        get() = focused?.let { current -> order.any { it > current } } ?: false

    fun previous() {
        val current = focused ?: return
        order.lastOrNull { it < current }?.let { requesters[it]?.requestFocus() }
    }

    fun next() {
        val current = focused ?: return
        order.firstOrNull { it > current }?.let { requesters[it]?.requestFocus() }
    }
}

@Composable
fun rememberInputAccessoryState(): InputAccessoryState = remember { InputAccessoryState() }

fun Modifier.inputAccessory(state: InputAccessoryState, index: Int): Modifier = composed {
    val requester = remember { FocusRequester() }
    val relocation = remember { BringIntoViewRequester() }
    val density = LocalDensity.current
    val keyboard = WindowInsets.ime.getBottom(density)
    var size by remember { mutableStateOf(IntSize.Zero) }
    val focused = state.focused == index
    DisposableEffect(state, index, requester) {
        state.register(index, requester)
        onDispose { state.unregister(index, requester) }
    }
    LaunchedEffect(focused, keyboard > 0, state.barHeight, size) {
        if (!focused || keyboard == 0 || size == IntSize.Zero) return@LaunchedEffect
        val margin = state.barHeight + with(density) { 8.dp.toPx() }
        relocation.bringIntoView(Rect(0f, 0f, size.width.toFloat(), size.height + margin))
    }
    this
        .onSizeChanged { size = it }
        .bringIntoViewRequester(relocation)
        .focusRequester(requester)
        .onFocusChanged { state.onFocus(index, it.isFocused || it.hasFocus) }
}

private class InputAccessoryPosition(private val top: Int) : PopupPositionProvider {
    override fun calculatePosition(
        anchorBounds: IntRect,
        windowSize: IntSize,
        layoutDirection: LayoutDirection,
        popupContentSize: IntSize,
    ): IntOffset = IntOffset(0, top - popupContentSize.height)
}

@Composable
fun InputAccessoryBar(
    state: InputAccessoryState,
    modifier: Modifier = Modifier,
    previousLabel: String = "Previous",
    nextLabel: String = "Next",
    doneLabel: String = "Done",
    onDone: (() -> Unit)? = null,
) {
    val density = LocalDensity.current
    val keyboard = WindowInsets.ime.getBottom(density)
    val container = LocalWindowInfo.current.containerSize
    val focus = LocalFocusManager.current
    val inset = LocalKeyboardAccessory.current
    if (state.focused == null || keyboard == 0 || container.height == 0) {
        SideEffect {
            state.barHeight = 0
            inset?.height = 0
        }
        return
    }
    DisposableEffect(inset) {
        onDispose { inset?.height = 0 }
    }
    val colors = EsuissTheme.colors
    val top = container.height - keyboard
    val provider = remember(top) { InputAccessoryPosition(top) }
    Popup(
        popupPositionProvider = provider,
        properties = PopupProperties(focusable = false, dismissOnBackPress = false, dismissOnClickOutside = false),
    ) {
        Row(
            modifier = modifier
                .width(with(density) { container.width.toDp() })
                .height(InputAccessoryBarHeight)
                .onSizeChanged {
                    state.barHeight = it.height
                    inset?.height = it.height
                }
                .background(colors.muted)
                .drawBehind { drawRect(colors.border, Offset.Zero, Size(size.width, 1.dp.toPx())) }
                .padding(horizontal = 4.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.spacedBy(0.dp),
        ) {
            Button(
                onClick = { state.previous() },
                variant = ButtonVariant.Plain,
                size = ButtonSize.Icon,
                enabled = state.hasPrevious,
            ) {
                Icon(PhosphorIcons.Regular.CaretUp, contentDescription = previousLabel, size = 20.dp)
            }
            Button(
                onClick = { state.next() },
                variant = ButtonVariant.Plain,
                size = ButtonSize.Icon,
                enabled = state.hasNext,
            ) {
                Icon(PhosphorIcons.Regular.CaretDown, contentDescription = nextLabel, size = 20.dp)
            }
            Spacer(Modifier.weight(1f))
            Button(
                onClick = {
                    onDone?.invoke()
                    focus.clearFocus()
                },
                variant = ButtonVariant.Plain,
            ) {
                BasicText(
                    doneLabel,
                    style = Typography.base.copy(color = colors.primary, fontWeight = FontWeight.SemiBold),
                    maxLines = 1,
                )
            }
        }
    }
}
