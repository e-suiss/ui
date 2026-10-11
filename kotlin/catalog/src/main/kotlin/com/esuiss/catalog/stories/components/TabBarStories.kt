package com.esuiss.catalog.stories.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.saveable.rememberSaveable
import androidx.compose.runtime.setValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.unit.dp
import com.adamglin.PhosphorIcons
import com.adamglin.phosphoricons.Regular
import com.adamglin.phosphoricons.regular.ChatCircle
import com.adamglin.phosphoricons.regular.GearSix
import com.adamglin.phosphoricons.regular.House
import com.adamglin.phosphoricons.regular.MagnifyingGlass
import com.adamglin.phosphoricons.regular.User
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Screen
import com.esuiss.ui.components.ScreenEdge
import com.esuiss.ui.components.TabBar
import com.esuiss.ui.components.TabBarItem
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant

val tabBarStories = StoryGroup(
    section = Section.Components,
    title = "Tab Bar",
    stories = listOf(
        Story("Default", fullScreen = true) { TabBarExample() },
        Story("WithoutBadges", fullScreen = true) { TabBarExample(badges = false) },
        Story("LargeBadge", fullScreen = true) { TabBarLargeBadge() },
        Story("DisabledItem", fullScreen = true) { TabBarExample(disabled = "search") },
    ),
)

private class TabBarEntry(val value: String, val label: String, val icon: ImageVector, val badge: String? = null)

private val tabBarEntries = listOf(
    TabBarEntry("home", "Home", PhosphorIcons.Regular.House),
    TabBarEntry("search", "Search", PhosphorIcons.Regular.MagnifyingGlass),
    TabBarEntry("messages", "Messages", PhosphorIcons.Regular.ChatCircle, "3"),
    TabBarEntry("profile", "Profile", PhosphorIcons.Regular.User, ""),
)

@Composable
private fun TabBarPage(title: String, bar: @Composable () -> Unit) {
    Screen(edges = setOf(ScreenEdge.Top, ScreenEdge.Left, ScreenEdge.Right)) {
        Column(Modifier.fillMaxSize()) {
            Column(
                Modifier.weight(1f).fillMaxWidth().padding(16.dp),
                verticalArrangement = Arrangement.spacedBy(8.dp),
            ) {
                Text(title, variant = TextVariant.H3)
                Text("Tap a tab to switch screens.", variant = TextVariant.Muted)
            }
            bar()
        }
    }
}

@Composable
private fun TabBarExample(badges: Boolean = true, disabled: String? = null) {
    var value by rememberSaveable { mutableStateOf("home") }
    val current = tabBarEntries.firstOrNull { it.value == value }
    TabBarPage(current?.label ?: "") {
        TabBar(value = value, onValueChange = { value = it }) {
            tabBarEntries.forEach { entry ->
                TabBarItem(
                    value = entry.value,
                    label = entry.label,
                    icon = entry.icon,
                    badge = if (badges) entry.badge else null,
                    enabled = entry.value != disabled,
                )
            }
        }
    }
}

@Composable
private fun TabBarLargeBadge() {
    var value by rememberSaveable { mutableStateOf("home") }
    TabBarPage("Home") {
        TabBar(value = value, onValueChange = { value = it }) {
            TabBarItem(value = "home", label = "Home", icon = PhosphorIcons.Regular.House)
            TabBarItem(value = "messages", label = "Messages", icon = PhosphorIcons.Regular.ChatCircle, badge = "128")
            TabBarItem(value = "settings", label = "Settings", icon = PhosphorIcons.Regular.GearSix, badge = "New")
        }
    }
}
