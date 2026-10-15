package com.esuiss.ui.interactions

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.scaleIn
import androidx.compose.animation.scaleOut
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.gestures.awaitEachGesture
import androidx.compose.foundation.gestures.awaitFirstDown
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyItemScope
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.layout
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.platform.LocalDensity
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.setProgress
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.rememberHaptics
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Shadows
import com.esuiss.ui.theme.Typography
import com.esuiss.ui.theme.shadow
import kotlin.math.floor
import kotlin.math.roundToInt
import kotlinx.coroutines.launch

val SectionIndexLetters: List<String> = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".map { it.toString() } + "#"

private val RowHeight = 16.dp

interface SectionIndexSectionScope {
    fun item(key: Any? = null, content: @Composable LazyItemScope.() -> Unit)

    fun items(count: Int, key: ((Int) -> Any)? = null, content: @Composable LazyItemScope.(index: Int) -> Unit)
}

interface SectionIndexScope {
    fun SectionIndexSection(value: String, header: String? = value, content: SectionIndexSectionScope.() -> Unit)
}

private class SectionEntry(val count: Int, val key: ((Int) -> Any)?, val content: @Composable LazyItemScope.(Int) -> Unit)

private class SectionSpec(val value: String, val header: String?, val entries: List<SectionEntry>) {
    val size: Int get() = (if (header != null) 1 else 0) + entries.sumOf { it.count }
}

private class SectionIndexSectionScopeImpl : SectionIndexSectionScope {
    val entries = mutableListOf<SectionEntry>()

    override fun item(key: Any?, content: @Composable LazyItemScope.() -> Unit) {
        entries += SectionEntry(1, key?.let { k -> { k } }) { content() }
    }

    override fun items(count: Int, key: ((Int) -> Any)?, content: @Composable LazyItemScope.(index: Int) -> Unit) {
        entries += SectionEntry(count, key, content)
    }
}

private class SectionIndexScopeImpl : SectionIndexScope {
    val sections = mutableListOf<SectionSpec>()

    override fun SectionIndexSection(value: String, header: String?, content: SectionIndexSectionScope.() -> Unit) {
        sections += SectionSpec(value, header, SectionIndexSectionScopeImpl().apply(content).entries.toList())
    }
}

@Composable
fun SectionIndex(
    modifier: Modifier = Modifier,
    state: LazyListState = rememberLazyListState(),
    letters: List<String> = SectionIndexLetters,
    onValueChange: ((String) -> Unit)? = null,
    contentPadding: PaddingValues = PaddingValues(0.dp),
    content: SectionIndexScope.() -> Unit,
) {
    val sections = SectionIndexScopeImpl().apply(content).sections.toList()
    val starts = sections.runningFold(0) { total, section -> total + section.size }
    val scope = rememberCoroutineScope()
    Box(modifier = modifier) {
        LazyColumn(state = state, contentPadding = contentPadding) {
            sections.forEach { section ->
                if (section.header != null) {
                    stickyHeader(key = "section-index-${section.value}", contentType = "section-index-header") {
                        SectionIndexHeader(section.header)
                    }
                }
                section.entries.forEach { entry ->
                    items(entry.count, key = entry.key) { index -> entry.content(this, index) }
                }
            }
        }
        if (sections.isNotEmpty()) {
            SectionIndexBar(
                letters = letters,
                onValueChange = { letter ->
                    val position = letters.indexOf(letter)
                    val target = sections.indexOfFirst { letters.indexOf(it.value) >= position }.takeIf { it >= 0 } ?: sections.lastIndex
                    scope.launch { state.scrollToItem(starts[target]) }
                    onValueChange?.invoke(letter)
                },
                modifier = Modifier.align(Alignment.CenterEnd).padding(end = 12.dp),
            )
        }
    }
}

@Composable
fun SectionIndexHeader(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    BasicText(
        text,
        modifier = modifier
            .fillMaxWidth()
            .background(colors.background.copy(alpha = 0.94f))
            .padding(horizontal = 16.dp, vertical = 6.dp)
            .semantics { heading() },
        style = Typography.sm.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
    )
}

