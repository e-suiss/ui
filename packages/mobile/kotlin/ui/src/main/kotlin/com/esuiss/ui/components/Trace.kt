package com.esuiss.ui.components

import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretRight
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class TraceStatus { Running, Error, Pending }

private val LocalTraceStatus = staticCompositionLocalOf<TraceStatus?> { null }

private val LocalTraceExpanded = staticCompositionLocalOf { false }

@Composable
fun Trace(
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
fun TraceLine(
    modifier: Modifier = Modifier,
    status: TraceStatus? = null,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val color = if (status == TraceStatus.Error) colors.destructive else colors.mutedForeground
    Row(
        modifier = modifier
            .alpha(if (status == TraceStatus.Pending) 0.6f else 1f)
            .semantics(mergeDescendants = true) {},
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalTraceStatus provides status,
            LocalContentStyle provides Typography.sm.copy(color = color),
            LocalContentColor provides color,
            LocalIconSize provides 16.dp,
        ) {
            content()
        }
    }
}

@Composable
fun TraceIcon(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier = modifier.size(16.dp).clearAndSetSemantics {},
        contentAlignment = Alignment.Center,
    ) {
        content()
    }
}

@Composable
fun RowScope.TraceTitle(text: String, modifier: Modifier = Modifier) {
    val running = LocalTraceStatus.current == TraceStatus.Running
    val pulse = if (running) {
        val transition = rememberInfiniteTransition(label = "trace-title")
        transition.animateFloat(
            initialValue = 1f,
            targetValue = 0.45f,
            animationSpec = infiniteRepeatable(tween(900), RepeatMode.Reverse),
            label = "trace-title-alpha",
        ).value
    } else {
        1f
    }
    BasicText(
        text,
        modifier = modifier.weight(1f, fill = false).alpha(pulse),
        style = LocalContentStyle.current,
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun TraceDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier.alpha(0.7f),
        style = LocalContentStyle.current.copy(fontFeatureSettings = "tnum"),
        maxLines = 1,
    )
}

@Composable
fun TraceCollapsible(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    CompositionLocalProvider(LocalTraceExpanded provides expanded) {
        Collapsible(
            expanded = expanded,
            onExpandedChange = onExpandedChange,
            modifier = modifier.fillMaxWidth(),
            content = content,
        )
    }
}

@Composable
fun TraceCollapsible(
    modifier: Modifier = Modifier,
    initiallyExpanded: Boolean = false,
    content: @Composable ColumnScope.() -> Unit,
) {
    var expanded by rememberSaveable { mutableStateOf(initiallyExpanded) }
    TraceCollapsible(expanded, { expanded = it }, modifier, content)
}

@Composable
fun TraceCollapsibleTrigger(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val expanded = LocalTraceExpanded.current
    val rotation by animateFloatAsState(if (expanded) 90f else 0f, tween(200), label = "trace-caret")
    CollapsibleTrigger(modifier = modifier) {
        Row(
            horizontalArrangement = Arrangement.spacedBy(4.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            content()
            Icon(
                PhosphorIcons.Regular.CaretRight,
                contentDescription = null,
                modifier = Modifier.rotate(rotation),
                size = 16.dp,
                tint = EsuissTheme.colors.mutedForeground,
            )
        }
    }
}

@Composable
fun TraceCollapsibleContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    CollapsibleContent(modifier = modifier) {
        Column(
            modifier = Modifier
                .padding(start = 7.dp, top = 8.dp, bottom = 4.dp)
                .drawBehind {
                    val stroke = 1.dp.toPx()
                    val x = if (layoutDirection == LayoutDirection.Rtl) size.width - stroke else 0f
                    drawRect(colors.border, Offset(x, 0f), Size(stroke, size.height))
                }
                .padding(start = 16.dp, end = 4.dp)
                .fillMaxWidth(),
            verticalArrangement = Arrangement.spacedBy(8.dp),
        ) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.sm.copy(color = colors.mutedForeground, lineHeight = 22.sp),
                LocalContentColor provides colors.mutedForeground,
            ) {
                content()
            }
        }
    }
}
