package com.esuiss.ui.components

import androidx.compose.animation.core.Spring
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.spring
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.CornerRadius
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.PathEffect
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.graphics.drawscope.Stroke
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.ProgressBarRangeInfo
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.progressBarRangeInfo
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.Colors
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Palette
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.roundToInt

enum class AttachmentState { Idle, Uploading, Processing, Error, Done }

enum class AttachmentSize { Default, Sm, Xs }

enum class AttachmentOrientation { Horizontal, Vertical }

enum class AttachmentMediaVariant { Icon, Document, Image }

private enum class AttachmentSlot { Content, Actions }

@Stable
private class AttachmentInfo(
    val state: AttachmentState,
    val size: AttachmentSize,
    val orientation: AttachmentOrientation,
) {
    var media by mutableIntStateOf(0)
    var contents by mutableIntStateOf(0)
    var progress by mutableIntStateOf(0)
    var first by mutableStateOf(true)
}

private class AttachmentGroupMarker

private val LocalAttachment = staticCompositionLocalOf<AttachmentInfo?> { null }

private val LocalAttachmentGroup = staticCompositionLocalOf<AttachmentGroupMarker?> { null }

private val AttachmentInfo?.vertical: Boolean
    get() = this?.orientation == AttachmentOrientation.Vertical

private val AttachmentInfo?.sizeOrDefault: AttachmentSize
    get() = this?.size ?: AttachmentSize.Default

@Composable
private fun Register(info: AttachmentInfo?, field: (AttachmentInfo, Int) -> Unit) {
    if (info == null) return
    DisposableEffect(info) {
        field(info, 1)
        onDispose { field(info, -1) }
    }
}

