package com.esuiss.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

enum class MarkerVariant { Default, Separator, Border }

private val LocalMarkerVariant = staticCompositionLocalOf { MarkerVariant.Default }

@Composable
fun Marker(
    modifier: Modifier = Modifier,
    variant: MarkerVariant = MarkerVariant.Default,
    content: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val border = if (variant == MarkerVariant.Border) {
        Modifier
            .drawBehind {
                val stroke = 1.dp.toPx()
                drawRect(colors.separator, Offset(0f, size.height - stroke), Size(size.width, stroke))
            }
            .padding(bottom = 8.dp)
    } else {
        Modifier
    }
    Row(
        modifier = modifier
            .fillMaxWidth()
            .heightIn(min = 16.dp)
            .then(border)
            .semantics(mergeDescendants = true) {},
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalMarkerVariant provides variant,
            LocalContentStyle provides Typography.sm.copy(color = colors.labelSecondary),
            LocalContentColor provides colors.labelSecondary,
            LocalIconSize provides 16.dp,
        ) {
            if (variant == MarkerVariant.Separator) {
                MarkerLine(Modifier.padding(end = 4.dp))
            }
            content()
            if (variant == MarkerVariant.Separator) {
                MarkerLine(Modifier.padding(start = 4.dp))
            }
        }
    }
}

@Composable
fun Marker(
    text: String,
    modifier: Modifier = Modifier,
    variant: MarkerVariant = MarkerVariant.Default,
    icon: ImageVector? = null,
) {
    Marker(modifier, variant) {
        if (icon != null) MarkerIcon { Icon(icon, contentDescription = null) }
        MarkerContent(text)
    }
}

@Composable
private fun RowScope.MarkerLine(modifier: Modifier) {
    Box(
        modifier = Modifier
            .weight(1f)
            .then(modifier)
            .height(1.dp)
            .background(EsuissTheme.colors.separator),
    )
}

@Composable
fun MarkerIcon(
    modifier: Modifier = Modifier,
    content: @Composable BoxScope.() -> Unit,
) {
    Box(
        modifier = modifier.size(16.dp).clearAndSetSemantics {},
        contentAlignment = Alignment.Center,
    ) {
        CompositionLocalProvider(LocalIconSize provides 16.dp) {
            content()
        }
    }
}

@Composable
fun RowScope.MarkerContent(
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    val separator = LocalMarkerVariant.current == MarkerVariant.Separator
    Box(
        modifier = if (separator) modifier else modifier.weight(1f, fill = false),
        contentAlignment = if (separator) Alignment.Center else Alignment.CenterStart,
    ) {
        content()
    }
}

@Composable
fun RowScope.MarkerContent(text: String, modifier: Modifier = Modifier) {
    val separator = LocalMarkerVariant.current == MarkerVariant.Separator
    MarkerContent(modifier) {
        BasicText(
            text,
            style = LocalContentStyle.current.copy(textAlign = if (separator) TextAlign.Center else TextAlign.Start),
        )
    }
}
