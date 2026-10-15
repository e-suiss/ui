package com.esuiss.ui.components

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.Animatable
import androidx.compose.animation.core.CubicBezierEasing
import androidx.compose.animation.core.RepeatMode
import androidx.compose.animation.core.animateFloat
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.infiniteRepeatable
import androidx.compose.animation.core.rememberInfiniteTransition
import androidx.compose.animation.core.spring
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
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Rect
import androidx.compose.ui.geometry.RoundRect
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Path
import androidx.compose.ui.graphics.PathFillType
import androidx.compose.ui.graphics.StrokeCap
import androidx.compose.ui.graphics.StrokeJoin
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.drawscope.scale
import androidx.compose.ui.hapticfeedback.HapticFeedbackType
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.Density
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Fill
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.fill.Flashlight
import com.adamglin.phosphoricons.regular.Flashlight
import com.esuiss.ui.theme.DarkColors
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Typography
import kotlin.math.max
import kotlin.math.min
import kotlin.math.roundToInt

enum class QrScannerState { Idle, Success, Error }

private val QrFrameMax = 260.dp
private const val QrFrameRatio = 0.66f
private val QrFrameLift = 24.dp
private val QrHoleRadius = 32.dp
private val QrBracketArm = 48.dp
private val QrBracketWidth = 6.dp
private val QrLineInset = 24.dp
private val QrLineHeight = 2.dp
private val QrTitleGap = 32.dp
private val QrTitleInset = 24.dp
private val QrDescriptionGap = 20.dp
private val QrDescriptionWidth = 280.dp
private val QrTorchBottom = 48.dp
private val QrTorchSize = 56.dp
private val QrScanEasing = CubicBezierEasing(0.42f, 0f, 0.58f, 1f)

private fun Density.qrFrame(frameSize: Dp?, width: Float, height: Float): Rect {
    val side = frameSize?.toPx()
        ?: min(QrFrameMax.toPx(), (min(width, height) / density * QrFrameRatio).roundToInt() * density)
    val left = (width - side) / 2
    val top = max(0f, (height - side) / 2 - QrFrameLift.toPx())
    return Rect(left, top, left + side, top + side)
}

@Composable
fun QrScanner(
    modifier: Modifier = Modifier,
    state: QrScannerState = QrScannerState.Idle,
    title: String? = null,
    hint: String? = null,
    scanLine: Boolean = false,
    torch: Boolean = false,
    onTorchToggle: ((Boolean) -> Unit)? = null,
    frameSize: Dp? = null,
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
            QrScannerState.Idle -> Palette.white
            QrScannerState.Success -> if (colors.isDark) Palette.green400 else Palette.green600
            QrScannerState.Error -> colors.destructive
        },
        tween(200),
        label = "bracket",
    )
    val scale by animateFloatAsState(
        if (state == QrScannerState.Success && !reduced) 0.94f else 1f,
        spring(dampingRatio = 0.6f, stiffness = 400f),
        label = "scale",
    )
    val scanning = scanLine && state == QrScannerState.Idle && !reduced
    val sweep = rememberInfiniteTransition(label = "scan")
    val position by sweep.animateFloat(
        0f,
        1f,
        infiniteRepeatable(tween(1800, easing = QrScanEasing), RepeatMode.Reverse),
        label = "line",
    )
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
            val base = qrFrame(frameSize, size.width, size.height)
            val frame = base.translate(shake.value * density, 0f)
            val side = frame.width
            val radius = min(QrHoleRadius.toPx(), side / 2)
            val cutout = Path().apply {
                fillType = PathFillType.EvenOdd
                addRect(Rect(Offset.Zero, size))
                addRoundRect(RoundRect(frame, CornerRadius(radius)))
            }
            drawPath(cutout, Palette.black.copy(alpha = 0.5f))
            val arm = max(radius, min(QrBracketArm.toPx(), side / 2))
            val stroke = Stroke(QrBracketWidth.toPx(), cap = StrokeCap.Round, join = StrokeJoin.Round)
            val corners = listOf(
                Triple(Offset(frame.left, frame.top), 1f, 1f),
                Triple(Offset(frame.right, frame.top), -1f, 1f),
                Triple(Offset(frame.right, frame.bottom), -1f, -1f),
                Triple(Offset(frame.left, frame.bottom), 1f, -1f),
            )
            scale(scale, frame.center) {
                corners.forEach { (corner, dx, dy) ->
                    val center = Offset(corner.x + dx * radius, corner.y + dy * radius)
                    val path = Path().apply {
                        moveTo(corner.x, corner.y + dy * arm)
                        lineTo(corner.x, corner.y + dy * radius)
                        arcTo(
                            Rect(center, radius),
                            if (dx > 0) 180f else 0f,
                            if (dx * dy > 0) 90f else -90f,
                            false,
                        )
                        lineTo(corner.x + dx * arm, corner.y)
                    }
                    drawPath(path, bracket, style = stroke)
                }
            }
            if (scanning) {
                val inset = QrLineInset.toPx()
                val height = QrLineHeight.toPx()
                val y = frame.top + inset + (side - inset * 2) * position
                drawRoundRect(
                    colors.primary,
                    topLeft = Offset(frame.left + inset, y - height / 2),
                    size = Size(side - inset * 2, height),
                    cornerRadius = CornerRadius(height / 2),
                )
            }
        }
        Layout(
            modifier = Modifier.matchParentSize(),
            content = {
                if (title != null) {
                    BasicText(
                        title,
                        style = Typography.lg.copy(color = Palette.white, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
                    )
                } else {
                    Box(Modifier)
                }
                if (hint != null) {
                    BasicText(
                        hint,
                        modifier = Modifier.widthIn(max = QrDescriptionWidth),
                        style = Typography.sm.copy(color = Palette.white, textAlign = TextAlign.Center),
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
            val width = constraints.maxWidth
            val height = constraints.maxHeight
            val inset = QrTitleInset.roundToPx()
            val titlePlaceable = measurables[0].measure(loose.copy(maxWidth = max(0, width - inset * 2)))
            val hintPlaceable = measurables[1].measure(loose)
            val torchPlaceable = measurables[2].measure(loose)
            val frame = qrFrame(frameSize, width.toFloat(), height.toFloat())
            val top = frame.top.roundToInt()
            val bottom = frame.bottom.roundToInt()
            layout(width, height) {
                titlePlaceable.place((width - titlePlaceable.width) / 2, top - QrTitleGap.roundToPx() - titlePlaceable.height)
                hintPlaceable.place((width - hintPlaceable.width) / 2, bottom + QrDescriptionGap.roundToPx())
                torchPlaceable.place((width - torchPlaceable.width) / 2, height - QrTorchBottom.roundToPx() - torchPlaceable.height)
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
            .size(QrTorchSize)
            .alpha(if (pressed) 0.7f else 1f)
            .clip(CircleShape)
            .background(if (on) Palette.white else Palette.black.copy(alpha = 0.5f), CircleShape)
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
            tint = if (on) Palette.black else Palette.white,
        )
    }
}
