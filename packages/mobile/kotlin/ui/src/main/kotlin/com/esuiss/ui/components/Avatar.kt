package com.esuiss.ui.components

import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.painter.Painter
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.Dp
import androidx.compose.ui.unit.constrainHeight
import androidx.compose.ui.unit.constrainWidth
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class AvatarSize(
    val size: Dp,
    internal val iconSize: Dp,
    internal val badgeSize: Dp,
    internal val badgeIconSize: Dp,
    internal val countIconSize: Dp,
) {
    Sm(24.dp, 14.dp, 12.dp, 0.dp, 12.dp),
    Default(32.dp, 20.dp, 16.dp, 8.dp, 16.dp),
    Lg(40.dp, 24.dp, 18.dp, 10.dp, 20.dp),
    Xl(64.dp, 40.dp, 22.dp, 12.dp, 28.dp),
    ;

    internal val textStyle: TextStyle
        get() = when (this) {
            Sm -> Typography.xs3
            Default -> Typography.xs
            Lg -> Typography.md
            Xl -> Typography.xl2
        }
}

private val LocalAvatarSize = staticCompositionLocalOf { AvatarSize.Default }

private val LocalAvatarGrouped = staticCompositionLocalOf { false }

@Composable
fun Avatar(
    modifier: Modifier = Modifier,
    size: AvatarSize = AvatarSize.Default,
    image: Painter? = null,
    contentDescription: String? = null,
    badge: (@Composable () -> Unit)? = null,
    fallback: (@Composable () -> Unit)? = null,
) {
    val colors = EsuissTheme.colors
    val grouped = LocalAvatarGrouped.current
    CompositionLocalProvider(LocalAvatarSize provides size, LocalAvatarGrouped provides false) {
        Box(modifier.size(size.size)) {
            Box(
                Modifier
                    .fillMaxSize()
                    .then(
                        if (grouped) {
                            Modifier.background(colors.background, CircleShape).padding(2.dp)
                        } else {
                            Modifier
                        },
                    )
                    .clip(CircleShape),
                contentAlignment = Alignment.Center,
            ) {
                fallback?.invoke()
                if (image != null) {
                    Image(
                        painter = image,
                        contentDescription = contentDescription,
                        modifier = Modifier.fillMaxSize(),
                        contentScale = ContentScale.Crop,
                    )
                }
            }
            if (badge != null) {
                Box(Modifier.align(Alignment.BottomEnd).offset(2.dp, 2.dp)) {
                    badge()
                }
            }
        }
    }
}

@Composable
fun AvatarFallback(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val size = LocalAvatarSize.current
    val background = if (colors.isDark) {
        colors.mutedForeground.copy(alpha = colors.mutedForeground.alpha * 0.6f)
    } else {
        colors.mutedForeground
    }
    Box(
        modifier = modifier.fillMaxSize().background(background, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides size.textStyle.copy(color = colors.primaryForeground, fontWeight = FontWeight.SemiBold),
            LocalContentColor provides colors.primaryForeground,
            LocalIconSize provides size.iconSize,
        ) {
            content()
        }
    }
}

@Composable
fun AvatarFallback(
    text: String,
    modifier: Modifier = Modifier,
) {
    AvatarFallback(modifier) {
        BasicText(text.uppercase(), style = LocalContentStyle.current, maxLines = 1)
    }
}

@Composable
fun AvatarBadge(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit = {},
) {
    val colors = EsuissTheme.colors
    val size = LocalAvatarSize.current
    Box(
        modifier = modifier
            .size(size.badgeSize)
            .background(colors.background, CircleShape)
            .padding(2.dp)
            .background(colors.primary, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        if (size != AvatarSize.Sm) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.xs3.copy(color = colors.primaryForeground),
                LocalContentColor provides colors.primaryForeground,
                LocalIconSize provides size.badgeIconSize,
            ) {
                content()
            }
        }
    }
}

@Composable
fun AvatarGroup(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Layout(
        content = { CompositionLocalProvider(LocalAvatarGrouped provides true, content = content) },
        modifier = modifier,
    ) { measurables, constraints ->
        val loose = constraints.copy(minWidth = 0, minHeight = 0)
        val placeables = measurables.map { it.measure(loose) }
        val large = AvatarSize.Xl.size.roundToPx()
        val offsets = IntArray(placeables.size)
        var x = 0
        placeables.forEachIndexed { index, placeable ->
            if (index > 0) x -= if (placeable.height >= large) 16.dp.roundToPx() else 8.dp.roundToPx()
            offsets[index] = x
            x += placeable.width
        }
        val height = placeables.maxOfOrNull { it.height } ?: 0
        layout(constraints.constrainWidth(x.coerceAtLeast(0)), constraints.constrainHeight(height)) {
            placeables.forEachIndexed { index, placeable ->
                placeable.placeRelative(offsets[index], (height - placeable.height) / 2)
            }
        }
    }
}

@Composable
fun AvatarGroupCount(
    modifier: Modifier = Modifier,
    size: AvatarSize = AvatarSize.Default,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    Box(
        modifier = modifier
            .size(size.size)
            .background(colors.background, CircleShape)
            .padding(2.dp)
            .background(colors.muted, CircleShape),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides size.textStyle.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
            LocalContentColor provides colors.foreground,
            LocalIconSize provides size.countIconSize,
        ) {
            content()
        }
    }
}

@Composable
fun AvatarGroupCount(
    text: String,
    modifier: Modifier = Modifier,
    size: AvatarSize = AvatarSize.Default,
) {
    AvatarGroupCount(modifier, size) {
        BasicText(text, style = LocalContentStyle.current, maxLines = 1)
    }
}
