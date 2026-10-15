package com.esuiss.catalog

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.WindowInsets
import androidx.compose.foundation.layout.WindowInsetsSides
import androidx.compose.foundation.layout.consumeWindowInsets
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.only
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.safeDrawing
import androidx.compose.foundation.layout.windowInsetsPadding
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.CaretRight
import com.esuiss.ui.components.Header
import com.esuiss.ui.components.HeaderActions
import com.esuiss.ui.components.HeaderBack
import com.esuiss.ui.components.HeaderTitle
import com.esuiss.ui.components.Icon
import com.esuiss.ui.components.Input
import com.esuiss.ui.components.Item
import com.esuiss.ui.components.ItemActions
import com.esuiss.ui.components.ItemContent
import com.esuiss.ui.components.ItemDescription
import com.esuiss.ui.components.ItemGroup
import com.esuiss.ui.components.ItemGroupVariant
import com.esuiss.ui.components.ItemSeparator
import com.esuiss.ui.components.ItemTitle
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.Text
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Typography

private sealed interface Entry {
    data class GroupRow(val group: StoryGroup) : Entry
    data class StoryRow(val group: StoryGroup, val story: Story) : Entry
}

@Composable
internal fun HomeScreen(state: CatalogState) {
    val query = state.query.trim()
    Screen {
        Column(Modifier.fillMaxSize()) {
            Header {
                HeaderTitle("Catalog")
                HeaderActions { ThemeButton(state) }
            }
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
                verticalArrangement = Arrangement.spacedBy(24.dp),
            ) {
                item(key = "search") {
                    Input(
                        value = state.query,
                        onValueChange = { state.query = it },
                        placeholder = "Search",
                    )
                }
                Section.entries.forEach { section ->
                    val rows = sectionRows(section, query)
                    if (rows.isNotEmpty()) {
                        item(key = section.name) {
                            SectionList(section.title, rows) { row ->
                                when (row) {
                                    is Entry.GroupRow -> state.push(Route.Group(row.group.id))
                                    is Entry.StoryRow -> state.push(Route.StoryPage(row.group.storyId(row.story)))
                                }
                            }
                        }
                    }
                }
                if (query.isNotEmpty() && Section.entries.all { sectionRows(it, query).isEmpty() }) {
                    item(key = "empty") {
                        Text(
                            "No results",
                            modifier = Modifier.fillMaxWidth().padding(top = 24.dp),
                            style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground),
                        )
                    }
                }
            }
        }
    }
}

private fun sectionRows(section: Section, query: String): List<Entry> {
    val groups = Catalog.groups(section)
    if (query.isEmpty()) return groups.map { Entry.GroupRow(it) }
    val groupRows = groups.filter { matches(it.displayTitle, query) }.map { Entry.GroupRow(it) }
    val storyRows = groups.flatMap { group ->
        group.stories.filter { matches(it.name, query) }.map { Entry.StoryRow(group, it) }
    }
    return groupRows + storyRows
}

@Composable
private fun SectionList(title: String, rows: List<Entry>, onOpen: (Entry) -> Unit) {
    Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
        Text(
            title,
            modifier = Modifier.padding(horizontal = 16.dp),
            style = Typography.sm.copy(color = EsuissTheme.colors.mutedForeground, fontWeight = FontWeight.SemiBold),
        )
        ItemGroup(variant = ItemGroupVariant.Inset) {
            rows.forEachIndexed { index, row ->
                if (index > 0) ItemSeparator()
                when (row) {
                    is Entry.GroupRow -> NavigationItem(row.group.displayTitle, null, row.group.stories.size.toString()) { onOpen(row) }
                    is Entry.StoryRow -> NavigationItem(row.story.name, row.group.displayTitle, null) { onOpen(row) }
                }
            }
        }
    }
}

@Composable
private fun NavigationItem(title: String, description: String?, detail: String?, onClick: () -> Unit) {
    Item(onClick = onClick) {
        ItemContent {
            ItemTitle(title)
            if (description != null) ItemDescription(description)
        }
        ItemActions {
            if (detail != null) {
                Text(detail, style = Typography.base.copy(color = EsuissTheme.colors.mutedForeground))
            }
            Icon(PhosphorIcons.Regular.CaretRight, contentDescription = null, tint = EsuissTheme.colors.mutedForeground)
        }
    }
}

@Composable
internal fun GroupScreen(state: CatalogState, id: String, onBack: () -> Unit) {
    val group = Catalog.group(id) ?: return
    Screen {
        Column(Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = onBack, text = "Catalog")
                HeaderTitle(group.displayTitle, subtitle = group.section.title)
                HeaderActions { ThemeButton(state) }
            }
            LazyColumn(
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(16.dp),
            ) {
                item(key = "stories") {
                    ItemGroup(variant = ItemGroupVariant.Inset) {
                        group.stories.forEachIndexed { index, story ->
                            if (index > 0) ItemSeparator()
                            NavigationItem(story.name, null, null) {
                                state.push(Route.StoryPage(group.storyId(story)))
                            }
                        }
                    }
                }
            }
        }
    }
}

@Composable
internal fun StoryScreen(state: CatalogState, id: String, onBack: () -> Unit) {
    val (group, story) = Catalog.find(id) ?: return
    if (story.fullScreen) {
        Column(Modifier.fillMaxSize().background(EsuissTheme.colors.background)) {
            Row(
                modifier = Modifier
                    .fillMaxWidth()
                    .windowInsetsPadding(WindowInsets.safeDrawing.only(WindowInsetsSides.Top + WindowInsetsSides.Horizontal))
                    .height(44.dp)
                    .padding(horizontal = 8.dp),
                horizontalArrangement = Arrangement.SpaceBetween,
                verticalAlignment = Alignment.CenterVertically,
            ) {
                HeaderBack(onClick = onBack, text = group.displayTitle)
                ThemeButton(state)
            }
            Box(
                Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .consumeWindowInsets(WindowInsets.safeDrawing.only(WindowInsetsSides.Top)),
            ) {
                story.content()
            }
        }
        return
    }
    Screen {
        Column(Modifier.fillMaxSize()) {
            Header {
                HeaderBack(onClick = onBack, text = group.displayTitle)
                HeaderTitle(story.name)
                HeaderActions { ThemeButton(state) }
            }
            Column(
                modifier = Modifier
                    .weight(1f)
                    .fillMaxWidth()
                    .verticalScroll(rememberScrollState())
                    .padding(16.dp),
            ) {
                story.content()
            }
        }
    }
}
