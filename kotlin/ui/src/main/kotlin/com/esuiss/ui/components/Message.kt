package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.layout.onSizeChanged
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class MessageAlign { Start, End }

@Stable
internal class MessageState(val align: MessageAlign) {
    var ghosts by mutableIntStateOf(0)
    var footers by mutableIntStateOf(0)
    var footerHeight by mutableIntStateOf(0)
}

private enum class MessageSlot { Avatar, Content }

internal val LocalMessage = staticCompositionLocalOf<MessageState?> { null }

@Composable
fun MessageGroup(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.fillMaxWidth(),
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

@Composable
fun Message(
    modifier: Modifier = Modifier,
    align: MessageAlign = MessageAlign.Start,
    content: @Composable () -> Unit,
) {
    val state = remember(align) { MessageState(align) }
    val end = align == MessageAlign.End
    CompositionLocalProvider(
        LocalMessage provides state,
        LocalBubbleAlign provides if (end) BubbleAlign.End else BubbleAlign.Start,
    ) {
        Layout(content = content, modifier = modifier.fillMaxWidth()) { measurables, constraints ->
            val gap = 8.dp.roundToPx()
            val width = if (constraints.hasBoundedWidth) constraints.maxWidth else Constraints.Infinity
            val fixed = measurables.filter { it.layoutId != MessageSlot.Content }
                .associateWith { it.measure(Constraints(maxWidth = width, maxHeight = constraints.maxHeight)) }
            val flexible = measurables.filter { it.layoutId == MessageSlot.Content }
            val used = fixed.values.sumOf { it.width } + gap * (measurables.size - 1).coerceAtLeast(0)
            val remaining = if (width == Constraints.Infinity) Constraints.Infinity else (width - used).coerceAtLeast(0)
            val share = if (flexible.isEmpty() || remaining == Constraints.Infinity) remaining else remaining / flexible.size
            val measured = flexible.associateWith {
                it.measure(
                    if (share == Constraints.Infinity) {
                        Constraints(maxHeight = constraints.maxHeight)
                    } else {
                        Constraints(minWidth = share, maxWidth = share, maxHeight = constraints.maxHeight)
                    },
                )
            }
            val placeables = measurables.map { fixed[it] ?: measured.getValue(it) }
            val totalWidth = placeables.sumOf { it.width } + gap * (placeables.size - 1).coerceAtLeast(0)
            val layoutWidth = constraints.constrainWidth(totalWidth)
            val height = constraints.constrainHeight(placeables.maxOfOrNull { it.height } ?: 0)
            val lift = if (state.footers > 0) state.footerHeight + 10.dp.roundToPx() else 0
            layout(layoutWidth, height) {
                var x = if (end) layoutWidth else 0
                measurables.forEachIndexed { index, measurable ->
                    val placeable = placeables[index]
                    val y = if (measurable.layoutId == MessageSlot.Avatar) {
                        (height - placeable.height - lift).coerceAtLeast(0)
                    } else {
                        0
                    }
                    if (end) {
                        x -= placeable.width
                        placeable.placeRelative(x, y)
                        x -= gap
                    } else {
                        placeable.placeRelative(x, y)
                        x += placeable.width + gap
                    }
                }
            }
        }
    }
}

@Composable
fun MessageAvatar(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier = modifier
            .layoutId(MessageSlot.Avatar)
            .widthIn(min = 32.dp)
            .clip(CircleShape)
            .background(EsuissTheme.colors.surfaceSecondary, CircleShape),
        contentAlignment = Alignment.Center,
        content = content,
    )
}

@Composable
fun MessageContent(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val message = LocalMessage.current
    BubbleStack(
        modifier = modifier.layoutId(MessageSlot.Content),
        spacing = 10.dp,
        alignEnd = message?.align == MessageAlign.End,
        content = content,
    )
}

@Composable
private fun MessageLine(
    modifier: Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val message = LocalMessage.current
    Row(
        modifier = modifier.padding(horizontal = if ((message?.ghosts ?: 0) > 0) 0.dp else 14.dp),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.xs.copy(color = colors.labelSecondary),
            LocalContentColor provides colors.labelSecondary,
            LocalIconSize provides 14.dp,
        ) {
            content()
        }
    }
}

@Composable
fun MessageHeader(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    MessageLine(modifier, content)
}

@Composable
fun MessageHeader(text: String, modifier: Modifier = Modifier) {
    MessageHeader(modifier) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}

@Composable
fun MessageFooter(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val message = LocalMessage.current
    if (message != null) {
        DisposableEffect(message) {
            message.footers += 1
            onDispose {
                message.footers -= 1
                if (message.footers == 0) message.footerHeight = 0
            }
        }
    }
    MessageLine(
        modifier.onSizeChanged { message?.footerHeight = it.height },
        content,
    )
}

@Composable
fun MessageFooter(text: String, modifier: Modifier = Modifier) {
    MessageFooter(modifier) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1, overflow = TextOverflow.Ellipsis)
    }
}
