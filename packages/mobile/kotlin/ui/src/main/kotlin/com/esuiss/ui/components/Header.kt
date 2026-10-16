package com.esuiss.ui.components

import androidx.compose.animation.core.animate
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.input.nestedscroll.NestedScrollConnection
import androidx.compose.ui.input.nestedscroll.NestedScrollSource
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.layout.layoutId
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.Constraints
import androidx.compose.ui.unit.Velocity
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretLeft
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private val HeaderBarHeight = 44.dp

private enum class HeaderSlot { Back, Start, End, Title, LargeTitle }

enum class HeaderActionsSide { Leading, Trailing }

@Stable
class HeaderState {
    internal var range by mutableFloatStateOf(0f)
    internal var offset by mutableFloatStateOf(0f)

    val collapsedFraction: Float
        get() = if (range <= 0f) 1f else (offset / range).coerceIn(0f, 1f)

    val nestedScrollConnection: NestedScrollConnection = object : NestedScrollConnection {
        override fun onPreScroll(available: Offset, source: NestedScrollSource): Offset {
            if (available.y >= 0f || range <= 0f) return Offset.Zero
            val next = (offset - available.y).coerceAtMost(range)
            val used = next - offset
            offset = next
            return Offset(0f, -used)
        }

        override fun onPostScroll(consumed: Offset, available: Offset, source: NestedScrollSource): Offset {
            if (available.y <= 0f || range <= 0f) return Offset.Zero
            val next = (offset - available.y).coerceAtLeast(0f)
            val used = offset - next
            offset = next
            return Offset(0f, used)
        }

        override suspend fun onPostFling(consumed: Velocity, available: Velocity): Velocity {
            settle()
            return Velocity.Zero
        }
    }

    internal suspend fun settle() {
        if (range <= 0f || offset <= 0f || offset >= range) return
        val target = if (offset < range / 2f) 0f else range
        animate(offset, target, animationSpec = tween(250)) { value, _ -> offset = value }
    }
}

@Composable
fun rememberHeaderState(): HeaderState = remember { HeaderState() }

private val LocalHeaderState = staticCompositionLocalOf<HeaderState?> { null }

@Composable
fun Header(
    modifier: Modifier = Modifier,
    state: HeaderState = rememberHeaderState(),
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val collapsed = state.range > 0f && state.offset >= state.range
    val separator by animateFloatAsState(if (state.range <= 0f || collapsed) 1f else 0f, tween(150), label = "separator")
    CompositionLocalProvider(LocalHeaderState provides state) {
        Layout(
            content = content,
            modifier = modifier
                .clipToBounds()
                .drawWithContent {
                    drawContent()
                    val stroke = 1.dp.toPx()
                    drawRect(colors.border.copy(alpha = colors.border.alpha * separator), Offset(0f, size.height - stroke), Size(size.width, stroke))
                },
        ) { measurables, constraints ->
            val width = constraints.maxWidth
            val bar = HeaderBarHeight.roundToPx()
            val inset = 8.dp.roundToPx()
            val loose = Constraints(maxWidth = width, maxHeight = bar)
            val back = measurables.firstOrNull { it.layoutId == HeaderSlot.Back }?.measure(loose)
            val start = measurables.firstOrNull { it.layoutId == HeaderSlot.Start }?.measure(loose)
            val end = measurables.firstOrNull { it.layoutId == HeaderSlot.End }?.measure(loose)
            val leading = (back?.width ?: 0) + (start?.width ?: 0)
            val side = maxOf(leading, end?.width ?: 0) + inset
            val titleWidth = (width - side * 2).coerceAtLeast(0)
            val title = measurables.firstOrNull { it.layoutId == HeaderSlot.Title }
                ?.measure(Constraints(maxWidth = titleWidth, maxHeight = bar))
            val large = measurables.firstOrNull { it.layoutId == HeaderSlot.LargeTitle }
                ?.measure(Constraints(minWidth = width, maxWidth = width))
            val range = (large?.height ?: 0).toFloat()
            if (state.range != range) state.range = range
            val offset = state.offset.coerceIn(0f, range).toInt()
            val height = bar + (large?.height ?: 0) - offset
            layout(width, height) {
                var x = inset
                back?.let {
                    it.placeRelative(x, (bar - it.height) / 2)
                    x += it.width
                }
                start?.placeRelative(x, (bar - (start.height)) / 2)
                end?.let { it.placeRelative(width - inset - it.width, (bar - it.height) / 2) }
                title?.placeRelative((width - title.width) / 2, (bar - title.height) / 2)
                large?.placeRelative(0, bar - offset)
            }
        }
    }
}

