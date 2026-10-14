package com.esuiss.catalog.stories.patterns

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.patterns.SplitView
import com.esuiss.ui.patterns.SplitViewColumn
import com.esuiss.ui.patterns.SplitViewItem
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

val splitViewStories = StoryGroup(
    section = Section.Patterns,
    title = "Split View",
    stories = listOf(
        Story("Default") { SplitViewMail() },
        Story("DetailColumn") { SplitViewMail(defaultColumn = SplitViewColumn.Detail) },
        Story("StartOnSidebar") { SplitViewMail(defaultColumn = SplitViewColumn.Sidebar) },
        Story("TwoColumns") { SplitViewMail(withSidebar = false) },
    ),
)

private class SplitViewMessage(
    val id: String,
    val from: String,
    val time: String,
    val subject: String,
    val body: String,
)

private val splitViewMailboxes = listOf("Inbox", "Sent", "Drafts", "Archive")

private val splitViewMessages = listOf(
    SplitViewMessage(
        "order",
        "Acme Store",
        "09:12",
        "Your order has shipped",
        "Order #1042 will be delivered tomorrow. Tracking number: 4815 1623 42.",
    ),
    SplitViewMessage(
        "meeting",
        "Jordan Lee",
        "Yesterday",
        "Tomorrow's meeting",
        "Does 10:00 work for you? On the agenda: the Q4 budget and the campaign plan.",
    ),
    SplitViewMessage(
        "storage",
        "Cloud Drive",
        "Mon",
        "Your storage is almost full",
        "Your cloud storage is 90% full. Upgrade your plan to get more space.",
    ),
)

@Composable
private fun SplitViewMail(withSidebar: Boolean = true, defaultColumn: SplitViewColumn = SplitViewColumn.List) {
    var mailbox by rememberSaveable { mutableStateOf("Inbox") }
    var messageId by rememberSaveable { mutableStateOf("order") }
    val message = splitViewMessages.firstOrNull { it.id == messageId } ?: splitViewMessages.first()
    val colors = EsuissTheme.colors
    SplitView(modifier = Modifier.fillMaxWidth().height(640.dp), defaultColumn = defaultColumn) {
        if (withSidebar) {
            SplitViewSidebar(title = "Mailboxes") {
                splitViewMailboxes.forEach { name ->
                    SplitViewItem(isActive = mailbox == name, onClick = { mailbox = name }) {
                        Text(name)
                    }
                }
            }
        }
        SplitViewList(title = mailbox) {
            splitViewMessages.forEach { item ->
                SplitViewItem(isActive = item.id == messageId, onClick = { messageId = item.id }) {
                    Row(
                        modifier = Modifier.fillMaxWidth(),
                        horizontalArrangement = Arrangement.spacedBy(8.dp),
                        verticalAlignment = Alignment.CenterVertically,
                    ) {
                        Text(
                            item.from,
                            modifier = Modifier.weight(1f),
                            style = Typography.base.copy(fontWeight = FontWeight.SemiBold),
                            maxLines = 1,
                            overflow = TextOverflow.Ellipsis,
                        )
                        Text(item.time, style = Typography.sm.copy(color = colors.labelSecondary), maxLines = 1)
                    }
                    Text(item.subject, maxLines = 1, overflow = TextOverflow.Ellipsis)
                    Text(
                        item.body,
                        style = Typography.sm.copy(color = colors.labelSecondary),
                        maxLines = 1,
                        overflow = TextOverflow.Ellipsis,
                    )
                }
            }
        }
        SplitViewDetail(title = message.subject) {
            Text("${message.from} · ${message.time}", style = Typography.sm.copy(color = colors.labelSecondary))
            Text(message.body, modifier = Modifier.padding(top = 24.dp))
        }
    }
}
