package com.esuiss.ui.patterns

import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.LazyListState
import androidx.compose.foundation.lazy.itemsIndexed
import androidx.compose.foundation.lazy.rememberLazyListState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.rememberUpdatedState
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.runtime.snapshotFlow
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import kotlinx.coroutines.flow.distinctUntilChanged

@Composable
fun <T> PagedList(
    items: List<T>,
    modifier: Modifier = Modifier,
    pageSize: Int = 10,
    getKey: ((T, Int) -> Any)? = null,
    loadMoreLabel: String = "Load more",
    state: LazyListState = rememberLazyListState(),
    contentPadding: PaddingValues = PaddingValues(0.dp),
    renderItem: @Composable (T, Int) -> Unit,
) {
    val size = pageSize.coerceAtLeast(1)
    val pageCount = maxOf(1, (items.size + size - 1) / size)
    var loaded by rememberSaveable { mutableIntStateOf(1) }
    val end = minOf(loaded.coerceAtMost(pageCount) * size, items.size)
    val visible = items.subList(0, end)
    val hasMore = end < items.size
    val currentHasMore by rememberUpdatedState(hasMore)
    val currentEnd by rememberUpdatedState(end)
    val loadMore = { loaded = minOf(loaded + 1, pageCount) }
    LaunchedEffect(state) {
        snapshotFlow {
            val last = state.layoutInfo.visibleItemsInfo.lastOrNull()?.index ?: -1
            last >= currentEnd - 1 && currentEnd > 0
        }
            .distinctUntilChanged()
            .collect { reached -> if (reached && currentHasMore) loadMore() }
    }
    LazyColumn(
        modifier = modifier,
        state = state,
        contentPadding = contentPadding,
    ) {
        itemsIndexed(visible, key = getKey?.let { keyOf -> { index: Int, item: T -> keyOf(item, index) } }) { index, item ->
            renderItem(item, index)
        }
        if (hasMore) {
            item(key = "paged-list-load-more") {
                Button(
                    text = loadMoreLabel,
                    onClick = loadMore,
                    modifier = Modifier.padding(top = 16.dp),
                    variant = ButtonVariant.Secondary,
                    size = ButtonSize.Lg,
                    block = true,
                )
            }
        }
    }
}