@Composable
fun Attachment(
    modifier: Modifier = Modifier,
    state: AttachmentState = AttachmentState.Done,
    size: AttachmentSize = AttachmentSize.Default,
    orientation: AttachmentOrientation = AttachmentOrientation.Horizontal,
    onClick: (() -> Unit)? = null,
    onClickLabel: String? = null,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val grouped = LocalAttachmentGroup.current != null
    val info = remember(state, size, orientation) { AttachmentInfo(state, size, orientation) }
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val vertical = orientation == AttachmentOrientation.Vertical
    val hasMedia = info.media > 0
    val hasContent = info.contents > 0
    val shape = when {
        grouped -> RectangleShape
        size == AttachmentSize.Xs -> RoundedCornerShape(Radius.lg)
        else -> RoundedCornerShape(Radius.xl2)
    }
    val idle = state == AttachmentState.Idle && !grouped
    val background = if (idle) Color.Transparent else colors.muted
    val padding = attachmentPadding(size, vertical, hasMedia, hasContent)
    val gap = when (size) {
        AttachmentSize.Default -> if (vertical) 8.dp else 12.dp
        AttachmentSize.Sm -> 10.dp
        AttachmentSize.Xs -> 6.dp
    }
    val sizing = when {
        grouped -> Modifier.fillMaxWidth()
        vertical -> Modifier.width(if (hasContent) 120.dp else 96.dp)
        else -> Modifier
    }
    val separatorStart = when (size) {
        AttachmentSize.Default -> if (hasMedia) 64.dp else 16.dp
        AttachmentSize.Sm -> if (hasMedia) 48.dp else 8.dp
        AttachmentSize.Xs -> if (hasMedia) 38.dp else 6.dp
    }
    CompositionLocalProvider(
        LocalAttachment provides info,
        LocalAttachmentGroup provides null,
        LocalContentStyle provides (if (size == AttachmentSize.Default) Typography.sm else Typography.xs).copy(color = colors.foreground),
        LocalContentColor provides colors.foreground,
    ) {
        Layout(
            content = content,
            modifier = modifier
                .layoutId(info)
                .then(sizing)
                .alpha(if (pressed) 0.8f else 1f)
                .clip(shape)
                .background(background, shape)
                .then(
                    if (state == AttachmentState.Idle && !grouped) {
                        Modifier.drawWithContent {
                            drawContent()
                            val stroke = 1.dp.toPx()
                            val radius = if (size == AttachmentSize.Xs) Radius.lg.toPx() else Radius.xl2.toPx()
                            drawRoundRect(
                                color = colors.input,
                                topLeft = Offset(stroke / 2, stroke / 2),
                                size = Size(this.size.width - stroke, this.size.height - stroke),
                                cornerRadius = CornerRadius(radius),
                                style = Stroke(stroke, pathEffect = PathEffect.dashPathEffect(floatArrayOf(4.dp.toPx(), 3.dp.toPx()))),
                            )
                        }
                    } else {
                        Modifier
                    },
                )
                .then(
                    if (grouped) {
                        Modifier.drawWithContent {
                            drawContent()
                            if (!info.first) {
                                val inset = separatorStart.toPx()
                                val rtl = layoutDirection == LayoutDirection.Rtl
                                drawRect(
                                    color = colors.border,
                                    topLeft = Offset(if (rtl) 0f else inset, 0f),
                                    size = Size(this.size.width - inset, 1.dp.toPx()),
                                )
                            }
                        }
                    } else {
                        Modifier
                    },
                )
                .then(
                    if (onClick != null) {
                        Modifier.clickable(
                            interactionSource = interaction,
                            indication = null,
                            onClickLabel = onClickLabel,
                            role = Role.Button,
                            onClick = onClick,
                        )
                    } else {
                        Modifier
                    },
                ),
        ) { measurables, constraints ->
            val start = padding.start.roundToPx()
            val top = padding.top.roundToPx()
            val space = gap.roundToPx()
            if (vertical) {
                val inner = if (constraints.hasBoundedWidth) (constraints.maxWidth - start * 2).coerceAtLeast(0) else Constraints.Infinity
                val flow = measurables.filter { it.layoutId != AttachmentSlot.Actions }
                    .map {
                        it.measure(
                            if (inner == Constraints.Infinity) Constraints() else Constraints(minWidth = inner, maxWidth = inner),
                        )
                    }
                val actions = measurables.filter { it.layoutId == AttachmentSlot.Actions }.map { it.measure(Constraints()) }
                val width = constraints.constrainWidth(
                    if (inner == Constraints.Infinity) (flow.maxOfOrNull { it.width } ?: 0) + start * 2 else constraints.maxWidth,
                )
                val height = flow.sumOf { it.height } + space * (flow.size - 1).coerceAtLeast(0) + top * 2
                layout(width, constraints.constrainHeight(height)) {
                    var y = top
                    flow.forEach {
                        it.placeRelative(start, y)
                        y += it.height + space
                    }
                    val edge = 12.dp.roundToPx()
                    actions.forEach { it.placeRelative(width - edge - it.width, edge, 1f) }
                }
            } else {
                val minWidth = if (grouped) 0 else 160.dp.roundToPx()
                val maxInner = if (constraints.hasBoundedWidth) constraints.maxWidth - start * 2 else Constraints.Infinity
                val fixed = measurables.filter { it.layoutId != AttachmentSlot.Content }
                    .associateWith { it.measure(Constraints(maxWidth = maxInner.coerceAtLeast(0))) }
                val flexible = measurables.filter { it.layoutId == AttachmentSlot.Content }
                val used = fixed.values.sumOf { it.width } + space * (measurables.size - 1).coerceAtLeast(0)
                val natural = flexible.associateWith { it.maxIntrinsicWidth(constraints.maxHeight) }
                val available = if (maxInner == Constraints.Infinity) Constraints.Infinity else (maxInner - used).coerceAtLeast(0)
                val stretch = grouped || constraints.minWidth > 0
                val contentWidth = flexible.associateWith { measurable ->
                    val share = if (available == Constraints.Infinity) Constraints.Infinity else available / flexible.size
                    when {
                        share == Constraints.Infinity -> natural.getValue(measurable)
                        stretch -> share
                        else -> natural.getValue(measurable).coerceAtMost(share)
                    }
                }
                var innerWidth = used + contentWidth.values.sum()
                val floor = (minWidth.coerceAtMost(if (constraints.hasBoundedWidth) constraints.maxWidth else minWidth) - start * 2).coerceAtLeast(0)
                val extra = (floor - innerWidth).coerceAtLeast(0)
                val measured = flexible.associateWith {
                    val w = contentWidth.getValue(it) + if (flexible.isNotEmpty()) extra / flexible.size else 0
                    it.measure(Constraints(minWidth = w, maxWidth = w))
                }
                innerWidth += if (flexible.isNotEmpty()) extra else 0
                val placeables = measurables.map { fixed[it] ?: measured.getValue(it) }
                val width = constraints.constrainWidth(
                    if (grouped && constraints.hasBoundedWidth) constraints.maxWidth else maxOf(innerWidth, floor) + start * 2,
                )
                val innerHeight = placeables.maxOfOrNull { it.height } ?: 0
                layout(width, constraints.constrainHeight(innerHeight + top * 2)) {
                    var x = start
                    placeables.forEach {
                        it.placeRelative(x, top + (innerHeight - it.height) / 2)
                        x += it.width + space
                    }
                }
            }
        }
    }
}