private fun displayItems(letters: List<String>, capacity: Int): List<String> {
    if (capacity >= letters.size) return letters
    val slots = maxOf(3, if (capacity % 2 == 0) capacity - 1 else capacity)
    fun letterAt(slot: Int) = letters[((slot.toFloat() / (slots - 1)) * (letters.size - 1)).roundToInt()]
    return List(slots) { slot -> if (slot % 2 == 0) letterAt(slot) else "•" }
}

@Composable
fun SectionIndexBar(
    modifier: Modifier = Modifier,
    letters: List<String> = SectionIndexLetters,
    onValueChange: ((String) -> Unit)? = null,
    accessibilityLabel: String = "Section index",
) {
    if (letters.isEmpty()) return
    val colors = EsuissTheme.colors
    val haptics = rememberHaptics()
    val density = LocalDensity.current
    var current by remember { mutableIntStateOf(0) }
    var dragging by remember { mutableStateOf(false) }
    var dragY by remember { mutableFloatStateOf(0f) }
    var columnHeight by remember { mutableIntStateOf(0) }
    val change by rememberUpdatedState(onValueChange)
    val currentLetters by rememberUpdatedState(letters)

    fun jump(index: Int) {
        if (index != current) haptics.selection()
        current = index
        currentLetters.getOrNull(index)?.let { change?.invoke(it) }
    }

    BoxWithConstraints(modifier = modifier) {
        val available = with(density) { constraints.maxHeight.toDp() } - 16.dp
        val capacity = if (constraints.hasBoundedHeight) floor(((available - RowHeight) / RowHeight)).toInt() else letters.size
        val items = displayItems(letters, capacity)
        Box(
            modifier = Modifier
                .pointerInput(Unit) {
                    fun track(y: Float, first: Boolean) {
                        val height = columnHeight.toFloat().coerceAtLeast(1f)
                        val clamped = y.coerceIn(0f, height)
                        dragY = clamped
                        val fraction = (clamped / height).coerceIn(0f, 0.9999f)
                        val index = (fraction * currentLetters.size).toInt()
                        if (index != current || first) jump(index)
                    }
                    awaitEachGesture {
                        val down = awaitFirstDown()
                        down.consume()
                        dragging = true
                        track(down.position.y, true)
                        while (true) {
                            val event = awaitPointerEvent()
                            val pointer = event.changes.firstOrNull { it.id == down.id } ?: break
                            if (!pointer.pressed) break
                            pointer.consume()
                            track(pointer.position.y, false)
                        }
                        dragging = false
                    }
                }
                .semantics {
                    contentDescription = accessibilityLabel
                    stateDescription = letters.getOrElse(current) { "" }
                    progressBarRangeInfo = ProgressBarRangeInfo(current.toFloat(), 0f..letters.lastIndex.toFloat(), letters.lastIndex - 1)
                    setProgress { value ->
                        jump(value.roundToInt().coerceIn(0, letters.lastIndex))
                        true
                    }
                }
                .padding(start = 12.dp),
        ) {
            Column(
                modifier = Modifier
                    .onSizeChanged { columnHeight = it.height }
                    .padding(horizontal = 6.dp),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                items.forEach { label ->
                    Box(modifier = Modifier.height(RowHeight).widthIn(min = 12.dp), contentAlignment = Alignment.Center) {
                        BasicText(
                            label,
                            style = Typography.xs3.copy(color = colors.primary, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                        )
                    }
                }
            }
            AnimatedVisibility(
                visible = dragging,
                modifier = Modifier.layout { measurable, _ ->
                    val placeable = measurable.measure(Constraints())
                    layout(0, 0) {
                        placeable.place(-(56.dp + 16.dp).roundToPx(), (dragY - 28.dp.toPx()).roundToInt())
                    }
                },
                enter = fadeIn(tween(200)) + scaleIn(tween(200), initialScale = 0.5f),
                exit = fadeOut(tween(200)) + scaleOut(tween(200), targetScale = 0.5f),
            ) {
                Box(
                    modifier = Modifier
                        .size(56.dp)
                        .shadow(Shadows.lg, CircleShape)
                        .background(colors.popover, CircleShape)
                        .border(1.dp, colors.border, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    BasicText(
                        letters.getOrElse(current) { "" },
                        style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                }
            }
        }
    }
}
