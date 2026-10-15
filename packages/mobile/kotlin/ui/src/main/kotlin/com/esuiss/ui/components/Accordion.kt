package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.draw.rotate
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.layout.Layout
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.collapse
import androidx.compose.ui.semantics.expand
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription
import androidx.compose.ui.text.style.TextDecoration
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretDown
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class AccordionVariant { Default, Filled }

private class AccordionDividers {
    var positions by mutableStateOf(emptyList<Int>())
}

@Composable
fun Accordion(
    modifier: Modifier = Modifier,
    variant: AccordionVariant = AccordionVariant.Default,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val dividers = remember { AccordionDividers() }
    val shape = RoundedCornerShape(Radius.xl2)
    Layout(
        content = content,
        modifier = modifier
            .fillMaxWidth()
            .then(
                if (variant == AccordionVariant.Filled) {
                    Modifier.clip(shape).background(colors.muted, shape)
                } else {
                    Modifier
                },
            )
            .drawWithContent {
                drawContent()
                val inset = 16.dp.toPx()
                val stroke = 1.dp.toPx()
                val rtl = layoutDirection == LayoutDirection.Rtl
                dividers.positions.forEach { y ->
                    val top = y + stroke / 2
                    drawLine(
                        color = colors.border,
                        start = Offset(if (rtl) 0f else inset, top),
                        end = Offset(if (rtl) size.width - inset else size.width, top),
                        strokeWidth = stroke,
                    )
                }
            },
    ) { measurables, constraints ->
        val placeables = measurables.map { it.measure(constraints.copy(minHeight = 0)) }
        val width = constraints.maxWidth
        val height = placeables.sumOf { it.height }.coerceIn(constraints.minHeight, constraints.maxHeight)
        layout(width, height) {
            var y = 0
            val positions = ArrayList<Int>()
            placeables.forEachIndexed { index, placeable ->
                if (index > 0) positions.add(y)
                placeable.placeRelative(0, y)
                y += placeable.height
            }
            if (dividers.positions != positions) dividers.positions = positions
        }
    }
}

@Composable
fun AccordionItem(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    title: String,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    AccordionItem(
        expanded = expanded,
        onExpandedChange = onExpandedChange,
        modifier = modifier,
        enabled = enabled,
        trigger = { BasicText(title, style = LocalContentStyle.current) },
        content = content,
    )
}

@Composable
fun AccordionItem(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    trigger: @Composable RowScope.() -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    Column(modifier = modifier.fillMaxWidth().padding(start = 16.dp)) {
        AccordionTrigger(expanded, onExpandedChange, enabled, trigger)
        AnimatedVisibility(
            visible = expanded,
            enter = expandVertically(tween(250), expandFrom = Alignment.Top) + fadeIn(tween(250)),
            exit = shrinkVertically(tween(200), shrinkTowards = Alignment.Top) + fadeOut(tween(200)),
        ) {
            AccordionContent(content)
        }
    }
}

@Composable
private fun AccordionTrigger(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    enabled: Boolean,
    trigger: @Composable RowScope.() -> Unit,
) {
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val rotation by animateFloatAsState(
        targetValue = if (expanded) 180f else 0f,
        animationSpec = tween(if (expanded) 250 else 200),
        label = "caret",
    )
    val foreground = colors.foreground
    Row(
        modifier = Modifier
            .fillMaxWidth()
            .heightIn(min = 44.dp)
            .alpha(if (enabled) 1f else 0.5f)
            .semantics {
                heading()
                stateDescription = if (expanded) "Expanded" else "Collapsed"
                if (enabled) {
                    if (expanded) {
                        collapse { onExpandedChange(false); true }
                    } else {
                        expand { onExpandedChange(true); true }
                    }
                }
            }
            .clickable(
                interactionSource = interaction,
                indication = null,
                enabled = enabled,
                role = Role.Button,
                onClick = { onExpandedChange(!expanded) },
            )
            .padding(top = 11.dp, bottom = 11.dp, end = 16.dp),
        horizontalArrangement = Arrangement.spacedBy(24.dp),
        verticalAlignment = Alignment.CenterVertically,
    ) {
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(
                color = foreground,
                textDecoration = if (pressed && enabled) TextDecoration.Underline else null,
            ),
            LocalContentColor provides foreground,
            LocalIconSize provides 16.dp,
        ) {
            Row(
                modifier = Modifier.weight(1f),
                horizontalArrangement = Arrangement.spacedBy(8.dp),
                verticalAlignment = Alignment.CenterVertically,
                content = trigger,
            )
        }
        Icon(
            PhosphorIcons.Regular.CaretDown,
            contentDescription = null,
            modifier = Modifier.rotate(rotation),
            size = 16.dp,
            tint = colors.mutedForeground,
        )
    }
}

@Composable
private fun AccordionContent(content: @Composable ColumnScope.() -> Unit) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalContentStyle provides Typography.sm.copy(color = colors.mutedForeground),
        LocalContentColor provides colors.mutedForeground,
    ) {
        Column(
            modifier = Modifier.fillMaxWidth().padding(end = 40.dp, bottom = 12.dp),
            verticalArrangement = Arrangement.spacedBy(16.dp),
            content = content,
        )
    }
}