private class AttachmentPadding(val start: Dp, val top: Dp)

private fun attachmentPadding(size: AttachmentSize, vertical: Boolean, media: Boolean, content: Boolean): AttachmentPadding =
    when (size) {
        AttachmentSize.Default -> when {
            !vertical -> AttachmentPadding(16.dp, 12.dp)
            media -> AttachmentPadding(8.dp, 8.dp)
            content -> AttachmentPadding(10.dp, 8.dp)
            else -> AttachmentPadding(16.dp, 12.dp)
        }
        AttachmentSize.Sm -> when {
            media -> AttachmentPadding(6.dp, 6.dp)
            content -> AttachmentPadding(8.dp, 6.dp)
            else -> AttachmentPadding(0.dp, 0.dp)
        }
        AttachmentSize.Xs -> when {
            media -> AttachmentPadding(4.dp, 4.dp)
            content -> AttachmentPadding(6.dp, 4.dp)
            else -> AttachmentPadding(0.dp, 0.dp)
        }
    }

@Composable
fun AttachmentGroup(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val shape = RoundedCornerShape(Radius.xl2)
    val marker = remember { AttachmentGroupMarker() }
    CompositionLocalProvider(LocalAttachmentGroup provides marker) {
        Layout(
            content = content,
            modifier = modifier
                .fillMaxWidth()
                .clip(shape)
                .background(colors.muted, shape),
        ) { measurables, constraints ->
            val width = constraints.maxWidth
            val placeables = measurables.map { it.measure(Constraints(minWidth = width, maxWidth = width)) }
            measurables.forEachIndexed { index, measurable ->
                (measurable.layoutId as? AttachmentInfo)?.first = index == 0
            }
            layout(width, constraints.constrainHeight(placeables.sumOf { it.height })) {
                var y = 0
                placeables.forEach {
                    it.placeRelative(0, y)
                    y += it.height
                }
            }
        }
    }
}

