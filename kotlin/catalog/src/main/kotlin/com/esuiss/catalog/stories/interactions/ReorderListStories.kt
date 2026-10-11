package com.esuiss.catalog.stories.interactions

import androidx.compose.foundation.border
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.semantics.LiveRegionMode
import androidx.compose.ui.semantics.liveRegion
import androidx.compose.ui.semantics.semantics
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.interactions.ReorderList
import com.esuiss.ui.interactions.ReorderListHandle
import com.esuiss.ui.interactions.ReorderListItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val reorderListStories = StoryGroup(
    section = Section.Interactions,
    title = "Reorder List",
    stories = listOf(
        Story("Default") { ReorderListDemo(inset = false) },
        Story("Inset") { ReorderListDemo(inset = true) },
        Story("LeadingHandle") { ReorderListLeadingHandle() },
    ),
)

private class ReorderListTask(val title: String, val detail: String? = null)

private val reorderListTasks = linkedMapOf(
    "inbox" to ReorderListTask("Inbox", "12 messages"),
    "today" to ReorderListTask("Today"),
    "upcoming" to ReorderListTask("Upcoming", "Next 7 days"),
    "someday" to ReorderListTask("Someday"),
    "archive" to ReorderListTask("Archive", "Everything you finished, kept for later reference"),
)

private val reorderListInitial = reorderListTasks.keys.toList()

@Composable
private fun ReorderListDemo(inset: Boolean) {
    val colors = EsuissTheme.colors
    var value by rememberSaveable { mutableStateOf(reorderListInitial) }
    val shape = RoundedCornerShape(Radius.xl2)
    Column(verticalArrangement = Arrangement.spacedBy(12.dp)) {
        ReorderList(
            value = value,
            onValueChange = { value = it },
            modifier = if (inset) Modifier.clip(shape).border(1.dp, colors.separator, shape) else Modifier,
        ) { key ->
            val task = reorderListTasks.getValue(key)
            ReorderListItem {
                Column(Modifier.weight(1f).padding(vertical = 12.dp)) {
                    Text(task.title, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    if (task.detail != null) {
                        Text(task.detail, style = Typography.sm.copy(color = colors.labelSecondary))
                    }
                }
                ReorderListHandle(contentDescription = "Reorder ${task.title}")
            }
        }
        Text(
            value.joinToString(", ") { reorderListTasks.getValue(it).title },
            modifier = Modifier.semantics { liveRegion = LiveRegionMode.Polite },
            style = Typography.sm.copy(color = colors.labelSecondary),
        )
    }
}

@Composable
private fun ReorderListLeadingHandle() {
    var value by rememberSaveable { mutableStateOf(reorderListInitial) }
    ReorderList(
        value = value,
        onValueChange = { value = it },
        moveUpLabel = "Move earlier",
        moveDownLabel = "Move later",
    ) { key ->
        val task = reorderListTasks.getValue(key)
        ReorderListItem(Modifier.padding(end = 12.dp)) {
            ReorderListHandle(contentDescription = "Reorder ${task.title}")
            Text(
                task.title,
                modifier = Modifier.weight(1f).padding(vertical = 12.dp),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}
