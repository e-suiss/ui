package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class EmptyMediaVariant { Default, Icon }

@Composable
fun Empty(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    Column(
        modifier = modifier
            .fillMaxWidth()
            .padding(48.dp),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp, Alignment.CenterVertically),
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = colors.foreground, textAlign = TextAlign.Center),
            LocalContentColor provides colors.foreground,
        ) {
            content()
        }
    }
}

@Composable
fun EmptyHeader(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.widthIn(max = 384.dp).semantics(mergeDescendants = true) {},
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(8.dp),
        content = content,
    )
}

@Composable
fun EmptyMedia(
    modifier: Modifier = Modifier,
    variant: EmptyMediaVariant = EmptyMediaVariant.Default,
    content: @Composable BoxScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val surface = if (variant == EmptyMediaVariant.Icon) {
        val shape = RoundedCornerShape(Radius.lg)
        Modifier.size(40.dp).background(colors.muted, shape)
    } else {
        Modifier
    }
    Box(
        modifier = modifier.padding(bottom = 8.dp).then(surface),
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(
            LocalIconSize provides if (variant == EmptyMediaVariant.Icon) 20.dp else LocalIconSize.current,
            LocalContentColor provides colors.foreground,
        ) {
            content()
        }
    }
}

@Composable
fun EmptyTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier.semantics { heading() },
        style = Typography.lg.copy(
            color = EsuissTheme.colors.foreground,
            fontWeight = FontWeight.SemiBold,
            textAlign = TextAlign.Center,
        ),
    )
}

@Composable
fun EmptyDescription(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier,
        style = Typography.sm.copy(
            color = EsuissTheme.colors.mutedForeground,
            lineHeight = 24.sp,
            textAlign = TextAlign.Center,
        ),
    )
}

@Composable
fun EmptyContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(
        modifier = modifier.widthIn(max = 384.dp).fillMaxWidth(),
        horizontalAlignment = Alignment.CenterHorizontally,
        verticalArrangement = Arrangement.spacedBy(16.dp),
        content = content,
    )
}