@Composable
fun HeaderTitle(
    text: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
) {
    val colors = EsuissTheme.colors
    val state = LocalHeaderState.current
    Column(
        modifier = modifier
            .layoutId(HeaderSlot.Title)
            .graphicsLayer {
                val fraction = state?.collapsedFraction ?: 1f
                alpha = if (state == null || state.range <= 0f) 1f else ((fraction - 0.6f) / 0.4f).coerceIn(0f, 1f)
            }
            .semantics { heading() },
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        BasicText(
            text,
            style = Typography.base.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold, textAlign = TextAlign.Center),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        if (subtitle != null) {
            BasicText(
                subtitle,
                style = Typography.xs.copy(color = colors.mutedForeground, textAlign = TextAlign.Center),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
fun HeaderLargeTitle(
    text: String,
    modifier: Modifier = Modifier,
    subtitle: String? = null,
) {
    val colors = EsuissTheme.colors
    val state = LocalHeaderState.current
    Column(
        modifier = modifier
            .layoutId(HeaderSlot.LargeTitle)
            .graphicsLayer {
                val fraction = state?.collapsedFraction ?: 0f
                alpha = (1f - fraction * 1.4f).coerceIn(0f, 1f)
            }
            .padding(start = 16.dp, end = 16.dp, top = 4.dp, bottom = 8.dp),
        verticalArrangement = Arrangement.spacedBy(2.dp),
    ) {
        BasicText(
            text,
            modifier = Modifier.semantics { heading() },
            style = Typography.xl3.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
            maxLines = 2,
            overflow = TextOverflow.Ellipsis,
        )
        if (subtitle != null) {
            BasicText(subtitle, style = Typography.sm.copy(color = colors.mutedForeground))
        }
    }
}

@Composable
fun HeaderBack(
    onClick: () -> Unit,
    modifier: Modifier = Modifier,
    text: String? = "Back",
    contentDescription: String = text ?: "Back",
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    Row(
        modifier = modifier
            .layoutId(HeaderSlot.Back)
            .height(HeaderBarHeight)
            .clickable(
                interactionSource = interaction,
                indication = null,
                role = Role.Button,
                onClickLabel = contentDescription,
                onClick = onClick,
            )
            .graphicsLayer { alpha = if (pressed) 0.4f else 1f }
            .padding(end = 8.dp),
        horizontalArrangement = Arrangement.spacedBy(2.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        Icon(PhosphorIcons.Regular.CaretLeft, contentDescription = if (text == null) contentDescription else null, size = 24.dp, tint = colors.primary)
        if (text != null) {
            BasicText(text, style = Typography.base.copy(color = colors.primary), maxLines = 1)
        }
    }
}

@Composable
fun HeaderActions(
    modifier: Modifier = Modifier,
    side: HeaderActionsSide = HeaderActionsSide.Trailing,
    content: @Composable RowScope.() -> Unit,
) {
    Row(
        modifier = modifier.layoutId(if (side == HeaderActionsSide.Leading) HeaderSlot.Start else HeaderSlot.End),
        horizontalArrangement = Arrangement.spacedBy(4.dp),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}
