package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.LinearEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.tween
import androidx.compose.foundation.Canvas
import androidx.compose.foundation.background
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Flashlight
import com.adamglin.phosphoricons.regular.Flashlight
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.Typography

enum class QrScannerState { Idle, Success, Error }

private const val QrFrameCenter = 0.45f

@Composable
fun QrScanner(
    modifier: Modifier = Modifier,
    state: QrScannerState = QrScannerState.Idle,
    title: String? = null,
    hint: String? = null,
    scanLine: Boolean = true,
    torch: Boolean = false,
    onTorchToggle: ((Boolean) -> Unit)? = null,
    frameSize: Dp = 248.dp,
    content: @Composable BoxScope.() -> Unit = {},
) {
    val colors = DarkColors
    val haptics = rememberHaptics()
    val reduced = formReducedMotion()
    val shake = remember { Animatable(0f) }
    LaunchedEffect(state) {
        when (state) {
            QrScannerState.Success -> haptics.perform(HapticFeedbackType.Confirm)
            QrScannerState.Error -> {
                haptics.perform(HapticFeedbackType.Reject)
                if (!reduced) shake.shake()
            }
            QrScannerState.Idle -> Unit
        }
    }
    val bracket by animateColorAsState(
        when (state) {
            QrScannerState.Idle -> colors.onMedia
            QrScannerState.Success -> colors.success
            QrScannerState.Error -> colors.danger
        },
        tween(200),
        label = "bracket",
    )
    val scanning = scanLine && state == QrScannerState.Idle && !reduced
    val sweep = rememberInfiniteTransition(label = "scan")
    val position by sweep.animateFloat(
        0f,
        1f,
        infiniteRepeatable(tween(1800, easing = LinearEasing), RepeatMode.Reverse),
        label = "line",
    )
    val dim = colors.media.copy(alpha = 0.6f)
    val line = colors.accent
    val stateText = when (state) {
        QrScannerState.Idle -> "Scanning"
        QrScannerState.Success -> "Code found"
        QrScannerState.Error -> "Code not recognized"
    }
    Box(modifier = modifier.fillMaxSize().clipToBounds()) {
        content()
        Canvas(
            modifier = Modifier
                .matchParentSize()
                .semantics {
                    contentDescription = "Scan area"
                    stateDescription = stateText
                },
        ) {
            val side = frameSize.toPx()
            val radius = 24.dp.toPx()
            val left = (size.width - side) / 2 + shake.value * density
            val top = size.height * QrFrameCenter - side / 2
            val frame = Rect(left, top, left + side, top + side)
            val cutout = Path().apply {
                fillType = PathFillType.EvenOdd
                addRect(Rect(Offset.Zero, size))
                addRoundRect(RoundRect(frame, CornerRadius(radius)))
            }
            drawPath(cutout, dim)
            val length = 36.dp.toPx()
            val stroke = Stroke(4.dp.toPx(), cap = StrokeCap.Round)
            val corners = listOf(
                Triple(Offset(frame.left, frame.top), 180f, Offset(1f, 1f)),
                Triple(Offset(frame.right, frame.top), 270f, Offset(-1f, 1f)),
                Triple(Offset(frame.right, frame.bottom), 0f, Offset(-1f, -1f)),
                Triple(Offset(frame.left, frame.bottom), 90f, Offset(1f, -1f)),
            )
            corners.forEach { (corner, start, direction) ->
                val arcLeft = if (direction.x > 0) corner.x else corner.x - radius * 2
                val arcTop = if (direction.y > 0) corner.y else corner.y - radius * 2
                val path = Path().apply {
                    val vertical = Offset(corner.x, corner.y + direction.y * length)
                    val horizontal = Offset(corner.x + direction.x * length, corner.y)
                    val (from, to) = if (start == 180f || start == 0f) vertical to horizontal else horizontal to vertical
                    moveTo(from.x, from.y)
                    arcTo(Rect(arcLeft, arcTop, arcLeft + radius * 2, arcTop + radius * 2), start, 90f, false)
                    lineTo(to.x, to.y)
                }
                drawPath(path, bracket, style = stroke)
            }
            if (scanning) {
                val inset = 20.dp.toPx()
                val y = frame.top + inset + (side - inset * 2) * position
                val height = 2.dp.toPx()
                drawRect(
                    Brush.horizontalGradient(
                        listOf(line.copy(alpha = 0f), line, line.copy(alpha = 0f)),
                        startX = frame.left + inset,
                        endX = frame.right - inset,
                    ),
                    topLeft = Offset(frame.left + inset, y - height / 2),
                    size = Size(side - inset * 2, height),
                )
            }
        }
        Layout(
            modifier = Modifier.matchParentSize(),
            content = {
                if (title != null) {
                    BasicText(
                        title,
                        modifier = Modifier.widthIn(max = frameSize + 48.dp),
                        style = Typography.lg.copy(color = colors.onMedia, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                } else {
                    Box(Modifier)
                }
                if (hint != null) {
                    BasicText(
                        hint,
                        modifier = Modifier.widthIn(max = frameSize + 48.dp),
                        style = Typography.sm.copy(color = colors.onMedia.copy(alpha = 0.7f), textAlign = TextAlign.Center),
                    )
                } else {
                    Box(Modifier)
                }
                if (onTorchToggle != null) {
                    QrScannerTorch(torch, onTorchToggle)
                } else {
                    Box(Modifier)
                }
            },
        ) { measurables, constraints ->
            val loose = constraints.copy(minWidth = 0, minHeight = 0)
            val (titlePlaceable, hintPlaceable, torchPlaceable) = measurables.map { it.measure(loose) }
            val side = frameSize.roundToPx()
            val gap = 24.dp.roundToPx()
            val width = constraints.maxWidth
            val height = constraints.maxHeight
            val top = (height * QrFrameCenter).toInt() - side / 2
            val bottom = top + side
            layout(width, height) {
                titlePlaceable.place((width - titlePlaceable.width) / 2, top - gap - titlePlaceable.height)
                hintPlaceable.place((width - hintPlaceable.width) / 2, bottom + gap)
                val torchTop = maxOf(bottom + gap + hintPlaceable.height + 32.dp.roundToPx(), height - 48.dp.roundToPx() - torchPlaceable.height)
                torchPlaceable.place((width - torchPlaceable.width) / 2, minOf(torchTop, height - torchPlaceable.height - 16.dp.roundToPx()))
            }
        }
    }
}

@Composable
private fun QrScannerTorch(on: Boolean, onToggle: (Boolean) -> Unit) {
    val colors = DarkColors
    val source = remember { MutableInteractionSource() }
    val pressed by source.collectIsPressedAsState()
    val haptics = rememberHaptics()
    Box(
        modifier = Modifier
            .size(56.dp)
            .graphicsLayer {
                val scale = if (pressed) 0.95f else 1f
                scaleX = scale
                scaleY = scale
            }
            .clip(CircleShape)
            .background(if (on) colors.onMedia else colors.onMedia.copy(alpha = if (pressed) 0.3f else 0.2f), CircleShape)
            .toggleable(on, source, null, true, Role.Switch) {
                haptics.toggle(it)
                onToggle(it)
            }
            .semantics { contentDescription = "Torch" },
        contentAlignment = Alignment.Center,
    ) {
        Icon(
            if (on) PhosphorIcons.Fill.Flashlight else PhosphorIcons.Regular.Flashlight,
            contentDescription = null,
            size = 24.dp,
            tint = if (on) colors.media else colors.onMedia,
        )
    }
}
