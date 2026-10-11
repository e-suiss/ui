package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.remember
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.components.Theme
import com.esuiss.ui.components.ThemeProvider
import com.esuiss.ui.components.ThemeStorage
import com.esuiss.ui.components.ThemeToggle
import com.esuiss.ui.components.useTheme
import com.esuiss.ui.theme.EsuissTheme
import com.esuiss.ui.theme.Radius
import com.esuiss.ui.theme.Typography

val themeStories = StoryGroup(
    section = Section.Components,
    title = "Theme",
    stories = listOf(
        Story("System") { ThemeDemo(Theme.System) },
        Story("Light") { ThemeDemo(Theme.Light) },
        Story("Dark") { ThemeDemo(Theme.Dark) },
        Story("WithStorage") { ThemeWithStorage() },
    ),
)

private class ThemeSavedStorage(initial: Map<String, String>) : ThemeStorage {
    private val items = initial.toMutableMap()

    override suspend fun getItem(key: String): String? = items[key]

    override suspend fun setItem(key: String, value: String) {
        items[key] = value
    }
}

@Composable
private fun ThemePreview() {
    val state = useTheme()
    val colors = EsuissTheme.colors
    Column(
        modifier = Modifier.fillMaxWidth().background(colors.surface),
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Light and dark.", variant = TextVariant.H2)
            Text(
                "Every surface, label and accent follows the theme tokens, so the whole app changes at once.",
                color = colors.labelSecondary,
            )
        }
        ThemeToggle()
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.surfaceSecondary, RoundedCornerShape(Radius.xl2))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Text("Selected", style = Typography.sm, color = colors.labelSecondary)
            Text(state.theme.name.lowercase(), style = Typography.base.copy(fontWeight = FontWeight.SemiBold))
            Text("Showing", Modifier.padding(top = 8.dp), style = Typography.sm, color = colors.labelSecondary)
            Text(state.resolvedTheme.name.lowercase(), style = Typography.base.copy(fontWeight = FontWeight.SemiBold))
        }
    }
}

@Composable
private fun ThemeDemo(defaultTheme: Theme) {
    ThemeProvider(defaultTheme = defaultTheme, storageKey = "theme-story") {
        ThemePreview()
    }
}

@Composable
private fun ThemeWithStorage() {
    val storage = remember { ThemeSavedStorage(mapOf("theme-story" to "dark")) }
    ThemeProvider(defaultTheme = Theme.Light, storageKey = "theme-story", storage = storage) {
        ThemePreview()
    }
}
