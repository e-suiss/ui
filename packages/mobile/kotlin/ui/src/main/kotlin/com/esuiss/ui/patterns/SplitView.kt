package com.esuiss.ui.patterns

import androidx.compose.animation.AnimatedContent
import androidx.compose.animation.core.tween
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.animation.slideInHorizontally
import androidx.compose.animation.slideOutHorizontally
import androidx.compose.animation.togetherWith
import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.interaction.MutableInteractionSource
import androidx.compose.foundation.interaction.collectIsPressedAsState
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.BoxWithConstraints
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.heightIn
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.Immutable
import androidx.compose.runtime.DisposableEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableFloatStateOf
import androidx.compose.runtime.mutableStateMapOf
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.staticCompositionLocalOf
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.alpha
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawBehind
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.onPlaced
import androidx.compose.ui.layout.positionInRoot
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.contentDescription
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.semantics.selected
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.CaretLeft
import com.adamglin.phosphoricons.regular.CaretRight
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography
import kotlin.math.abs

enum class SplitViewColumn { Sidebar, List, Detail }

private class SplitViewPane(
    val kind: SplitViewColumn,
    val title: String?,
    val modifier: Modifier,
    val content: @Composable ColumnScope.() -> Unit,
)

interface SplitViewScope {
    fun SplitViewSidebar(title: String? = null, modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit)

    fun SplitViewList(title: String? = null, modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit)

    fun SplitViewDetail(title: String? = null, modifier: Modifier = Modifier, content: @Composable ColumnScope.() -> Unit)
}

private class SplitViewScopeImpl : SplitViewScope {
    val panes = mutableListOf<SplitViewPane>()

    override fun SplitViewSidebar(title: String?, modifier: Modifier, content: @Composable ColumnScope.() -> Unit) {
        panes += SplitViewPane(SplitViewColumn.Sidebar, title, modifier, content)
    }

    override fun SplitViewList(title: String?, modifier: Modifier, content: @Composable ColumnScope.() -> Unit) {
        panes += SplitViewPane(SplitViewColumn.List, title, modifier, content)
    }

    override fun SplitViewDetail(title: String?, modifier: Modifier, content: @Composable ColumnScope.() -> Unit) {
        panes += SplitViewPane(SplitViewColumn.Detail, title, modifier, content)
    }
}

private class SplitViewItemEdges {
    val edges = mutableStateMapOf<Any, Pair<Float, Float>>()
}

@Immutable
private class SplitViewContext(
    val compact: Boolean,
    val kind: SplitViewColumn,
    val setColumn: (SplitViewColumn) -> Unit,
    val items: SplitViewItemEdges = SplitViewItemEdges(),
)

private val LocalSplitView = staticCompositionLocalOf<SplitViewContext?> { null }

private fun next(kind: SplitViewColumn): SplitViewColumn = when (kind) {
    SplitViewColumn.Sidebar -> SplitViewColumn.List
    SplitViewColumn.List, SplitViewColumn.Detail -> SplitViewColumn.Detail
}

private fun previous(kind: SplitViewColumn): SplitViewColumn? = when (kind) {
    SplitViewColumn.Sidebar -> null
    SplitViewColumn.List -> SplitViewColumn.Sidebar
    SplitViewColumn.Detail -> SplitViewColumn.List
}

private val WideBreakpoint = 768.dp

