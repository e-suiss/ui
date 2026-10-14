package com.esuiss.ui.components

import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.gestures.detectTapGestures
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.ime
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.boundsInWindow
import androidx.compose.ui.layout.onGloballyPositioned
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.platform.LocalFocusManager
import androidx.compose.ui.platform.LocalView
import androidx.compose.ui.unit.dp

@Composable
fun KeyboardScrollView(
    modifier: Modifier = Modifier,
    state: ScrollState = rememberScrollState(),
    contentPadding: PaddingValues = PaddingValues(0.dp),
    verticalArrangement: Arrangement.Vertical = Arrangement.Top,
    content: @Composable ColumnScope.() -> Unit,
) {
    val density = LocalDensity.current
    val view = LocalView.current
    val focus = LocalFocusManager.current
    val ime = WindowInsets.ime.getBottom(density)
    val keyboard = if (ime > 0) ime + (LocalKeyboardAccessory.current?.height ?: 0) else 0
    var bottom by remember { mutableFloatStateOf(0f) }
    val windowHeight = view.rootView.height
    val overlap = if (keyboard > 0 && windowHeight > 0) {
        (bottom - (windowHeight - keyboard)).coerceAtLeast(0f)
    } else {
        0f
    }
    Box(
        modifier = modifier.onGloballyPositioned { bottom = it.boundsInWindow().bottom },
    ) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .padding(bottom = with(density) { overlap.toDp() })
                .pointerInput(focus) { detectTapGestures { focus.clearFocus() } }
                .verticalScroll(state)
                .padding(contentPadding),
            verticalArrangement = verticalArrangement,
            content = content,
        )
    }
}
