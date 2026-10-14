package com.esuiss.ui.interactions

import androidx.compose.animation.animateColorAsState
import androidx.compose.animation.core.animateDpAsState
import androidx.compose.animation.core.animateFloatAsState
import androidx.compose.animation.core.tween
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.RowScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.selection.toggleable
import androidx.compose.foundation.shape.CircleShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.Stable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateListOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clipToBounds
import androidx.compose.ui.draw.scale
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.graphicsLayer
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.clearAndSetSemantics
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.bold.Check
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.FormEasing
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.components.formReducedMotion
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

@Stable
interface SelectionListScope {
    val editing: Boolean
    val selected: List<String>
    fun setEditing(editing: Boolean)
    fun setSelected(selected: List<String>)
    fun toggle(value: String)
    fun selectAll()
    fun clear()
}

private class SelectionListContext(
    editing: () -> Boolean,
    selected: () -> List<String>,
    private val onEditingChange: () -> (Boolean) -> Unit,
    private val onValueChange: () -> (List<String>) -> Unit,
) : SelectionListScope {
    private val editingState = editing
    private val selectedState = selected
    val values = mutableStateListOf<String>()

    override val editing: Boolean
        get() = editingState()

    override val selected: List<String>
        get() = selectedState()

    override fun setEditing(editing: Boolean) {
        onEditingChange()(editing)
        if (!editing) onValueChange()(emptyList())
    }

    override fun setSelected(selected: List<String>) {
        onValueChange()(selected)
    }

    override fun toggle(value: String) {
        val current = selected
        setSelected(if (value in current) current - value else current + value)
    }

    override fun selectAll() {
        setSelected(values.toList())
    }

    override fun clear() {
        setSelected(emptyList())
    }
}

private val LocalSelectionList = staticCompositionLocalOf<SelectionListContext?> { null }

@Composable
private fun selectionList(): SelectionListContext =
    LocalSelectionList.current ?: error("SelectionList parts must be used within a SelectionList")

@Composable
fun SelectionList(
    editing: Boolean,
    onEditingChange: (Boolean) -> Unit,
    value: List<String>,
    onValueChange: (List<String>) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable SelectionListScope.() -> Unit,
) {
    val currentEditing by rememberUpdatedState(editing)
    val currentValue by rememberUpdatedState(value)
    val currentOnEditingChange by rememberUpdatedState(onEditingChange)
    val currentOnValueChange by rememberUpdatedState(onValueChange)
    val context = remember {
        SelectionListContext(
            editing = { currentEditing },
            selected = { currentValue },
            onEditingChange = { currentOnEditingChange },
            onValueChange = { currentOnValueChange },
        )
    }
    CompositionLocalProvider(LocalSelectionList provides context) {
        Box(modifier = modifier) {
            context.content()
        }
    }
}

@Composable
fun SelectionListTrigger(
    modifier: Modifier = Modifier,
    text: String? = null,
) {
    val context = selectionList()
    val editing = context.editing
    Button(
        onClick = { context.setEditing(!editing) },
        modifier = modifier,
        variant = ButtonVariant.Plain,
    ) {
        BasicText(
            text ?: if (editing) "Done" else "Select",
            style = LocalContentStyle.current.copy(fontWeight = FontWeight.SemiBold),
            maxLines = 1,
        )
    }
}

@Composable
fun SelectionListItem(
    value: String,
    modifier: Modifier = Modifier,
    contentDescription: String? = null,
    content: @Composable RowScope.() -> Unit,
) {
    val context = selectionList()
    DisposableEffect(context, value) {
        context.values.add(value)
        onDispose { context.values.remove(value) }
    }
    val colors = EsuissTheme.colors
    val editing = context.editing
    val checked = value in context.selected
    val reduced = formReducedMotion()
    val slow = if (reduced) 0 else 400
    val medium = if (reduced) 0 else 300
    val fast = if (reduced) 0 else 200
    val indicatorWidth by animateDpAsState(if (editing) 40.dp else 0.dp, tween(slow, easing = FormEasing), label = "width")
    val indicatorAlpha by animateFloatAsState(if (editing) 1f else 0f, tween(slow, easing = FormEasing), label = "alpha")
    val indicatorScale by animateFloatAsState(if (editing) 1f else 0.5f, tween(medium, easing = FormEasing), label = "scale")
    val checkScale by animateFloatAsState(if (checked) 1f else 0f, tween(fast), label = "check")
    val background by animateColorAsState(if (checked) colors.itemSelected else Color.Transparent, tween(fast), label = "background")
    val fill by animateColorAsState(if (checked) colors.accent else Color.Transparent, tween(medium, easing = FormEasing), label = "fill")
    val stroke by animateColorAsState(if (checked) colors.accent else colors.labelTertiary, tween(medium, easing = FormEasing), label = "stroke")
    Box(modifier = modifier.fillMaxWidth().background(background)) {
        Row(
            modifier = Modifier.fillMaxWidth().then(if (editing) Modifier.clearAndSetSemantics {} else Modifier),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Box(
                modifier = Modifier
                    .width(indicatorWidth)
                    .clipToBounds()
                    .graphicsLayer { alpha = indicatorAlpha },
                contentAlignment = Alignment.CenterStart,
            ) {
                Box(
                    modifier = Modifier
                        .padding(start = 16.dp)
                        .size(22.dp)
                        .scale(indicatorScale)
                        .background(fill, CircleShape)
                        .border(1.5.dp, stroke, CircleShape),
                    contentAlignment = Alignment.Center,
                ) {
                    Icon(
                        PhosphorIcons.Bold.Check,
                        contentDescription = null,
                        modifier = Modifier.scale(checkScale),
                        size = 14.dp,
                        tint = colors.onAccent,
                    )
                }
            }
            Row(
                modifier = Modifier.weight(1f),
                verticalAlignment = Alignment.CenterVertically,
                content = content,
            )
        }
        if (editing) {
            Spacer(
                modifier = Modifier
                    .matchParentSize()
                    .toggleable(
                        value = checked,
                        interactionSource = remember { MutableInteractionSource() },
                        indication = null,
                        role = Role.Checkbox,
                        onValueChange = { context.toggle(value) },
                    )
                    .semantics { if (contentDescription != null) this.contentDescription = contentDescription },
            )
        }
    }
}

@Composable
fun SelectionListBar(
    modifier: Modifier = Modifier,
    content: @Composable RowScope.() -> Unit,
) {
    val context = selectionList()
    FloatingBar(
        visible = context.editing,
        maxWidth = 448.dp,
        contentPadding = PaddingValues(horizontal = 6.dp),
        horizontalArrangement = Arrangement.spacedBy(8.dp),
        modifier = modifier,
    ) {
        CompositionLocalProvider(LocalSelectionList provides context) {
            content()
        }
    }
}

@Composable
fun RowScope.SelectionListCount(
    modifier: Modifier = Modifier,
    text: String? = null,
) {
    val count = selectionList().selected.size
    BasicText(
        text ?: if (count == 0) "Select items" else "$count selected",
        modifier = modifier.weight(1f),
        style = Typography.sm.copy(
            color = EsuissTheme.colors.label,
            fontWeight = FontWeight.Medium,
            textAlign = TextAlign.Center,
            fontFeatureSettings = "tnum",
        ),
        maxLines = 1,
        overflow = TextOverflow.Ellipsis,
    )
}
