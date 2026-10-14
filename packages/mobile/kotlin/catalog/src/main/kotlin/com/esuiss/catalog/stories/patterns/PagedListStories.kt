package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ChatCircle
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemMedia
import com.esuiss.ui.components.ItemMediaVariant
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.patterns.PagedList

val pagedListStories = StoryGroup(
    section = Section.Patterns,
    title = "Paged List",
    stories = listOf(
        Story("Default") { PagedListDemo(pagedListTopics) },
        Story("SmallPages") { PagedListDemo(pagedListTopics, pageSize = 3) },
        Story("SinglePage") { PagedListDemo(pagedListTopics.take(6)) },
        Story("CustomLabels") { PagedListDemo(pagedListTopics, pageSize = 3, loadMoreLabel = "Show more topics") },
    ),
)

private class PagedListTopic(val id: Int, val title: String, val replies: Int)

private val pagedListSubjects = listOf(
    "Getting started",
    "Dark mode tokens",
    "Form validation",
    "Release notes",
    "Accessibility",
    "Theming",
    "Server components",
    "Animations",
)

private val pagedListTopics = List(57) { index ->
    PagedListTopic(
        id = index + 1,
        title = "${pagedListSubjects[index % pagedListSubjects.size]} · thread ${index + 1}",
        replies = (index * 7) % 23,
    )
}

@Composable
private fun PagedListDemo(items: List<PagedListTopic>, pageSize: Int = 10, loadMoreLabel: String = "Load more") {
    PagedList(
        items = items,
        modifier = Modifier.fillMaxWidth().height(560.dp),
        pageSize = pageSize,
        getKey = { topic, _ -> topic.id },
        loadMoreLabel = loadMoreLabel,
    ) { topic, _ ->
        PagedListRow(topic)
    }
}

@Composable
private fun PagedListRow(topic: PagedListTopic) {
    Item(onClick = {}) {
        ItemMedia(variant = ItemMediaVariant.Icon) {
            Icon(PhosphorIcons.Regular.ChatCircle, contentDescription = null)
        }
        ItemContent {
            ItemTitle(topic.title)
            ItemDescription("${topic.replies} replies")
        }
    }
}
