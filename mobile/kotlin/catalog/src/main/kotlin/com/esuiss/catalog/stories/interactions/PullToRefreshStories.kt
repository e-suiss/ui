package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.key
import androidx.compose.runtime.mutableIntStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.PullToRefresh
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography
import kotlinx.coroutines.delay

val pullToRefreshStories = StoryGroup(
    section = Section.Interactions,
    title = "Pull To Refresh",
    stories = listOf(
        Story("Default") { PullToRefreshFeed() },
        Story("WithFlatList") { PullToRefreshFlatList() },
    ),
)

private val pullToRefreshViewport = Modifier.fillMaxWidth().height(600.dp)

@Composable
private fun PullToRefreshFeed() {
    var count by rememberSaveable { mutableIntStateOf(3) }
    PullToRefresh(
        onRefresh = {
            delay(1200)
            count += 1
        },
        modifier = pullToRefreshViewport,
    ) {
        Column(
            modifier = Modifier.fillMaxSize().verticalScroll(rememberScrollState()),
            verticalArrangement = Arrangement.spacedBy(12.dp),
        ) {
            Text("Pull down to refresh", style = Typography.sm.copy(color = EsuissTheme.colors.labelSecondary))
            ItemGroup(variant = ItemGroupVariant.Inset) {
                (count downTo 1).forEachIndexed { index, update ->
                    key(update) {
                        if (index > 0) ItemSeparator()
                        Item {
                            ItemContent {
                                ItemTitle("Update $update")
                                ItemDescription("Fetched from the server")
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
private fun PullToRefreshFlatList() {
    PullToRefresh(onRefresh = { delay(1000) }, modifier = pullToRefreshViewport) {
        LazyColumn(Modifier.fillMaxSize()) {
            items(listOf("Inbox", "Drafts", "Sent", "Archive"), key = { it }) { item ->
                Text(item, modifier = Modifier.padding(vertical = 12.dp), style = Typography.base)
            }
        }
    }
}