@Composable
fun SplitView(
    modifier: Modifier = Modifier,
    column: SplitViewColumn? = null,
    defaultColumn: SplitViewColumn = SplitViewColumn.List,
    onColumnChange: (SplitViewColumn) -> Unit = {},
    content: SplitViewScope.() -> Unit,
) {
    val panes = SplitViewScopeImpl().apply(content).panes.toList()
    var uncontrolled by rememberSaveable { mutableStateOf(defaultColumn) }
    val current = column ?: uncontrolled
    val setColumn: (SplitViewColumn) -> Unit = { nextColumn ->
        if (column == null) uncontrolled = nextColumn
        onColumnChange(nextColumn)
    }
    val titles = panes.associate { it.kind to it.title }
    BoxWithConstraints(modifier = modifier) {
        if (maxWidth >= WideBreakpoint) {
            WideSplitView(panes, setColumn)
        } else {
            AnimatedContent(
                targetState = current,
                transitionSpec = {
                    val forward = targetState.ordinal > initialState.ordinal
                    (slideInHorizontally(tween(300)) { if (forward) it / 3 else -it / 3 } + fadeIn(tween(300))) togetherWith
                        (slideOutHorizontally(tween(300)) { if (forward) -it / 3 else it / 3 } + fadeOut(tween(200)))
                },
                label = "splitView",
            ) { shown ->
                val pane = panes.firstOrNull { it.kind == shown }
                if (pane != null) {
                    val back = previous(pane.kind)?.takeIf { target ->
                        panes.any { it.kind == target } && !(target == SplitViewColumn.Sidebar && titles[target] == null)
                    }
                    CompactPane(pane, back, back?.let { titles[it] }, setColumn)
                }
            }
        }
    }
}

@Composable
private fun CompactPane(
    pane: SplitViewPane,
    back: SplitViewColumn?,
    backTitle: String?,
    setColumn: (SplitViewColumn) -> Unit,
) {
    val colors = EsuissTheme.colors
    CompositionLocalProvider(
        LocalSplitView provides SplitViewContext(compact = true, kind = pane.kind, setColumn = setColumn, items = remember { SplitViewItemEdges() }),
        LocalContentStyle provides Typography.base.copy(color = colors.foreground),
        LocalContentColor provides colors.foreground,
    ) {
        Column(
            modifier = pane.modifier
                .fillMaxSize()
                .verticalScroll(rememberScrollState())
                .padding(PaddingValues(horizontal = 16.dp, vertical = 8.dp)),
        ) {
            if (back != null) {
                val interaction = remember { MutableInteractionSource() }
                val pressed by interaction.collectIsPressedAsState()
                val tint = colors.primary
                Row(
                    modifier = Modifier
                        .heightIn(min = 44.dp)
                        .alpha(if (pressed) 0.8f else 1f)
                        .clickable(interactionSource = interaction, indication = null, role = Role.Button) { setColumn(back) },
                    verticalAlignment = Alignment.CenterVertically,
                    horizontalArrangement = Arrangement.spacedBy(2.dp),
                ) {
                    Icon(PhosphorIcons.Bold.CaretLeft, contentDescription = if (backTitle == null) "Back" else null, size = 18.dp, tint = tint)
                    if (backTitle != null) BasicText(backTitle, style = Typography.base.copy(color = tint))
                }
            }
            if (pane.title != null) {
                BasicText(
                    pane.title,
                    modifier = Modifier.padding(bottom = 8.dp).semantics { heading() },
                    style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.Bold),
                )
            }
            pane.content(this)
        }
    }
}

