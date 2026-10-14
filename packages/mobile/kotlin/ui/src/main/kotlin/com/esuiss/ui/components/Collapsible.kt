package com.esuiss.ui.components

import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.core.tween
import androidx.compose.animation.expandVertically
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.shrinkVertically
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.remember
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.collapse
import androidx.compose.ui.semantics.expand
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.stateDescription

@Immutable
private data class CollapsibleState(
    val expanded: Boolean,
    val enabled: Boolean,
    val onExpandedChange: (Boolean) -> Unit,
)

private val LocalCollapsible = staticCompositionLocalOf<CollapsibleState?> { null }

@Composable
fun Collapsible(
    expanded: Boolean,
    onExpandedChange: (Boolean) -> Unit,
    modifier: Modifier = Modifier,
    enabled: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    CompositionLocalProvider(LocalCollapsible provides CollapsibleState(expanded, enabled, onExpandedChange)) {
        Column(modifier = modifier, content = content)
    }
}

@Composable
fun CollapsibleTrigger(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val state = LocalCollapsible.current ?: error("CollapsibleTrigger must be used within a Collapsible.")
    Row(
        modifier = modifier
            .semantics {
                stateDescription = if (state.expanded) "Expanded" else "Collapsed"
                if (state.enabled) {
                    if (state.expanded) {
                        collapse { state.onExpandedChange(false); true }
                    } else {
                        expand { state.onExpandedChange(true); true }
                    }
                }
            }
            .clickable(
                interactionSource = remember { MutableInteractionSource() },
                indication = null,
                enabled = state.enabled,
                role = Role.Button,
                onClick = { state.onExpandedChange(!state.expanded) },
            ),
        verticalAlignment = Alignment.CenterVertically,
        content = content,
    )
}

@Composable
fun CollapsibleContent(
    modifier: Modifier = Modifier,
    content: @Composable ColumnScope.() -> Unit,
) {
    val state = LocalCollapsible.current ?: error("CollapsibleContent must be used within a Collapsible.")
    AnimatedVisibility(
        visible = state.expanded,
        modifier = modifier,
        enter = expandVertically(tween(250), expandFrom = Alignment.Top) + fadeIn(tween(250)),
        exit = shrinkVertically(tween(200), shrinkTowards = Alignment.Top) + fadeOut(tween(200)),
    ) {
        Column(content = content)
    }
}
