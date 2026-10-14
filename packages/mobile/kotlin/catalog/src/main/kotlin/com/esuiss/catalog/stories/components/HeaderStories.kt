package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.nestedscroll.nestedScroll
import androidx.compose.ui.layout.layout
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextOverflow
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Bold
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.bold.DotsThree
import com.adamglin.phosphoricons.regular.List
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.Plus
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonSize
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderActionsSide
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderLargeTitle
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Separator
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.rememberHeaderState

val headerStories = StoryGroup(
    section = Section.Components,
    title = "Header",
    stories = listOf(
        Story("Default") { HeaderDefault() },
        Story("LargeTitle", fullScreen = true) { HeaderLargeTitleDemo(subtitle = null) },
        Story("LargeTitleWithSubtitle", fullScreen = true) { HeaderLargeTitleDemo(subtitle = "3 unread") },
        Story("CompactWithScroll", fullScreen = true) { HeaderCompactScroll() },
        Story("Subtitle") { HeaderSubtitle() },
        Story("LeadingActions") { HeaderLeadingActions() },
        Story("BackOnly") { HeaderBackOnly() },
    ),
)

private val HeaderMessages = listOf(
    "Lunch on Friday?",
    "The draft is ready for review",
    "Photos from the trip",
    "Invoice for September",
    "Your order has shipped",
    "Team sync moved to 3 PM",
    "Weekend plans",
    "Book club picks",
    "Flight confirmation",
    "New comment on your post",
    "Reminder: dentist at 10",
    "Quarterly report",
    "Welcome to the beta",
    "Parking update",
    "Recipe you asked for",
)

private fun Modifier.headerBleed(): Modifier = layout { measurable, constraints ->
    val inset = 16.dp.roundToPx()
    val width = constraints.maxWidth + inset * 2
    val placeable = measurable.measure(constraints.copy(minWidth = width, maxWidth = width))
    layout(constraints.maxWidth, (placeable.height - inset).coerceAtLeast(0)) {
        placeable.place(-inset, -inset)
    }
}

@Composable
private fun HeaderMessageRows() {
    Column(Modifier.fillMaxWidth().padding(horizontal = 16.dp)) {
        HeaderMessages.forEachIndexed { index, message ->
            if (index > 0) Separator()
            Text(
                message,
                modifier = Modifier.fillMaxWidth().padding(vertical = 12.dp),
                maxLines = 1,
                overflow = TextOverflow.Ellipsis,
            )
        }
    }
}

@Composable
private fun HeaderTrailingActions() {
    HeaderActions {
        Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
            Icon(PhosphorIcons.Regular.MagnifyingGlass, contentDescription = "Search")
        }
        Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
            Icon(PhosphorIcons.Regular.Plus, contentDescription = "New message")
        }
    }
}

@Composable
private fun HeaderPlainAction(text: String) {
    Button(onClick = {}, variant = ButtonVariant.Plain, size = ButtonSize.Sm) {
        Text(text, style = TextStyle(fontWeight = FontWeight.SemiBold))
    }
}

@Composable
private fun HeaderLargeTitleDemo(subtitle: String?) {
    val state = rememberHeaderState()
    Screen {
        Column(Modifier.fillMaxSize().nestedScroll(state.nestedScrollConnection)) {
            Header(state = state) {
                HeaderBack(onClick = {}, text = "Mailboxes")
                HeaderTitle("Inbox")
                HeaderLargeTitle("Inbox", subtitle = subtitle)
                HeaderTrailingActions()
            }
            Column(Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState())) {
                HeaderMessageRows()
            }
        }
    }
}

@Composable
private fun HeaderCompactScroll() {
    Screen {
        Column(Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = {}, text = null)
                HeaderTitle("Inbox", subtitle = "15 messages")
                HeaderActions {
                    Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                        Icon(PhosphorIcons.Bold.DotsThree, contentDescription = "More")
                    }
                }
            }
            Column(Modifier.weight(1f).fillMaxWidth().verticalScroll(rememberScrollState())) {
                HeaderMessageRows()
            }
        }
    }
}

@Composable
private fun HeaderDefault() {
    Column(Modifier.headerBleed()) {
        Header {
            HeaderBack(onClick = {}, text = "Settings")
            HeaderTitle("Profile")
            HeaderActions { HeaderPlainAction("Edit") }
        }
    }
}

@Composable
private fun HeaderSubtitle() {
    Column(Modifier.headerBleed()) {
        Header {
            HeaderBack(onClick = {}, text = null)
            HeaderTitle("Alex Morgan", subtitle = "Last seen today")
            HeaderTrailingActions()
        }
    }
}

@Composable
private fun HeaderLeadingActions() {
    Column(Modifier.headerBleed()) {
        Header {
            HeaderActions(side = HeaderActionsSide.Leading) {
                Button(onClick = {}, variant = ButtonVariant.Ghost, size = ButtonSize.Icon) {
                    Icon(PhosphorIcons.Regular.List, contentDescription = "Menu")
                }
            }
            HeaderTitle("Library")
            HeaderActions { HeaderPlainAction("Done") }
        }
    }
}

@Composable
private fun HeaderBackOnly() {
    Column(Modifier.headerBleed()) {
        Header {
            HeaderBack(onClick = {}, text = "A very long previous screen title")
            HeaderTitle("Details")
        }
    }
}