@Composable
fun AttachmentMedia(
    modifier: Modifier = Modifier,
    variant: AttachmentMediaVariant = AttachmentMediaVariant.Icon,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val info = LocalAttachment.current
    Register(info) { target, delta -> target.media += delta }
    val size = info.sizeOrDefault
    val vertical = info.vertical
    val radius = when {
        variant != AttachmentMediaVariant.Image || size == AttachmentSize.Xs -> Radius.sm
        else -> Radius.md
    }
    val shape = RoundedCornerShape(radius)
    val bordered = variant != AttachmentMediaVariant.Image
    val sizing = if (vertical) {
        if (variant == AttachmentMediaVariant.Document) Modifier.fillMaxWidth().height(44.dp) else Modifier.fillMaxWidth().aspectRatio(1f)
    } else {
        when (size) {
            AttachmentSize.Default -> Modifier.size(36.dp, 44.dp)
            AttachmentSize.Sm -> Modifier.size(32.dp, 40.dp)
            AttachmentSize.Xs -> Modifier.size(28.dp, 34.dp)
        }
    }
    val iconSize = when {
        vertical -> 24.dp
        size == AttachmentSize.Xs -> 14.dp
        else -> 16.dp
    }
    Box(
        modifier = modifier
            .then(sizing)
            .clip(shape)
            .background(if (bordered) colors.background else colors.muted, shape)
            .then(if (bordered) Modifier.border(1.dp, colors.border, shape) else Modifier)
            .then(if (variant == AttachmentMediaVariant.Document) Modifier.padding(bottom = 6.dp) else Modifier),
        contentAlignment = if (variant == AttachmentMediaVariant.Document) Alignment.BottomCenter else Alignment.Center,
    ) {
        CompositionLocalProvider(
            LocalContentColor provides if (variant == AttachmentMediaVariant.Icon) colors.mutedForeground else colors.foreground,
            LocalIconSize provides iconSize,
        ) {
            content()
        }
    }
}

@Composable
fun AttachmentMedia(
    image: Painter,
    contentDescription: String?,
    modifier: Modifier = Modifier,
) {
    AttachmentMedia(modifier, AttachmentMediaVariant.Image) {
        Image(
            painter = image,
            contentDescription = contentDescription,
            modifier = Modifier.fillMaxSize(),
            contentScale = ContentScale.Crop,
        )
    }
}

@Composable
fun AttachmentLabel(
    text: String,
    modifier: Modifier = Modifier,
    background: Color = EsuissTheme.colors.primary,
) {
    val colors = EsuissTheme.colors
    BasicText(
        text.uppercase(),
        modifier = modifier
            .background(background, RoundedCornerShape(Radius.xs))
            .padding(horizontal = 4.dp, vertical = 2.dp),
        style = TextStyle(fontSize = 9.sp, lineHeight = 9.sp, fontWeight = FontWeight.SemiBold, color = colors.primaryForeground),
        maxLines = 1,
    )
}

@Composable
fun AttachmentContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val info = LocalAttachment.current
    Register(info) { target, delta -> target.contents += delta }
    Column(
        modifier = modifier
            .layoutId(AttachmentSlot.Content)
            .then(if (info.vertical) Modifier.padding(horizontal = 4.dp) else Modifier),
        content = content,
    )
}