@Composable
private fun WideSplitView(panes: List<SplitViewPane>, setColumn: (SplitViewColumn) -> Unit) {
    val colors = EsuissTheme.colors
    val weights = panes.map {
        when (it.kind) {
            SplitViewColumn.Sidebar -> 0.20f
            SplitViewColumn.List -> 0.32f
            SplitViewColumn.Detail -> 0.48f
        }
    }
    Row(modifier = Modifier.fillMaxSize()) {
        panes.forEachIndexed { index, pane ->
            if (index > 0) Box(modifier = Modifier.width(1.dp).fillMaxHeight().background(colors.border))
            CompositionLocalProvider(
                LocalSplitView provides SplitViewContext(compact = false, kind = pane.kind, setColumn = setColumn),
                LocalContentStyle provides Typography.base.copy(color = colors.foreground),
                LocalContentColor provides colors.foreground,
            ) {
                Column(
                    modifier = Modifier
                        .weight(weights[index])
                        .fillMaxHeight()
                        .verticalScroll(rememberScrollState())
                        .then(pane.modifier)
                        .padding(
                            when (pane.kind) {
                                SplitViewColumn.Sidebar -> PaddingValues(start = 12.dp, end = 12.dp, top = 4.dp, bottom = 12.dp)
                                SplitViewColumn.List -> PaddingValues(12.dp)
                                SplitViewColumn.Detail -> PaddingValues(32.dp)
                            },
                        ),
                ) {
                    if (pane.title != null) {
                        when (pane.kind) {
                            SplitViewColumn.Sidebar -> BasicText(
                                pane.title,
                                modifier = Modifier.padding(start = 12.dp, end = 12.dp, top = 12.dp, bottom = 8.dp).semantics { heading() },
                                style = Typography.xs.copy(color = colors.mutedForeground, fontWeight = FontWeight.SemiBold),
                            )
                            SplitViewColumn.List -> Box(
                                modifier = Modifier.semantics {
                                    heading()
                                    contentDescription = pane.title
                                },
                            )
                            SplitViewColumn.Detail -> BasicText(
                                pane.title,
                                modifier = Modifier.padding(bottom = 4.dp).semantics { heading() },
                                style = Typography.xl2.copy(color = colors.foreground, fontWeight = FontWeight.SemiBold),
                            )
                        }
                    }
                    pane.content(this)
                }
            }
        }
    }
}

@Composable
fun SplitViewItem(
    modifier: Modifier = Modifier,
    isActive: Boolean = false,
    onClick: () -> Unit = {},
    content: @Composable ColumnScope.() -> Unit,
) {
    val context = LocalSplitView.current ?: SplitViewContext(compact = true, kind = SplitViewColumn.List, setColumn = {})
    val colors = EsuissTheme.colors
    val interaction = remember { MutableInteractionSource() }
    val pressed by interaction.collectIsPressedAsState()
    val id = remember { Any() }
    var top by remember { mutableFloatStateOf(Float.NaN) }
    val click = {
        onClick()
        context.setColumn(next(context.kind))
    }
    if (context.compact) {
        val separator = colors.border
        val edges = context.items.edges
        DisposableEffect(edges) { onDispose { edges.remove(id) } }
        val divided = edges.any { (key, edge) -> key !== id && abs(edge.second - top) < 1f }
        Row(
            modifier = modifier
                .fillMaxWidth()
                .heightIn(min = 44.dp)
                .onPlaced {
                    val y = it.positionInRoot().y
                    top = y
                    edges[id] = y to y + it.size.height
                }
                .alpha(if (pressed) 0.8f else 1f)
                .drawBehind { if (divided) drawRect(separator, Offset.Zero, Size(size.width, 1.dp.toPx())) }
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = click)
                .semantics { selected = isActive }
                .padding(vertical = 12.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp), content = content)
            if (context.kind != SplitViewColumn.Detail) {
                Icon(PhosphorIcons.Regular.CaretRight, contentDescription = null, size = 16.dp, tint = colors.mutedForeground)
            }
        }
    } else {
        val list = context.kind == SplitViewColumn.List
        val shape = RoundedCornerShape(if (list) Radius.xl else Radius.lg)
        Row(
            modifier = modifier
                .fillMaxWidth()
                .alpha(if (pressed) 0.8f else 1f)
                .clip(shape)
                .background(if (isActive) colors.muted else Color.Transparent, shape)
                .clickable(interactionSource = interaction, indication = null, role = Role.Button, onClick = click)
                .semantics { selected = isActive }
                .padding(horizontal = 12.dp, vertical = if (list) 12.dp else 8.dp),
            horizontalArrangement = Arrangement.spacedBy(12.dp),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Column(modifier = Modifier.weight(1f), verticalArrangement = Arrangement.spacedBy(2.dp), content = content)
        }
    }
}
