package com.esuiss.ui.interactions

import androidx.compose.foundation.ScrollState
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsFocusedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.text.BasicTextField
import androidx.compose.foundation.text.KeyboardOptions
import androidx.compose.foundation.text.selection.LocalTextSelectionColors
import androidx.compose.foundation.text.selection.TextSelectionColors
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.SideEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.focus.FocusRequester
import androidx.compose.ui.focus.focusRequester
import androidx.compose.ui.graphics.SolidColor
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.input.ImeAction
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.XCircle
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.esuiss.ui.components.Icon
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay
import kotlinx.coroutines.flow.collectLatest

private const val SettleDelay = 140L

@Stable
private class SearchRevealContext(val scroll: ScrollState) {
    var fieldHeight by mutableIntStateOf(0)
    var viewportHeight by mutableIntStateOf(0)
    var hasQuery by mutableStateOf(false)
    var positioned = false

    val reveal: Float
        get() = if (fieldHeight == 0) 1f else (1f - scroll.value.toFloat() / fieldHeight).coerceIn(0f, 1f)
}

private val LocalSearchReveal = staticCompositionLocalOf<SearchRevealContext?> { null }

@Composable
fun SearchReveal(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val scroll = rememberScrollState()
    val context = remember(scroll) { SearchRevealContext(scroll) }
    LaunchedEffect(context, context.fieldHeight) {
        val height = context.fieldHeight
        if (height == 0 || context.positioned) return@LaunchedEffect
        context.positioned = true
        scroll.scrollTo(if (context.hasQuery) 0 else height)
    }
    LaunchedEffect(context) {
        snapshotFlow { scroll.isScrollInProgress }.collectLatest { scrolling ->
            if (scrolling) return@collectLatest
            delay(SettleDelay)
            val top = scroll.value
            val size = context.fieldHeight
            if (top <= 0 || top >= size) return@collectLatest
            scroll.animateScrollTo(if (top < size / 2 || context.hasQuery) 0 else size)
        }
    }
    CompositionLocalProvider(LocalSearchReveal provides context) {
        Column(
            modifier = modifier
                .onSizeChanged { context.viewportHeight = it.height }
                .verticalScroll(scroll),
            content = content,
        )
    }
}

@Composable
fun SearchRevealField(
    value: String,
    onValueChange: (String) -> Unit,
    modifier: Modifier = Modifier,
    placeholder: String = "Search",
    enabled: Boolean = true,
) {
    val context = LocalSearchReveal.current
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val focused by interaction.collectIsFocusedAsState()
    val focus = remember { FocusRequester() }
    SideEffect { context?.hasQuery = value.isNotEmpty() }
    LaunchedEffect(focused) {
        if (focused) context?.scroll?.animateScrollTo(0)
    }
    val textStyle = Typography.base.copy(color = colors.foreground)
    Box(
        modifier = Modifier
            .fillMaxWidth()
            .onSizeChanged { context?.fieldHeight = it.height }
            .graphicsLayer { alpha = context?.reveal ?: 1f }
            .padding(start = 16.dp, end = 16.dp, bottom = 8.dp),
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .height(36.dp)
                .background(colors.secondary, RoundedCornerShape(Radius.lg))
                .padding(horizontal = 8.dp),
            horizontalArrangement = Arrangement.spacedBy(6.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = null, size = 18.dp, tint = colors.mutedForeground)
            CompositionLocalProvider(
                LocalTextSelectionColors provides TextSelectionColors(colors.primary, colors.primary.copy(alpha = 0.3f)),
            ) {
                BasicTextField(
                    value = value,
                    onValueChange = onValueChange,
                    modifier = modifier
                        .weight(1f)
                        .focusRequester(focus)
                        .semantics { contentDescription = placeholder },
                    enabled = enabled,
                    singleLine = true,
                    textStyle = textStyle,
                    keyboardOptions = KeyboardOptions(imeAction = ImeAction.Search),
                    interactionSource = interaction,
                    cursorBrush = SolidColor(colors.primary),
                    decorationBox = { inner ->
                        Box(contentAlignment = Alignment.CenterStart) {
                            if (value.isEmpty()) {
                                BasicText(placeholder, style = textStyle.copy(color = colors.mutedForeground), maxLines = 1)
                            }
                            inner()
                        }
                    },
                )
            }
            if (value.isNotEmpty()) {
                Box(
                    modifier = Modifier
                        .size(28.dp)
                        .clickable(
                            interactionSource = remember { MutableInteractionSource() },
                            indication = null,
                            role = Role.Button,
                            onClickLabel = null,
                        ) {
                            onValueChange("")
                            focus.requestFocus()
                        }
                        .semantics { contentDescription = "Clear search" },
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(PhosphorIcons.Fill.XCircle, contentDescription = null, size = 18.dp, tint = colors.mutedForeground)
                }
            }
        }
    }
}

@Composable
fun SearchRevealContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val context = LocalSearchReveal.current
    val minHeight = with(LocalDensity.current) { (context?.viewportHeight ?: 0).toDp() }
    Column(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = minHeight),
        content = content,
    )
}
