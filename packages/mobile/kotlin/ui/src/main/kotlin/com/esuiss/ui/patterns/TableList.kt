package com.esuiss.ui.patterns

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyListScope
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.text.BasicText
import androidx.compose.runtime.Composable
import androidx.compose.runtime.CompositionLocalProvider
import androidx.compose.runtime.key
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.draw.drawWithContent
import androidx.compose.ui.geometry.Offset
import androidx.compose.ui.geometry.Size
import androidx.compose.ui.graphics.RectangleShape
import androidx.compose.ui.semantics.Role
import androidx.compose.ui.semantics.heading
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.LayoutDirection
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemFrame
import com.esuiss.ui.components.ItemSize
import com.esuiss.ui.components.ItemVariant
import com.esuiss.ui.components.LocalContentColor
import com.esuiss.ui.components.LocalContentStyle
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

enum class TableListSlot { Title, Description, Trailing, Hidden }

enum class TableListAlign { Start, End }

class TableListColumn<T>(
    val key: String,
    val header: String,
    val slot: TableListSlot? = null,
    val align: TableListAlign = TableListAlign.Start,
    val mobileCell: (@Composable (T) -> Unit)? = null,
    val cell: @Composable (T) -> Unit,
)

@Composable
fun <T> TableList(
    rows: List<T>,
    columns: List<TableListColumn<T>>,
    modifier: Modifier = Modifier,
    getKey: (T, Int) -> Any = { _, index -> index },
    title: String? = null,
    emptyText: String = "No results.",
    onRowClick: ((T) -> Unit)? = null,
) {
    val colors = EsuissTheme.colors
    val titleColumn = columns.firstOrNull { it.slot == TableListSlot.Title }
    val description = columns.filter { it.slot == TableListSlot.Description }
    val trailing = columns.filter { it.slot == TableListSlot.Trailing }
    Column(modifier = modifier.fillMaxWidth(), verticalArrangement = Arrangement.spacedBy(12.dp)) {
        if (title != null) TableListTitle(title)
        if (rows.isEmpty()) {
            val shape = RoundedCornerShape(Radius.xl2)
            BasicText(
                emptyText,
                modifier = Modifier
                    .fillMaxWidth()
                    .clip(shape)
                    .background(colors.muted, shape)
                    .padding(horizontal = 16.dp, vertical = 12.dp),
                style = Typography.base.copy(color = colors.mutedForeground),
            )
        } else {
            Column(modifier = Modifier.fillMaxWidth()) {
                rows.forEachIndexed { index, row ->
                    key(getKey(row, index)) {
                        TableListRow(
                            first = index == 0,
                            last = index == rows.lastIndex,
                            onClick = onRowClick?.let { { it(row) } },
                        ) {
                            TableListCells(row, titleColumn, description, trailing)
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun <T> TableListCells(
    row: T,
    titleColumn: TableListColumn<T>?,
    description: List<TableListColumn<T>>,
    trailing: List<TableListColumn<T>>,
) {
    val colors = EsuissTheme.colors
    val cell: (TableListColumn<T>) -> @Composable (T) -> Unit = { it.mobileCell ?: it.cell }
    ItemContent {
        if (titleColumn != null) {
            CompositionLocalProvider(LocalContentStyle provides Typography.base.copy(color = colors.foreground)) {
                cell(titleColumn)(row)
            }
        }
        if (description.isNotEmpty()) {
            CompositionLocalProvider(
                LocalContentStyle provides Typography.sm.copy(color = colors.mutedForeground),
                LocalContentColor provides colors.mutedForeground,
            ) {
                Row(verticalAlignment = Alignment.CenterVertically) {
                    description.forEachIndexed { position, column ->
                        if (position > 0) BasicText(" · ", style = LocalContentStyle.current, maxLines = 1)
                        cell(column)(row)
                    }
                }
            }
        }
    }
    trailing.forEach { column ->
        CompositionLocalProvider(
            LocalContentStyle provides Typography.base.copy(color = colors.mutedForeground, fontFeatureSettings = "tnum"),
            LocalContentColor provides colors.mutedForeground,
        ) {
            cell(column)(row)
        }
    }
}

@Composable
fun TableListTitle(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier.semantics { heading() },
        style = Typography.xl3.copy(color = EsuissTheme.colors.foreground, fontWeight = FontWeight.Bold),
    )
}

@Composable
fun TableListHeader(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier
            .fillMaxWidth()
            .semantics { heading() }
            .padding(start = 16.dp, end = 16.dp, bottom = 8.dp),
        style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground),
    )
}

@Composable
fun TableListFooter(text: String, modifier: Modifier = Modifier) {
    BasicText(
        text,
        modifier = modifier
            .fillMaxWidth()
            .padding(start = 16.dp, end = 16.dp, top = 8.dp),
        style = Typography.xs.copy(color = EsuissTheme.colors.mutedForeground),
    )
}

@Composable
fun TableListRow(
    first: Boolean,
    last: Boolean,
    modifier: Modifier = Modifier,
    onClick: (() -> Unit)? = null,
    onLongClick: (() -> Unit)? = null,
    enabled: Boolean = true,
    selected: Boolean? = null,
    content: @Composable () -> Unit,
) {
    val colors = EsuissTheme.colors
    val radius = Radius.xl2
    val shape = when {
        first && last -> RoundedCornerShape(radius)
        first -> RoundedCornerShape(topStart = radius, topEnd = radius)
        last -> RoundedCornerShape(bottomStart = radius, bottomEnd = radius)
        else -> RectangleShape
    }
    val separator = colors.border
    ItemFrame(
        modifier = modifier
            .clip(shape)
            .background(colors.muted, shape)
            .drawWithContent {
                drawContent()
                if (!first) {
                    val inset = 16.dp.toPx()
                    val start = if (layoutDirection == LayoutDirection.Rtl) 0f else inset
                    drawRect(separator, Offset(start, 0f), Size(size.width - inset, 1.dp.toPx()))
                }
            },
        variant = ItemVariant.Default,
        size = ItemSize.Default,
        shape = shape,
        padding = PaddingValues(horizontal = 16.dp, vertical = 11.dp),
        onClick = onClick,
        onLongClick = onLongClick,
        enabled = enabled,
        selected = selected,
        role = Role.Button,
        onClickLabel = null,
        minHeight = 44.dp,
        gap = 16.dp,
        content = content,
    )
}

@Composable
fun TableListRowText(
    title: String,
    description: String? = null,
    trailing: String? = null,
) {
    val colors = EsuissTheme.colors
    ItemContent {
        BasicText(
            title,
            style = Typography.base.copy(color = LocalContentColor.current),
            maxLines = 1,
            overflow = TextOverflow.Ellipsis,
        )
        if (description != null) {
            BasicText(
                description,
                style = Typography.sm.copy(color = colors.mutedForeground),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
    if (trailing != null) {
        BasicText(
            trailing,
            style = Typography.base.copy(color = colors.mutedForeground, fontFeatureSettings = "tnum"),
            maxLines = 1,
        )
    }
}

class TableListSectionScope internal constructor() {
    internal val rows = mutableListOf<TableListEntry>()

    fun item(
        key: Any? = null,
        onClick: (() -> Unit)? = null,
        content: @Composable () -> Unit,
    ) {
        rows += TableListEntry(key, onClick, content)
    }

    fun row(
        title: String,
        description: String? = null,
        trailing: String? = null,
        key: Any? = null,
        onClick: (() -> Unit)? = null,
    ) {
        item(key, onClick) { TableListRowText(title, description, trailing) }
    }

    fun <T> items(
        items: List<T>,
        key: ((T) -> Any)? = null,
        onClick: ((T) -> Unit)? = null,
        content: @Composable (T) -> Unit,
    ) {
        items.forEach { value ->
            item(key?.invoke(value), onClick?.let { { it(value) } }) { content(value) }
        }
    }
}

internal class TableListEntry(
    val key: Any?,
    val onClick: (() -> Unit)?,
    val content: @Composable () -> Unit,
)

private sealed interface TableListBlock {
    class Title(val text: String) : TableListBlock
    class Section(
        val header: String?,
        val footer: String?,
        val emptyText: String?,
        val rows: List<TableListEntry>,
    ) : TableListBlock
}

class TableListScope internal constructor() {
    private val blocks = mutableListOf<TableListBlock>()

    fun title(text: String) {
        blocks += TableListBlock.Title(text)
    }

    fun section(
        header: String? = null,
        footer: String? = null,
        emptyText: String? = null,
        content: TableListSectionScope.() -> Unit,
    ) {
        val scope = TableListSectionScope().apply(content)
        blocks += TableListBlock.Section(header, footer, emptyText, scope.rows.toList())
    }

    internal fun emit(lazy: LazyListScope, prefix: String) {
        var sectionIndex = 0
        blocks.forEachIndexed { blockIndex, block ->
            when (block) {
                is TableListBlock.Title -> lazy.item(key = "$prefix:title:$blockIndex", contentType = "table-list-title") {
                    TableListTitle(block.text, Modifier.padding(bottom = 12.dp))
                }
                is TableListBlock.Section -> {
                    val section = sectionIndex++
                    if (section > 0) {
                        lazy.item(key = "$prefix:gap:$section", contentType = "table-list-gap") {
                            Spacer(Modifier.height(24.dp))
                        }
                    }
                    if (block.header != null) {
                        lazy.item(key = "$prefix:header:$section", contentType = "table-list-header") {
                            TableListHeader(block.header)
                        }
                    }
                    if (block.rows.isEmpty() && block.emptyText != null) {
                        lazy.item(key = "$prefix:empty:$section", contentType = "table-list-row") {
                            TableListRow(first = true, last = true) {
                                ItemContent {
                                    BasicText(block.emptyText, style = Typography.base.copy(color = EsuissTheme.colors.mutedForeground))
                                }
                            }
                        }
                    }
                    block.rows.forEachIndexed { index, entry ->
                        lazy.item(
                            key = entry.key?.let { "$prefix:row:$section:$it" },
                            contentType = "table-list-row",
                        ) {
                            TableListRow(
                                first = index == 0,
                                last = index == block.rows.lastIndex,
                                onClick = entry.onClick,
                                content = entry.content,
                            )
                        }
                    }
                    if (block.footer != null) {
                        lazy.item(key = "$prefix:footer:$section", contentType = "table-list-footer") {
                            TableListFooter(block.footer)
                        }
                    }
                }
            }
        }
    }
}

fun LazyListScope.tableList(
    key: String = "table-list",
    content: TableListScope.() -> Unit,
) {
    TableListScope().apply(content).emit(this, key)
}