@Composable
fun AttachmentTitle(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val info = LocalAttachment.current
    val size = info.sizeOrDefault
    val style = when (size) {
        AttachmentSize.Default -> Typography.base
        else -> Typography.xs.copy(fontWeight = FontWeight.SemiBold)
    }
    BasicText(
        text,
        modifier = modifier.padding(end = if ((info?.progress ?: 0) > 0) 48.dp else 0.dp),
        style = style.copy(color = colors.foreground),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun AttachmentDescription(text: String, modifier: Modifier = Modifier) {
    val colors = EsuissTheme.colors
    val info = LocalAttachment.current
    val style = if (info.sizeOrDefault == AttachmentSize.Default) Typography.sm else Typography.xs
    BasicText(
        text,
        modifier = modifier.padding(top = 2.dp),
        style = style.copy(color = if (info?.state == AttachmentState.Error) colors.destructive else colors.mutedForeground),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}

@Composable
fun AttachmentProgress(
    value: Float,
    modifier: Modifier = Modifier,
    max: Float = 100f,
    contentDescription: String? = null,
) {
    val colors = EsuissTheme.colors
    val info = LocalAttachment.current
    Register(info) { target, delta -> target.progress += delta }
    val fraction = if (max <= 0f) 0f else (value / max).coerceIn(0f, 1f)
    val animated by animateFloatAsState(
        targetValue = fraction,
        animationSpec = spring(dampingRatio = Spring.DampingRatioNoBouncy, stiffness = 200f),
        label = "attachment-progress",
    )
    Layout(
        content = {
            BasicText(
                "${(fraction * 100).roundToInt()}%",
                style = Typography.sm.copy(color = colors.mutedForeground, fontFeatureSettings = "tnum"),
                maxLines = 1,
            )
            Box(
                Modifier
                    .fillMaxWidth()
                    .height(4.dp)
                    .clip(CircleShape)
                    .background(colors.foreground.copy(alpha = 0.1f)),
            ) {
                Box(
                    Modifier
                        .fillMaxHeight()
                        .fillMaxWidth(animated)
                        .background(colors.primary, CircleShape),
                )
            }
        },
        modifier = modifier
            .fillMaxWidth()
            .padding(top = 8.dp)
            .semantics(mergeDescendants = true) {
                progressBarRangeInfo = ProgressBarRangeInfo(value.coerceIn(0f, max), 0f..max)
                if (contentDescription != null) this.contentDescription = contentDescription
            },
    ) { measurables, constraints ->
        val label = measurables[0].measure(Constraints())
        val track = measurables[1].measure(constraints.copy(minHeight = 0))
        layout(track.width, track.height) {
            track.placeRelative(0, 0)
            label.placeRelative(track.width - label.width, -label.height - 8.dp.roundToPx())
        }
    }
}

@Composable
fun AttachmentActions(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val info = LocalAttachment.current
    Row(
        modifier = modifier.layoutId(AttachmentSlot.Actions),
        horizontalArrangement = Arrangement.spacedBy(if (info.vertical) 4.dp else 0.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun AttachmentAction(
    onClick: () -> Unit,
    contentDescription: String?,
    modifier: Modifier = Modifier,
    variant: ButtonVariant = ButtonVariant.Secondary,
    enabled: Boolean = true,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val info = LocalAttachment.current
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val size = info.sizeOrDefault
    val vertical = info.vertical
    val diameter = when (size) {
        AttachmentSize.Default -> 28.dp
        AttachmentSize.Sm -> 24.dp
        AttachmentSize.Xs -> 20.dp
    }
    val background = if (vertical) Palette.black.copy(alpha = 0.5f) else attachmentActionBackground(variant, colors)
    val foreground = when {
        vertical || variant == ButtonVariant.Default -> colors.primaryForeground
        variant == ButtonVariant.Destructive -> colors.destructive
        else -> colors.mutedForeground
    }
    Box(
        modifier = modifier
            .size(diameter)
            .alpha(
                when {
                    !enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clip(CircleShape)
            .background(background, CircleShape)
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            )
            .then(if (contentDescription != null) Modifier.semantics { this.contentDescription = contentDescription } else Modifier),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(
            LocalContentColor provides foreground,
            LocalIconSize provides if (size == AttachmentSize.Xs) 10.dp else 12.dp,
        ) {
            content()
        }
    }
}

@Composable
fun AttachmentAction(
    text: String,
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    BasicText(
        text,
        modifier = modifier
            .alpha(
                when {
                    !enabled -> 0.5f
                    pressed -> 0.8f
                    else -> 1f
                },
            )
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = onClick,
            ),
        style = Typography.base.copy(color = colors.primary),
        maxLines = 1,
    )
}

private fun attachmentActionBackground(variant: ButtonVariant, colors: Colors): Color = when (variant) {
    ButtonVariant.Default -> colors.primary
    ButtonVariant.Destructive -> colors.destructive.copy(alpha = if (colors.isDark) 0.2f else 0.1f)
    ButtonVariant.Outline -> colors.background
    ButtonVariant.Ghost, ButtonVariant.Plain, ButtonVariant.Link -> Color.Transparent
    else -> colors.secondary
}
