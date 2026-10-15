package com.esuiss.catalog.stories.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.widthIn
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.runtime.Composable
import androidx.compose.runtime.key
import androidx.compose.runtime.remember
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import com.esuiss.catalog.Section
import com.esuiss.catalog.Story
import com.esuiss.catalog.StoryGroup
import com.esuiss.ui.components.Button
import com.esuiss.ui.components.ButtonVariant
import com.esuiss.ui.components.Card
import com.esuiss.ui.components.CardContent
import com.esuiss.ui.components.CardFooter
import com.esuiss.ui.components.CardHeader
import com.esuiss.ui.components.Text
import com.esuiss.ui.components.TextVariant
import com.esuiss.ui.components.Theme
import com.esuiss.ui.components.ThemeEffect
import com.esuiss.ui.components.ThemeOrigin
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
        Story("Circle", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Circle, ThemeOrigin.Center) },
        Story("CircleFromCorner", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Circle, ThemeOrigin.TopRight) },
        Story("CircleFromEdge", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Circle, ThemeOrigin.BottomCenter) },
        Story("Rectangle", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Rectangle, ThemeOrigin.BottomUp) },
        Story("RectangleSideways", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Rectangle, ThemeOrigin.LeftRight) },
        Story("Polygon", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Polygon, ThemeOrigin.TopLeft) },
        Story("CircleBlur", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.CircleBlur, ThemeOrigin.Center) },
        Story("CircleBlurFromCorner", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.CircleBlur, ThemeOrigin.BottomRight) },
        Story("Blurred", fullScreen = true) { ThemeTransitionDemo(ThemeEffect.Circle, ThemeOrigin.Center, blur = true) },
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
        modifier = Modifier.fillMaxWidth().background(colors.background),
        verticalArrangement = Arrangement.spacedBy(24.dp),
    ) {
        Column(verticalArrangement = Arrangement.spacedBy(8.dp)) {
            Text("Light and dark.", variant = TextVariant.H2)
            Text(
                "Every surface, label and accent follows the theme tokens, so the whole app changes at once.",
                color = colors.mutedForeground,
            )
        }
        ThemeToggle()
        Column(
            modifier = Modifier
                .fillMaxWidth()
                .background(colors.muted, RoundedCornerShape(Radius.xl2))
                .padding(16.dp),
            verticalArrangement = Arrangement.spacedBy(4.dp),
        ) {
            Text("Selected", style = Typography.sm, color = colors.mutedForeground)
            Text(state.theme.name.lowercase(), style = Typography.base.copy(fontWeight = FontWeight.SemiBold))
            Text("Showing", Modifier.padding(top = 8.dp), style = Typography.sm, color = colors.mutedForeground)
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

@Composable
private fun ThemeTransitionDemo(effect: ThemeEffect, origin: ThemeOrigin, blur: Boolean = false) {
    val dark = EsuissTheme.colors.isDark
    key(dark) {
        ThemeProvider(defaultTheme = if (dark) Theme.Dark else Theme.Light, storageKey = "theme-transition-story") {
            val colors = EsuissTheme.colors
            Column(
                modifier = Modifier
                    .fillMaxSize()
                    .background(colors.background)
                    .padding(horizontal = 24.dp, vertical = 32.dp),
                verticalArrangement = Arrangement.spacedBy(32.dp, Alignment.CenterVertically),
                horizontalAlignment = Alignment.CenterHorizontally,
            ) {
                Column(
                    modifier = Modifier.widthIn(max = 448.dp),
                    verticalArrangement = Arrangement.spacedBy(12.dp),
                    horizontalAlignment = Alignment.CenterHorizontally,
                ) {
                    Text("Light and dark.", variant = TextVariant.H2, textAlign = TextAlign.Center)
                    Text(
                        "Every surface, label and accent follows the theme tokens, so the whole app changes at once.",
                        color = colors.mutedForeground,
                        textAlign = TextAlign.Center,
                    )
                }
                Card(Modifier.widthIn(max = 448.dp).fillMaxWidth()) {
                    CardHeader(title = "Appearance", description = "Pick a theme and watch it spread across the screen.")
                    CardContent {
                        Text("Cards, buttons and text all switch together.", color = colors.mutedForeground)
                    }
                    CardFooter {
                        Button("Continue", onClick = {}, variant = ButtonVariant.Secondary, block = true)
                    }
                }
                ThemeToggle(effect = effect, origin = origin, blur = blur)
            }
        }
    }
}
