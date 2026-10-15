package com.esuiss.ui.interactions

import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.platform.LocalLayoutDirection
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Immutable
internal class UndoBarEntry(
    val id: Long,
    val title: String,
    val actionLabel: String?,
    val onUndo: () -> Unit,
    val onCommit: (() -> Unit)?,
)

@Stable
class UndoBarState {
    private var nextId = 0L
    private var entry by mutableStateOf<UndoBarEntry?>(null)
    internal var visible by mutableStateOf(false)
        private set
    private var pending: UndoBarEntry? = null

    internal val current: UndoBarEntry?
        get() = entry

    fun show(
        title: String,
        onUndo: () -> Unit,
        actionLabel: String? = null,
        onCommit: (() -> Unit)? = null,
    ) {
        pending?.onCommit?.invoke()
        nextId += 1
        val next = UndoBarEntry(nextId, title, actionLabel, onUndo, onCommit)
        pending = next
        entry = next
        visible = true
    }

    fun undo() {
        settle(true)
    }

    fun dismiss() {
        settle(false)
    }

    private fun settle(undo: Boolean) {
        val active = pending ?: return
        pending = null
        visible = false
        if (undo) active.onUndo() else active.onCommit?.invoke()
    }
}

@Composable
fun rememberUndoBarState(): UndoBarState = remember { UndoBarState() }

@Composable
fun UndoBarProvider(
    state: UndoBarState,
    modifier: Modifier = Modifier,
    timeoutMillis: Long = 5000,
    content: @Composable () -> Unit,
) {
    content()
    val entry = state.current ?: return
    val visible = state.visible
    val progress = remember { Animatable(0f) }
    LaunchedEffect(entry.id, visible, timeoutMillis) {
        if (!visible) return@LaunchedEffect
        progress.snapTo(0f)
        progress.animateTo(1f, tween(timeoutMillis.toInt(), easing = LinearEasing))
        state.dismiss()
    }
    val colors = EsuissTheme.colors
    FloatingBar(
        visible = visible,
        maxWidth = 384.dp,
        contentPadding = PaddingValues(start = 16.dp, end = 4.dp),
        horizontalArrangement = Arrangement.spacedBy(12.dp),
        modifier = modifier.semantics { liveRegion = LiveRegionMode.Polite },
    ) {
        val rtl = LocalLayoutDirection.current == LayoutDirection.Rtl
        Canvas(modifier = Modifier.size(20.dp)) {
            val stroke = 2.dp.toPx()
            val radius = 8.dp.toPx()
            val topLeft = Offset(center.x - radius, center.y - radius)
            val arc = Size(radius * 2, radius * 2)
            drawCircle(colors.border, radius, style = Stroke(stroke))
            scale(if (rtl) -1f else 1f, 1f) {
                drawArc(
                    color = colors.mutedForeground,
                    startAngle = -90f + progress.value * 360f,
                    sweepAngle = (1f - progress.value) * 360f,
                    useCenter = false,
                    topLeft = topLeft,
                    size = arc,
                    style = Stroke(stroke, cap = StrokeCap.Round),
                )
            }
        }
        BasicText(
            entry.title,
            modifier = Modifier.weight(1f),
            style = Typography.sm.copy(color = colors.foreground, fontWeight = FontWeight.Medium),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        Button(onClick = { state.undo() }, variant = ButtonVariant.Plain, size = ButtonSize.Lg) {
            BasicText(
                entry.actionLabel ?: "Undo",
                style = LocalContentStyle.current.copy(fontWeight = FontWeight.SemiBold),
                maxLines = 1,
            )
        }
    }
}
